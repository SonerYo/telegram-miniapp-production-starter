from __future__ import annotations

from enum import StrEnum
from functools import lru_cache

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class AppEnvironment(StrEnum):
    DEVELOPMENT = "development"
    TEST = "test"
    PRODUCTION = "production"


class LogFormat(StrEnum):
    CONSOLE = "console"
    JSON = "json"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_env: AppEnvironment = AppEnvironment.DEVELOPMENT
    app_debug: bool = False
    app_version: str = "0.1.0"
    app_host: str = "127.0.0.1"
    app_port: int = Field(default=8000, ge=1, le=65535)
    database_url: str = "sqlite+aiosqlite:///./starter.db"
    telegram_bot_token: str | None = None
    telegram_init_data_max_age_seconds: int = Field(default=3600, ge=60, le=86400)
    cors_allowed_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    trusted_hosts: str = "localhost,127.0.0.1"
    log_level: str = "INFO"
    log_format: LogFormat = LogFormat.CONSOLE
    request_id_header: str = "X-Request-ID"
    rate_limit_enabled: bool = True
    rate_limit_mutations_per_minute: int = Field(default=60, ge=1, le=1000)
    dev_mock_auth: bool = True

    @field_validator("cors_allowed_origins", "trusted_hosts")
    @classmethod
    def reject_empty_csv(cls, value: str) -> str:
        if not value.strip() or not all(part.strip() for part in value.split(",")):
            raise ValueError("must be a non-empty comma-separated list")
        return value

    @field_validator("log_level")
    @classmethod
    def normalize_log_level(cls, value: str) -> str:
        normalized = value.upper()
        if normalized not in {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}:
            raise ValueError("unsupported log level")
        return normalized

    @model_validator(mode="after")
    def enforce_environment_guards(self) -> Settings:
        if self.app_env is AppEnvironment.PRODUCTION:
            if self.app_debug:
                raise ValueError("APP_DEBUG must be false in production")
            if self.dev_mock_auth:
                raise ValueError("DEV_MOCK_AUTH must be false in production")
            if not self.telegram_bot_token:
                raise ValueError("TELEGRAM_BOT_TOKEN is required in production")
            if self.database_url.startswith("sqlite"):
                raise ValueError("PostgreSQL DATABASE_URL is required in production")
            if self.log_format is not LogFormat.JSON:
                raise ValueError("LOG_FORMAT must be json in production")
        if "*" in self.cors_origins:
            raise ValueError("wildcard CORS origins are not allowed")
        return self

    @property
    def cors_origins(self) -> list[str]:
        return [part.strip() for part in self.cors_allowed_origins.split(",")]

    @property
    def allowed_hosts(self) -> list[str]:
        return [part.strip() for part in self.trusted_hosts.split(",")]

    @property
    def is_production(self) -> bool:
        return self.app_env is AppEnvironment.PRODUCTION


@lru_cache
def get_settings() -> Settings:
    return Settings()
