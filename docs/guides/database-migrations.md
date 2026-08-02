# Database migrations

Create a revision after changing models:

```bash
uv run --project apps/api alembic -c apps/api/alembic.ini revision --autogenerate -m "describe change"
```

Review generated types, names, defaults, constraints, data transformations, and downgrade behavior. Then apply and inspect:

```bash
uv run --project apps/api alembic -c apps/api/alembic.ini upgrade head
uv run --project apps/api alembic -c apps/api/alembic.ini check
```

Production deployment uses an explicit one-off container:

```bash
docker compose -f docker-compose.prod.yml --profile migrate run --rm migrate
```

Back up data before destructive changes. For large tables, split schema addition, backfill, constraint enforcement, and old-column removal across compatible releases. API startup intentionally does not run migrations.
