# ADR 0003: Per-request init data authentication

- Status: Accepted
- Date: 2026-08-02

## Context

Telegram launch data is trustworthy only after server-side validation. A starter also needs a local browser workflow without creating a second accidental production identity path.

## Decision

Protected requests send the raw launch string as `Authorization: tma <initData>`. FastAPI parses duplicate-safe query data, derives the Telegram secret key, verifies the HMAC with constant-time comparison, enforces `auth_date`, validates the user payload, and then upserts a sanitized local user. The raw string is not persisted.

Development may use `X-Dev-User: browser-mock` only when `APP_ENV` is not production and `DEV_MOCK_AUTH=true`. Production configuration rejects that combination at startup. No JWT or browser session token is introduced.

## Consequences

Revocation and token storage remain simple, and every request has fresh proof bounded by the configured age. The API pays a small verification and user-upsert cost. A future high-volume system may exchange verified init data for a short-lived, audience-bound server session in a new ADR.
