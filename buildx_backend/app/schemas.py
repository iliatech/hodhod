from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Any

class RegisterIn(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=160)
    password: str = Field(min_length=8, max_length=128)

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict[str, Any]

class ProfileIn(BaseModel):
    target_role: str = Field(default="", max_length=160)
    location: str = Field(default="", max_length=160)
    experience_years: int = Field(default=0, ge=0, le=70)
    skills: list[str] = []
    education: list[dict[str, Any]] = []
    work_history: list[dict[str, Any]] = []
    preferences: dict[str, Any] = {}

class ProfileOut(ProfileIn):
    model_config = ConfigDict(from_attributes=True)

class ConversationCreate(BaseModel):
    target_role: str = Field(min_length=2, max_length=160)

class ConversationMessage(BaseModel):
    message: str = Field(min_length=1, max_length=6000)

class ResumeGenerateIn(BaseModel):
    target_role: str | None = Field(default=None, max_length=160)
    job_description: str = Field(default="", max_length=12000)
    additional_context: str = Field(default="", max_length=6000)

class JobCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    company: str = Field(default="", max_length=200)
    location: str = Field(default="", max_length=160)
    description: str = Field(default="", max_length=12000)
    url: str = Field(default="", max_length=1000)
    skills: list[str] = []

class JobOut(BaseModel):
    id: int
    title: str
    company: str
    location: str
    description: str
    url: str
    skills: list[str]
    match_score: int | None = None
    explanation: str | None = None
