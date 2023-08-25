# Arnoldi

An AI life coach that helps users navigate their lives, while motivating them to get very, very swole.

## Quickstart

Set up environment variables in `.env`. Feel free to use [`.env.template`](./.env.template) as a template.

To deploy, run:

```
docker compose --env-file .env -f docker-compose-prod.yml up -d
```

## Architecture

The application is very simple currently, only consists of two servies - a frontend and a backend. The backend communicates also with an external database, and later on a vector store.
