import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const { sb } = await requireAdmin();
  const out: { email: string; created_at: string }[] = [];
  for (let from = 0; ; from += 1000) {
    const { data } = await sb.from("subscribers").select("email,created_at").order("created_at").range(from, from + 999);
    out.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  const csv = "email,prijavljen\n" + out.map((r) => `${r.email},${r.created_at.slice(0, 10)}`).join("\n");
  return new Response("﻿" + csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="newsletter-poloairwoman.csv"' },
  });
}
