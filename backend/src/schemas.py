from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str
    email: str
    profile_picture: str | None = None
    bio: str | None = None


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    profile_picture: str | None = None
    bio: str | None = None

class UserLogin(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    



class PerfumeCreate(BaseModel):
    name: str
    brand: dict
    image: str | None = None
    accords: list | None = None
    description: str | None = None
    release_year: int | None = None
    top_notes: list | None = None
    middle_notes: list | None = None
    bottom_notes: list | None = None
    gender: str | None = None
    concentration: str | None = None


class PerfumeResponse(BaseModel):
    id: str
    name: str
    brand: dict
    image: str | None = None
    accords: list | None = None
    description: str | None = None
    release_year: int | None = None
    top_notes: list | None = None
    middle_notes: list | None = None
    bottom_notes: list | None = None
    gender: str | None = None
    concentration: str | None = None


class CollectionCreate(BaseModel):
    perfume_id: str
    rating: int | None = None
    notes: str | None = None


class CollectionResponse(BaseModel):
    id: str
    user_id: str
    perfume_id: str
    rating: int | None = None
    notes: str | None = None


class WishlistCreate(BaseModel):
    name: str


class WishlistResponse(BaseModel):
    id: str
    user_id: str
    name: str


class WishlistItemCreate(BaseModel):
    perfume_id: str


class WishlistItemResponse(BaseModel):
    wishlist_id: str
    perfume_id: str
