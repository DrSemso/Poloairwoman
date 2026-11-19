import { NextResponse } from "next/server";
import { dbRpc, hasDb } from "@/lib/server";

export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  const e = String(email || "").trim().toLowerCase().slice(0, 160);
  if (!/^\S+@\S+\.\S+$/.test(e)) return NextResponse.json({ error: "Neispravan email." }, { status: 400 });
  if (!hasDb) {
    if (process.env.NODE_ENV !== "production") return NextResponse.json({ ok: true, dev: true });
    return NextResponse.json({ error: "Prijava trenutno nije dostupna." }, { status: 503 });
  }
  try {
    await dbRpc("subscribe", { email: e });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("newsletter", err);
    return NextResponse.json({ error: "Greška." }, { status: 500 });
  }
}
