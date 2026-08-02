from __future__ import annotations

import hashlib
import hmac
import json
from datetime import UTC, datetime, timedelta
from urllib.parse import urlencode

import pytest

from app.telegram.init_data import InitDataValidationError, validate_init_data

TOKEN = "obvious-unit-test-token"


def make_init_data(
    *,
    auth_date: datetime | None = None,
    user: dict[str, object] | None = None,
    include_hash: bool = True,
) -> str:
    fields = {
        "auth_date": str(int((auth_date or datetime.now(UTC)).timestamp())),
        "query_id": "deterministic-query",
        "user": json.dumps(
            user or {"id": 42, "first_name": "Ada", "username": "ada"},
            separators=(",", ":"),
            ensure_ascii=False,
        ),
    }
    check = "\n".join(f"{key}={value}" for key, value in sorted(fields.items()))
    secret = hmac.new(b"WebAppData", TOKEN.encode(), hashlib.sha256).digest()
    if include_hash:
        fields["hash"] = hmac.new(secret, check.encode(), hashlib.sha256).hexdigest()
    return urlencode(fields)


def test_valid_signature_and_unicode_user() -> None:
    raw = make_init_data(user={"id": 42, "first_name": "Ада 🚀", "language_code": "ru"})
    validated = validate_init_data(raw, TOKEN, 3600)
    assert validated.user.first_name == "Ада 🚀"
    assert validated.user.id == 42


@pytest.mark.parametrize(
    ("raw", "message"),
    [
        (make_init_data(include_hash=False), "hash"),
        ("not-a-query", "Malformed"),
        ("hash=short&auth_date=1&user=%7B%7D", "hash"),
        ("hash=" + "0" * 64 + "&hash=" + "1" * 64, "Duplicate"),
    ],
)
def test_rejects_malformed_data(raw: str, message: str) -> None:
    with pytest.raises(InitDataValidationError, match=message):
        validate_init_data(raw, TOKEN, 3600)


def test_rejects_invalid_signature() -> None:
    raw = make_init_data().replace("Ada", "Grace")
    with pytest.raises(InitDataValidationError, match="signature"):
        validate_init_data(raw, TOKEN, 3600)


def test_rejects_expired_auth_date() -> None:
    raw = make_init_data(auth_date=datetime.now(UTC) - timedelta(hours=2))
    with pytest.raises(InitDataValidationError, match="expired"):
        validate_init_data(raw, TOKEN, 60)


def test_rejects_future_auth_date() -> None:
    raw = make_init_data(auth_date=datetime.now(UTC) + timedelta(minutes=2))
    with pytest.raises(InitDataValidationError, match="future"):
        validate_init_data(raw, TOKEN, 3600)


def test_rejects_missing_user_after_valid_signature() -> None:
    raw = make_init_data(user={"id": 42, "first_name": ""})
    with pytest.raises(InitDataValidationError, match="payload"):
        validate_init_data(raw, TOKEN, 3600)
