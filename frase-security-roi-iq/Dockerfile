# Expect `dist/` from `npm install && npm run build` before image build (CI does this on the runner).
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
