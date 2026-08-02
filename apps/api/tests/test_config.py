import pytest
from pydantic import ValidationError

from app.core.config import AppEnvironment, LogFormat, Settings


def test_production_requires_secret_and_disables_mock() -> None:
    with pytest.raises(ValidationError, match="DEV_MOCK_AUTH"):
        Settings(
            app_env=AppEnvironment.PRODUCTION,
            app_debug=False,
            dev_mock_auth=True,
            telegram_bot_token="obvious-placeholder",
            database_url="postgresql+asyncpg://app@db/starter",
            log_format=LogFormat.JSON,
        )


def test_production_rejects_missing_bot_token() -> None:
    with pytest.raises(ValidationError, match="TELEGRAM_BOT_TOKEN"):
        Settings(
            app_env=AppEnvironment.PRODUCTION,
            dev_mock_auth=False,
            telegram_bot_token=None,
            database_url="postgresql+asyncpg://app@db/starter",
            log_format=LogFormat.JSON,
        )


def test_wildcard_cors_is_rejected() -> None:
    with pytest.raises(ValidationError, match="wildcard"):
        Settings(cors_allowed_origins="*")


def test_cors_requires_exact_http_origin() -> None:
    with pytest.raises(ValidationError, match="exact HTTP"):
        Settings(cors_allowed_origins="https://example.invalid/path")


def test_wildcard_trusted_host_is_rejected() -> None:
    with pytest.raises(ValidationError, match="wildcard trusted"):
        Settings(trusted_hosts="*.example.invalid")
