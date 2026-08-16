#COme back and understand this at some point, for now just let it work THEN come back and understand it its fine
#FOr now this is your scraper, come back tomorrow and get the one that is only gonna charge you a tiny bit of moeny, 1 dollar for every 1k searches
#And then use it for with the five dollars, if you use it then you get about 5000 searches which is MORE thatn enough, espeiclaly if youre saving
#in the database





import os
import re
import requests
from dotenv import load_dotenv

load_dotenv()

APIFY_TOKEN = os.getenv("APIFY_TOKEN")
ACTOR_ID = os.getenv("ACTOR_ID")

def run_scraper(query: str, max_items: int = 1):
    url = f"https://api.apify.com/v2/actors/{ACTOR_ID}/run-sync-get-dataset-items?token={APIFY_TOKEN}"
    payload = {
        "query": query,
        "maxItems": max_items,
        "proxyConfiguration": {"useApifyProxy": True},
        "allReviews": False,
        "omitFields": [
            "reviews", "pros", "cons", "images", "longevityBreakout", "sillageBreakout",
            "priceValueBreakout", "ratingBreakout", "seasonBreakout", "relationBreakout",
            "genderBreakout", "thisPerfumeRemindsMeOf", "peopleWhoLikeThisAlsoLike", "brandLogo"
        ]
    }

    response = requests.post(url, json=payload, timeout=120)
    #print("APIFY STATUS:", response.status_code)
    #print("APIFY BODY:", response.text[:500])
    if response.status_code not in (200, 201):
        return None
    try:
        items = response.json()
    except Exception:
        return None
    if not isinstance(items, list) or len(items) == 0:
        return None
    return items[0]

def parse_year(text):
    match = re.search(r"\b(19|20)\d{2}\b", text or "")
    return int(match.group()) if match else None


def parse_pyramid(scraped):
    pyramid = scraped.get("pyramid", {}) or {}
    if pyramid.get("type") == "full":
        return (
            [{"name": n["name"], "img": n.get("img")} for n in pyramid.get("topNotes", [])],
            [{"name": n["name"], "img": n.get("img")} for n in pyramid.get("middleNotes", [])],
            [{"name": n["name"], "img": n.get("img")} for n in pyramid.get("baseNotes", [])],
        )
    elif pyramid.get("type") == "single":
        all_notes = [{"name": n["name"], "img": n.get("img")} for n in pyramid.get("allNotes", [])]
        return (all_notes, [], [])
    return ([], [], [])


def scrape_and_build(query: str, generate_id, Perfume):
    scraped = run_scraper(query)
    if not scraped:
        return None

    top, middle, base = parse_pyramid(scraped)

    return Perfume(
        id=generate_id(),
        name=scraped.get("title") or query,
        brand=scraped.get("brandName") or "Unknown",
        image=scraped.get("primaryImageUrl"),
        accords=[
            {"name": a.get("accord"), "hex": a.get("hex"), "value": a.get("value")}
            for a in scraped.get("mainAccords", [])
        ],
        description=scraped.get("description"),
        release_year=parse_year(scraped.get("description")),
        top_notes=top,
        middle_notes=middle,
        bottom_notes=base,
        gender=scraped.get("gender"),
        concentration=None,
    )
#