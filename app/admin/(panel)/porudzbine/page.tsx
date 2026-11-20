import Link from "next/link";
import { ORDER_STATUSES, requireAdmin, type OrderRow } from "@/lib/admin";
import OrderList from "@/components/admin/OrderList";

const PER = 50;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; strana?: string }> }) {
  const sp = await searchParams;
  const { sb } = await requireAdmin();
  const page = Math.max(1, parseInt(sp.strana || "1", 10) || 1);
  let q = sb.from("orders").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (sp.status) q = q.eq("status", sp.status);
  if (sp.q) {
    const t = sp.q.replace(/[%,()]/g, " ").trim();
    q = q.or(`number.ilike.%${t}%,customer->>name.ilike.%${t}%,customer->>phone.ilike.%${t}%,customer->>city.ilike.%${t}%`);
  }
  const { data, count } = await q.range((page - 1) * PER, page * PER - 1);
  const pages = Math.max(1, Math.ceil((count ?? 0) / PER));
  const link = (o: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    Object.entries({ status: sp.status, q: sp.q, ...o }).forEach(([k, v]) => v && p.set(k, v));
    const s = p.toString();
    return `/admin/porudzbine${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <div className="adm-head">
        <h1>Porudžbine</h1>
        <form className="adm-search">
          {sp.status && <input type="hidden" name="status" value={sp.status} />}
          <input name="q" defaultValue={sp.q} placeholder="Broj, ime, telefon, grad…" />
        </form>
      </div>
      <div className="adm-tabs">
        <Link href={link({ status: undefined, strana: undefined })} className={!sp.status ? "on" : ""}>
          Sve
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link key={s.key} href={link({ status: s.key, strana: undefined })} className={sp.status === s.key ? "on" : ""}>
            {s.label}
          </Link>
        ))}
      </div>
      <OrderList orders={(data ?? []) as OrderRow[]} />
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
