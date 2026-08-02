# Threat model

## Assets and boundaries

Protected assets are the bot token, verified Telegram identity, owner-scoped tasks, database credentials, personal profile fields, and operational logs. The browser and all request input are untrusted. FastAPI is the authentication and authorization boundary; PostgreSQL is reachable only from the private service network.

## Material threats and controls

| Threat                       | Primary controls                                                       | Residual responsibility                       |
| ---------------------------- | ---------------------------------------------------------------------- | --------------------------------------------- |
| Forged launch identity       | Official HMAC derivation, constant-time compare, strict parsing        | Protect and rotate bot token                  |
| Replay of captured init data | Configurable `auth_date` maximum and future skew check                 | HTTPS, suitable expiry, incident response     |
| Browser mock in production   | Compile-time dev branch, bundle marker check, API startup guard        | Run exact release gate                        |
| Cross-user object access     | Owner ID in every task lookup, indistinguishable 404                   | Repeat pattern for every new resource         |
| Secret leakage               | Examples only, secret scan, redacted structured logs, no browser token | Platform secret manager and log review        |
| XSS or unsafe navigation     | React escaping, schema validation, controlled links, CSP               | Review any HTML or new content origins        |
| CORS/host abuse              | Exact origin and host settings, same-origin proxy                      | Configure final domain and trusted proxy      |
| Mutation abuse               | Input limits and process-local limiter                                 | Edge/distributed limit for scale or hostility |
| Dependency compromise        | Lockfiles, Dependabot, audit, CodeQL, review                           | Timely triage and provenance policy           |
| Database loss                | Explicit migrations, persistent volume                                 | Encrypted backups and tested restore          |

## Out of scope for the starter

Payment fraud, file scanning, product moderation, jurisdiction-specific compliance, bot command handling, distributed denial of service, compromised Telegram clients, and downstream business authorization require an application-specific model.

Revisit this document when adding personal data, uploads, payments, third-party APIs, admin roles, analytics, or multiple services.
