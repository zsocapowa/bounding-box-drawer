from sqlalchemy import create_engine

from backend.config import DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER
from database.db_models import Base

SQLALCHEMY_DATABASE_URL = (
    f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
Base.metadata.create_all(engine)
