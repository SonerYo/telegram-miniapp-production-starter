from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.telegram.init_data import TelegramUserData


async def upsert_telegram_user(session: AsyncSession, data: TelegramUserData) -> User:
    user = await session.scalar(select(User).where(User.telegram_user_id == data.id))
    now = datetime.now(UTC)
    if user is None:
        user = User(
            telegram_user_id=data.id,
            username=data.username,
            first_name=data.first_name,
            last_name=data.last_name,
            language_code=data.language_code,
            is_premium=data.is_premium,
            photo_url=data.photo_url,
            last_seen_at=now,
        )
        session.add(user)
    else:
        user.username = data.username
        user.first_name = data.first_name
        user.last_name = data.last_name
        user.language_code = data.language_code
        user.is_premium = data.is_premium
        user.photo_url = data.photo_url
        user.last_seen_at = now
    await session.commit()
    await session.refresh(user)
    return user
