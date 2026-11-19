# ADR 0001: Modular monolith on ECS Fargate

Status: accepted

Context: pre-seed team, one product, read-heavy predictable traffic.

Decision: one Next.js deployable (UI + `/api/v1`) with controller/service/repository layering, plus one
worker deployable. Shared code in `packages/*`. Runs on Fargate behind CloudFront and an ALB.

Why not microservices: operational cost without team-size benefit; the outbox events are the seams for later extraction.
Why not Lambda: SSR cold starts hurt p95 and Postgres connection pooling is awkward.
