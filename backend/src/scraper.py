# COme back and understand this at some point, for now just let it work THEN come back and understand it its fine
# FOr now this is your scraper, come back tomorrow and get the one that is only gonna charge you a tiny bit of moeny, 1 dollar for every 1k searches
# And then use it for with the five dollars, if you use it then you get about 5000 searches which is MORE thatn enough, espeiclaly if youre saving
# in the database
import os
import requests
from dotenv import load_dotenv

load_dotenv()

APIFY_TOKEN = os.getenv("APIFY_TOKEN")
ACTOR_ID = os.getenv("ACTOR_ID", "solidcode~fragrantica-scraper")


def run_scraper(query: str, max_items: int = 1):
    url = f"https://api.apify.com/v2/actors/{ACTOR_ID}/run-sync-get-dataset-items?token={APIFY_TOKEN}"
    payload = {
        "searchQueries": [query],
        "maxResults": max_items,
        "includeReviews": False,
    }

    response = requests.post(url, json=payload, timeout=120)
    print("APIFY STATUS:", response.status_code)
    print("APIFY BODY:", response.text[:500])
    if response.status_code not in (200, 201):
        return None
    try:
        items = response.json()
    except Exception:
        return None
    perfumes = [i for i in items if i.get("recordType") == "perfume"]
    if not perfumes:
        return None
    return perfumes[0]


def _clean_accords(raw_accords):
    cleaned = []
    for a in raw_accords:
        name = (a.get("name") or "").strip()
        if not name:
            continue
        lowered = name.lower()
        if "buy" in lowered or "luckyscent" in lowered or "http" in lowered:
            continue
        cleaned.append({"name": name, "hex": None, "value": a.get("strength")})
        if len(cleaned) >= 10:
            break
    return cleaned


def scrape_and_build(query: str, generate_id, Perfume):
    scraped = run_scraper(query)
    if not scraped:
        return None

    return Perfume(
        id=generate_id(),
        name=scraped.get("name") or query,
        brand=scraped.get("brand") or "Unknown",
        image=scraped.get("imageUrl"),
        accords=_clean_accords(scraped.get("mainAccords", [])),
        description=None,
        release_year=scraped.get("year"),
        top_notes=[{"name": n, "img": None} for n in scraped.get("notesTop", [])],
        middle_notes=[{"name": n, "img": None} for n in scraped.get("notesMiddle", [])],
        bottom_notes=[{"name": n, "img": None} for n in scraped.get("notesBase", [])],
        gender=scraped.get("gender"),
        concentration=None,
    )
