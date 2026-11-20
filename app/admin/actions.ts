"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, ORDER_STATUSES } from "@/lib/admin";
import { CATALOG_TAG } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/site";
import { textToHtml } from "@/lib/format";

function refreshShop(slug?: string) {
  revalidateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
  if (slug) revalidatePath(`/proizvod/${slug}`);
}

export async function setOrderStatus(id: number, status: string) {
  const { sb } = await requireAdmin();
  if (!ORDER_STATUSES.some((s) => s.key === status)) throw new Error("Nepoznat status");
  const { error } = await sb.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
}

export async function saveOrderNote(id: number, note: string) {
  const { sb } = await requireAdmin();
  const { error } = await sb.from("orders").update({ admin_note: note.slice(0, 2000) }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/porudzbine/${id}`);
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "dj")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export type ProductInput = {
  id?: number;
  name: string;
  slug?: string;
  category: string;
  price: number;
  regularPrice: number | null;
  description: string;
  images: string[];
  active: boolean;
  inStock: boolean;
  featured: boolean;
};

export async function saveProduct(input: ProductInput): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const { sb } = await requireAdmin();
  const name = input.name.trim();
  if (name.length < 2) return { ok: false, error: "Upiši naziv proizvoda." };
  if (!CATEGORIES.some((c) => c.slug === input.category)) return { ok: false, error: "Izaberi kategoriju." };
  const price = Math.round(Number(input.price));
  if (!Number.isFinite(price) || price <= 0) return { ok: false, error: "Cena mora biti veća od 0." };
  const regular = input.regularPrice ? Math.round(Number(input.regularPrice)) : null;
  if (regular !== null && regular <= price) return { ok: false, error: "Stara cena mora biti veća od nove (ili ostavi prazno)." };
  if (!input.images.length) return { ok: false, error: "Dodaj bar jednu sliku." };

  const row = {
    name,
    category: input.category,
    price,
    regular_price: regular,
    description: textToHtml(input.description),
    images: input.images,
    active: input.active,
    in_stock: input.inStock,
    featured: input.featured,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { data, error } = await sb.from("products").update(row).eq("id", input.id).select("slug").single();
    if (error) return { ok: false, error: error.message };
    refreshShop(data.slug);
    return { ok: true, id: input.id };
  }

  // Novi proizvod: jedinstven slug, i ide na vrh liste "Novo"
  let slug = slugify(input.slug || name) || `proizvod-${Date.now()}`;
  const { data: clash } = await sb.from("products").select("slug").like("slug", `${slug}%`);
  if (clash?.some((c) => c.slug === slug)) slug = `${slug}-${(clash?.length ?? 0) + 1}`;
  const { data: top } = await sb.from("products").select("rank").order("rank").limit(1);
  const rank = (top?.[0]?.rank ?? 0) - 1;
  const { data, error } = await sb.from("products").insert({ ...row, slug, rank }).select("id").single();
  if (error) return { ok: false, error: error.message };
  refreshShop(slug);
  return { ok: true, id: data.id };
}

export async function quickUpdate(id: number, patch: { in_stock?: boolean; active?: boolean; featured?: boolean; price?: number }) {
  const { sb } = await requireAdmin();
  const { data, error } = await sb
    .from("products")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("slug")
    .single();
  if (error) throw new Error(error.message);
  refreshShop(data.slug);
  revalidatePath("/admin/proizvodi");
}

export async function deleteProduct(id: number) {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("products").select("slug").eq("id", id).single();
  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refreshShop(data?.slug);
  redirect("/admin/proizvodi");
}
