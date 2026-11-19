import type { Metadata } from "next";
import Link from "next/link";
import { search } from "@/lib/products";
import { ProductGrid } from "@/components/Sections";

export const metadata: Metadata = { title: "Pretraga", robots: { index: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = search(q).slice(0, 60);
  return (
    <>
      <section className="cat-hero">
        <div className="wrap">
          <h1>Pretraga</h1>
          <p className="lead">{q ? <>Rezultati za „{q}“ — {results.length} {results.length === 1 ? "proizvod" : "proizvoda"}</> : "Upiši šta tražiš u polje za pretragu."}</p>
        </div>
      </section>
      <div className="wrap plist">
        {results.length ? (
          <ProductGrid products={results} />
        ) : (
          <div className="empty">
            <p>Nismo pronašli ništa za tu pretragu.</p>
            <p style={{ marginTop: 20 }}>
              <Link href="/kategorija/svi-proizvodi" className="btn">
                Pogledaj sve proizvode
              </Link>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
