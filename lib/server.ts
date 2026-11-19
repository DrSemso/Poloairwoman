import "server-only";

const SB_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasDb = !!(SB_URL && SB_KEY);
export const hasMail = !!process.env.RESEND_API_KEY;

export async function dbInsert(table: string, row: Record<string, unknown>) {
  if (!hasDb) throw new Error("db-not-configured");
  const r = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: SB_KEY!,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal,resolution=ignore-duplicates",
    },
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error(`db ${r.status}: ${await r.text()}`);
}

export function adminEmails() {
  return (process.env.ADMIN_EMAILS || "info@poloairwoman.rs")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function sendMail(to: string[], subject: string, html: string, replyTo?: string) {
  if (!hasMail || !to.length) return false;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || "Poloair Woman <narudzbe@poloairwoman.rs>",
      to,
      subject,
      html,
      reply_to: replyTo,
    }),
  });
  if (!r.ok) console.error("resend", r.status, await r.text());
  return r.ok;
}

export function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
