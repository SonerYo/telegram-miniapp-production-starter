from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class TaskCreate(BaseModel):
    text: str = Field(min_length=1, max_length=500)


class TaskUpdate(BaseModel):
    text: str | None = Field(default=None, min_length=1, max_length=500)
    is_completed: bool | None = None

    @model_validator(mode="after")
    def require_change(self) -> TaskUpdate:
        if self.text is None and self.is_completed is None:
            raise ValueError("At least one field must be provided")
        return self


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    text: str
    is_completed: bool
    created_at: datetime
    updated_at: datetime
    completed_at: datetime | None


class TaskListResponse(BaseModel):
    items: list[TaskResponse]
    total: int
