#!/bin/sh
set -e

# Generate config.js from environment variables at container startup.
# Only the listed variables are substituted — everything else stays untouched.
envsubst '${APP_TITLE} ${AUTH_URL} ${API_BASE_URL} ${WEBHOOK_TASKS} ${WEBHOOK_FOLDERS} ${WEBHOOK_FILES} ${WEBHOOK_SERVE_FILE} ${WEBHOOK_FILE_DELETE} ${WEBHOOK_UPLOAD_FORM}' \
  < /usr/share/nginx/html/js/config.js.template \
  > /usr/share/nginx/html/js/config.js

echo "[entrypoint] config.js generated from environment"

exec nginx -g 'daemon off;'
