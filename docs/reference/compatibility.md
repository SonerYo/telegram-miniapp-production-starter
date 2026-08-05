# Compatibility policy

## Supported development baseline

- Node.js 24.14 or later in the Node 24 line and pnpm 11.18.
- Python 3.12 and the locked `uv` environment.
- PostgreSQL 18 for the provided Compose topology.
- Current stable Chromium for automated browser checks.
- Current Telegram Mini App clients on maintained iOS and Android versions for manual release smoke tests.

The frontend build target is ES2022. The project does not promise Internet Explorer, obsolete embedded browsers, or Telegram client versions no longer maintained upstream.

## Versioning

Before 1.0, minor releases may contain documented breaking changes. Patch releases should be backward compatible. API contract changes update OpenAPI and the changelog. Database changes use forward-reviewed migrations and should keep the previous application version compatible during rolling deployment where applicable.

Dependencies are updated through reviewed pull requests; “latest” is not installed at runtime. Exact resolved versions live in lockfiles, while compatible ranges allow Dependabot maintenance.
