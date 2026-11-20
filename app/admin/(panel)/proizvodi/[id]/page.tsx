import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin, type ProductRow } from "@/lib/admin";
import ProductForm from "@/components/admin/ProductForm";
import { CATEGORIES } from "@/lib/site";
import { htmlToText } from "@/lib/format";

export default async function ProductEdit({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ sacuvano?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  const { sb } = await requireAdmin();
  let p: ProductRow | null = null;
  if (id !== "novi") {
    const { data } = await sb.from("products").select("*").eq("id", Number(id)).maybeSingle();
    if (!data) notFound();
    p = data as ProductRow;
  }
  return (
    <>
      <Link href="/admin/proizvodi" className="adm-link">
        ← Svi proizvodi
      </Link>
      <div className="adm-head">
        <h1>{p ? p.name : "Novi proizvod"}</h1>
        {p && (
          <Link href={`/proizvod/${p.slug}`} target="_blank" className="adm-link">
            Pogledaj u prodavnici ↗
          </Link>
        )}
      </div>
      {sp.sacuvano !== undefined && <p className="adm-ok">Sačuvano ✓ Prodavnica je osvežena.</p>}
      <ProductForm
        categories={CATEGORIES.map((c) => ({ slug: c.slug, name: c.name }))}
        initial={
          p
            ? {
                id: p.id,
                name: p.name,
                category: p.category,
                price: p.price,
                regularPrice: p.regular_price,
                description: htmlToText(p.description),
                images: p.images,
                active: p.active,
                inStock: p.in_stock,
                featured: p.featured,
              }
            : null
        }
      />
    </>
  );
}
