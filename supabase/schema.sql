-- Poloair Woman: porudžbine i prijave na newsletter.
-- Upis ide isključivo sa servera (service role), zato je RLS uključen bez javnih polisa.
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
