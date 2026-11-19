import raw from "@/data/products.json";
import { CATEGORIES, COLLECTIONS, type Category } from "./site";

export type Product = {
  id: number;
  slug: string;
  oldSlug: string;
  name: string;
  category: string;
  price: number;
  regularPrice: number | null;
  images: string[];
  description: string;
  summary: string;
  rank: number; // 0 = najnoviji
  whiteCover: boolean; // naslovna slika je na beloj pozadini
};

export const PRODUCTS = raw as Product[];

/** Koliko najnovijih proizvoda nosi oznaku "Novo". */
const NEW_COUNT = 24;

export function isNew(p: Product) {
  return p.rank < NEW_COUNT;
}

export function discountPct(p: Product) {
  if (!p.regularPrice) return 0;
  return Math.round((1 - p.price / p.regularPrice) * 100);
}

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return [...CATEGORIES, ...COLLECTIONS].find((c) => c.slug === slug);
}

export function productsIn(slug: string): Product[] {
  if (slug === "novo") return PRODUCTS.filter(isNew);
  if (slug === "akcije") return PRODUCTS.filter((p) => p.regularPrice);
  if (slug === "svi-proizvodi") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === slug);
}

export type SortKey = "popularno" | "cena-rastuce" | "cena-opadajuce" | "najnovije";

export const SORTS: { key: SortKey; label: string }[] = [
  { key: "popularno", label: "Izdvajamo" },
  { key: "najnovije", label: "Najnovije" },
  { key: "cena-rastuce", label: "Cena: od najniže" },
  { key: "cena-opadajuce", label: "Cena: od najviše" },
];

export function sortProducts(list: Product[], sort: SortKey) {
  const l = [...list];
  switch (sort) {
    case "cena-rastuce":
      return l.sort((a, b) => a.price - b.price);
    case "cena-opadajuce":
      return l.sort((a, b) => b.price - a.price);
    case "najnovije":
      return l.sort((a, b) => a.rank - b.rank);
    default:
      // "Izdvajamo": snižene i premium setovi prvo, pa najnoviji
      return l.sort((a, b) => score(b) - score(a) || a.rank - b.rank);
  }
}

function score(p: Product) {
  return (p.whiteCover ? 4 : 0) + (p.regularPrice ? 2 : 0) + (p.images.length >= 4 ? 1 : 0);
}

export function related(p: Product, n = 4): Product[] {
  const same = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id);
  // Stabilan, ali raznovrstan izbor: najbliži po ceni
  same.sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price) || a.rank - b.rank);
  const out = same.slice(0, n - 1);
  const pair: Record<string, string> = { satovi: "pokloni", setovi: "pokloni", pokloni: "setovi", narukvice: "satovi", torbice: "novcanici", novcanici: "torbice", naocare: "torbice" };
  const extra = PRODUCTS.find((x) => x.category === pair[p.category] && !out.includes(x));
  if (extra) out.push(extra);
  return out.slice(0, n);
}

export function search(q: string): Product[] {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "dj");
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return PRODUCTS.filter((p) => {
    const hay = norm(`${p.name} ${p.category} ${p.summary}`);
    return terms.every((t) => hay.includes(t));
  });
}
