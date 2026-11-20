import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { CATEGORIES } from "@/lib/site";
import ReorderList from "@/components/admin/ReorderList";

export default async function Raspored({ searchParams }: { searchParams: Promise<{ kat?: string }> }) {
  const sp = await searchParams;
  const kat = CATEGORIES.some((c) => c.slug === sp.kat) ? sp.kat! : CATEGORIES[0].slug;
  const { sb } = await requireAdmin();
  const { data } = await sb.from("products").select("id,name,price,images,in_stock,active").eq("category", kat).order("rank").limit(1000);
  const rows = (data ?? []).map((p) => ({ id: p.id as number, name: p.name as string, price: p.price as number, image: (p.images as string[])[0] || "/brand/placeholder.webp", inStock: p.in_stock as boolean, active: p.active as boolean }));
  return (
    <>
      <div className="adm-head">
        <h1>Raspored</h1>
      </div>
      <p className="muted adm-intro">
        Redosled kojim se proizvodi prikazuju u kategoriji (i na „Svi proizvodi“). Prevuci red mišem ili koristi strelice, pa klikni <b>Sačuvaj raspored</b>.
        Rasprodati proizvodi se na sajtu uvek prikazuju na kraju.
      </p>
      <div className="adm-tabs">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/admin/raspored?kat=${c.slug}`} className={c.slug === kat ? "on" : ""}>
            {c.name}
          </Link>
        ))}
      </div>
      {rows.length ? <ReorderList key={kat} items={rows} /> : <p className="adm-empty">U ovoj kategoriji nema proizvoda.</p>}
    </>
  );
}
