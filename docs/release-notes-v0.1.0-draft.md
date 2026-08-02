# v0.1.0 release notes — draft

This initial release provides a production-oriented foundation for Telegram Mini Apps rather than a finished product.

## Included

- React, Vite, and strict TypeScript mobile UI with direct Telegram bridge adapter.
- Explicit browser mock, adaptive themes and safe areas, task flows, and common UI states.
- FastAPI authentication using server-validated Telegram init data.
- PostgreSQL, async SQLAlchemy, Alembic, owner-scoped sample data, and stable errors.
- Development/production Compose, unprivileged application containers, Nginx proxy, and health checks.
- Unit, API, browser, accessibility, responsive, CI, CodeQL, Dependabot, and documentation workflows.
- MIT license and standard community/security files.

## Important limitations

- The project has no claimed production users and has not received an independent security audit.
- Browser automation cannot replace real Telegram iOS/Android testing.
- The provided mutation limiter is process-local.
- TLS, backups, monitoring, secret storage, and managed infrastructure are deployment responsibilities.
- No npm, PyPI, Docker image, bot, or hosted application is published by this release.

## Upgrade and migration

This is the first release. Apply Alembic migration `0001` before starting the API against a clean PostgreSQL database.
