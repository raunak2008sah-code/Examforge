# =============================================================================
# ExamForge — Developer Makefile
# =============================================================================
# All commands listed in CLAUDE.md §8 are implemented here.
# Run `make help` to see available targets.
#
# Requirements:
#   - pnpm >= 9  (Node.js package manager)
#   - uv or pip  (Python package manager, for doc-processor)
#   - docker     (only for docker:build target)
# =============================================================================

.DEFAULT_GOAL := help
.PHONY: help install dev dev\:web dev\:processor \
        lint lint\:fix typecheck format format\:check \
        test test\:watch test\:web test\:processor \
        build build\:web build\:processor \
        db\:generate db\:migrate db\:migrate\:deploy db\:push db\:studio db\:seed db\:format db\:validate \
        types\:generate types\:verify \
        docker\:build \
        parser\:test parser\:golden \
        clean clean\:web clean\:processor clean\:all \
        check

# ---------------------------------------------------------------------------
# Help
# ---------------------------------------------------------------------------
help: ## Show this help message
	@echo ""
	@echo "ExamForge — available make targets"
	@echo "==================================="
	@grep -E '^[a-zA-Z_:/-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-28s\033[0m %s\n", $$1, $$2}'
	@echo ""

# ---------------------------------------------------------------------------
# Install
# ---------------------------------------------------------------------------
install: ## Install all JS/TS dependencies via pnpm
	pnpm install

install\:processor: ## Install Python dependencies for doc-processor
	cd apps/doc-processor && pip install -e ".[dev]"

install\:all: install install\:processor ## Install all dependencies (JS + Python)

# ---------------------------------------------------------------------------
# Development servers
# ---------------------------------------------------------------------------
dev: ## Start Next.js dev server (port 3000)
	pnpm --filter @examforge/web dev

dev\:web: ## Start Next.js dev server only
	pnpm --filter @examforge/web dev

dev\:processor: ## Start FastAPI dev server (port 8000, hot-reload)
	cd apps/doc-processor && uvicorn app.main:app --reload --port 8000

# ---------------------------------------------------------------------------
# Code Quality — Lint
# ---------------------------------------------------------------------------
lint: ## Run ESLint (web) + Ruff (processor)
	pnpm --filter @examforge/web lint
	cd apps/doc-processor && ruff check .

lint\:fix: ## Run ESLint --fix (web) + Ruff --fix (processor)
	pnpm --filter @examforge/web lint:fix
	cd apps/doc-processor && ruff check --fix .

# ---------------------------------------------------------------------------
# Code Quality — Type Checking
# ---------------------------------------------------------------------------
typecheck: ## Run tsc (web + packages) + mypy (processor)
	pnpm --filter @examforge/web typecheck
	pnpm --filter @examforge/db typecheck
	pnpm --filter @examforge/shared-types typecheck
	cd apps/doc-processor && mypy app

# ---------------------------------------------------------------------------
# Code Quality — Formatting
# ---------------------------------------------------------------------------
format: ## Format all code (Prettier for TS/JSON/MD, Ruff for Python)
	pnpm format
	cd apps/doc-processor && ruff format .

format\:check: ## Check formatting without writing (for CI)
	pnpm format:check
	cd apps/doc-processor && ruff format --check .

# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------
test: ## Run all tests (Vitest + Pytest)
	pnpm --filter @examforge/web test
	cd apps/doc-processor && pytest

test\:watch: ## Run Vitest in watch mode (web only)
	pnpm --filter @examforge/web test:watch

test\:web: ## Run Vitest (web only)
	pnpm --filter @examforge/web test

test\:processor: ## Run Pytest (doc-processor only)
	cd apps/doc-processor && pytest -v

# ---------------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------------
build: ## Build all packages + web app (production)
	pnpm --filter @examforge/db build
	pnpm --filter @examforge/shared-types build
	pnpm --filter @examforge/web build

build\:web: ## Build Next.js app only
	pnpm --filter @examforge/web build

build\:processor: ## (No build step for Python; validates imports)
	cd apps/doc-processor && python -c "import app.main; print('Import OK')"

# ---------------------------------------------------------------------------
# Database (Prisma) — CLAUDE.md §8
# ---------------------------------------------------------------------------
db\:generate: ## Generate Prisma client from schema
	pnpm --filter @examforge/db db:generate

db\:migrate: ## Create + apply a new migration (dev)
	pnpm --filter @examforge/db db:migrate

db\:migrate\:deploy: ## Apply pending migrations (CI / production)
	pnpm --filter @examforge/db db:migrate:deploy

db\:push: ## Push schema changes without a migration file (prototyping only)
	pnpm --filter @examforge/db db:push

db\:studio: ## Open Prisma Studio (port 5555)
	pnpm --filter @examforge/db db:studio

db\:seed: ## Seed development data
	pnpm --filter @examforge/db db:seed

db\:format: ## Format prisma/schema.prisma
	pnpm --filter @examforge/db db:format

db\:validate: ## Validate prisma/schema.prisma
	pnpm --filter @examforge/db db:validate

# ---------------------------------------------------------------------------
# Shared Types — CLAUDE.md §8
# ---------------------------------------------------------------------------
types\:generate: ## Generate shared types from Prisma + OpenAPI
	pnpm --filter @examforge/shared-types types:generate

types\:verify: ## Verify web/processor types match
	pnpm --filter @examforge/shared-types types:verify

# ---------------------------------------------------------------------------
# Docker
# ---------------------------------------------------------------------------
docker\:build: ## Build doc-processor Docker image
	docker build -t examforge-doc-processor:latest apps/doc-processor

docker\:run: ## Run doc-processor container locally
	docker run --rm -p 8000:8000 \
		--env-file .env \
		examforge-doc-processor:latest

# ---------------------------------------------------------------------------
# Parser Development — CLAUDE.md §8
# ---------------------------------------------------------------------------
parser\:test: ## Run golden-file parser tests
	cd apps/doc-processor && pytest tests/golden_files/ -v

parser\:golden: ## Regenerate golden files (REVIEW OUTPUT BEFORE COMMITTING)
	@echo "⚠️  Regenerating golden files. Review all changes before committing."
	cd apps/doc-processor && pytest tests/golden_files/ --regenerate -v

# ---------------------------------------------------------------------------
# Clean
# ---------------------------------------------------------------------------
clean: ## Remove build artefacts (keeps node_modules)
	pnpm --filter @examforge/web clean
	pnpm --filter @examforge/db clean
	pnpm --filter @examforge/shared-types clean
	cd apps/doc-processor && find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null; \
		find . -type d -name .mypy_cache -exec rm -rf {} + 2>/dev/null; \
		find . -type d -name .ruff_cache -exec rm -rf {} + 2>/dev/null; \
		find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null; true

clean\:all: clean ## Remove build artefacts AND node_modules (full reset)
	pnpm --filter @examforge/web exec -- rm -rf node_modules
	rm -rf node_modules

# ---------------------------------------------------------------------------
# Convenience aggregates
# ---------------------------------------------------------------------------
check: lint typecheck format\:check ## Run all checks without side effects (CI-safe)
	@echo ""
	@echo "✓ All checks passed"
