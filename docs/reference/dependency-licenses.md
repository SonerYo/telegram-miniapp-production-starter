# Dependency license review

This snapshot records production dependencies resolved on 2026-08-02. Lockfiles remain the authoritative version inventory; repeat the review for every release and after dependency changes.

## Frontend

`pnpm licenses list --prod` reported MIT for all resolved production packages, including React, React DOM, React Router, TanStack Query, React Hook Form, Zod, Zustand, and their runtime transitive dependencies.

## Backend direct dependencies

| Package           | Resolved | Declared license      |
| ----------------- | -------- | --------------------- |
| Alembic           | 1.18.5   | MIT                   |
| asyncpg           | 0.31.0   | Apache-2.0            |
| FastAPI           | 0.141.1  | MIT                   |
| pydantic-settings | 2.14.2   | MIT                   |
| SQLAlchemy        | 2.0.51   | MIT                   |
| structlog         | 25.5.0   | MIT OR Apache-2.0     |
| Uvicorn           | 0.52.1   | BSD-3-Clause          |

Metadata is informational and not legal advice. A distributor should review the complete transitive inventory, license texts, notices, source-offer obligations, trademarks, assets, and its own modifications before publication.
