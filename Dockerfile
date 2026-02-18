FROM nginx:alpine

# envsubst is included in nginx:alpine via libintl
# but we need the full gettext for the standalone binary
RUN apk add --no-cache gettext

# Nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Frontend source
COPY src/ /usr/share/nginx/html/

# Entrypoint generates config.js from env vars
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
