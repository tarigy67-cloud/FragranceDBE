from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str
    email: str
    profile_picture: str | None = None
    bio: str | None = None


class UserLogin(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str