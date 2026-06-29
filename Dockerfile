# ============================================================
# Build stage: Vue/Vite
# ============================================================
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ============================================================
# Runtime stage: Node server interno para edge_nginx
# ============================================================
FROM node:22-alpine AS runtime

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY server.mjs ./server.mjs

USER node

EXPOSE 8080

CMD ["node", "server.mjs"]