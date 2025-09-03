ARG registry=docker.io
FROM ${registry}/nginxinc/nginx-unprivileged:alpine-slim

COPY ./../docs /usr/share/nginx/html
COPY ./../.docker/nginx.apps.conf /etc/nginx/conf.d/default.conf

EXPOSE 8000

USER nginx

CMD ["nginx", "-g", "daemon off;"]