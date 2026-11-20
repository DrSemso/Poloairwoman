import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { sb, email } = await requireAdmin();
  const { count } = await sb.from("orders").select("id", { count: "exact", head: true }).eq("status", "nova");
  return (
    <div className="adm">
      <AdminNav email={email} newOrders={count ?? 0} />
      <div className="adm-main">{children}</div>
    </div>
  );
}
