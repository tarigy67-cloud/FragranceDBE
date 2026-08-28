import uuid
from sqlalchemy import Column, String, Integer, JSON,ForeignKey, Table, Boolean,DateTime,Float
from src.database import Base
def generate_id():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"
    id = Column(String,primary_key = True, default = generate_id)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique = True, nullable = False)
    hashed_password = Column(String,  nullable = False)
    profile_picture = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_code = Column(String, nullable=True)
    verification_code_expires = Column(DateTime, nullable=True)
    reset_code = Column(String, nullable=True)
    reset_code_expires = Column(DateTime, nullable=True)


class Perfume(Base):
    __tablename__ = 'perfumes'
    id = Column(String,primary_key = True, default = generate_id)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    image = Column(String, nullable=True)
    accords = Column(JSON, nullable=True)
    description = Column(String, nullable = True)
    release_year = Column(Integer, nullable=True)
    top_notes = Column(JSON, nullable=True)
    middle_notes = Column(JSON, nullable=True)
    bottom_notes = Column(JSON, nullable=True)
    gender = Column(String, nullable=True)
    concentration = Column(String, nullable=True)


class PerfumeInCollection(Base):
    __tablename__ = 'perfumes_in_collection'
    id = Column(String,primary_key = True, default = generate_id)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    image = Column(String, nullable=True)
    accords = Column(JSON, nullable=True)
    description = Column(String, nullable = True)
    release_year = Column(Integer, nullable=True)
    top_notes = Column(JSON, nullable=True)
    middle_notes = Column(JSON, nullable=True)
    bottom_notes = Column(JSON, nullable=True)
    gender = Column(String, nullable=True)
    concentration = Column(String, nullable=True)
    user_id = Column(String,ForeignKey("users.id"),nullable = False)
    notes = Column(String, nullable = True)
    rating = Column(Float, nullable = True)



class Collection(Base):
    __tablename__ = "collection"
    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    perfume_id = Column(String, ForeignKey("perfumes.id"),nullable = False)


class Wishlist(Base):
    __tablename__ = "wishlists"
    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)



wishlist_items = Table(
    "wishlist_items",
    Base.metadata,
    Column("wishlist_id", String, ForeignKey("wishlists.id"), primary_key=True),
    Column("perfume_id", String, ForeignKey("perfumes.id"), primary_key=True)
)

