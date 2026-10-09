from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "buildX Career Agent"
    database_url: str = "postgresql+psycopg://buildx:buildx@db:5432/buildx"
    secret_key: str = "CHANGE_ME_TO_A_LONG_RANDOM_SECRET"
    access_token_minutes: int = 60 * 24
    llm_provider: str = "openai"
    llm_api_key: str = ""
    llm_model: str = "gpt-4o-mini"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5500,http://127.0.0.1:5500,http://localhost:8000"
    environment: str = "development"
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()

def cors_origin_list() -> list[str]:
    return [x.strip() for x in settings.cors_origins.split(",") if x.strip()]
