# syntax=docker/dockerfile:1.7
# Build from the REPO ROOT:  docker build -f apps/worker/Dockerfile -t gearbox-worker .
FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
ENV NODE_ENV=production
WORKDIR /repo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/worker apps/worker
COPY packages packages
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --filter @gearbox/worker...
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /repo
USER app
CMD ["pnpm", "--filter", "@gearbox/worker", "start"]
