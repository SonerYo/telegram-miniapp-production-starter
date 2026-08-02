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

- Confirm branch protection, CodeQL, Dependabot, secret scanning, and private vulnerability reporting are operating.
- Review onboarding friction from a clean machine and fix documentation defects before adding features.
- Triage security and correctness reports first; avoid claiming adoption without public evidence.
- Track which extension requests repeat before expanding the core abstraction.
- Publish maintenance expectations based on actual capacity.

## Dependency policy

Merge patch/minor updates only after locked install, unit/E2E, build, and security checks. Treat majors as deliberate changes with release notes. For compromised or critical dependencies, assess reachability, pin/remove quickly, rotate credentials only when exposure warrants it, and publish factual guidance.

## Inactivity

If maintenance capacity changes, state it clearly in README, disable unsupported promises, invite qualified co-maintainers through a documented review period, and archive only after addressing security-contact expectations.
