# Build stage
FROM node:22-alpine3.21 AS builder
ARG CI=1

WORKDIR /app

# Install pnpm globally
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace files
COPY package.json pnpm-*.yaml ./
COPY packages ./packages

# Install dependencies (pnpm handles monorepo workspace installation)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store\
 pnpm install --filter="@falcon-analytics/backend..." --frozen-lockfile --prefer-offline

# Build the service (this will handle building all necessary packages for the backend)
RUN pnpm --filter="@falcon-analytics/backend..." build

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store\
  pnpm --filter="@falcon-analytics/backend" deploy --prefer-offline --prod out

# Runner stage
FROM node:22-alpine3.21 AS runner
WORKDIR /app

# Copy only the necessary files from builder stage
COPY --from=builder /app/out/dist dist
COPY --from=builder /app/out/node_modules node_modules

# Expose the port and run the app
EXPOSE 3000
CMD ["node", "./dist/index.js"]