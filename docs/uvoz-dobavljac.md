# Nedeljni uvoz novih modela od dobavljača

Dobavljač: Trendyol prodavnica **marka7** (brend Poloair), https://www.trendyol.com/magaza/marka7-m-112651

Svakog ponedeljka Claude (zakazani zadatak) proverava ženske modele i za svaki novi pravi
**skriveni nacrt** (`products.active = false`). Ništa se ne objavljuje samo: vlasnik nacrt pregleda
u adminu (Proizvodi → filter "Nacrti od dobavljača"), doradi i uključi "Vidljiv".

## Zašto ne skripta na serveru
Trendyol blokira automatske zahteve sa servera, a njihova pravila zabranjuju scraping.
Zato se stranica čita u pregledaču u Claude aplikaciji na Fatihovom računaru, kao da je otvara čovek.

## Postupak (za Claude)
1. U ugrađenom pregledaču otvori
   `https://www.trendyol.com/sr?mid=112651&os=1&sst=MOST_RECENT&q=kad%C4%B1n`
   (ženski modeli, najnoviji prvi). Ako traži zemlju, izaberi Türkiye; kolačiće odbij.
2. Sa stranice (DOM, `a[href*="-p-"]`) uzmi link, naziv i cenu prvih ~60 proizvoda.
   Šifra modela je na kraju naziva (npr. `PL-1620B3`, `ST-2259S1`).
3. Uporedi sa bazom (Supabase projekat `biaqsteordlmwvhuclln`):
   `select code from private.supplier_seen union select supplier_code from public.products where supplier_code is not null`.
   Nove su šifre kojih nema ni u jednom.
4. Za svaku novu šifru otvori stranicu proizvoda i iz `script[type="application/ld+json"]` (ProductGroup) uzmi:
   `image.contentUrl` (slike), `additionalProperty` (osobine) i cenu (prikazana cena u TL).
5. Napiši na srpskom (ekavica):
   - naziv u stilu sajta, npr. "Zlatni ženski sat sa cirkonima i ogrlicom", bez reči "Poloair" i bez šifre;
   - opis u HTML-u (`<p>…</p>`, i `<ul><li>` za osobine: materijal, prečnik kućišta, mehanizam, boja).
   Trendyol nema pravi opis, pa se piše iz naziva i osobina. Ne izmišljati vodootpornost ni garanciju.
6. Kategorija: `satovi` (samo sat), `setovi` (sat + narukvica/ogrlica), `pokloni` (set sa parfemom,
   naočarima, kutijom…), `narukvice`, `torbice`, `novcanici`, `naocare`.
7. Za svaki model:
   `select private.import_product('{"code":"ST-2259S1","url":"…","name":"…","category":"pokloni","description":"<p>…</p>","price_try":1749.9,"images":["https://cdn.dsmcdn.com/…"]}'::jsonb);`
   Funkcija preračuna cenu (TL → RSD po dnevnom kursu × 2, zaokruženo na …90), kopira slike u naš
   bucket i upiše skriveni nacrt. Ako šifru već imamo, ne radi ništa.
8. Najviše 20 nacrta po pokretanju (najnoviji prvi). Ostale nove šifre ostaju za sledeću nedelju.
9. Javi Fatihu kratko: koliko je nacrta napravljeno, sa nazivima i cenama, i link
   https://poloairwoman.rs/admin/proizvodi?stanje=nacrti

## Postavljanje (jednom)
- SQL: `supabase/supplier.sql`
- Edge funkcija: `supabase/functions/uvoz-slika` (verify_jwt isključen; proverava `x-import-secret`)
