"""Small, polite importer for public job feeds. Original posting URLs are preserved."""
from __future__ import annotations
import re
from html import unescape
from typing import Any
import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models import JobListing

ARBEITNOW = "https://www.arbeitnow.com/api/job-board-api"
REMOTEOK = "https://remoteok.com/api"
IT_TERMS = re.compile(r"\b(software|engineer|developer|devops|sre|security|data|cloud|it support|sysadmin|qa engineer|test engineer|product manager|ux|ui|designer|machine learning|artificial intelligence|ai engineer|backend|back-end|frontend|front-end|full.?stack|mobile|android|ios|network|database|platform|infrastructure|technical writer|solutions architect|programmer|python|java|javascript|typescript|golang|rust|php|ruby|kubernetes|site reliability)\b", re.I)


def clean_html(value: str) -> str:
    value = re.sub(r"(?is)<(script|style).*?>.*?</\1>", " ", value or "")
    value = re.sub(r"(?i)<br\s*/?>|</p>|</li>|</h[1-6]>", "\n", value)
    value = re.sub(r"<[^>]+>", " ", value)
    value = unescape(value)
    return re.sub(r"[ \t\r\f\v]+", " ", re.sub(r"\n\s*\n+", "\n", value)).strip()[:12000]


def is_it_job(title: str, tags: list[str], description: str = "") -> bool:
    return bool(IT_TERMS.search(" ".join([title or "", " ".join(tags or []), (description or "")[:1800]])))


def upsert(db: Session, *, title: str, company: str, location: str, description: str,
           url: str, skills: list[str], source: str) -> bool:
    if not title or not url or not url.startswith("https://"):
        return False
    existing = db.scalar(select(JobListing).where(JobListing.url == url))
    if existing:
        existing.title = title[:200]
        existing.company = (company or "نامشخص")[:200]
        existing.location = (location or "Remote / ریموت")[:160]
        existing.description = description[:12000]
        existing.skills = skills[:30]
        existing.source = source
        existing.active = True
        return False
    db.add(JobListing(title=title[:200], company=(company or "نامشخص")[:200],
        location=(location or "Remote / ریموت")[:160], description=description[:12000],
        url=url[:1000], skills=skills[:30], source=source, active=True))
    return True

async def sync_external_jobs(db: Session) -> dict[str, Any]:
    inserted = 0
    checked = 0
    failures: list[str] = []
    headers = {"User-Agent": "HodhodCareerAgent/1.0 (job links attributed to original publishers)"}
    async with httpx.AsyncClient(timeout=18, follow_redirects=True, headers=headers) as client:
        # Arbeitnow: Europe-focused jobs and remote listings, public keyless feed.
        try:
            for page in range(1, 4):
                response = await client.get(ARBEITNOW, params={"page": page})
                response.raise_for_status()
                payload = response.json()
                jobs = payload.get("data", []) if isinstance(payload, dict) else []
                if not jobs:
                    break
                for item in jobs:
                    title = str(item.get("title") or "").strip()
                    tags = item.get("tags") or []
                    desc = clean_html(str(item.get("description") or ""))
                    if not is_it_job(title, tags, desc):
                        continue
                    checked += 1
                    if upsert(db, title=title, company=str(item.get("company_name") or ""),
                        location=(str(item.get("location") or "Europe") + (" · Remote" if item.get("remote") else "")),
                        description=desc, url=str(item.get("url") or ""), skills=[str(t) for t in tags], source="Arbeitnow"):
                        inserted += 1
        except Exception:
            failures.append("Arbeitnow")
        # Remote OK: public feed; API terms require source attribution and direct links.
        try:
            response = await client.get(REMOTEOK)
            response.raise_for_status()
            payload = response.json()
            for item in (payload[1:] if isinstance(payload, list) else []):
                if not isinstance(item, dict):
                    continue
                title = str(item.get("position") or item.get("title") or "").strip()
                tags = item.get("tags") or []
                desc = clean_html(str(item.get("description") or ""))
                if not is_it_job(title, tags, desc):
                    continue
                checked += 1
                url = str(item.get("url") or "")
                if not url.startswith("https://"):
                    url = str(item.get("apply_url") or "")
                if upsert(db, title=title, company=str(item.get("company") or ""),
                    location=(str(item.get("location") or "Worldwide") + " · Remote"),
                    description=desc, url=url, skills=[str(t) for t in tags], source="Remote OK"):
                    inserted += 1
        except Exception:
            failures.append("Remote OK")
    db.commit()
    total = db.scalar(select(JobListing.id).where(JobListing.active.is_(True)).limit(1))
    return {"message": "آگهی‌ها به‌روزرسانی شدند" if not failures else "به‌روزرسانی با محدودیت انجام شد",
            "new_jobs": inserted, "matched_jobs_seen": checked, "sources_failed": failures,
            "has_active_jobs": total is not None,
            "sources": [{"name": "Arbeitnow", "url": "https://www.arbeitnow.com/"},
                        {"name": "Remote OK", "url": "https://remoteok.com/"}]}
