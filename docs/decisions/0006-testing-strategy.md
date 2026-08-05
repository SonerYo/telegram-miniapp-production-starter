# ADR 0006: Risk-oriented testing

- Status: Accepted
- Date: 2026-08-02

## Decision

Use pytest for validators, settings, errors, ownership, and API behavior; Vitest and Testing Library for adapters, the API client, forms, primitives, and shell behavior; and Playwright for whole browser flows, accessibility, states, and responsive widths. Container and migration checks sit in CI because they require system services.

Coverage is a diagnostic, not a substitute for assertions. Security boundaries and failure paths receive focused cases before presentational branches.

## Consequences

Most feedback is fast and deterministic. Browser tests depend on installed Chromium, and real Telegram client behavior still requires a manual smoke test before a public production claim.
