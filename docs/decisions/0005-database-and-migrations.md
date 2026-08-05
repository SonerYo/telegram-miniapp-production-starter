# ADR 0005: PostgreSQL and Alembic migrations

- Status: Accepted
- Date: 2026-08-02

## Decision

Use PostgreSQL with async SQLAlchemy 2 sessions and explicit Alembic migrations. UUID primary keys are application-facing; the Telegram numeric identifier has a unique constraint. User-owned task queries always include `owner_id`.

SQLite remains a fast test and limited local-development option, but production settings reject it. Migrations run as an explicit deployment step, never implicitly in API startup.

## Consequences

Schema changes are reviewable and production startup cannot race migration locks. Tests can exercise most repository behavior cheaply, while CI applies the same migration to PostgreSQL. Operators remain responsible for backups, connection limits, upgrades, and rollback rehearsals.
