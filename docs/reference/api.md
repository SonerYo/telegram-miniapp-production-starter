# API reference

The versioned API prefix is `/api/v1`. The machine-readable [OpenAPI snapshot](openapi.json) is generated from the application and checked in CI.

## Authentication

Protected routes require:

```http
Authorization: tma <raw Telegram WebApp initData>
```

The development-only alternative is `X-Dev-User: browser-mock` when both non-production environment and mock-auth flag permit it.

## Endpoints

| Method   | Path                      | Authentication | Purpose                    |
| -------- | ------------------------- | -------------- | -------------------------- |
| `GET`    | `/health/live`            | No             | Process liveness           |
| `GET`    | `/health/ready`           | No             | Database readiness         |
| `GET`    | `/api/v1/meta`            | No             | Public service metadata    |
| `GET`    | `/api/v1/me`              | Yes            | Sanitized verified profile |
| `GET`    | `/api/v1/tasks`           | Yes            | Owner-scoped task list     |
| `POST`   | `/api/v1/tasks`           | Yes            | Create a task              |
| `PATCH`  | `/api/v1/tasks/{task_id}` | Yes            | Update text/completion     |
| `DELETE` | `/api/v1/tasks/{task_id}` | Yes            | Delete an owned task       |

Mutation routes use a small process-local rate limit. Task text is trimmed and length-limited. Lists are bounded to 100 records in the starter.

## Error contract

Errors use a stable envelope with a machine code, safe message, request ID, and optional validation details. Responses never expose tracebacks, database errors, authorization headers, raw init data, or bot tokens. Send the request ID—not sensitive request data—when correlating logs.

Run `make api-schema` after an intentional contract change and commit `docs/reference/openapi.json`.
