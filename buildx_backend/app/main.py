from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from sqlalchemy.exc import IntegrityError
from app.config import settings, cors_origin_list
from app.database import Base, engine, get_db
from app.models import User, Profile, Resume, Conversation, JobListing
from app.schemas import RegisterIn, LoginIn, TokenOut, ProfileIn, ConversationCreate, ConversationMessage, ResumeGenerateIn, JobCreate, JobOut
from app.security import hash_password, verify_password, create_access_token, get_current_user
from app.agent import agent
from app.jobs_sync import sync_external_jobs

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Convenient for a contest MVP. Use Alembic migrations for production evolution.
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origin_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def user_payload(user: User) -> dict:
    return {"id": user.id, "email": user.email, "full_name": user.full_name}

def profile_dict(profile: Profile | None) -> dict:
    if not profile:
        return {"target_role": "", "location": "", "experience_years": 0, "skills": [], "education": [], "work_history": [], "preferences": {}}
    return {k: getattr(profile, k) for k in ["target_role", "location", "experience_years", "skills", "education", "work_history", "preferences"]}

def get_or_create_profile(db: Session, user: User) -> Profile:
    if user.profile:
        return user.profile
    p = Profile(user_id=user.id)
    db.add(p)
    db.flush()
    return p

@app.get("/", response_class=HTMLResponse)
def root():
    return """<!doctype html><html lang='fa' dir='rtl'><meta charset='utf-8'><title>buildX Career Agent API</title><body style='font-family:sans-serif;max-width:760px;margin:4rem auto;line-height:2'><h1>buildX — همراه هوشمند کاریابی</h1><p>بک‌اند فعال است. برای تست API و مشاهدهٔ مستندات به <a href='/docs'>/docs</a> بروید.</p><p>سلامت سرویس: <a href='/health'>/health</a></p></body></html>"""

@app.get("/health")
def health():
    return {"status": "ok", "service": settings.app_name}

@app.post("/api/auth/register", response_model=TokenOut, status_code=201)
def register(data: RegisterIn, db: Session = Depends(get_db)):
    email = data.email.lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(409, "این ایمیل قبلاً ثبت شده است")
    user = User(email=email, full_name=data.full_name.strip(), password_hash=hash_password(data.password))
    db.add(user)
    db.flush()
    db.add(Profile(user_id=user.id))
    db.commit()
    db.refresh(user)
    return {"access_token": create_access_token(user.id), "user": user_payload(user)}

@app.post("/api/auth/login", response_model=TokenOut)
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == data.email.lower()))
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "ایمیل یا رمز عبور اشتباه است")
    return {"access_token": create_access_token(user.id), "user": user_payload(user)}

@app.get("/api/auth/me")
def me(user: User = Depends(get_current_user)):
    return user_payload(user)

@app.get("/api/profile")
def read_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return profile_dict(get_or_create_profile(db, user))

@app.put("/api/profile")
def update_profile(data: ProfileIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = get_or_create_profile(db, user)
    for key, value in data.model_dump().items():
        setattr(p, key, value)
    db.commit()
    db.refresh(p)
    return profile_dict(p)

@app.post("/api/agent/conversations", status_code=201)
def start_conversation(data: ConversationCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = get_or_create_profile(db, user)
    p.target_role = data.target_role.strip()
    conv = Conversation(user_id=user.id, state={"target_role": data.target_role.strip(), "facts": profile_dict(p), "turns": []})
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return {"id": conv.id, "target_role": data.target_role, "question": "برای شروع، لطفاً دربارهٔ آخرین تجربهٔ کاری، پروژه یا تجربهٔ آموزشی مرتبطت بگو. اگر تجربهٔ کاری نداری، پروژه‌ها و مهارت‌هایی را که واقعاً داری شرح بده."}

@app.post("/api/agent/conversations/{conversation_id}/messages")
async def send_message(conversation_id: int, data: ConversationMessage, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conv = db.scalar(select(Conversation).where(Conversation.id == conversation_id, Conversation.user_id == user.id))
    if not conv:
        raise HTTPException(404, "گفت‌وگو پیدا نشد")
    state = dict(conv.state or {})
    turns = list(state.get("turns", []))
    turns.append({"role": "user", "content": data.message})
    state["turns"] = turns
    # The agent extracts only explicitly stated facts and chooses the next useful question.
    try:
        extraction = await agent.complete([{"role": "user", "content": __import__("json").dumps({
            "target_role": state.get("target_role", ""),
            "known_facts": state.get("facts", {}),
            "conversation": turns,
            "task": "Extract new candidate facts stated explicitly in the conversation. Return JSON keys facts (object with skills, work_history, education, projects, languages, location, experience_years where supported) and question (one next useful question in Persian). Do not infer or fabricate."
        }, ensure_ascii=False)}], json_mode=True)
        import json
        extracted = json.loads(extraction)
        facts = dict(state.get("facts", {}))
        for key, value in extracted.get("facts", {}).items():
            if value not in (None, "", [], {}):
                if key in ("skills", "work_history", "education"):
                    existing = facts.get(key, [])
                    facts[key] = existing + [x for x in value if x not in existing] if isinstance(value, list) else existing
                else:
                    facts[key] = value
        state["facts"] = facts
        answer = extracted.get("question") or "آیا نکتهٔ دیگری دربارهٔ مهارت‌ها، پروژه‌ها یا تجربه‌هایت هست که بخواهی به رزومه اضافه کنیم؟"
    except RuntimeError as e:
        raise HTTPException(503, str(e))
    except Exception:
        raise HTTPException(502, "ایجنت نتوانست پاسخ معتبر بسازد. دوباره تلاش کنید.")
    conv.state = state
    db.commit()
    return {"conversation_id": conv.id, "answer": answer, "collected_facts": state.get("facts", {}), "can_generate": len(state.get("turns", [])) >= 2}

@app.post("/api/agent/conversations/{conversation_id}/generate-resume")
async def generate_from_conversation(conversation_id: int, data: ResumeGenerateIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conv = db.scalar(select(Conversation).where(Conversation.id == conversation_id, Conversation.user_id == user.id))
    if not conv:
        raise HTTPException(404, "گفت‌وگو پیدا نشد")
    state = conv.state or {}
    facts = state.get("facts", {})
    if not facts.get("skills") and not facts.get("work_history") and not facts.get("education"):
        raise HTTPException(400, "ابتدا اطلاعات واقعی مهارت‌ها، سوابق یا تحصیلات را در گفت‌وگو وارد کنید")
    target = (data.target_role or state.get("target_role") or "").strip()
    try:
        content = await agent.generate_resume(facts, target, data.job_description, data.additional_context)
    except RuntimeError as e:
        raise HTTPException(503, str(e))
    except Exception:
        raise HTTPException(502, "ساخت رزومه ناموفق بود. لطفاً دوباره تلاش کنید.")
    resume = Resume(user_id=user.id, title=f"رزومه {target}".strip(), target_role=target, content=content)
    db.add(resume)
    conv.is_complete = True
    db.commit()
    db.refresh(resume)
    return {"id": resume.id, "title": resume.title, "target_role": resume.target_role, "content": resume.content, "created_at": resume.created_at}

@app.post("/api/resumes/generate")
async def generate_resume(data: ResumeGenerateIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = get_or_create_profile(db, user)
    facts = profile_dict(p)
    if not any([facts.get("skills"), facts.get("work_history"), facts.get("education")]) and not data.additional_context.strip():
        raise HTTPException(400, "ابتدا پروفایل خود را با مهارت‌ها، تحصیلات یا سوابق واقعی تکمیل کنید")
    target = (data.target_role or p.target_role or "").strip()
    try:
        content = await agent.generate_resume(facts | {"full_name": user.full_name}, target, data.job_description, data.additional_context)
    except RuntimeError as e:
        raise HTTPException(503, str(e))
    except Exception:
        raise HTTPException(502, "ساخت رزومه ناموفق بود. لطفاً دوباره تلاش کنید.")
    resume = Resume(user_id=user.id, title=f"رزومه {target}".strip(), target_role=target, content=content)
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return {"id": resume.id, "title": resume.title, "target_role": resume.target_role, "content": resume.content, "created_at": resume.created_at}

@app.get("/api/resumes")
def list_resumes(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.scalars(select(Resume).where(Resume.user_id == user.id).order_by(Resume.updated_at.desc())).all()
    return [{"id": r.id, "title": r.title, "target_role": r.target_role, "created_at": r.created_at, "updated_at": r.updated_at} for r in items]

@app.get("/api/resumes/{resume_id}")
def get_resume(resume_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    r = db.scalar(select(Resume).where(Resume.id == resume_id, Resume.user_id == user.id))
    if not r:
        raise HTTPException(404, "رزومه پیدا نشد")
    return {"id": r.id, "title": r.title, "target_role": r.target_role, "content": r.content, "created_at": r.created_at, "updated_at": r.updated_at}

@app.delete("/api/resumes/{resume_id}", status_code=204)
def delete_resume(resume_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    r = db.scalar(select(Resume).where(Resume.id == resume_id, Resume.user_id == user.id))
    if not r:
        raise HTTPException(404, "رزومه پیدا نشد")
    db.delete(r)
    db.commit()
    return None

@app.post("/api/jobs", status_code=201)
def create_job(data: JobCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Job data may be user-entered/imported. Automated scraping is intentionally not assumed.
    job = JobListing(**data.model_dump(), source="user", active=True)
    db.add(job)
    db.commit()
    db.refresh(job)
    return {"id": job.id, **data.model_dump()}

@app.post("/api/jobs/refresh")
async def refresh_jobs(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Import current IT listings from public feeds; every listing links to its original source."""
    try:
        result = await sync_external_jobs(db)
        return result
    except Exception as e:
        raise HTTPException(502, "دریافت آگهی‌ها از منابع بیرونی ناموفق بود؛ کمی بعد دوباره تلاش کنید") from e

@app.get("/api/jobs")
def search_jobs(q: str = "", location: str = "", user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = select(JobListing).where(JobListing.active.is_(True))
    if q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(or_(JobListing.title.ilike(term), JobListing.description.ilike(term), JobListing.company.ilike(term)))
    if location.strip():
        stmt = stmt.where(JobListing.location.ilike(f"%{location.strip()}%"))
    jobs = db.scalars(stmt.order_by(JobListing.created_at.desc()).limit(100)).all()
    return [{"id": j.id, "title": j.title, "company": j.company, "location": j.location, "description": j.description, "url": j.url, "skills": j.skills, "source": j.source} for j in jobs]

@app.post("/api/jobs/{job_id}/translate")
async def translate_job(job_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    job = db.get(JobListing, job_id)
    if not job or not job.active:
        raise HTTPException(404, "آگهی پیدا نشد")
    try:
        import json
        raw = await agent.complete([{"role": "user", "content": json.dumps({
            "title": job.title, "company": job.company, "location": job.location,
            "description": job.description,
            "task": "Translate this job listing into natural Persian. Preserve technical terms and do not add facts. Return JSON with title_fa, location_fa, summary_fa (2-3 sentences), description_fa (faithful translation, concise if very long), and key_requirements_fa (array of strings)."
        }, ensure_ascii=False)}], json_mode=True)
        return json.loads(raw)
    except RuntimeError as e:
        raise HTTPException(503, str(e))
    except Exception as e:
        raise HTTPException(502, "ترجمه آگهی ناموفق بود؛ دوباره تلاش کنید") from e

@app.post("/api/jobs/{job_id}/match")
async def match_job(job_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    job = db.get(JobListing, job_id)
    if not job or not job.active:
        raise HTTPException(404, "آگهی پیدا نشد")
    p = get_or_create_profile(db, user)
    facts = profile_dict(p)
    if not any([facts.get("skills"), facts.get("work_history"), facts.get("education")]):
        raise HTTPException(400, "برای تحلیل تناسب، ابتدا پروفایل خود را تکمیل کنید")
    try:
        result = await agent.match_job(facts | {"full_name": user.full_name}, {
            "title": job.title, "company": job.company, "location": job.location,
            "description": job.description, "skills": job.skills
        })
    except RuntimeError as e:
        raise HTTPException(503, str(e))
    except Exception:
        raise HTTPException(502, "تحلیل تناسب ناموفق بود. لطفاً دوباره تلاش کنید.")
    return {"job_id": job.id, **result}

@app.get("/api/dashboard")
def dashboard(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return {
        "user": user_payload(user),
        "profile": profile_dict(user.profile),
        "resume_count": db.scalar(select(__import__("sqlalchemy").func.count(Resume.id)).where(Resume.user_id == user.id)) or 0,
        "conversation_count": db.scalar(select(__import__("sqlalchemy").func.count(Conversation.id)).where(Conversation.user_id == user.id)) or 0,
        "available_jobs": db.scalar(select(__import__("sqlalchemy").func.count(JobListing.id)).where(JobListing.active.is_(True))) or 0
    }
