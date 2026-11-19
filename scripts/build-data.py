"""Builds data/products.json from the WooCommerce Store API export in scripts/src/*.json.

Images are expected under public/img/<year>/<month>/<name>.webp (see scripts/README.md).
Run: python3 scripts/build-data.py
"""
import glob
import html
import json
import os
import re

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOADS = "https://poloairwoman.rs/wp-content/uploads/"

# WooCommerce category slug -> site category slug
CAT_MAP = {
    "zenski-satovi": "satovi",
    "set-zenski-sat-i-narukvica": "setovi",
    "premium-poklon-set-3-u-1": "pokloni",
    "narukvice": "narukvice",
    "zenske-torbice": "torbice",
    "zenski-novcanici": "novcanici",
    "zenske-naocare": "naocare",
}


def local_image(src: str) -> str:
    rel = src.replace(UPLOADS, "")
    base, ext = os.path.splitext(rel)
    if ext.lower() != ".webp":
        cand = f"{base}-c.webp"
        rel = cand if os.path.exists(os.path.join(ROOT, "public/img", cand)) else f"{base}.webp"
    path = os.path.join(ROOT, "public/img", rel)
    if not os.path.exists(path):
        raise SystemExit(f"missing image {path}")
    return "/img/" + rel


def is_white_bg(rel: str) -> bool:
    """True ako su ivice slike (skoro) bele — proizvod na beloj pozadini."""
    im = Image.open(os.path.join(ROOT, "public", rel.lstrip("/"))).convert("RGB")
    im.thumbnail((64, 64))
    w, h = im.size
    px = [im.getpixel((x, y)) for x in range(w) for y in (0, h - 1)] + [im.getpixel((x, y)) for y in range(h) for x in (0, w - 1)]
    white = sum(1 for r, g, b in px if min(r, g, b) > 235)
    return white / len(px) > 0.9


def clean_html(s: str) -> str:
    s = s.replace("\r", "")
    s = re.sub(r"<(/?)b>", r"<\1strong>", s)
    s = re.sub(r"<(/?)i>", r"<\1em>", s)
    s = re.sub(r"<(?!/?(p|br|strong|em)\b)[^>]*>", "", s)
    s = re.sub(r"<(p|strong|em)\s[^>]*>", r"<\1>", s)
    s = re.sub(r"<br\s*/?>\s*", "<br>", s)
    s = re.sub(r"<p>\s*(&nbsp;)?\s*</p>", "", s)
    return s.strip()


def text(s: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def display_name(name: str) -> str:
    n = re.sub(r"^poloair\s+", "", name.strip(), flags=re.I)
    n = re.sub(r"\s+I\s+", " i ", n)
    return n[:1].upper() + n[1:]


def guess_category(p) -> str:
    n = p["name"].lower()
    if "novčanik" in n:
        return "novcanici"
    if "sat" in n:
        return "satovi"
    return "satovi"


def main():
    raw = []
    for f in sorted(glob.glob(os.path.join(ROOT, "scripts/src/p*.json"))):
        raw += json.load(open(f))
    out = []
    for i, p in enumerate(raw):  # Store API returns newest first
        cats = [CAT_MAP[c["slug"]] for c in p["categories"] if c["slug"] in CAT_MAP]
        cat = cats[0] if cats else guess_category(p)
        price = int(p["prices"]["price"])
        regular = int(p["prices"]["regular_price"])
        imgs = []
        for im in p["images"]:
            li = local_image(im["src"])
            if li not in imgs:
                imgs.append(li)
        # Naslovna slika: prva na beloj pozadini (ostale ostaju u galeriji)
        whites = [im for im in imgs if is_white_bg(im)]
        if whites and imgs[0] != whites[0]:
            imgs.remove(whites[0])
            imgs.insert(0, whites[0])
        slug = re.sub(r"^poloair-", "", p["slug"])
        desc = clean_html(p["description"])
        out.append(
            {
                "id": p["id"],
                "slug": slug,
                "oldSlug": p["slug"],
                "name": display_name(p["name"]),
                "category": cat,
                "price": price,
                "regularPrice": regular if regular > price else None,
                "images": imgs,
                "whiteCover": bool(whites),
                "description": desc,
                "summary": text(desc)[:220],
                "rank": i,
            }
        )
    slugs = [p["slug"] for p in out]
    assert len(slugs) == len(set(slugs)), "duplicate slugs"
    json.dump(out, open(os.path.join(ROOT, "data/products.json"), "w"), ensure_ascii=False, indent=1)
    print(len(out), "products")


if __name__ == "__main__":
    main()
