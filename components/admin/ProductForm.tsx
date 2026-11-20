"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { deleteProduct, saveProduct, type ProductInput } from "@/app/admin/actions";
import { browserSupabase } from "@/lib/supabase-browser";

type Cat = { slug: string; name: string };

/** Smanji sliku na najviše 1400px i pretvori u WebP pre slanja. */
async function toWebp(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1400 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale);
  c.height = Math.round(bmp.height * scale);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("webp"))), "image/webp", 0.88));
}

export default function ProductForm({ categories, initial }: { categories: Cat[]; initial: ProductInput | null }) {
  const router = useRouter();
  const [f, setF] = useState<ProductInput>(
    initial ?? { name: "", category: categories[0].slug, price: 0, regularPrice: null, description: "", images: [], active: true, inStock: true, featured: false },
  );
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(0);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) => setF((s) => ({ ...s, [k]: v }));

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setErr("");
    const sb = browserSupabase();
    const list = Array.from(files);
    setUploading(list.length);
    const urls: string[] = [];
    for (const file of list) {
      try {
        const blob = await toWebp(file);
        const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.webp`;
        const { error } = await sb.storage.from("products").upload(path, blob, { contentType: "image/webp", cacheControl: "31536000" });
        if (error) throw error;
        urls.push(sb.storage.from("products").getPublicUrl(path).data.publicUrl);
      } catch {
        setErr(`Slika "${file.name}" nije otpremljena. Probaj ponovo ili sa manjom slikom.`);
      }
      setUploading((n) => n - 1);
    }
    setF((s) => ({ ...s, images: [...s.images, ...urls] }));
    if (fileRef.current) fileRef.current.value = "";
  }

  const move = (i: number, d: number) =>
    setF((s) => {
      const a = [...s.images];
      const j = i + d;
      if (j < 0 || j >= a.length) return s;
      [a[i], a[j]] = [a[j], a[i]];
      return { ...s, images: a };
    });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    start(async () => {
      const r = await saveProduct(f);
      if (!r.ok) return setErr(r.error);
      router.replace(`/admin/proizvodi/${r.id}?sacuvano`);
      router.refresh();
    });
  }

  return (
    <form className="adm-pform" onSubmit={submit}>
      <section className="adm-box">
        <div className="field">
          <label htmlFor="name">Naziv</label>
          <input id="name" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="npr. Sat S44 sa narukvicom" />
        </div>
        <div className="adm-row3">
          <div className="field">
            <label htmlFor="cat">Kategorija</label>
            <select id="cat" value={f.category} onChange={(e) => set("category", e.target.value)}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="price">Cena (RSD)</label>
            <input id="price" inputMode="numeric" value={f.price || ""} onChange={(e) => set("price", Number(e.target.value.replace(/\D/g, "")))} />
          </div>
          <div className="field">
            <label htmlFor="old">Stara cena (za akciju)</label>
            <input id="old" inputMode="numeric" value={f.regularPrice ?? ""} placeholder="prazno = nije na akciji" onChange={(e) => set("regularPrice", e.target.value ? Number(e.target.value.replace(/\D/g, "")) : null)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="desc">Opis</label>
          <textarea id="desc" rows={10} value={f.description} onChange={(e) => set("description", e.target.value)} />
          <small className="muted">Novi red = novi pasus. Može i &lt;strong&gt;podebljano&lt;/strong&gt;.</small>
        </div>
        <div className="adm-checks">
          <label>
            <input type="checkbox" checked={f.inStock} onChange={(e) => set("inStock", e.target.checked)} /> Na stanju
          </label>
          <label>
            <input type="checkbox" checked={f.active} onChange={(e) => set("active", e.target.checked)} /> Vidljiv u prodavnici
          </label>
          <label>
            <input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} /> Izdvojen (ide napred)
          </label>
        </div>
      </section>

      <section className="adm-box">
        <h2>Slike</h2>
        <p className="muted adm-hint">Prva slika je naslovna. Najbolje kvadratne, proizvod na beloj pozadini.</p>
        <div className="adm-imgs">
          {f.images.map((src, i) => (
            <div key={src} className="adm-img">
              <img src={src} alt="" />
              {i === 0 && <span className="adm-cover">Naslovna</span>}
              <div className="adm-img-ctl">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Levo">
                  ←
                </button>
                <button type="button" onClick={() => set("images", f.images.filter((x) => x !== src))} aria-label="Ukloni">
                  ✕
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === f.images.length - 1} aria-label="Desno">
                  →
                </button>
              </div>
            </div>
          ))}
          <label className="adm-img add">
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
            {uploading ? `Otpremam… (${uploading})` : "+ Dodaj slike"}
          </label>
        </div>
      </section>

      {err && <p className="form-err">{err}</p>}
      <div className="adm-actions sticky">
        <button className="btn" disabled={pending || uploading > 0}>
          {pending ? "Čuvam…" : "Sačuvaj"}
        </button>
        {f.id && (
          <button
            type="button"
            className="btn btn-outline danger"
            disabled={pending}
            onClick={() => {
              if (window.prompt('Proizvod se trajno briše. Upiši "obriši" za potvrdu:')?.trim().toLowerCase() === "obriši") start(() => deleteProduct(f.id!));
            }}
          >
            Obriši
          </button>
        )}
      </div>
    </form>
  );
}
