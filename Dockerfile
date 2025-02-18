# FROM oven/bun:alpine

# WORKDIR /app

# COPY package.json bun.lock ./

# RUN bun install --frozen-lockfile

# COPY . .

# ENV PORT 3000
# ENV HOSTNAME "0.0.0.0"
# ENV NEXT_TELEMETRY_DISABLED 1
# ENV NEXT_PUBLIC_BASE_URL localhost:3000

# EXPOSE 3000

# RUN bun run build
# RUN bun run start


FROM oven/bun:alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_PUBLIC_BASE_URL=localhost:3000

RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 bunjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=bunjs:bunjs /app/.next/standalone ./
COPY --from=builder --chown=bunjs:bunjs /app/.next/static ./.next/static

USER bunjs

EXPOSE 3000

ENV PORT=3000
ENV NEXT_PUBLIC_BASE_URL=localhost:3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["bun", "server.js"]