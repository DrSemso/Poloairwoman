import Link from "next/link";
import { requireAdmin, type OrderRow } from "@/lib/admin";
import { rsd } from "@/lib/format";
import OrderList from "@/components/admin/OrderList";

export default async function AdminHome() {
  const { sb } = await requireAdmin();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  const [{ data: recent }, { data: month }, { count: newCount }, { count: activeCount }, { count: soldOut }, { count: subs }] = await Promise.all([
    sb.from("orders").select("*").order("created_at", { ascending: false }).limit(8),
    sb.from("orders").select("total,status,created_at").gte("created_at", monthStart.toISOString()),
    sb.from("orders").select("id", { count: "exact", head: true }).eq("status", "nova"),
    sb.from("products").select("id", { count: "exact", head: true }).eq("active", true),
    sb.from("products").select("id", { count: "exact", head: true }).eq("active", true).eq("in_stock", false),
    sb.from("subscribers").select("email", { count: "exact", head: true }),
  ]);

  const valid = (month ?? []).filter((o) => !["otkazana", "vracena"].includes(o.status));
  const today = valid.filter((o) => new Date(o.created_at) >= dayStart);

  const cards = [
    { label: "Nove porudžbine", value: String(newCount ?? 0), href: "/admin/porudzbine?status=nova", accent: (newCount ?? 0) > 0 },
    { label: "Danas", value: `${today.length} · ${rsd(today.reduce((s, o) => s + o.total, 0))}` },
    { label: "Ovaj mesec", value: `${valid.length} · ${rsd(valid.reduce((s, o) => s + o.total, 0))}` },
    { label: "Aktivni proizvodi", value: `${activeCount ?? 0}`, sub: soldOut ? `${soldOut} rasprodato` : undefined, href: "/admin/proizvodi" },
    { label: "Newsletter", value: `${subs ?? 0}`, href: "/admin/newsletter" },
  ];

  return (
    <>
      <div className="adm-head">
        <h1>Pregled</h1>
        <Link href="/admin/proizvodi/novi" className="btn">
          + Novi proizvod
        </Link>
      </div>
      <div className="adm-cards">
        {cards.map((c) => {
          const inner = (
            <>
              <span>{c.label}</span>
              <b>{c.value}</b>
              {c.sub && <small>{c.sub}</small>}
            </>
          );
          return c.href ? (
            <Link key={c.label} href={c.href} className={`adm-card${c.accent ? " accent" : ""}`}>
              {inner}
            </Link>
          ) : (
            <div key={c.label} className="adm-card">
              {inner}
            </div>
          );
        })}
      </div>
      <div className="adm-head" style={{ marginTop: 36 }}>
        <h2>Poslednje porudžbine</h2>
        <Link href="/admin/porudzbine" className="adm-link">
          Sve porudžbine →
        </Link>
      </div>
      <OrderList orders={(recent ?? []) as OrderRow[]} />
    </>
  );
}
