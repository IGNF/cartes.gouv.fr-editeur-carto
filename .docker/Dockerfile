#----------------------------------------------------------------------
# cartes.gouv.fr-editeur-carto : Génération d'un build statique
#----------------------------------------------------------------------
ARG registry=docker.io
FROM node:26-alpine@sha256:2d984a15c9b54fd0aeb608b8e0d0d83529eb34d2966db27a1fb4f1edc3d298a3 AS builder

RUN apk add git

WORKDIR /app
COPY . .

# Enlève les devDependencies de tests, qui nécessitent l'installation de Python
RUN npm pkg delete devDependencies.canvas devDependencies.jsdom \
	devDependencies.vitest devDependencies.msw 'devDependencies.@faker-js/faker' \
	&& npm ci \
	&& npm run build

#----------------------------------------------------------------------
# cartes.gouv.fr-editeur-mes-cartes : Config d'un serveur statique avec nginx
#----------------------------------------------------------------------
FROM ${registry}/nginxinc/nginx-unprivileged:alpine-slim
COPY --from=builder /app/dist /usr/share/nginx/html/
COPY .docker/nginx.conf /etc/nginx/nginx.conf
COPY .docker/entrypoint.sh /entrypoint.sh

USER root
RUN chmod 755 /entrypoint.sh

EXPOSE 8000

USER nginx

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD test -s /tmp/env.js || exit 1