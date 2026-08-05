# ADR 0007: Same-origin Nginx deployment

- Status: Accepted
- Date: 2026-08-02

## Decision

Build static assets in a Node stage, serve them from unprivileged Nginx on port 8080, and proxy `/api` and health requests to FastAPI. PostgreSQL is private. Production Compose is a reference topology; TLS terminates at an external ingress or load balancer. Alembic runs as a one-off profile.

## Consequences

The browser uses one HTTPS origin and normally needs no cross-origin exception. The repository is deployable on many container platforms without coupling to one vendor. DNS, certificates, secrets, backups, observability, redundancy, and zero-downtime orchestration remain operator responsibilities.
