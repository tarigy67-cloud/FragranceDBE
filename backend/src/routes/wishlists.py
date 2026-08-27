from fastapi import APIRouter, HTTPException, Depends
from src.database import session
from src.models import User, Wishlist, Perfume, wishlist_items

from src.security import get_current_user

router = APIRouter()


# Create wishlist
@router.post("/me/wishlists")
def create_wishlist(
    name: str,
    current_user: User = Depends(get_current_user)
):
    wishlist = Wishlist(
        name=name,
        user_id=current_user.id
    )

    session.add(wishlist)
    session.commit()
    session.refresh(wishlist)

    return wishlist


# Get all my wishlists
@router.get("/me/wishlists")
def get_my_wishlists(
    current_user: User = Depends(get_current_user)
):
    wishlists = session.query(Wishlist).filter(
        Wishlist.user_id == current_user.id
    ).all()

    return wishlists


# Delete wishlist
@router.delete("/me/wishlists/{wishlist_id}")
def delete_wishlist(
    wishlist_id: str,
    current_user: User = Depends(get_current_user)
):
    wishlist = session.query(Wishlist).filter(
        Wishlist.id == wishlist_id,
        Wishlist.user_id == current_user.id
    ).first()

    if wishlist is None:
        raise HTTPException(
            status_code=404,
            detail="Wishlist not found"
        )

    session.delete(wishlist)
    session.commit()

    return {"message": "Wishlist deleted successfully"}


# Add perfume to wishlist
@router.post("/me/wishlists/{wishlist_id}/{perfume_id}")
def add_to_wishlist(
    wishlist_id: str,
    perfume_id: str,
    current_user: User = Depends(get_current_user)
):
    wishlist = session.query(Wishlist).filter(
        Wishlist.id == wishlist_id,
        Wishlist.user_id == current_user.id
    ).first()

    if wishlist is None:
        raise HTTPException(
            status_code=404,
            detail="Wishlist not found"
        )

    perfume = session.query(Perfume).filter(
        Perfume.id == perfume_id
    ).first()

    if perfume is None:
        raise HTTPException(
            status_code=404,
            detail="Perfume not found"
        )

    already_in_wishlist = session.execute(
        wishlist_items.select().where(
            wishlist_items.c.wishlist_id == wishlist_id,
            wishlist_items.c.perfume_id == perfume_id
        )
    ).first()

    if already_in_wishlist:
        raise HTTPException(
            status_code=409,
            detail="Perfume already in wishlist"
        )

    session.execute(
        wishlist_items.insert().values(
            wishlist_id=wishlist_id,
            perfume_id=perfume_id
        )
    )

    session.commit()

    return {"message": "Perfume added to wishlist"}


# Remove perfume from wishlist
@router.delete("/me/wishlists/{wishlist_id}/{perfume_id}")
def remove_from_wishlist(
    wishlist_id: str,
    perfume_id: str,
    current_user: User = Depends(get_current_user)
):
    wishlist = session.query(Wishlist).filter(
        Wishlist.id == wishlist_id,
        Wishlist.user_id == current_user.id
    ).first()

    if wishlist is None:
        raise HTTPException(
            status_code=404,
            detail="Wishlist not found"
        )

    existing_item = session.execute(
        wishlist_items.select().where(
            wishlist_items.c.wishlist_id == wishlist_id,
            wishlist_items.c.perfume_id == perfume_id
        )
    ).first()

    if existing_item is None:
        raise HTTPException(
            status_code=404,
            detail="Perfume not in wishlist"
        )

    session.execute(
        wishlist_items.delete().where(
            wishlist_items.c.wishlist_id == wishlist_id,
            wishlist_items.c.perfume_id == perfume_id
        )
    )

    session.commit()

    return {"message": "Perfume removed from wishlist"}


# Get all perfumes in a wishlist
@router.get("/me/wishlists/{wishlist_id}")
def get_wishlist(
    wishlist_id: str,
    current_user: User = Depends(get_current_user)
):
    wishlist = session.query(Wishlist).filter(
        Wishlist.id == wishlist_id,
        Wishlist.user_id == current_user.id
    ).first()

    if wishlist is None:
        raise HTTPException(
            status_code=404,
            detail="Wishlist not found"
        )

    perfumes = session.query(Perfume).join(wishlist_items,Perfume.id == wishlist_items.c.perfume_id).filter(wishlist_items.c.wishlist_id == wishlist_id).all()

    return {
        "id": wishlist.id,
        "name": wishlist.name,
        "perfumes": perfumes
    }


@router.put("/me/wishlists/{wishlist_id}")
def change_wishlist_name(wishlist_id: str,name: str,current_user: User = Depends(get_current_user)):
    wishlist = session.query(Wishlist).filter(Wishlist.id == wishlist_id,Wishlist.user_id == current_user.id).first()
    if wishlist is None:
        raise HTTPException(status_code=404,detail="Wishlist not found")
    wishlist.name = name
    session.commit()
    session.refresh(wishlist)
    return wishlist