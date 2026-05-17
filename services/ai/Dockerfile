FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared ./packages/shared
COPY services/ai ./services/ai
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @ai-school/shared build
RUN pnpm --filter @ai-school/ai-service build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/services/ai/dist ./dist
COPY --from=builder /app/services/ai/package.json ./
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
