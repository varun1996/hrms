import os
from django.db import connection


def database_healthcheck():
    try:
        connection.ensure_connection()
        return True
    except Exception:
        return False
    
