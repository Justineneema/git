import os
from django.core.wsgi import get_wsgi_application

# Standard Django WSGI setup
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cropdetector.settings")
application = get_wsgi_application()

# AUTO CREATE DATABASE TABLES (Django equivalent of db.create_all())
try:
    from django.core.management import call_command
    print(" Auto-migrating database...")
    call_command("migrate", interactive=False)
    print(" Database ready!")
except Exception as e:
    print(" Auto-migration failed:", e)
