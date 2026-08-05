from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker
from starlette.middleware.trustedhost import TrustedHostMiddleware

from app.api.errors import (
    ApiError,
    api_error_handler,
    unhandled_error_handler,
    validation_error_handler,
)
from app.api.health import router as health_router
from app.api.v1 import router as api_v1_router
from app.core.config import Settings, get_settings
from app.core.logging import configure_logging, get_logger
from app.core.middleware import RequestContextMiddleware
from app.core.rate_limit import ProcessLocalRateLimiter
from app.db.session import create_database


def create_app(
    settings: Settings | None = None,
    *,
    database_engine: AsyncEngine | None = None,
    session_factory: async_sessionmaker[AsyncSession] | None = None,
) -> FastAPI:
    app_settings = settings or get_settings()
    configure_logging(app_settings)
    owns_engine = database_engine is None

    @asynccontextmanager
    async def lifespan(application: FastAPI) -> AsyncIterator[None]:
        nonlocal database_engine, session_factory
        if database_engine is None or session_factory is None:
            database_engine, session_factory = create_database(app_settings)  # type: ignore[assignment]
        application.state.database_engine = database_engine
        application.state.session_factory = session_factory
        get_logger("api.startup").info(
            "application_started",
            environment=app_settings.app_env.value,
            version=app_settings.app_version,
            mock_auth=app_settings.dev_mock_auth and not app_settings.is_production,
        )
        yield
        if owns_engine and database_engine is not None:
            await database_engine.dispose()

    app = FastAPI(
        title="Telegram Mini App Production Starter API",
        version=app_settings.app_version,
        description="Server-validated Telegram authentication and owner-scoped demo task API.",
        lifespan=lifespan,
        debug=app_settings.app_debug,
    )
    app.state.settings = app_settings
    app.state.rate_limiter = ProcessLocalRateLimiter(app_settings.rate_limit_mutations_per_minute)
    if database_engine is not None and session_factory is not None:
        app.state.database_engine = database_engine
        app.state.session_factory = session_factory

    app.add_middleware(TrustedHostMiddleware, allowed_hosts=app_settings.allowed_hosts)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=app_settings.cors_origins,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-Dev-User", "X-Request-ID"],
        expose_headers=[app_settings.request_id_header],
    )
    app.add_middleware(RequestContextMiddleware)
    app.add_exception_handler(ApiError, api_error_handler)  # type: ignore[arg-type]
    app.add_exception_handler(RequestValidationError, validation_error_handler)  # type: ignore[arg-type]
    app.add_exception_handler(Exception, unhandled_error_handler)
    app.include_router(health_router)
    app.include_router(api_v1_router)
    return app


app = create_app()


def openapi_schema() -> dict[str, Any]:
    return app.openapi()
