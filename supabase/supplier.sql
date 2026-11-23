-- Poloair Woman: nedeljni uvoz novih modela od dobavljača (Trendyol prodavnica marka7) kao SKRIVENIH nacrta.
-- Nacrt = products.active = false; vlasnik ga uređuje i objavljuje u adminu (Vidljiv).
alter table public.products add column if not exists supplier_code text unique;

-- Šifre koje smo već videli kod dobavljača (da se isti model ne ubaci dva puta, ni kad se nacrt obriše)
create table if not exists private.supplier_seen (
  code text primary key,
  url text,
  seen_at timestamptz not null default now(),
  product_id bigint
);

insert into private.config(key, value) values ('import_secret', encode(extensions.gen_random_bytes(24), 'hex'))
  on conflict (key) do nothing;

-- Edge funkcija uvoz-slika proverava ključ preko ove funkcije (samo service_role)
create or replace function public.import_secret_ok(s text)
returns boolean language sql stable security definer set search_path = '' as $$
  select s is not null and s = (select value from private.config where key = 'import_secret');
$$;
revoke all on function public.import_secret_ok(text) from public, anon, authenticated;
grant execute on function public.import_secret_ok(text) to service_role;

-- Šifre dobavljača iz naziva slika postojećih proizvoda (npr. Pl-1517B5_0.webp -> PL-1517B5)
update public.products p set supplier_code = x.code from (
  select distinct on (code) id, code from (
    select id, upper(m[1]) || '-' || upper(m[2]) code
    from public.products,
      lateral regexp_matches(array_to_string(images, ' ') || ' ' || name, '(PL|ST|TR|BTN|CZN)[-_ ]?(\d{3,5}[A-Z]\d{0,2})', 'i') m
  ) y order by code, id
) x where p.id = x.id and p.supplier_code is null;

-- Pravi skriveni nacrt. p = {code, url, name, category, description, price_try, images[]}
-- Vraća id novog proizvoda, ili null ako šifru već imamo.
create or replace function private.import_product(p jsonb)
returns bigint language plpgsql security definer set search_path = '' as $$
declare
  rate numeric; rsd int; new_id bigint; imgs text[]; resp extensions.http_response; slug_ text;
  code_ text := upper(p->>'code');
begin
  insert into private.supplier_seen(code, url) values (code_, p->>'url') on conflict (code) do nothing;
  if exists (select 1 from public.products where supplier_code = code_) then
    return null;
  end if;

  resp := extensions.http_get('https://open.er-api.com/v6/latest/TRY');
  rate := ((resp.content::jsonb)->'rates'->>'RSD')::numeric;
  if rate is null or rate <= 0 then raise exception 'nema kursa TRY/RSD'; end if;
  -- TL -> RSD, puta 2, zaokruženo naviše na ...90 (npr. 2.590)
  rsd := (ceil(((p->>'price_try')::numeric * rate * 2 + 10) / 100) * 100 - 10)::int;

  resp := extensions.http((
    'POST', 'https://biaqsteordlmwvhuclln.supabase.co/functions/v1/uvoz-slika',
    array[extensions.http_header('x-import-secret', (select value from private.config where key = 'import_secret'))],
    'application/json', jsonb_build_object('code', code_, 'images', p->'images')::text
  )::extensions.http_request);
  if resp.status <> 200 then raise exception 'slike: % %', resp.status, left(resp.content, 300); end if;
  select array_agg(v) into imgs from jsonb_array_elements_text((resp.content::jsonb)->'urls') v;

  slug_ := trim(both '-' from regexp_replace(
    lower(translate(p->>'name' || ' ' || code_, 'čćžšđČĆŽŠĐ', 'cczsdcczsd')), '[^a-z0-9]+', '-', 'g'));

  insert into public.products(slug, name, category, price, images, description, active, in_stock, rank, supplier_code)
  values (slug_, p->>'name', p->>'category', rsd, coalesce(imgs, '{}'), coalesce(p->>'description', ''),
          false, true,
          (select coalesce(min(rank), 0) - 1 from public.products where category = p->>'category'),
          code_)
  returning id into new_id;
  update private.supplier_seen set product_id = new_id where code = code_;
  return new_id;
end $$;
revoke all on function private.import_product(jsonb) from public, anon, authenticated;
