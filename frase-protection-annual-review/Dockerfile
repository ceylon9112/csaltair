# Expect `dist/` to exist (run `npm ci && npm run build` first). CI builds on the runner, then `az acr build` uses this image.
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
