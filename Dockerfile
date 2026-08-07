# Stage 1: Build Phase
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./
RUN npm ci

# Copy full application codebase
COPY . .

# Build Vite frontend static files & Bundle Express server.ts using esbuild
RUN npm run build

# Stage 2: Production Runtime Phase
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy production package.json and install production-only dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/index.html ./index.html

# Security: Non-root execution
USER node

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
