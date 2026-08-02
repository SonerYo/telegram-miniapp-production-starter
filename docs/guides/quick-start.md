# Quick start

## UI only: three commands

Prerequisites are Node.js 24, Corepack, and pnpm 11.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm --filter @starter/web dev
```

Open <http://localhost:5173>. This uses the visible browser mock and an in-memory mock API. Choose **Developer preview** from Settings to force theme, safe areas, latency, empty, and failure states.

## Full local stack

Prerequisites are Docker Engine and Compose v2.

```bash
cp .env.example .env
docker compose up -d db
docker compose run --rm api alembic -c alembic.ini upgrade head
docker compose up --build
```

Open <http://localhost:5173>. The Vite service proxies `/api` to the API container and PostgreSQL persists tasks. The development-only identity header is enabled explicitly by Compose.

## Native toolchains

```bash
uv sync --project apps/api --all-groups --frozen
uv run --project apps/api uvicorn app.main:app --reload
```

In another terminal, run the web command above. Copy each application `.env.example` only when overriding defaults. Run `make check` before committing.

## Windows

Docker Desktop with Compose is the simplest full-stack path. In PowerShell, the `pnpm` and `uv` commands are identical; GNU Make is optional because every Make target shows its underlying command.
