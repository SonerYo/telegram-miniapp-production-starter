# ADR 0001: Monorepo and package management

- Status: Accepted
- Date: 2026-08-02

## Context

The UI, API, deployment files, contract snapshot, and contributor automation evolve together. Splitting the first release across repositories would make atomic contract changes and local onboarding harder.

## Decision

Keep a single repository. pnpm manages the TypeScript workspace and `uv` manages the Python project. Both lockfiles are committed. There is no generated client package in v0.1.0; the frontend validates a small handwritten contract with Zod and the OpenAPI document is checked for drift.

## Consequences

One pull request can update the API, client, migration, tests, and documentation. Toolchains remain independent and CI can cache them separately. If more apps or a public client library appear, workspace boundaries can be expanded without changing repository identity.
