from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    telegram_user_id: int
    username: str | None
    first_name: str
    last_name: str | None
    language_code: str | None
    is_premium: bool | None
    photo_url: str | None
    verified: bool = True
    authentication_mode: str = "telegram"
