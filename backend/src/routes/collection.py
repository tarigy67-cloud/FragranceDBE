from fastapi import APIRouter, HTTPException, Depends
from src.database import session
from src.models import User, Wishlist, Perfume, wishlist_items
from src.security import get_current_user

router = APIRouter()



