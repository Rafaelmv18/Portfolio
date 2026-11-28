#!/bin/sh
set -e

# Prepara o projeto na primeira execução, para qualquer pessoa rodar só com `docker compose up`.
[ -d vendor ] || composer install --no-interaction --prefer-dist
[ -f .env ] || cp .env.example .env
grep -q '^APP_KEY=base64' .env || php artisan key:generate --force

php artisan migrate --force

exec "$@"
