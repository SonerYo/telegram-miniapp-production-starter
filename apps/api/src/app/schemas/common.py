from __future__ import annotations

from typing import Any

from pydantic import BaseModel


class ErrorBody(BaseModel):
    code: str
    message: str
    request_id: str
    details: Any | None = None


class ErrorResponse(BaseModel):
    error: ErrorBody


class MetaResponse(BaseModel):
    name: str
    version: str
    environment: str
    mock_auth_enabled: bool
