// Kopira slike novog modela sa Trendyol CDN-a u naš bucket "products".
// Poziva ga samo baza (private.import_product) sa tajnim ključem iz private.config.
import { createClient } from "jsr:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const ALLOWED = /^https:\/\/cdn\.dsmcdn\.com\//;

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method", { status: 405 });
  const { data: ok } = await sb.rpc("import_secret_ok", { s: req.headers.get("x-import-secret") });
  if (!ok) return new Response("forbidden", { status: 403 });

  const { code, images } = (await req.json()) as { code: string; images: string[] };
  const safe = String(code || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!safe || !Array.isArray(images)) return new Response("bad request", { status: 400 });

  const urls: string[] = [];
  for (const [i, src] of images.slice(0, 10).entries()) {
    if (!ALLOWED.test(src)) continue;
    const r = await fetch(src);
    if (!r.ok) continue;
    const type = r.headers.get("content-type") || "image/jpeg";
    const ext = type.includes("webp") ? "webp" : type.includes("png") ? "png" : "jpg";
    const path = `uvoz/${safe}/${i + 1}.${ext}`;
    const { error } = await sb.storage.from("products").upload(path, await r.arrayBuffer(), { contentType: type, upsert: true });
    if (error) continue;
    urls.push(sb.storage.from("products").getPublicUrl(path).data.publicUrl);
  }
  return Response.json({ urls });
});
