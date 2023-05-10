docker-compose down --remove-orphans
docker rmi ninipriv/aime:backend_latest
docker rmi ninipriv/aime:frontend_latest
docker-compose --env-file .env -f docker-compose-prod.yml up -d