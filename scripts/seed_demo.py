from __future__ import annotations

import asyncio
from pathlib import Path

REPOSITORY_ROOT = Path(__file__).resolve().parents[1]

from app.core.config import AppEnvironment, Settings
from app.db.session import create_database
from app.models.task import Task
from app.repositories.tasks import create_task
from app.repositories.users import upsert_telegram_user
from app.telegram.init_data import TelegramUserData
from sqlalchemy import func, select


async def seed() -> None:
    settings = Settings()
    if settings.app_env is AppEnvironment.PRODUCTION:
        raise RuntimeError("Demo seed is disabled in production")
    engine, session_factory = create_database(settings)
    async with session_factory() as session:
        user = await upsert_telegram_user(
            session,
            TelegramUserData(
                id=9_000_000_001,
                first_name="Avery",
                last_name="Starter",
                username="browser_mock",
            ),
        )
        existing_count = await session.scalar(
            select(func.count(Task.id)).where(Task.owner_id == user.id)
        )
        if not existing_count:
            for text in (
                "Review the Telegram theme adapter",
                "Run the production readiness checklist",
                "Customize Starter Space for your product",
            ):
                await create_task(session, user.id, text)
    await engine.dispose()
    print("Seeded deterministic browser mock tasks.")


if __name__ == "__main__":
    asyncio.run(seed())
