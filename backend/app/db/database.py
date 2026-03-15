import os
from django.db import connection


def database_healthcheck():
    print(f"NAME: {os.getenv('POSTGRES_DB')}",
        f"USER: {os.getenv('POSTGRES_USER', 'postgres')}",
        f"PASSWORD: {os.getenv('POSTGRES_PASSWORD', 'postgres')}",
        f"HOST: {os.getenv('POSTGRES_HOST', '127.0.0.1')}",
        f"PORT: {os.getenv('POSTGRES_PORT', '5432')}",
        f"CONN_MAX_AGE: {int(os.getenv('POSTGRES_CONN_MAX_AGE', '60'))}",
        f"sslmode: {os.getenv('POSTGRES_SSLMODE', 'prefer')}",
        f"DISABLE_SERVER_SIDE_CURSORS: True",
    )
    try:
        connection.ensure_connection()
        return True
    except Exception:
        return False
    
