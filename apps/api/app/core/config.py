from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "sqlite:///./oracle.db"
    redis_url: str = "redis://localhost:6379/0"
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-opus-4-5"
    alpha_vantage_api_key: str = ""
    news_api_key: str = ""
    openweathermap_api_key: str = ""
    polygon_api_key: str = ""
    x_api_bearer_token: str = ""
    admin_run_secret: str = "change-me"
    request_timeout_seconds: float = 15.0

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
