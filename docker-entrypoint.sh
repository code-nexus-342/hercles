#!/bin/sh
set -e

# Optional one-time-ish setup for demo deployments.
#
# Set these env vars on DigitalOcean:
# - RUN_MIGRATIONS=1   to apply Prisma migrations
# - RUN_SEED=1         to seed demo data (safe to re-run; uses upserts)

if [ "${RUN_MIGRATIONS}" = "1" ]; then
  echo "[entrypoint] Running prisma migrate deploy"
  npx prisma migrate deploy
fi

if [ "${RUN_SEED}" = "1" ]; then
  echo "[entrypoint] Running prisma seed"
  npm run db:seed
fi

exec "$@"
