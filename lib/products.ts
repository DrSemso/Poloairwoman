import { CATEGORIES, COLLECTIONS, type Category } from "./site";

export type Product = {
  id: number;
  slug: string;
  oldSlug?: string | null;
  name: string;
  category: string;
  price: number;
  regularPrice: number | null;
  images: string[];
  description: string;
  summary: string;
  rank: number; // manji = noviji
  whiteCover?: boolean;
  inStock: boolean;
  featured: boolean;
  isNew?: boolean;
};

/** Koliko najnovijih proizvoda nosi oznaku "Novo". */
const NEW_COUNT = 24;

export function newIds(all: Product[]) {
  return new Set([...all].sort((a, b) => a.rank - b.rank).slice(0, NEW_COUNT).map((p) => p.id));
}

export function discountPct(p: Product) {
  if (!p.regularPrice || p.regularPrice <= p.price) return 0;
  return Math.round((1 - p.price / p.regularPrice) * 100);
}

export function getCategory(slug: string): Category | undefined {
  return [...CATEGORIES, ...COLLECTIONS].find((c) => c.slug === slug);
}

export function productsIn(all: Product[], slug: string): Product[] {
  if (slug === "novo") {
    const ids = newIds(all);
    return all.filter((p) => ids.has(p.id));
  }
  if (slug === "akcije") return all.filter((p) => discountPct(p) > 0);
  if (slug === "svi-proizvodi") return all;
  return all.filter((p) => p.category === slug);
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
      // "Izdvajamo": na stanju, izdvojeni, slika na beloj pozadini, sniženi — pa najnoviji
      return l.sort((a, b) => score(b) - score(a) || a.rank - b.rank);
  }
}

function score(p: Product) {
  return (p.inStock ? 16 : 0) + (p.featured ? 8 : 0) + (p.whiteCover !== false ? 4 : 0) + (p.regularPrice ? 2 : 0) + (p.images.length >= 4 ? 1 : 0);
}

export function related(all: Product[], p: Product, n = 4): Product[] {
  const same = all.filter((x) => x.category === p.category && x.id !== p.id && x.inStock);
  same.sort((a, b) => Math.abs(a.price - p.price) - Math.abs(b.price - p.price) || a.rank - b.rank);
  const out = same.slice(0, n - 1);
  const pair: Record<string, string> = { satovi: "pokloni", setovi: "pokloni", pokloni: "setovi", narukvice: "satovi", torbice: "novcanici", novcanici: "torbice", naocare: "torbice" };
  const extra = all.find((x) => x.category === pair[p.category] && x.inStock && !out.includes(x));
  if (extra) out.push(extra);
  return out.slice(0, n);
}

export function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "dj");
}

export function search(all: Product[], q: string): Product[] {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return all.filter((p) => {
    const hay = norm(`${p.name} ${p.category} ${p.summary}`);
    return terms.every((t) => hay.includes(t));
  });
}

export function summaryOf(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}
