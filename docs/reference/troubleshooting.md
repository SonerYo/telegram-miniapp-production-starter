# Troubleshooting

## API returns `AUTH_INVALID`

Confirm the request uses `Authorization: tma ...`, the API has the matching bot token, host time is correct, and launch data is within `TELEGRAM_INIT_DATA_MAX_AGE_SECONDS`. Do not log or paste the raw header.

## Browser mode returns 401

For the in-memory API, leave `VITE_API_MODE=mock`. For real FastAPI, use a non-production `APP_ENV`, set `DEV_MOCK_AUTH=true`, set `VITE_API_MODE=http`, and restart both processes after changing environment variables.

## Compose web cannot reach API

Keep `VITE_API_PROXY_TARGET=http://api:8000` in the web service. Check `docker compose ps`, then call `/health/ready`. Read API logs using the request ID from an error response.

## Readiness is unhealthy

Verify PostgreSQL health, `DATABASE_URL`, credentials, network name, and migration state. Liveness can pass while readiness fails because the process is alive but the database is unavailable.

## A deep route returns Nginx 404

Use the included `try_files ... /index.html` rule. Do not place another proxy in front that converts client routes to filesystem lookups.

## Layout overlaps Telegram controls

Use the semantic safe-area variables, not fixed padding or only browser `env()`. Reproduce with non-zero insets in Developer Preview at 320 pixels and a real client.

## Playwright has no executable

Run `pnpm --filter @starter/web exec playwright install --with-deps chromium`. Containerized or locked-down CI must allow the browser download or provide a compatible Playwright image.

## OpenAPI drift fails

If the API change is intended, run `make api-schema`, inspect the JSON diff, update typed client contracts and docs, and commit them together.
