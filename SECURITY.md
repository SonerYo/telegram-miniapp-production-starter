# Security policy

## Supported versions

| Version              | Supported        |
| -------------------- | ---------------- |
| `main`               | Yes              |
| Latest `0.x` release | Yes              |
| Older releases       | Best effort only |

## Reporting a vulnerability

Use GitHub private vulnerability reporting in the repository **Security** tab. The maintainer must enable that setting after publication. Until it is enabled, do not post sensitive details publicly; contact the maintainer through an already verified private channel associated with the repository.

Do not include bot tokens, raw init data, access tokens, private keys, personal data, or production database content in an issue, pull request, screenshot, or log excerpt.

The project does not promise a fixed response SLA. Maintainers will acknowledge and triage good-faith reports as availability permits, coordinate a fix and disclosure when confirmed, and credit reporters who want attribution.

## Security scope

In scope:

- Telegram init data validation and authentication boundaries.
- Browser mock exposure in production.
- Cross-user task access.
- Secret or personal-data leakage through code and logs.
- Dependency and container issues with a practical exploit path.
- XSS, unsafe redirects, CORS, CSP, or reverse-proxy weaknesses.

General hardening suggestions without a concrete vulnerability can use a public issue after removing sensitive information.

## Operational reminders

- Rotate a Telegram bot token immediately if it may have leaked, then invalidate affected deployment secrets.
- Store production secrets in the deployment platform's secret manager, not `.env` files committed to Git.
- Use a least-privilege database user, encrypted backups, HTTPS, and restricted network access.
- Review the [threat model](docs/reference/threat-model.md) after adding personal data, uploads, payments, or external integrations.

## Downstream responsibility

This starter cannot know a downstream product's data, jurisdiction, infrastructure, or abuse model. Adopters must review authorization for new resources, choose retention rules, configure monitoring/backups, patch dependencies, run real Telegram tests, and obtain independent security review when risk warrants it.
