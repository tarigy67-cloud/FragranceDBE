from fastapi import HTTPException, Depends,APIRouter
from src.models import User, PerfumeInCollection
from src.security import get_current_user
from src.database import session
import os
import uuid
from fastapi import UploadFile, File

router = APIRouter()



@router.get('/me/profile')
def get_my_profile(user: User = Depends(get_current_user)):
    amount_of_perfumes = session.query(PerfumeInCollection).filter(PerfumeInCollection.user_id == user.id).count()
    amount_of_wishlists = "this function will get filled out soon"
    return({
        "username" : user.username,
        "profile_picture": user.profile_picture,
        "amount_of_perfumes": amount_of_perfumes,
        "amount_of_wishlists": amount_of_wishlists,
        "bio":user.bio

    })


@router.get('/profile/{username}')
def get_other_profile(username):
    user = session.query(User).filter(User.username == username).first()
    amount_of_perfumes = session.query(PerfumeInCollection).filter(PerfumeInCollection.user_id == user.id).count()
    amount_of_wishlists = "this function will get filled out soon"
    return({
        "username" : user.username,
        "profile_picture": user.profile_picture,
        "amount_of_perfumes": amount_of_perfumes,
        "amount_of_wishlists": amount_of_wishlists,
        "bio":user.bio

    })


@router.post("/me/profile-picture")
def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(
        "uploads/profile_pictures",
        filename
    )
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
    current_user.profile_picture = f"/profile_pictures/{filename}"
    session.commit()
    session.refresh(current_user)
    return current_user