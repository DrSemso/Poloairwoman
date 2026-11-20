import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServer, hasSupabase } from "./supabase";

export const ORDER_STATUSES = [
  { key: "nova", label: "Nova", tone: "pink" },
  { key: "potvrdjena", label: "Potvrđena", tone: "blue" },
  { key: "poslata", label: "Poslata", tone: "amber" },
  { key: "isporucena", label: "Isporučena", tone: "green" },
  { key: "vracena", label: "Vraćena", tone: "gray" },
  { key: "otkazana", label: "Otkazana", tone: "gray" },
] as const;

export function statusLabel(key: string) {
  return ORDER_STATUSES.find((s) => s.key === key) ?? { key, label: key, tone: "gray" as const };
}

/** Ulogovani admin ili preusmerenje na prijavu. */
export async function requireAdmin() {
  if (!hasSupabase) redirect("/admin/prijava");
  const sb = await createSupabaseServer();
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/admin/prijava");
  const { data: ok } = await sb.rpc("is_admin");
  if (!ok) redirect("/admin/prijava?nema-pristupa");
  return { sb, email: data.user.email ?? "" };
}

export type OrderRow = {
  id: number;
  number: string;
  created_at: string;
  status: string;
  customer: { name: string; phone: string; email?: string; address: string; city: string; zip: string; note?: string };
  items: { slug: string; name: string; price: number; qty: number; total: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  admin_note: string;
};

export type ProductRow = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  regular_price: number | null;
  images: string[];
  description: string;
  active: boolean;
  in_stock: boolean;
  featured: boolean;
  track_stock: boolean;
  stock: number | null;
  rank: number;
  updated_at: string;
};

export function dateTime(iso: string) {
  return new Date(iso).toLocaleString("sr-Latn-RS", { timeZone: "Europe/Belgrade", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
