from __future__ import annotations

import hashlib
import hmac
import json
from collections.abc import AsyncIterator, Callable
from datetime import UTC, datetime
from urllib.parse import urlencode

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.core.config import AppEnvironment, Settings
from app.db.base import Base
from app.main import create_app

BOT_TOKEN = "obvious-unit-test-token"


def signed_init_data(user_id: int = 1001, first_name: str = "Test User") -> str:
    fields = {
        "auth_date": str(int(datetime.now(UTC).timestamp())),
        "query_id": f"test-query-{user_id}",
        "user": json.dumps(
            {"id": user_id, "first_name": first_name, "username": f"user_{user_id}"},
            separators=(",", ":"),
            ensure_ascii=False,
        ),
    }
    data_check_string = "\n".join(f"{key}={value}" for key, value in sorted(fields.items()))
    secret = hmac.new(b"WebAppData", BOT_TOKEN.encode(), hashlib.sha256).digest()
    fields["hash"] = hmac.new(secret, data_check_string.encode(), hashlib.sha256).hexdigest()
    return urlencode(fields)


@pytest.fixture
async def client() -> AsyncIterator[AsyncClient]:
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    settings = Settings(
        app_env=AppEnvironment.TEST,
        database_url="sqlite+aiosqlite:///:memory:",
        telegram_bot_token=BOT_TOKEN,
        trusted_hosts="testserver,localhost",
        rate_limit_enabled=False,
    )
    app = create_app(settings, database_engine=engine, session_factory=session_factory)
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as test_client:
        yield test_client
    await engine.dispose()


@pytest.fixture
def auth_headers() -> Callable[[int], dict[str, str]]:
    return lambda user_id=1001: {"Authorization": f"tma {signed_init_data(user_id)}"}
