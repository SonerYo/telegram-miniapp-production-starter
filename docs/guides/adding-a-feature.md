# Adding a feature

Use a vertical slice rather than adding a generic abstraction first.

1. Add SQLAlchemy models and a reviewable Alembic migration when persistence changes.
2. Add request/response schemas and an owner-scoped repository query.
3. Add a FastAPI route with verified-user and mutation-limit dependencies.
4. Export and commit OpenAPI with `make api-schema`.
5. Add Zod contracts and typed client methods on the web side.
6. Add query keys, mutations, invalidation or rollback behavior in the feature folder.
7. Compose the page from existing primitives and semantic tokens.
8. Test validation, authorization, success, empty, loading, failure, and narrow layout.
9. Update the relevant guide or create an ADR when trade-offs affect future contributors.

Do not accept an object ID without also filtering by the authenticated owner. Do not put server data into Zustand. Do not access `window.Telegram` outside the adapter.
