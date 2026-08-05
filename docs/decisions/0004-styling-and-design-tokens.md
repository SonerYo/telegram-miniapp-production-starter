# ADR 0004: CSS Modules and semantic tokens

- Status: Accepted
- Date: 2026-08-02

## Decision

Use global semantic design tokens for color, spacing, radius, typography, elevation, motion, Telegram theme mapping, and safe-area values. Use CSS Modules for component and page styles. Reusable React primitives own common accessible behavior; no third-party component kit or CSS runtime is included.

## Consequences

The rendered CSS is small, inspectable, and independent of a product brand. Telegram color parameters can replace semantic tokens without component rewrites. Contributors must extend semantic roles instead of scattering raw brand colors through modules.
