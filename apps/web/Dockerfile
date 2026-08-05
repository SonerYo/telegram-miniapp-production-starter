# syntax=docker/dockerfile:1.7
FROM node:24.14.0-alpine AS dependencies
RUN corepack enable && corepack prepare pnpm@11.18.0 --activate
WORKDIR /workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @starter/web... --store-dir /pnpm/store

FROM dependencies AS development
COPY apps/web apps/web
EXPOSE 5173
CMD ["pnpm", "--filter", "@starter/web", "dev", "--host", "0.0.0.0"]

FROM dependencies AS build
COPY apps/web apps/web
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN pnpm --filter @starter/web build

FROM nginx:1.31.3-alpine AS runtime
COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY infra/nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /workspace/apps/web/dist /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/run
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/health/live || exit 1
