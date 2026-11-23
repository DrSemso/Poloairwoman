import Link from "next/link";
import { requireAdmin, type ProductRow } from "@/lib/admin";
import { CATEGORIES } from "@/lib/site";
import { rsd } from "@/lib/format";
import ProductToggles from "@/components/admin/ProductToggles";

const PER = 40;

type SP = { q?: string; kat?: string; stanje?: string; strana?: string };

export default async function ProductsAdmin({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const { sb } = await requireAdmin();
  const page = Math.max(1, parseInt(sp.strana || "1", 10) || 1);
  let q = sb.from("products").select("id,slug,name,category,price,regular_price,images,active,in_stock,featured,track_stock,stock", { count: "exact" }).order("rank");
  if (sp.kat) q = q.eq("category", sp.kat);
  if (sp.stanje === "rasprodato") q = q.eq("in_stock", false);
  if (sp.stanje === "skriveno") q = q.eq("active", false);
  if (sp.stanje === "nacrti") q = q.eq("active", false).not("supplier_code", "is", null);
  if (sp.stanje === "izdvojeno") q = q.eq("featured", true);
  if (sp.q) q = q.ilike("name", `%${sp.q.replace(/[%,()]/g, " ").trim()}%`);
  const { data, count } = await q.range((page - 1) * PER, page * PER - 1);
  const rows = (data ?? []) as Pick<ProductRow, "id" | "slug" | "name" | "category" | "price" | "regular_price" | "images" | "active" | "in_stock" | "featured" | "track_stock" | "stock">[];
  const pages = Math.max(1, Math.ceil((count ?? 0) / PER));
  const link = (o: Partial<SP>) => {
    const p = new URLSearchParams();
    Object.entries({ q: sp.q, kat: sp.kat, stanje: sp.stanje, ...o }).forEach(([k, v]) => v && p.set(k, v));
    const s = p.toString();
    return `/admin/proizvodi${s ? `?${s}` : ""}`;
  };
  const catName = (s: string) => CATEGORIES.find((c) => c.slug === s)?.name ?? s;

  return (
    <>
      <div className="adm-head">
        <h1>
          Proizvodi <span className="muted adm-count">{count ?? 0}</span>
        </h1>
        <Link href="/admin/proizvodi/novi" className="btn">
          + Novi proizvod
        </Link>
      </div>
      <form className="adm-filters">
        <input name="q" defaultValue={sp.q} placeholder="Pretraži po nazivu…" />
        <select name="kat" defaultValue={sp.kat ?? ""}>
          <option value="">Sve kategorije</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="stanje" defaultValue={sp.stanje ?? ""}>
          <option value="">Svi</option>
          <option value="rasprodato">Rasprodato</option>
          <option value="skriveno">Skriveno</option>
          <option value="nacrti">Nacrti od dobavljača</option>
          <option value="izdvojeno">Izdvojeno</option>
        </select>
        <button className="btn btn-outline">Filtriraj</button>
      </form>
      {!rows.length ? (
        <p className="adm-empty">{sp.q || sp.kat || sp.stanje ? "Nema proizvoda za ovaj filter." : "Još nema proizvoda u bazi."}</p>
      ) : (
        <div className="adm-plist">
          {rows.map((p) => (
            <div key={p.id} className={`adm-prow${p.active ? "" : " off"}`}>
              <Link href={`/admin/proizvodi/${p.id}`} className="adm-thumb">
                <img src={p.images[0] || "/brand/placeholder.webp"} alt="" loading="lazy" />
              </Link>
              <div className="adm-pinfo">
                <Link href={`/admin/proizvodi/${p.id}`} className="adm-pname">
                  {p.name}
                </Link>
                <span className="muted">
                  {catName(p.category)} · {rsd(p.price)}
                  {p.regular_price ? <s> {rsd(p.regular_price)}</s> : null}
                </span>
              </div>
              <ProductToggles id={p.id} inStock={p.in_stock} active={p.active} featured={p.featured} stock={p.track_stock ? (p.stock ?? 0) : null} />
            </div>
          ))}
        </div>
      )}
      {pages > 1 && (
        <div className="pager">
          {page > 1 ? <Link href={link({ strana: String(page - 1) })}>Nazad</Link> : <span className="dis">Nazad</span>}
          <span className="gap" style={{ minWidth: 60 }}>
            {page}/{pages}
          </span>
          {page < pages ? <Link href={link({ strana: String(page + 1) })}>Dalje</Link> : <span className="dis">Dalje</span>}
        </div>
      )}
    </>
  );
}
