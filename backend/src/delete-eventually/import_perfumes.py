#THese are not really needed so feel free to delete it at some point, no point deleting it now theres no harm but WHEN you are done if you don
#need it, delete it and delete fragrances.csv



import csv
import os

from src.database import session
from src.models import Perfume

CSV_PATH = os.path.join(os.path.dirname(__file__), "fragrances.csv")


def slug_to_title(raw):
    # "sospiro-perfumes" -> "Sospiro Perfumes"
    if not raw:
        return None
    words = raw.split("-")
    return " ".join(word.capitalize() for word in words)


def split_notes(raw):
    # "honey, incense, apricot" -> ["honey", "incense", "apricot"]
    if not raw:
        return []
    return [note.strip() for note in raw.split(",") if note.strip()]


def build_accords(row):
    # accords are spread across 5 separate columns, not one packed string
    accords = []
    for i in range(1, 6):
        value = row.get(f"mainaccord{i}")
        if value:
            accords.append(value.strip())
    return accords


def clean_year(raw):
    if not raw:
        return None
    try:
        return int(raw)
    except ValueError:
        return None


def import_perfumes():
    imported = 0
    skipped = 0

    with open(CSV_PATH, encoding="utf-8") as file:
        reader = csv.DictReader(file, delimiter=";")

        for row in reader:
            name = slug_to_title(row.get("Perfume"))
            brand = slug_to_title(row.get("Brand"))

            if not name or not brand:
                skipped += 1
                continue

            already_exists = session.query(Perfume).filter(
                Perfume.name == name,
                Perfume.brand == brand
            ).first()

            if already_exists:
                skipped += 1
                continue

            perfume = Perfume(
                name=name,
                brand=brand,
                image=None,  # this dataset doesn't include images
                accords=build_accords(row),
                description=None,  # this dataset doesn't include descriptions
                release_year=clean_year(row.get("Year")),
                top_notes=split_notes(row.get("Top")),
                middle_notes=split_notes(row.get("Middle")),
                bottom_notes=split_notes(row.get("Base")),
                gender=row.get("Gender"),
                concentration=None,
            )

            session.add(perfume)
            imported += 1

            # commit every 500 rows instead of one at a time — much faster
            # for a file this big, and still safe if the script gets interrupted
            if imported % 500 == 0:
                session.commit()
                print(f"...{imported} imported so far")

    session.commit()
    print(f"\nDone. Imported {imported}, skipped {skipped}.")


if __name__ == "__main__":
    import_perfumes()