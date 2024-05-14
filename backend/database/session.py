from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.logger import logger
from backend.config import DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER
from database.db_models import Base

SQLALCHEMY_DATABASE_URL = (
    f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)


def configure_session(db_url: str, create_schema: bool = False):
    engine = create_engine(
        db_url,
        echo=False)
    if create_schema:
        Base.metadata.create_all(bind=engine)
    session_local = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return session_local


SessionLocal = configure_session(SQLALCHEMY_DATABASE_URL, False)


@contextmanager
def session_manager():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


if __name__ == "__main__":
    with session_manager() as db:
        logger.info('With create_schema True you can substitute alembic migration -> faster prototyping')
