import os

ENV = os.environ.get('ENV', 'dev')

DB_HOST = os.environ.get("DB_HOST")
DB_PORT = os.environ.get("DB_PORT")
DB_NAME = os.environ.get("DB_NAME")
DB_USER = os.environ.get("DB_USER")
DB_PASS = os.environ.get("DB_PASS")

AWS_REGION = os.environ.get("AWS_REGION")
AWS_CLIENT_ID = os.environ.get("AWS_CLIENT_ID")
AWS_CLIENT_SECRET = os.environ.get("AWS_CLIENT_SECRET")

BUCKET = os.environ.get("BUCKET")
