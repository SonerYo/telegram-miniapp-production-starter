from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Header, Request, Security
from fastapi.security import APIKeyHeader
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.errors import ApiError
from app.db.session import get_session
from app.models.user import User
from app.repositories.users import upsert_telegram_user
from app.telegram.init_data import (
    InitDataValidationError,
    TelegramUserData,
    validate_init_data,
)

telegram_auth = APIKeyHeader(
    name="Authorization",
    scheme_name="TelegramInitData",
    description="Raw Telegram init data using `Authorization: tma <initData>`.",
    auto_error=False,
)


class AuthenticatedUser:
    def __init__(self, user: User, mode: str) -> None:
        self.user = user
        self.mode = mode


async def get_current_user(
    request: Request,
    session: Annotated[AsyncSession, Depends(get_session)],
    authorization: Annotated[str | None, Security(telegram_auth)] = None,
    x_dev_user: Annotated[str | None, Header()] = None,
) -> AuthenticatedUser:
    settings = request.app.state.settings
    telegram_data: TelegramUserData
    mode = "telegram"

    if x_dev_user is not None:
        if settings.is_production or not settings.dev_mock_auth:
            raise ApiError(401, "invalid_auth", "Development authentication is disabled.")
        if x_dev_user != "browser-mock":
            raise ApiError(401, "invalid_auth", "Unknown development user.")
        telegram_data = TelegramUserData(
            id=9_000_000_001,
            first_name="Avery",
            last_name="Starter",
            username="browser_mock",
            language_code="en",
            is_premium=False,
        )
        mode = "browser_mock"
    else:
        if not authorization or not authorization.lower().startswith("tma "):
            raise ApiError(401, "missing_auth", "Telegram authentication is required.")
        if not settings.telegram_bot_token:
            raise ApiError(503, "auth_unavailable", "Telegram authentication is not configured.")
        try:
            validated = validate_init_data(
                authorization[4:],
                settings.telegram_bot_token,
                settings.telegram_init_data_max_age_seconds,
            )
        except InitDataValidationError as exc:
            raise ApiError(401, "invalid_init_data", "Telegram authentication failed.") from exc
        telegram_data = validated.user

    user = await upsert_telegram_user(session, telegram_data)
    return AuthenticatedUser(user, mode)


CurrentUser = Annotated[AuthenticatedUser, Depends(get_current_user)]


async def enforce_mutation_rate_limit(request: Request, current: CurrentUser) -> None:
    settings = request.app.state.settings
    if not settings.rate_limit_enabled:
        return
    allowed = await request.app.state.rate_limiter.allow(str(current.user.id))
    if not allowed:
        raise ApiError(429, "rate_limited", "Too many changes. Please try again shortly.")


MutationRateLimit = Annotated[None, Depends(enforce_mutation_rate_limit)]
