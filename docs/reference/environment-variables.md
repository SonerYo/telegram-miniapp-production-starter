# Environment variable reference

## API

| Variable                             | Default        |          Production | Secret | Purpose                                      |
| ------------------------------------ | -------------- | ------------------: | -----: | -------------------------------------------- |
| `APP_ENV`                            | `development`  |            Required |     No | `development`, `test`, or `production` guard |
| `APP_DEBUG`                          | `false`        |       Must be false |     No | Framework debug behavior                     |
| `APP_VERSION`                        | `0.1.0`        |         Recommended |     No | Metadata and diagnostics                     |
| `DATABASE_URL`                       | SQLite dev URL | PostgreSQL required |    Yes | SQLAlchemy async URL                         |
| `TELEGRAM_BOT_TOKEN`                 | empty          |            Required |    Yes | Init data validation only                    |
| `TELEGRAM_INIT_DATA_MAX_AGE_SECONDS` | `3600`         |            Required |     No | Maximum accepted auth age                    |
| `CORS_ALLOWED_ORIGINS`               | local origins  |            Required |     No | Comma-separated exact origins                |
| `TRUSTED_HOSTS`                      | local hosts    |            Required |     No | Comma-separated host allowlist               |
| `LOG_LEVEL`                          | `INFO`         |         Recommended |     No | Python logging level                         |
| `LOG_FORMAT`                         | `console`      |      Must be `json` |     No | Structured production output                 |
| `REQUEST_ID_HEADER`                  | `X-Request-ID` |            Optional |     No | Correlation header                           |
| `RATE_LIMIT_ENABLED`                 | `true`         |         Recommended |     No | Process-local mutation limiter               |
| `DEV_MOCK_AUTH`                      | `false`        |       Must be false |     No | Enable explicit development identity         |

`apps/api/.env.example` contains the complete parser-compatible form. Production validation fails closed for the unsafe combinations listed above.

## Web build and development server

| Variable                   | Default                 | Scope             | Purpose                                            |
| -------------------------- | ----------------------- | ----------------- | -------------------------------------------------- |
| `VITE_API_BASE_URL`        | `/api`                  | Browser build     | API prefix or origin                               |
| `VITE_API_MODE`            | `mock` in dev           | Browser build     | `mock` or `http` API adapter                       |
| `VITE_ENABLE_BROWSER_MOCK` | `true` in dev           | Browser build     | Explicit development host fallback                 |
| `VITE_API_PROXY_TARGET`    | `http://localhost:8000` | Vite process only | Dev proxy upstream; Compose uses `http://api:8000` |

Every `VITE_` variable embedded by Vite is public. Never place a bot token, database password, API secret, or private key in one.

## Compose database

`POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` configure the container and build `DATABASE_URL`. Development fallbacks are conspicuous local-only values. Production Compose requires all three.
