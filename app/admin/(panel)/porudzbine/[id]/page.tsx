import Link from "next/link";
import { notFound } from "next/navigation";
import { ORDER_STATUSES, dateTime, requireAdmin, type OrderRow } from "@/lib/admin";
import { rsd } from "@/lib/format";
import { NoteBox, StatusButtons } from "@/components/admin/OrderControls";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const { data } = await sb.from("orders").select("*").eq("id", Number(id)).maybeSingle();
  if (!data) notFound();
  const o = data as OrderRow;
  const c = o.customer;
  const phone = (c.phone || "").replace(/[^\d+]/g, "");
  const intl = phone.startsWith("0") ? `+381${phone.slice(1)}` : phone;
  const copy = `${c.name}\n${c.address}\n${c.zip} ${c.city}\n${c.phone}\nOtkupnina: ${o.total} RSD`;

  return (
    <>
      <Link href="/admin/porudzbine" className="adm-link">
        ← Sve porudžbine
      </Link>
      <div className="adm-head">
        <h1>Porudžbina {o.number}</h1>
        <span className="muted">{dateTime(o.created_at)}</span>
      </div>
      <div className="adm-grid2">
        <section className="adm-box">
          <h2>Status</h2>
          <StatusButtons id={o.id} status={o.status} statuses={ORDER_STATUSES} />
          <h2 style={{ marginTop: 26 }}>Proizvodi</h2>
          <div className="adm-table flat">
            <table>
              <tbody>
                {o.items.map((i) => (
                  <tr key={i.slug}>
                    <td>
                      <Link href={`/proizvod/${i.slug}`} target="_blank" className="adm-link">
                        {i.name}
                      </Link>
                    </td>
                    <td className="r nowrap">
                      {i.qty} × {rsd(i.price)}
                    </td>
                    <td className="r nowrap">{rsd(i.total)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={2}>Dostava</td>
                  <td className="r">{o.shipping ? rsd(o.shipping) : "Besplatna"}</td>
                </tr>
                <tr className="total">
                  <td colSpan={2}>Ukupno (pouzećem)</td>
                  <td className="r nowrap">{rsd(o.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 22 }}>
            <NoteBox id={o.id} note={o.admin_note || ""} />
          </div>
        </section>
        <section className="adm-box">
          <h2>Kupac</h2>
          <p className="adm-cust">
            <b>{c.name}</b>
            <br />
            {c.address}
            <br />
            {c.zip} {c.city}
          </p>
          <div className="adm-actions">
            <a className="btn" href={`tel:${intl}`}>
              Pozovi {c.phone}
            </a>
            <a className="btn btn-outline" href={`viber://chat?number=${encodeURIComponent(intl)}`}>
              Viber
            </a>
            {c.email && (
              <a className="btn btn-outline" href={`mailto:${c.email}?subject=${encodeURIComponent(`Porudžbina ${o.number}`)}`}>
                Email
              </a>
            )}
          </div>
          {c.note && (
            <p className="adm-note">
              <b>Napomena kupca:</b> {c.note}
            </p>
          )}
          <div className="field" style={{ marginTop: 22 }}>
            <label>Za nalepnicu kurira (označi i kopiraj)</label>
            <textarea readOnly rows={5} value={copy} />
          </div>
        </section>
      </div>
    </>
  );
}
