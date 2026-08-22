from fastapi import APIRouter, HTTPException
from src.database import session
from src.models import Perfume, generate_id
from src.scraper import scrape_and_build

router = APIRouter()


def perfume_to_dict(p):
    return {
        "id": p.id,
        "name": p.name,
        "brand": p.brand,
        "image": p.image,
        "accords": p.accords,
        "description": p.description,
        "release_year": p.release_year,
        "top_notes": p.top_notes,
        "middle_notes": p.middle_notes,
        "bottom_notes": p.bottom_notes,
        "gender": p.gender,
        "concentration": p.concentration,
    }


@router.get('/perfumes/search')
def search_up_perfume(q: str):
    existing_perfume = session.query(Perfume).filter(Perfume.name.ilike(f"%{q}%")).first()
    if existing_perfume:
        return perfume_to_dict(existing_perfume)

    new_perfume = scrape_and_build(q, generate_id, Perfume)
    if not new_perfume:
        raise HTTPException(status_code=404, detail="Perfume not found anywhere")

    session.add(new_perfume)
    session.commit()

    return perfume_to_dict(new_perfume)


@router.get("/perfumes/{perfume_id}")
def get_specific_perfume(perfume_id: str):
    #assuming the perfume is already gonna be in the database because this function is to get it from a collection
    perfume = session.query(Perfume).filter(Perfume.id == perfume_id).first()

    if not perfume:
        raise HTTPException(status_code=404, detail="Perfume not found")

    return perfume_to_dict(perfume)
