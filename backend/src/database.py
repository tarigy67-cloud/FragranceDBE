from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base

DATABASE_URL = "postgresql+psycopg://tarig@localhost/perfume_db"

engine = create_engine(DATABASE_URL)

Base = declarative_base()
session = Session(engine)


def create_db():
    from src import models
    Base.metadata.create_all(engine)