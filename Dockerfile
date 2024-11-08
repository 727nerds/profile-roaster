# Build stage
FROM oven/bun:1-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/

# Install all dependencies
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build frontend
RUN bun run frontend:build

# Production stage
FROM oven/bun:1-alpine

WORKDIR /app

# Copy backend files
COPY --from=build /app/apps/backend/src ./src
COPY --from=build /app/apps/backend/public ./public
COPY --from=build /app/apps/backend/package.json ./package.json
COPY --from=build /app/bun.lockb ./

# Install only production dependencies
RUN bun install

EXPOSE 3000

CMD ["bun", "src/index.ts"]