# Release checklist

- [ ] Version values and `CHANGELOG.md` match the intended tag.
- [ ] `make setup` works from a clean checkout.
- [ ] Frontend format, lint, typecheck, unit tests, and production build pass.
- [ ] Backend Ruff, formatting, mypy, pytest, OpenAPI drift, and compile checks pass.
- [ ] Playwright passes with the installed Chromium at all configured widths.
- [ ] Development and production Compose configurations validate.
- [ ] API and web images build without privileged runtime users.
- [ ] Alembic upgrades a clean PostgreSQL database to head and reports no model drift.
- [ ] Browser mock and full-stack local quick starts match README.
- [ ] Real Telegram iOS and Android smoke tests pass in light and dark themes.
- [ ] Secret/path scan and dependency/security workflows pass.
- [ ] No `.env`, database, logs, test artifacts, dependencies, or private product assets are tracked.
- [ ] Source archive contains one root folder and its checksum is recorded.
- [ ] Release notes state limitations, migrations, and security impact honestly.
- [ ] Maintainer has reviewed the production and publishing checklists.
