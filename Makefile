SHELL := /bin/bash
PNPM := pnpm
UV := uv

.PHONY: setup dev dev-web dev-api db-up migrate seed test test-web test-api test-e2e lint typecheck format format-check check verify build docker-build clean api-schema api-schema-check docs-check secret-scan

setup:
	$(PNPM) install --frozen-lockfile
	$(UV) sync --project apps/api --all-groups --frozen

dev:
	docker compose up --build

dev-web:
	$(PNPM) --filter @starter/web dev

dev-api:
	$(UV) run --project apps/api uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

db-up:
	docker compose up -d db

migrate:
	$(UV) run --project apps/api alembic -c apps/api/alembic.ini upgrade head

seed:
	$(UV) run --project apps/api python scripts/seed_demo.py

test: test-web test-api

test-web:
	$(PNPM) --filter @starter/web test

test-api:
	$(UV) run --project apps/api pytest apps/api/tests

test-e2e:
	$(PNPM) --filter @starter/web test:e2e

lint:
	$(PNPM) --filter @starter/web lint
	$(UV) run --project apps/api ruff check apps/api
	$(UV) run --project apps/api ruff format --check apps/api

typecheck:
	$(PNPM) --filter @starter/web typecheck
	$(UV) run --project apps/api mypy apps/api/src

format:
	$(PNPM) --filter @starter/web format
	$(UV) run --project apps/api ruff check --fix apps/api
	$(UV) run --project apps/api ruff format apps/api

check: lint typecheck test

build:
	$(PNPM) --filter @starter/web build
	$(UV) run --project apps/api python -m compileall -q apps/api/src

api-schema:
	$(UV) run --project apps/api python scripts/export_openapi.py

api-schema-check:
	$(UV) run --project apps/api python scripts/export_openapi.py --check

docs-check:
	$(PNPM) --filter @starter/web docs:check

secret-scan:
	bash scripts/secret_scan.sh

docker-build:
	docker compose build
	docker compose -f docker-compose.prod.yml config --quiet

verify: format-check lint typecheck test api-schema-check build docs-check secret-scan
	@command -v docker >/dev/null || { echo "Docker is required for the final release verification: run 'make docker-build'."; exit 1; }
	$(MAKE) docker-build

format-check:
	$(PNPM) --filter @starter/web format:check
	$(UV) run --project apps/api ruff format --check apps/api

clean:
	bash scripts/clean.sh
