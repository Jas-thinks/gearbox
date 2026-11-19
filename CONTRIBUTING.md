# Contributing to Gearbox

## Workflow
1. Branch from `main`: `feat/<topic>`, `fix/<topic>`, `chore/<topic>`.
2. Keep PRs small and focused; fill in the PR template.
3. CI must pass: typecheck, lint, build, Terraform validate, Docker build.
4. Squash-merge into `main`.

## Commits
[Conventional Commits](https://www.conventionalcommits.org): `feat(web): ...`, `fix(worker): ...`, `docs: ...`, `build: ...`, `chore: ...`.

## Local setup
See the [README](README.md#quick-start). Node 20+, pnpm 9.

## Architecture rules
- Business logic lives in services, never in route handlers.
- Only repositories talk to the database.
- Every write that triggers side effects goes through the outbox; consumers must be idempotent.
- Schema changes are new numbered migrations in `packages/database/supabase/migrations/`; never edit an applied one.
- Significant design choices get an ADR in `docs/adr/`.
