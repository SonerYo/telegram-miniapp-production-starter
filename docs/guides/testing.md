# Testing guide

## Fast feedback

```bash
make check
make api-schema-check
make docs-check
```

Backend tests use an isolated temporary SQLite database for speed. CI additionally applies Alembic to PostgreSQL. Frontend unit tests run in jsdom and include focused coverage reporting.

## Browser tests

Install the browser once, then run:

```bash
pnpm --filter @starter/web exec playwright install --with-deps chromium
make test-e2e
```

Playwright starts the Vite development server in deterministic browser mock mode. It covers startup, task CRUD, BackButton, loading/empty/error/offline states, dark theme, non-zero safe areas, 404, axe checks, and horizontal overflow at 320, 360, 375, 390, 430, and 768 pixels.

To refresh sanitized public screenshots after intentional UI review:

```bash
pnpm --filter @starter/web test:e2e:update
```

Never update snapshots merely to silence a failure. Inspect changed focus, spacing, safe-area, text wrapping, and theme behavior first.

## Release gate

`make verify` includes formatting, linting, types, unit tests, OpenAPI drift, production build, docs, secret scanning, and container builds. A real Telegram-client smoke test and migration rehearsal remain manual release checks.
