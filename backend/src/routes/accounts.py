from fastapi import APIRouter, HTTPException, Depends
from src.schemas import UserCreate, UserResponse, UserLogin, LoginResponse
from src.database import session
from src.models import User
from src.security import hash_password, verify_password, get_current_user, create_access_token

router = APIRouter()


# Create Account
@router.post("/register", response_model=LoginResponse)
def create_account(user: UserCreate):
    hashed_password = hash_password(user.password)

    existing_username = session.query(User).filter(User.username == user.username).first()
    if existing_username:
        raise HTTPException(status_code= 404, detail = "Username Already Taken")

    
    existing_email = session.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise HTTPException(status_code = 404, detail = "Email Already Taken")

    new_user = User(
        username=user.username,
        email = user.email,
        hashed_password=hashed_password,
        profile_picture=user.profile_picture,
        bio=user.bio
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    access_token = create_access_token({"sub": new_user.id})
    return {
            "access_token": access_token,
            "token_type": "bearer"
        } 

#Login Account
@router.post('/login')
def login(user: UserLogin):
    existing_user = session.query(User).filter(User.email == user.email).first()

    if not existing_user:
        raise HTTPException(status_code = 401, detail = "Invalid email or password")

    if not verify_password(user.password, existing_user.hashed_password):
        raise HTTPException(status_code = 401, detail = "Invalid email or password")

    
    access_token = create_access_token({"sub":existing_user.id})
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



@router.get('/accounts')
def get_all_accounts():
    return session.query(User).all()

