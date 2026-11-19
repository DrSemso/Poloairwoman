import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";
import { CATEGORIES, COLLECTIONS, SITE } from "@/lib/site";
import { PAGES } from "@/lib/pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${SITE.url}${p}`;
  return [
    { url: u("/"), changeFrequency: "daily", priority: 1 },
    ...[...CATEGORIES, ...COLLECTIONS].map((c) => ({ url: u(`/kategorija/${c.slug}`), changeFrequency: "daily" as const, priority: 0.8 })),
    ...PRODUCTS.map((p) => ({ url: u(`/proizvod/${p.slug}`), changeFrequency: "weekly" as const, priority: 0.7, images: p.images.slice(0, 3).map(u) })),
    ...PAGES.map((p) => ({ url: u(`/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.3 })),
  ];
}
