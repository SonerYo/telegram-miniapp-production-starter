# ADR 0002: Telegram bridge adapter

- Status: Accepted
- Date: 2026-08-02

## Context

Telegram exposes Mini App capabilities through `window.Telegram.WebApp`. Application code should not depend on the global object everywhere, and browser development must remain deterministic.

## Decision

Load the [official bridge script](https://core.telegram.org/bots/webapps#initializing-mini-apps) and place a small typed adapter in `apps/web/src/lib/telegram`. Only `runtime.ts` reads the global. The provider exposes the subset this starter uses: initialization, theme, viewport and safe areas, BackButton, MainButton, haptics, closing confirmation, links, and raw init data.

Browser mock code is dynamically imported only when Vite's compile-time development flag is true. The production build check rejects its marker text.

## Consequences

The integration surface is auditable and vendor behavior is easy to mock. New Telegram features require an explicit type and adapter addition. This deliberately avoids a larger SDK dependency until its abstraction provides clear value.
