from fastapi import APIRouter, HTTPException, Depends
from src.database import session
from src.models import User,  Perfume,  PerfumeInCollection
from src.security import get_current_user
 
router = APIRouter()
 
 
# Add perfume to collection
@router.post("/me/collection/{perfume_id}")
def add_to_collection(
    perfume_id: str,
    notes: str = None,
    current_user: User = Depends(get_current_user)
):
    perfume = session.query(Perfume).filter(
        Perfume.id == perfume_id
    ).first()
 
    if perfume is None:
        raise HTTPException(
            status_code=404,
            detail="Perfume not found"
        )
 
    already_in_collection = session.query(PerfumeInCollection).filter(
        PerfumeInCollection.user_id == current_user.id,
        PerfumeInCollection.name == perfume.name,
        PerfumeInCollection.brand == perfume.brand
    ).first()
 
    if already_in_collection:
        raise HTTPException(
            status_code=409,
            detail="Perfume already in collection"
        )
 
    collection_item = PerfumeInCollection(
        original_id=perfume.id,
        name=perfume.name,
        brand=perfume.brand,
        image=perfume.image,
        accords=perfume.accords,
        description=perfume.description,
        release_year=perfume.release_year,
        top_notes=perfume.top_notes,
        middle_notes=perfume.middle_notes,
        bottom_notes=perfume.bottom_notes,
        gender=perfume.gender,
        concentration=perfume.concentration,
        user_id=current_user.id,
        notes=notes
    )
 
    session.add(collection_item)
    session.commit()
    session.refresh(collection_item)
 
    return collection_item
 
 
# Get everything in my collection
@router.get("/me/collection")
def get_my_collection(
    current_user: User = Depends(get_current_user)
):
    collection = session.query(PerfumeInCollection).filter(
        PerfumeInCollection.user_id == current_user.id
    ).all()
 
    return collection
 
 
# Remove perfume from collection
@router.delete("/me/collection/{item_id}")
def remove_from_collection(
    item_id: str,
    current_user: User = Depends(get_current_user)
):
    item = session.query(PerfumeInCollection).filter(
        PerfumeInCollection.id == item_id,
        PerfumeInCollection.user_id == current_user.id
    ).first()
 
    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Perfume not in collection"
        )
 
    session.delete(item)
    session.commit()
 
    return {"message": "Perfume removed from collection"}
 
 
# Edit the note on a perfume in my collection
@router.put("/me/collection/{item_id}")
def edit_collection_note(
    item_id: str,
    notes: str,
    current_user: User = Depends(get_current_user)
):
    item = session.query(PerfumeInCollection).filter(
        PerfumeInCollection.id == item_id,
        PerfumeInCollection.user_id == current_user.id
    ).first()
 
    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Perfume not in collection"
        )
 
    item.notes = notes
    session.commit()
    session.refresh(item)
 
    return item


@router.get("/me/collection/{item_id}")
def get_collection_item(
    item_id: str,
    current_user: User = Depends(get_current_user)
):
    item = session.query(PerfumeInCollection).filter(
        PerfumeInCollection.id == item_id,
        PerfumeInCollection.user_id == current_user.id
    ).first()

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Perfume not in collection"
        )

    return item


# Edit the rating on a perfume in my collection
@router.put("/me/collection/{item_id}/rating")
def edit_collection_rating(
    item_id: str,
    rating: float,
    current_user: User = Depends(get_current_user)
):
    item = session.query(PerfumeInCollection).filter(
        PerfumeInCollection.id == item_id,
        PerfumeInCollection.user_id == current_user.id
    ).first()

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Perfume not in collection"
        )

    if rating < 0 or rating > 10:
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 0 and 10"
        )

    item.rating = rating

    session.commit()
    session.refresh(item)

    return item
