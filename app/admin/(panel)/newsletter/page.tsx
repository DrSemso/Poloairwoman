import { dateTime, requireAdmin } from "@/lib/admin";

export default async function NewsletterAdmin() {
  const { sb } = await requireAdmin();
  const { data, count } = await sb.from("subscribers").select("email,created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(500);
  const rows = data ?? [];
  return (
    <>
      <div className="adm-head">
        <h1>
          Newsletter <span className="muted adm-count">{count ?? 0}</span>
        </h1>
        {rows.length > 0 && (
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- preuzimanje fajla, ne stranica
          <a href="/api/admin/newsletter-csv" className="btn btn-outline">
            Preuzmi CSV
          </a>
        )}
      </div>
      {!rows.length ? (
        <p className="adm-empty">Još niko nije ostavio email.</p>
      ) : (
        <div className="adm-table">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Prijavljen</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.email}>
                  <td>
                    <a href={`mailto:${r.email}`} className="adm-link">
                      {r.email}
                    </a>
                  </td>
                  <td className="nowrap">{dateTime(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
