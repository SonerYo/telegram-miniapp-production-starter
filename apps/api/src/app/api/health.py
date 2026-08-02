from __future__ import annotations

import asyncio

from fastapi import APIRouter, Request
from sqlalchemy import text

from app.api.errors import ApiError

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/live")
async def live() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/ready")
async def ready(request: Request) -> dict[str, str]:
    try:
        async with asyncio.timeout(2):
            async with request.app.state.session_factory() as session:
                await session.execute(text("SELECT 1"))
    except (TimeoutError, OSError) as exc:
        raise ApiError(503, "database_unavailable", "Database is not ready.") from exc
    return {"status": "ok", "database": "ready"}
