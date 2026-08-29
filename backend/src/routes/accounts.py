from fastapi import APIRouter, HTTPException, Depends
from src.schemas import UserCreate, UserLogin, LoginResponse
from src.database import session
from src.models import User
from src.security import hash_password, verify_password, get_current_user, create_access_token
import random
from datetime import datetime, timedelta
from src.email import send_verification_email



router = APIRouter()


@router.post("/register", response_model=LoginResponse)
def create_account(user: UserCreate):
    hashed_password = hash_password(user.password)

    existing_username = session.query(User).filter(
        User.username == user.username
    ).first()

    if existing_username:
        raise HTTPException(status_code=409, detail="Username Already Taken")

    existing_email = session.query(User).filter(
        User.email == user.email
    ).first()

    if existing_email:
        raise HTTPException(status_code=409, detail="Email Already Taken")

    verification_code = str(random.randint(100000, 999999))

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        profile_picture=user.profile_picture,
        bio=user.bio,
        verification_code=verification_code,
        verification_code_expires=datetime.utcnow() + timedelta(minutes=10)
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    send_verification_email(
        new_user.email,
        verification_code
    )

    access_token = create_access_token({"sub": new_user.id})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# Login Account
@router.post('/login')
def login(user: UserLogin):
    existing_user = session.query(User).filter(
        User.email == user.email
    ).first()
    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    if not verify_password(user.password, existing_user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    if not existing_user.is_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before logging in"
        )
    access_token = create_access_token({"sub": existing_user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


#Delete Account
@router.delete('/me/account')
def delete_user(password: str, user: User = Depends(get_current_user)):
    is_password_verified = verify_password(password, user.hashed_password)
    if is_password_verified:
        session.delete(user)
        session.commit()


@router.put('/me/account')
def edit_account(
    username: str = None,
    email: str = None,
    password: str = None,
    profile_picture: str = None,
    bio: str = None,
    user: User = Depends(get_current_user)
):
    if username is not None:
        user.username = username
    if email is not None:
        user.email = email
    if password is not None:
        user.hashed_password = hash_password(password)
    if profile_picture is not None:
        user.profile_picture = profile_picture
    if bio is not None:
        user.bio = bio
    session.commit()
    session.refresh(user)
    return user





#Email verification
@router.post("/verify-email")
def verify_email(email: str, code: str):
    user = session.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    if user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email already verified"
        )
    if user.verification_code != code:
        raise HTTPException(
            status_code=400,
            detail="Invalid verification code"
        )
    if user.verification_code_expires < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Verification code expired"
        )
    user.is_verified = True
    user.verification_code = None
    user.verification_code_expires = None
    session.commit()
    return {
        "message": "Email verified successfully"
    }


#Forgot your password
@router.post("/forgot-password")
def forgot_password(email: str):
    user = session.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    reset_code = str(random.randint(100000, 999999))
    user.reset_code = reset_code
    user.reset_code_expires = datetime.utcnow() + timedelta(minutes=10)
    session.commit()
    send_verification_email(
        user.email,
        reset_code
    )
    return {
        "message": "Password reset code sent"
    }



# Reset password
@router.post("/reset-password")
def reset_password(email: str, code: str, new_password: str):
    user = session.query(User).filter(
        User.email == email
    ).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    if user.reset_code != code:
        raise HTTPException(
            status_code=400,
            detail="Invalid reset code"
        )
    if user.reset_code_expires < datetime.utcnow():
        raise HTTPException(
            status_code=400,
            detail="Reset code expired"
        )
    user.hashed_password = hash_password(new_password)
    user.reset_code = None
    user.reset_code_expires = None
    session.commit()
    return {
        "message": "Password reset successfully"
    }