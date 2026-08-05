from __future__ import annotations

from collections.abc import Callable

from httpx import AsyncClient


async def test_health_and_meta(client: AsyncClient) -> None:
    live = await client.get("/health/live")
    ready = await client.get("/health/ready")
    meta = await client.get("/api/v1/meta")
    assert live.json() == {"status": "ok"}
    assert ready.json() == {"status": "ok", "database": "ready"}
    assert meta.json()["mock_auth_enabled"] is True


async def test_me_requires_valid_auth(
    client: AsyncClient, auth_headers: Callable[[int], dict[str, str]]
) -> None:
    missing = await client.get("/api/v1/me")
    invalid = await client.get("/api/v1/me", headers={"Authorization": "tma invalid"})
    valid = await client.get("/api/v1/me", headers=auth_headers(1001))
    assert missing.status_code == 401
    assert invalid.status_code == 401
    assert valid.status_code == 200
    assert valid.json()["telegram_user_id"] == 1001
    assert valid.json()["verified"] is True
    assert "request_id" in missing.json()["error"]


async def test_task_crud_and_ownership(
    client: AsyncClient, auth_headers: Callable[[int], dict[str, str]]
) -> None:
    owner = auth_headers(1001)
    other_user = auth_headers(1002)
    created = await client.post("/api/v1/tasks", headers=owner, json={"text": "Ship starter"})
    assert created.status_code == 201
    task_id = created.json()["id"]

    listed = await client.get("/api/v1/tasks?status=open", headers=owner)
    assert listed.json()["total"] == 1
    assert listed.json()["items"][0]["text"] == "Ship starter"

    foreign_patch = await client.patch(
        f"/api/v1/tasks/{task_id}", headers=other_user, json={"is_completed": True}
    )
    assert foreign_patch.status_code == 404

    updated = await client.patch(
        f"/api/v1/tasks/{task_id}", headers=owner, json={"is_completed": True}
    )
    assert updated.status_code == 200
    assert updated.json()["is_completed"] is True
    assert updated.json()["completed_at"] is not None

    deleted = await client.delete(f"/api/v1/tasks/{task_id}", headers=owner)
    assert deleted.status_code == 204
    assert (await client.get("/api/v1/tasks", headers=owner)).json()["total"] == 0


async def test_validation_uses_stable_error_contract(
    client: AsyncClient, auth_headers: Callable[[int], dict[str, str]]
) -> None:
    response = await client.post("/api/v1/tasks", headers=auth_headers(1001), json={"text": ""})
    payload = response.json()["error"]
    assert response.status_code == 422
    assert payload["code"] == "validation_error"
    assert payload["details"][0]["location"] == ["body", "text"]

    whitespace = await client.post(
        "/api/v1/tasks", headers=auth_headers(1001), json={"text": "   "}
    )
    assert whitespace.status_code == 422


async def test_browser_mock_auth_is_explicit(
    client: AsyncClient,
) -> None:
    response = await client.get("/api/v1/me", headers={"X-Dev-User": "browser-mock"})
    assert response.status_code == 200
    assert response.json()["authentication_mode"] == "browser_mock"
