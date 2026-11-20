-- Poloair Woman: zalihe i ručni raspored proizvoda (migracija stock_and_order).
alter table public.products add column if not exists track_stock boolean not null default false;
alter table public.products add column if not exists stock integer check (stock is null or stock >= 0);

-- Kad se prate zalihe, "na stanju" se računa iz broja komada
create or replace function public.products_sync_stock()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.track_stock then
    new.stock := coalesce(new.stock, 0);
    new.in_stock := new.stock > 0;
  end if;
  return new;
end $$;
create trigger products_sync_stock before insert or update on public.products
  for each row execute function public.products_sync_stock();

-- Porudžbina umanjuje zalihe (atomski); ako nema dovoljno, ništa se ne upisuje
create or replace function public.place_order(secret text, o jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare it jsonb; left_ int; pname text;
begin
  if secret is null or secret <> (select value from private.config where key = 'server_secret') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  for it in select * from jsonb_array_elements(o->'items') loop
    update public.products set stock = stock - (it->>'qty')::int, updated_at = now()
      where slug = it->>'slug' and track_stock and stock >= (it->>'qty')::int;
    if not found and exists (select 1 from public.products where slug = it->>'slug' and track_stock) then
      select name, stock into pname, left_ from public.products where slug = it->>'slug';
      raise exception 'out_of_stock:%:%', pname, left_ using errcode = 'P0001';
    end if;
  end loop;
  insert into public.orders(number, customer, items, subtotal, shipping, total, status)
  values (o->>'number', o->'customer', o->'items', (o->>'subtotal')::int, (o->>'shipping')::int, (o->>'total')::int, 'nova');
end $$;

-- Ručni raspored: dati proizvodi dobijaju svoje postojeće pozicije u novom redosledu
create or replace function public.reorder_products(ids bigint[])
returns void language plpgsql security invoker set search_path = '' as $$
declare rs int[];
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  select array_agg(rank order by rank) into rs from public.products where id = any(ids);
  update public.products p set rank = rs[t.ord], updated_at = now()
    from unnest(ids) with ordinality as t(id, ord) where p.id = t.id;
end $$;
revoke all on function public.reorder_products(bigint[]) from public, anon;
grant execute on function public.reorder_products(bigint[]) to authenticated;
