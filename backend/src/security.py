from pwdlib import PasswordHash
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from fastapi import Depends, HTTPException
from src.database import session
from src.models import User


load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

passwordHasher = PasswordHash.recommended()


def hash_password(password: str):
    return (passwordHasher.hash(password))


def verify_password(password: str, hashed:str):
    return (passwordHasher.verify(password,hashed))



def create_access_token(data:dict):
    dataCopy = data.copy()
    expiration = datetime.utcnow() + timedelta(minutes = 120)
    dataCopy.update({"exp":expiration})

    token = jwt.encode(
        dataCopy,
        SECRET_KEY,
        algorithm = ALGORITHM
    )
    return token


authenticationScheme = HTTPBearer()


def get_current_user(cred: HTTPAuthorizationCredentials = Depends(authenticationScheme)):
    token = cred.credentials
    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]

        )

        user_id = payload.get("sub")

        if not user_id:

            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:
        raise HTTPException(status_code=401,detail="Invalid or expired token" )
    
    user = session.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )
    return user
