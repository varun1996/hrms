# hrms_lite
Lightweight Human Resource Management System

## Backend database

The Django backend is configured for PostgreSQL.

Set these environment variables before running the backend:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_SSLMODE`

## Render deployment

The backend is prepared for Render deployment.

Key deployment files:

- `render.yaml`
- `backend/build.sh`

Recommended Render environment variables:

- `DATABASE_URL`
- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CSRF_TRUSTED_ORIGINS`
