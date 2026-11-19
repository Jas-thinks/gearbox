# Gearbox

[![CI](https://github.com/Jas-thinks/gearbox/actions/workflows/ci.yml/badge.svg)](https://github.com/Jas-thinks/gearbox/actions/workflows/ci.yml)

Peer-to-peer camera-gear rental marketplace. Built as a **scalable, AWS-ready distributed system**:
stateless Next.js API/UI, Redis for cache/rate-limit/idempotency, a transactional outbox feeding SQS,
and an autoscaled worker fleet.

> Architecture deep-dive: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · Decisions: [docs/adr](docs/adr) · Plan: [docs/ROADMAP.md](docs/ROADMAP.md)

```
apps/
  web/        @gearbox/web       Public site + /api/v1 (Next.js, standalone Docker image)
  worker/     @gearbox/worker    Outbox relay + SQS consumers
  growth-os/  @gearbox/growth-os Internal CRM / waitlist pipeline
packages/
  infra/      Redis rate limiter, cache-aside, idempotency, SQS publisher/consumer
  database/   Supabase clients + SQL migrations (001-008)
  config/ types/ utils/ ui/
infra/terraform/  AWS: VPC, ECS Fargate, ALB, CloudFront+WAF, ElastiCache, SQS+DLQ, S3, Secrets, alarms
.github/workflows/ CI (typecheck, lint, build, terraform validate, docker build) + manual deploy
```

## Distributed-systems highlights

| Concern | Solution |
|---|---|
| No double-booking | Postgres exclusion constraint on `(equipment, daterange)` |
| Safe client retries | `Idempotency-Key` (Redis claim, DB unique key) |
| Reliable events | Transactional outbox, `SKIP LOCKED` relay, SQS, DLQ + alarm |
| Read scale | CloudFront, Redis cache-aside with single-flight, GIN full-text search |
| Abuse control | Redis Lua rate limiter (fails open) + AWS WAF |
| Resilience | 2 AZs, autoscaling (CPU, req/target, queue depth), circuit-breaker rollback |

## API (v1)

| Method | Route | Notes |
|---|---|---|
| GET | `/api/v1/equipment`, `/equipment/:slug` | Cached (edge + Redis) |
| GET | `/api/v1/equipment/:slug/availability` | Busy date ranges |
| POST | `/api/v1/bookings` | Bearer JWT, `Idempotency-Key`, 10/min/IP |
| GET | `/api/v1/bookings`, `/bookings/:id` | Bearer JWT |
| POST | `/api/v1/waitlist`, `/contact` | Public |
| GET | `/api/v1/health/live`, `/health/ready` | Probes |

## Quick start

```bash
corepack enable && pnpm install
cp .env.example apps/web/.env.local     # add Supabase keys
# Apply packages/database/supabase/migrations/*.sql (in order) to your Supabase project
pnpm dev:web                            # http://localhost:3000
pnpm --filter @gearbox/worker dev       # background worker
docker compose up --build               # full stack with Redis
```

Redis and SQS are optional locally; everything falls back to in-memory / in-process.

## Deploy to AWS

```bash
cd infra/terraform
terraform init && terraform apply       # creates the whole stack
# 1. put secret values in Secrets Manager (names in `terraform output secret_names`)
# 2. push images to the ECR repos (or run the Deploy workflow)
```

CI/CD uses GitHub OIDC; set `AWS_DEPLOY_ROLE_ARN` and the `NEXT_PUBLIC_*` repo variables.
Switch `deploy.yml` to run on push to `main` once bootstrapped.

## Scripts

`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm clean`

## Contributing & security

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

## License

Proprietary. See [LICENSE](LICENSE).
