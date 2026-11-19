# Poloair Woman — webshop

Next.js (App Router) prodavnica za poloairwoman.rs. Dizajn po Netlify primeru (Cormorant Garamond + Poppins, brend paleta u `app/globals.css`).

## Pokretanje
```
npm install
npm run dev
```

## Katalog
- Proizvodi su u `data/products.json`, slike u `public/img/` (WebP).
- Izvor: WooCommerce Store API starog sajta (`scripts/src/*.json`). Ponovna izgradnja: `python3 scripts/build-data.py`.
- Kategorije, kontakt, cena dostave i prag za besplatnu dostavu: `lib/site.ts`.
- Info stranice (dostava, zamena, reklamacije, uslovi, privatnost): `lib/pages.ts`.

## Porudžbine (plaćanje samo pouzećem)
`app/api/order` računa cene na serveru i porudžbinu:
- upisuje u Supabase tabelu `orders` (ako su postavljeni `SUPABASE_URL` i `SUPABASE_SERVICE_ROLE_KEY`),
- šalje email adminima preko Resend-a (`RESEND_API_KEY`, `MAIL_FROM`, `ADMIN_EMAILS`).
Bez ijednog od ta dva u produkciji, forma kupcu kaže da poruči telefonom.

## Stari linkovi
`next.config.ts` preusmerava stare WooCommerce adrese (`/p/...`, `/k/...`, info stranice) na nove.
