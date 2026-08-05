# Public repository publishing checklist

Keep the repository private until every relevant item is reviewed by a human owner.

- [ ] Confirm commit history contains no secrets, raw init data, personal data, internal URLs, client names, or copied private code.
- [ ] Inspect all images, fixtures, logs, snapshots, and generated archives.
- [ ] Replace repository support and security contact placeholders with maintained channels.
- [ ] Verify LICENSE ownership and third-party dependency licenses.
- [ ] Run all release checks from the exact default branch commit.
- [ ] Enable branch protection with required CI and at least one review where maintainership allows.
- [ ] Enable CodeQL, dependency graph, Dependabot alerts/updates, secret scanning, push protection, and private vulnerability reporting.
- [ ] Set the factual repository description and topics; do not imply Telegram/OpenAI affiliation or adoption.
- [ ] Configure issue discussions/labels and response expectations.
- [ ] Review funding, analytics, badges, telemetry, and external services before enabling any.
- [ ] Make the visibility change only after explicit owner approval.
- [ ] After publication, clone anonymously, run the quick start, and check every public link.
