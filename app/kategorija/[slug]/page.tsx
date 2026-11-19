import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategory, productsIn, sortProducts, SORTS, type SortKey } from "@/lib/products";
import { CATEGORIES, COLLECTIONS, FAQ_GENERAL, MENU } from "@/lib/site";
import { Faq, FinalCta, NewsletterSection, ProductGrid, TrustLine } from "@/components/Sections";
import SortSelect from "@/components/SortSelect";

const PER_PAGE = 24;

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ sort?: string; strana?: string }> };

export function generateStaticParams() {
  return [...CATEGORIES, ...COLLECTIONS].map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return {};
  return {
    title: c.title,
    description: `${c.description} Plaćanje pouzećem, slanje u roku od 24h.`,
    alternates: { canonical: `/kategorija/${slug}` },
  };
}

function pageHref(slug: string, sort: string, page: number) {
  const p = new URLSearchParams();
  if (sort !== "popularno") p.set("sort", sort);
  if (page > 1) p.set("strana", String(page));
  const qs = p.toString();
  return `/kategorija/${slug}${qs ? `?${qs}` : ""}`;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const c = getCategory(slug);
  if (!c) notFound();

  const sort = (SORTS.some((s) => s.key === sp.sort) ? sp.sort : "popularno") as SortKey;
  const all = sortProducts(productsIn(slug), slug === "novo" ? "najnovije" : sort);
  const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, parseInt(sp.strana || "1", 10) || 1));
  const items = all.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const nums: (number | "…")[] = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i);
    else if (nums[nums.length - 1] !== "…") nums.push("…");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Početna", item: "/" },
      { "@type": "ListItem", position: 2, name: c.name, item: `/kategorija/${slug}` },
    ],
  };

  return (
    <>
      <section className="cat-hero">
        <div className="wrap">
          <nav className="crumb" aria-label="Putanja">
            <Link href="/">Početna</Link>
            <span className="sep">/</span>
            {c.name}
          </nav>
          <h1>{c.title}</h1>
          <p className="lead">{c.description}</p>
          <TrustLine />
          <div className="cat-chips">
            {MENU.filter((m) => m.href !== "/kategorija/novo").map((m) => (
              <Link key={m.href} href={m.href} className={`chip${m.href === `/kategorija/${slug}` ? " active" : ""}`}>
                {m.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap plist">
        <div className="sortbar">
          <span className="count">
            {all.length} {all.length === 1 ? "model" : "modela"}
          </span>
          {slug !== "novo" && (
            <Suspense>
              <SortSelect value={sort} />
            </Suspense>
          )}
        </div>
        {items.length ? <ProductGrid products={items} priorityCount={4} /> : <p className="empty">Trenutno nema proizvoda u ovoj kategoriji.</p>}

        {pages > 1 && (
          <>
            <nav className="pager pager-d" aria-label="Stranice">
              {page > 1 ? <Link href={pageHref(slug, sort, page - 1)} aria-label="Prethodna">←</Link> : <span className="dis">←</span>}
              {nums.map((n, i) =>
                n === "…" ? (
                  <span key={`g${i}`} className="gap">
                    …
                  </span>
                ) : n === page ? (
                  <span key={n} className="cur" aria-current="page">
                    {n}
                  </span>
                ) : (
                  <Link key={n} href={pageHref(slug, sort, n)}>
                    {n}
                  </Link>
                )
              )}
              {page < pages ? <Link href={pageHref(slug, sort, page + 1)} aria-label="Sledeća">→</Link> : <span className="dis">→</span>}
            </nav>
            <nav className="pager pager-m" aria-label="Stranice">
              {page > 1 ? <Link href={pageHref(slug, sort, page - 1)}>Nazad</Link> : <span className="dis">Nazad</span>}
              <span className="gap" style={{ minWidth: 60 }}>
                {page}/{pages}
              </span>
              {page < pages ? <Link href={pageHref(slug, sort, page + 1)}>Dalje</Link> : <span className="dis">Dalje</span>}
            </nav>
          </>
        )}
      </div>

      <Faq items={FAQ_GENERAL.slice(0, 5)} title="Pre nego što naručiš" />
      <NewsletterSection />
      <FinalCta title="Tvoj novi omiljeni komad te čeka" href="/kategorija/svi-proizvodi" cta="Pogledaj celu kolekciju" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
