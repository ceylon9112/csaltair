# Patron web (Vite) static site — same bundle as SaltAIr-style Azure Container Apps deploys
FROM node:20-bookworm-slim AS build
WORKDIR /src

COPY package.json package-lock.json ./
COPY patron-web/package.json patron-web/package-lock.json ./patron-web/

RUN npm ci && npm ci --prefix patron-web --include=dev

COPY . .

RUN npm run build:web:vite

FROM nginx:alpine
COPY --from=build /src/patron-web/dist /usr/share/nginx/html
COPY docker/nginx-spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
