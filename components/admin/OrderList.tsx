import Link from "next/link";
import { dateTime, statusLabel, type OrderRow } from "@/lib/admin";
import { rsd } from "@/lib/format";

export function StatusPill({ status }: { status: string }) {
  const s = statusLabel(status);
  return <span className={`adm-pill ${s.tone}`}>{s.label}</span>;
}

export default function OrderList({ orders }: { orders: OrderRow[] }) {
  if (!orders.length) return <p className="adm-empty">Još nema porudžbina.</p>;
  return (
    <div className="adm-table">
      <table>
        <thead>
          <tr>
            <th>Broj</th>
            <th className="hide-m">Datum</th>
            <th>Kupac</th>
            <th className="hide-m">Grad</th>
            <th className="r">Iznos</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <Link href={`/admin/porudzbine/${o.id}`} className="adm-link">
                  {o.number}
                </Link>
                <small className="show-m">{dateTime(o.created_at)}</small>
              </td>
              <td className="nowrap hide-m">{dateTime(o.created_at)}</td>
              <td>
                {o.customer?.name}
                <small>{o.customer?.phone}</small>
                <small className="show-m">{o.customer?.city}</small>
              </td>
              <td className="hide-m">{o.customer?.city}</td>
              <td className="r nowrap">{rsd(o.total)}</td>
              <td>
                <StatusPill status={o.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
