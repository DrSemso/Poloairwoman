import "server-only";

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_ANON_KEY;
const SECRET = process.env.SERVER_SECRET;

export const hasDb = !!(SB_URL && SB_KEY && SECRET);
export const hasMail = !!process.env.RESEND_API_KEY;

/** Poziva zaštićenu Supabase funkciju (radi samo sa serverskim tajnim ključem). */
export async function dbRpc(fn: string, args: Record<string, unknown>) {
  if (!hasDb) throw new Error("db-not-configured");
  const r = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: { apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ secret: SECRET, ...args }),
    cache: "no-store",
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
