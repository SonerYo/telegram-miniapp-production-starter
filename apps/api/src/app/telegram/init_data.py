from __future__ import annotations

import hashlib
import hmac
import json
from datetime import UTC, datetime
from urllib.parse import parse_qsl

from pydantic import BaseModel, ConfigDict, Field, ValidationError


class TelegramUserData(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: int = Field(gt=0)
    first_name: str = Field(min_length=1, max_length=128)
    last_name: str | None = Field(default=None, max_length=128)
    username: str | None = Field(default=None, max_length=64)
    language_code: str | None = Field(default=None, max_length=16)
    is_premium: bool | None = None
    allows_write_to_pm: bool | None = None
    photo_url: str | None = Field(default=None, max_length=2048)


class ValidatedInitData(BaseModel):
    user: TelegramUserData
    auth_date: datetime
    query_id: str | None = None
    start_param: str | None = None


class InitDataValidationError(ValueError):
    """Raised when Telegram init data is malformed, invalid, or stale."""


def validate_init_data(
    raw_init_data: str,
    bot_token: str,
    max_age_seconds: int,
    *,
    now: datetime | None = None,
) -> ValidatedInitData:
    if not raw_init_data or len(raw_init_data) > 16_384:
        raise InitDataValidationError("Init data is missing or too large")
    try:
        pairs = parse_qsl(raw_init_data, keep_blank_values=True, strict_parsing=True)
    except ValueError as exc:
        raise InitDataValidationError("Malformed init data") from exc

    keys = [key for key, _ in pairs]
    if len(keys) != len(set(keys)):
        raise InitDataValidationError("Duplicate init data fields")
    values = dict(pairs)
    received_hash = values.pop("hash", None)
    if not received_hash or len(received_hash) != 64:
        raise InitDataValidationError("Missing or malformed hash")

    data_check_string = "\n".join(f"{key}={value}" for key, value in sorted(values.items()))
    secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    expected_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected_hash, received_hash):
        raise InitDataValidationError("Invalid init data signature")

    auth_date_raw = values.get("auth_date")
    user_raw = values.get("user")
    if auth_date_raw is None or user_raw is None:
        raise InitDataValidationError("Required init data fields are missing")
    try:
        auth_timestamp = int(auth_date_raw)
        auth_date = datetime.fromtimestamp(auth_timestamp, tz=UTC)
        user = TelegramUserData.model_validate(json.loads(user_raw))
    except (ValueError, TypeError, json.JSONDecodeError, ValidationError) as exc:
        raise InitDataValidationError("Invalid init data payload") from exc

    current_time = now or datetime.now(UTC)
    age_seconds = (current_time - auth_date).total_seconds()
    if age_seconds < -30:
        raise InitDataValidationError("Init data auth date is in the future")
    if age_seconds > max_age_seconds:
        raise InitDataValidationError("Init data has expired")

    return ValidatedInitData(
        user=user,
        auth_date=auth_date,
        query_id=values.get("query_id"),
        start_param=values.get("start_param"),
    )
