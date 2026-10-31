# syntax=docker/dockerfile:1

# ---- build: static site into /app/dist ----
FROM node:22-slim AS build
# pnpm 12 ships as a standalone binary; copy it from the official image (https://pnpm.io/docker).
COPY --from=ghcr.io/pnpm/pnpm:12.16.1 /opt/pnpm /opt/pnpm
RUN for bin in pnpm pn pnpx pnx; do ln -s "/opt/pnpm/$bin" "/usr/local/bin/$bin"; done
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/var/cache/pnpm \
    pnpm install --frozen-lockfile --store-dir /var/cache/pnpm

COPY . .
# Canonical, hreflang, Open Graph and sitemap URLs are built from this.
ARG SITE_URL=https://example.com
ENV SITE_URL=$SITE_URL
RUN pnpm build

# ---- runtime: nginx serving dist ----
FROM nginx:stable-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
