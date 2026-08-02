# Production checklist

## Application

- [ ] Replace placeholder descriptions, support contacts, hostname, and branding.
- [ ] Run `make verify` on the exact release commit.
- [ ] Review all dependency and CodeQL findings; document accepted risks.
- [ ] Test the exact build in real Telegram iOS and Android clients.
- [ ] Confirm production bundle contains no browser control panel.
- [ ] Confirm API startup rejects mock auth and missing bot token.

## Data and secrets

- [ ] Generate unique database credentials and store all secrets outside Git.
- [ ] Use a least-privilege database role and private network.
- [ ] Apply migrations to a staging copy and rehearse rollback compatibility.
- [ ] Configure encrypted backups, retention, and a tested restore.
- [ ] Define personal-data purpose, retention, export, and deletion behavior.

## Edge and operations

- [ ] Configure DNS, HTTPS, renewal alerts, trusted proxy behavior, and allowed host.
- [ ] Review CORS and CSP for the final origin and integrations.
- [ ] Centralize JSON logs without authorization headers or raw init data.
- [ ] Monitor health, errors, latency, database capacity, disk, and certificate expiry.
- [ ] Define alert ownership, incident response, and token rotation procedure.
- [ ] Replace or accept the per-process rate limiter before horizontal scaling.

## GitHub and open source

- [ ] Enable branch protection, required CI, secret scanning, CodeQL, and Dependabot.
- [ ] Enable private vulnerability reporting and update the security contact.
- [ ] Run the publishing checklist and inspect the release archive from scratch.
- [ ] Verify repository description/topics are factual and no audience claims are implied.
