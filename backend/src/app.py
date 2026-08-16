from fastapi import FastAPI
from src.database import create_db
from src.routes import accounts,perfumes,collection,profile,wishlists
from src.database import session
from src.models import Perfume
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
create_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


app.include_router(accounts.router)
app.include_router(perfumes.router)
app.include_router(collection.router)
app.include_router(profile.router)
app.include_router(wishlists.router)



