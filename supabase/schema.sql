-- Poloair Woman: porudžbine i prijave na newsletter.
-- RLS uključen bez javnih polisa: niko ne čita tabele preko API-ja.
create table if not exists public.orders (
  id bigint generated always as identity primary key,
  number text not null unique,
  created_at timestamptz not null default now(),
  status text not null default 'nova',
  customer jsonb not null,
  items jsonb not null,
  subtotal integer not null,
  shipping integer not null,
  total integer not null
);
alter table public.orders enable row level security;

create table if not exists public.subscribers (
  email text primary key,
  created_at timestamptz not null default now()
);
alter table public.subscribers enable row level security;

-- Upis ide preko security definer funkcija koje traže serverski tajni ključ
-- (isti kao SERVER_SECRET u Vercel env; vrednost se ne čuva u repou).
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table if not exists private.config (key text primary key, value text not null);
-- insert into private.config(key, value) values ('server_secret', '<SERVER_SECRET>');

create or replace function public.place_order(secret text, o jsonb)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if secret is null or secret <> (select value from private.config where key = 'server_secret') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  insert into public.orders(number, customer, items, subtotal, shipping, total, status)
  values (o->>'number', o->'customer', o->'items', (o->>'subtotal')::int, (o->>'shipping')::int, (o->>'total')::int, 'nova');
end $$;

create or replace function public.subscribe(secret text, email text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if secret is null or secret <> (select value from private.config where key = 'server_secret') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  insert into public.subscribers(email) values (lower(trim(email))) on conflict do nothing;
end $$;

revoke all on function public.place_order(text, jsonb) from public;
revoke all on function public.subscribe(text, text) from public;
grant execute on function public.place_order(text, jsonb) to anon;
grant execute on function public.subscribe(text, text) to anon;
