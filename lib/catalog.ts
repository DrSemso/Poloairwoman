import "server-only";
import { unstable_cache } from "next/cache";
import raw from "@/data/products.json";
import { createSupabasePublic, hasSupabase } from "./supabase";
import { newIds, summaryOf, type Product } from "./products";

export const CATALOG_TAG = "products";

type Row = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  regular_price: number | null;
  images: string[];
  description: string;
  in_stock: boolean;
  featured: boolean;
  rank: number;
  old_slug: string | null;
};

// Naslovne slike sa belom pozadinom (iz uvoza) — nove slike iz admina tretiramo kao bele
const NOT_WHITE = new Set((raw as { images: string[]; whiteCover: boolean }[]).filter((p) => !p.whiteCover).map((p) => p.images[0]));

export function fromRow(r: Row): Product {
  return {
    id: r.id,
    slug: r.slug,
    oldSlug: r.old_slug,
    name: r.name,
    category: r.category,
    price: r.price,
    regularPrice: r.regular_price && r.regular_price > r.price ? r.regular_price : null,
    images: r.images?.length ? r.images : ["/brand/placeholder.webp"],
    description: r.description || "",
    summary: summaryOf(r.description || ""),
    rank: r.rank,
    inStock: r.in_stock,
    featured: r.featured,
    whiteCover: !!r.images?.length && !NOT_WHITE.has(r.images[0]),
  };
}

const fallback = (): Product[] =>
  (raw as (Omit<Product, "inStock" | "featured"> & { whiteCover: boolean })[]).map((p) => ({ ...p, inStock: true, featured: false }));

async function load(): Promise<Product[]> {
  if (!hasSupabase) return fallback();
  const sb = createSupabasePublic();
  const out: Row[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb
      .from("products")
      .select("id,slug,name,category,price,regular_price,images,description,in_stock,featured,rank,old_slug")
      .eq("active", true)
      .order("rank")
      .range(from, from + 999);
    if (error) {
      console.error("catalog", error.message);
      return fallback();
    }
    out.push(...(data as Row[]));
    if (!data || data.length < 1000) break;
  }
  // Prazna baza (pre uvoza) — prikaži katalog iz repoa
  return out.length ? out.map(fromRow) : fallback();
}

function markNew(list: Product[]) {
  const ids = newIds(list);
  return list.map((p) => ({ ...p, isNew: ids.has(p.id) }));
}

/** Ceo aktivni katalog, keširan; admin ga osvežava preko revalidateTag. */
export const getCatalog = unstable_cache(async () => markNew(await load()), ["catalog-v1"], { tags: [CATALOG_TAG], revalidate: 600 });

export async function getProductBySlug(slug: string) {
  return (await getCatalog()).find((p) => p.slug === slug);
}
