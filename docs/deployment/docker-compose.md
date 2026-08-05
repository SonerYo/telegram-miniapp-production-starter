# Docker Compose deployment

`docker-compose.prod.yml` is a single-host reference topology, not a managed production platform.
The PostgreSQL 18 named volume is mounted at `/var/lib/postgresql`, matching the official image's versioned `PGDATA` layout.

## Prepare

Create an untracked deployment environment with unique values:

```dotenv
POSTGRES_DB=starter
POSTGRES_USER=starter_app
POSTGRES_PASSWORD=replace-with-a-long-random-value
TELEGRAM_BOT_TOKEN=replace-from-secret-manager
CORS_ALLOWED_ORIGINS=https://miniapp.example.com
TRUSTED_HOSTS=miniapp.example.com
HTTP_PORT=8080
```

Do not copy the example password to production. Prefer secret injection by the deployment platform instead of a long-lived file.

## Validate, migrate, start

```bash
docker compose -f docker-compose.prod.yml config --quiet
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml --profile migrate run --rm migrate
docker compose -f docker-compose.prod.yml up -d db api web
```

Check `GET /health/live`, `GET /health/ready`, logs, and the migration revision. Put the exposed web port behind HTTPS. PostgreSQL and FastAPI are not published to the host in production Compose.

## Operate

- Back up and restore PostgreSQL on a schedule, and test the restore.
- Pin and review image updates through Dependabot.
- Aggregate JSON API logs and monitor readiness, latency, error rate, and saturation.
- Rotate the bot token and database credential through the platform secret mechanism.
- Scale only after replacing the process-local mutation limiter or accepting per-worker limits.

Rollback application containers to the previous image only while its schema remains compatible. Restore data or use a reviewed downgrade only when necessary; never assume all migrations are safely reversible.
