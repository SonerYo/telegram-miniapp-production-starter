# Contributing

Thanks for helping improve this starter. Focus contributions on reusable Telegram Mini App foundations rather than product-specific business logic.

## Setup

```bash
corepack enable
pnpm install --frozen-lockfile
uv sync --project apps/api --all-groups --frozen
make check
```

Install Playwright Chromium once before E2E work:

```bash
pnpm --filter @starter/web exec playwright install --with-deps chromium
```

## Branches and commits

- Use a descriptive branch such as `feat/viewport-recipe` or `fix/init-data-expiry`.
- Keep commits reviewable and describe intent, not generated file counts.
- Conventional commit prefixes are welcome but not enforced by a bot.

## Before opening a pull request

1. Run `make check`.
2. Run relevant Playwright tests for UI or Telegram adapter changes.
3. Run `make api-schema` after API contract changes and commit the schema.
4. Update guides, ADRs, and changelog entries when behavior changes.
5. Run `bash scripts/secret_scan.sh`.

Generated files are limited to `pnpm-lock.yaml`, `apps/api/uv.lock`, `docs/reference/openapi.json`, and selected sanitized screenshots. Do not edit lockfiles or OpenAPI JSON by hand.

## Pull requests

- Explain the problem, approach, user/developer impact, and checks run.
- Keep large architecture changes issue-first so trade-offs can be discussed.
- Include sanitized mobile screenshots for visible UI changes.
- Do not include raw Telegram init data, bot tokens, database dumps, personal information, or production logs.

## Code expectations

- Preserve strict TypeScript, Ruff, mypy, and stable API error contracts.
- Keep global Telegram access inside `lib/telegram`.
- Keep server state in TanStack Query rather than duplicating it in Zustand.
- Add ownership checks for every new user-owned object.
- Avoid new infrastructure or UI dependencies when a small local implementation is clearer.

## Security

Do not open a public issue for a vulnerability. Follow [SECURITY.md](SECURITY.md). After repository publication, private vulnerability reporting is the preferred channel.
