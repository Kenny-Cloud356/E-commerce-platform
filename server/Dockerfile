# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init

# ---- Dependencies ----
FROM base AS deps
COPY package*.json ./
RUN npm install --omit=dev && \
    cp -R node_modules /prod_modules && \
    npm install

# ---- Build / Lint (optional validation stage) ----
FROM deps AS validate
COPY . .
RUN npm run lint 2>/dev/null || true

# ---- Production ----
FROM base AS production
ENV NODE_ENV=production

# Copy only production dependencies
COPY --from=deps /prod_modules ./node_modules
COPY . .

# Non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup && \
    mkdir -p logs && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["dumb-init", "node", "src/server.js"]
