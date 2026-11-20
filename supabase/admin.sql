-- Poloair Woman: katalog proizvoda, admini i slike.
-- Admin = ulogovan (email kod) i email je u private.admins.
create table if not exists private.admins (email text primary key);
insert into private.admins(email) values ('info@poloairwoman.rs'), ('fatih.lukarcanin000@gmail.com')
  on conflict do nothing;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from private.admins a where a.email = lower(coalesce(auth.jwt()->>'email', '')));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create sequence if not exists public.products_id_seq start 100000;
create table if not exists public.products (
  id bigint primary key default nextval('public.products_id_seq'),
  slug text not null unique,
  old_slug text,
  name text not null,
  category text not null,
  price integer not null check (price > 0),
  regular_price integer,
  images text[] not null default '{}',
  description text not null default '',
  active boolean not null default true,
  in_stock boolean not null default true,
  featured boolean not null default false,
  rank integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter sequence public.products_id_seq owned by public.products.id;
create index if not exists products_rank_idx on public.products(rank);
alter table public.products enable row level security;

create policy "products_public_read" on public.products for select to anon, authenticated
  using (active or (select public.is_admin()));
create policy "products_admin_insert" on public.products for insert to authenticated
  with check ((select public.is_admin()));
create policy "products_admin_update" on public.products for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "products_admin_delete" on public.products for delete to authenticated
  using ((select public.is_admin()));

alter table public.orders add column if not exists admin_note text not null default '';
create policy "orders_admin_read" on public.orders for select to authenticated using ((select public.is_admin()));
create policy "orders_admin_update" on public.orders for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "subscribers_admin_read" on public.subscribers for select to authenticated using ((select public.is_admin()));

-- Slike proizvoda: javni bucket, upis samo admin
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('products', 'products', true, 8388608, array['image/webp', 'image/jpeg', 'image/png', 'image/avif'])
on conflict (id) do nothing;
create policy "product_images_admin_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'products' and (select public.is_admin()));
create policy "product_images_admin_update" on storage.objects for update to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));
create policy "product_images_admin_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));
