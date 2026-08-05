# Why this project

Many Telegram Mini App examples correctly demonstrate one API call or one interface primitive. They usually stop before the repetitive work that determines whether a new product is safe to extend: server-side init data validation, explicit runtime boundaries, database ownership, environment guards, failure states, migrations, container health, and reproducible tests.

This repository turns those concerns into one inspectable full-stack baseline.

## The gap it closes

- A frontend must treat `initDataUnsafe` as display-only and send raw `initData` to a backend that validates it.
- Mobile layout must account for Telegram theme values, changing viewport height, safe-area insets, and host navigation.
- Developers need a normal browser feedback loop without quietly weakening production authentication.
- A starter should demonstrate state recovery, object ownership, migrations, logs, health checks, and release hygiene—not only a happy-path screen.

## Why browser mock mode matters

Telegram launch context is excellent for integration testing but slow for ordinary UI iteration. The explicit browser mock makes layout and state work available to local development and Playwright. It is visibly synthetic and compile-time guarded; it is not a replacement for a real Telegram smoke test.

## Why validation belongs on the backend

The frontend can be modified by its user. A Telegram user object becomes trustworthy only after the server recomputes the HMAC with the bot token, compares it in constant time, and rejects stale authentication dates. The bot token never belongs in Vite environment variables or browser storage.

## Deliberate limits

The starter does not include every Telegram feature. Payments, notifications, Redis, background jobs, analytics, and product-specific permissions have different threat models and operating costs. Adding incomplete examples would make the repository harder to understand and easier to misuse.

## Maintenance principles

1. Prefer official specifications and small, active dependencies.
2. Keep development conveniences physically disabled in production paths.
3. Test risky boundaries before chasing broad line coverage.
4. Keep documentation commands executable and versioned with code.
5. Report adoption, contributors, and security review status honestly.

The project grew from general practical experience building Telegram Mini Apps. It contains original implementation and neutral demo behavior; it does not publish code, data, branding, or product logic from private applications.
