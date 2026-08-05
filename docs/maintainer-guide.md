# Maintainer guide

## Triage and review

- Reproduce issues against the latest supported release and remove sensitive data from reports.
- Label by type, impact, and affected layer; ask for a minimal reproduction when evidence is missing.
- Require tests at the boundary changed and documentation for user-visible or architectural behavior.
- Review migration compatibility, ownership filters, production mock guards, logging fields, dependency cost, and mobile layout on relevant changes.
- Use private vulnerability reporting for security work and coordinate disclosure through [SECURITY.md](../SECURITY.md).

## Release process

1. Resolve or explicitly defer release-blocking issues.
2. Update version metadata and move changelog items under the release version/date.
3. Run the [release checklist](release-checklist.md) on the exact commit.
4. Merge through protected `main`; create a signed or verified `vX.Y.Z` tag.
5. Let the release workflow build source archives and checksums; inspect before publishing notes.
6. Monitor CI, issues, health, logs, and dependency alerts after release.

No npm, PyPI, or Docker registry publication is configured. Adding one requires a separate design, provenance, permissions, and rollback review.

## First 30 days after publication

### Week 1

- Publish `v0.1.0` only after the release checklist passes on the exact commit.
- Verify a clean install on a second machine or clean CI environment.
- Fix setup and documentation friction before adding features.
- Open three to five concrete roadmap issues owned by the maintainer.
- Announce the project only in relevant developer communities and collect real feedback without spam.

### Week 2

- Prioritize security and correctness reports, then fix the first reproducible bugs.
- Improve Windows, macOS, and Linux setup notes from observed failures.
- Add one practical guide requested by users.
- Release `v0.1.1` only if the accumulated fixes justify it.

### Week 3

- Implement one small, repeated feature request that fits the starter's scope.
- Extend tests around the changed trust boundary or workflow.
- Review dependency alerts and the production license inventory.
- Publish a short technical article or sanitized demo video if maintenance capacity allows.

### Week 4

- Assess actual interest using public issues, pull requests, and factual usage signals.
- Update the roadmap and maintenance expectations based on actual capacity.
- Define a narrow `v0.2.0` scope from repeated needs rather than speculation.
- Update the Codex for Open Source draft only with verified facts if the current program permits submission or resubmission.

This plan does not guarantee program acceptance, adoption, or community growth.

## Dependency policy

Merge patch/minor updates only after locked install, unit/E2E, build, and security checks. Treat majors as deliberate changes with release notes. For compromised or critical dependencies, assess reachability, pin/remove quickly, rotate credentials only when exposure warrants it, and publish factual guidance.

## Inactivity

If maintenance capacity changes, state it clearly in README, disable unsupported promises, invite qualified co-maintainers through a documented review period, and archive only after addressing security-contact expectations.
