import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase";

// Link iz emaila za prijavu (radi i sa PKCE "code" i sa "token_hash").
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = (url.searchParams.get("type") || "email") as EmailOtpType;
  const sb = await createSupabaseServer();
  let ok = false;
  if (code) ok = !(await sb.auth.exchangeCodeForSession(code)).error;
  else if (tokenHash) ok = !(await sb.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  return NextResponse.redirect(new URL(ok ? "/admin" : "/admin/prijava?greska", url.origin));
}
