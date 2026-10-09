import json
from typing import Any
from openai import AsyncOpenAI
from app.config import settings

SYSTEM = """You are a careful Persian-speaking career coach and resume agent.
Help the user build a truthful, ATS-friendly resume and assess job fit.
Never invent employers, degrees, dates, metrics, skills, or achievements. If data is missing,
ask a concise follow-up question instead of fabricating it. Be transparent about uncertainty.
When producing a resume, output valid JSON with keys: summary (string), target_role (string),
skills (array of strings), experience (array of objects with company,title,dates,bullets),
education (array of objects), projects (array of objects), languages (array), tailoring_notes (array).
Only use facts supplied by the user. Respond in Persian unless the user writes mainly in another language.
"""

class CareerAgent:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.llm_api_key) if settings.llm_api_key else None

    async def complete(self, messages: list[dict[str, str]], json_mode: bool = False) -> str:
        if not self.client:
            raise RuntimeError("LLM_API_KEY تنظیم نشده است. در فایل .env کلید سرویس مدل زبانی را وارد کنید.")
        kwargs: dict[str, Any] = {}
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}
        response = await self.client.chat.completions.create(
            model=settings.llm_model,
            messages=[{"role": "system", "content": SYSTEM}, *messages],
            temperature=0.3,
            **kwargs,
        )
        return response.choices[0].message.content or ""

    async def ask_resume_question(self, target_role: str, collected: dict, user_message: str | None = None) -> dict:
        prompt = {
            "target_role": target_role,
            "known_candidate_information": collected,
            "latest_user_message": user_message,
            "task": "Ask the single most useful next question to fill missing truthful resume information. If enough info exists, set ready_to_generate true. Return JSON keys question (string), ready_to_generate (boolean), missing_information (array)."
        }
        raw = await self.complete([{"role": "user", "content": json.dumps(prompt, ensure_ascii=False)}], json_mode=True)
        return json.loads(raw)

    async def generate_resume(self, facts: dict, target_role: str, job_description: str = "", additional_context: str = "") -> dict:
        prompt = {
            "target_role": target_role,
            "verified_candidate_facts": facts,
            "job_description": job_description,
            "additional_context": additional_context,
            "task": "Create a tailored, ATS-friendly resume as JSON. Do not add unsupported facts. Include concise tailoring_notes that explain alignment and any gaps."
        }
        raw = await self.complete([{"role": "user", "content": json.dumps(prompt, ensure_ascii=False)}], json_mode=True)
        return json.loads(raw)

    async def match_job(self, profile: dict, job: dict) -> dict:
        prompt = {
            "candidate": profile, "job": job,
            "task": "Assess fit from 0 to 100 based only on supplied facts. Return JSON keys score (integer 0-100), explanation (string), strengths (array), gaps (array), next_steps (array). Do not infer unstated skills."
        }
        raw = await self.complete([{"role": "user", "content": json.dumps(prompt, ensure_ascii=False)}], json_mode=True)
        result = json.loads(raw)
        result["score"] = max(0, min(100, int(result.get("score", 0))))
        return result

agent = CareerAgent()
