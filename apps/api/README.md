# Starter API

FastAPI service for Telegram init data authentication, verified-user upsert, and owner-scoped task CRUD.

From the repository root:

```bash
uv sync --project apps/api --all-groups
uv run --project apps/api alembic -c apps/api/alembic.ini upgrade head
uv run --project apps/api uvicorn app.main:app --reload --port 8000
```

See the root [README](../../README.md) and [API reference](../../docs/reference/api.md) for the supported authentication modes.

