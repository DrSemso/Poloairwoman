import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase";

export async function POST(req: Request) {
  const sb = await createSupabaseServer();
  await sb.auth.signOut();
  return NextResponse.redirect(new URL("/admin/prijava", req.url), { status: 303 });
}
