"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { FreeShipBar, shippingFor } from "@/components/CartDrawer";
import { IconCash } from "@/components/Icons";
import { rsd } from "@/lib/format";

type Form = { name: string; phone: string; email: string; address: string; city: string; zip: string; note: string };
const EMPTY: Form = { name: "", phone: "", email: "", address: "", city: "", zip: "", note: "" };

function validate(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {};
  if (f.name.trim().split(/\s+/).length < 2) e.name = "Unesi ime i prezime.";
  if (f.phone.replace(/\D/g, "").length < 8) e.phone = "Unesi ispravan broj telefona.";
  if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Email adresa nije ispravna.";
  if (f.address.trim().length < 4) e.address = "Unesi ulicu i broj.";
  if (f.city.trim().length < 2) e.city = "Unesi grad.";
  if (!/^\d{5}$/.test(f.zip.trim())) e.zip = "Poštanski broj ima 5 cifara.";
  return e;
}

export default function Checkout() {
  const { lines, subtotal, setQty, remove, ready, clear } = useCart();
  const router = useRouter();
  const [f, setF] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [busy, setBusy] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const shipping = shippingFor(subtotal);

  if (!ready) return <div style={{ minHeight: 400 }} />;

  if (!lines.length)
    return (
      <div className="thanks">
        <h1>Korpa je prazna</h1>
        <p className="lead">Dodaj omiljeni komad u korpu i vrati se ovde da završiš porudžbinu.</p>
        <p style={{ marginTop: 26 }}>
          <Link href="/kategorija/svi-proizvodi" className="btn">
            Pogledaj kolekciju
          </Link>
        </p>
      </div>
    );

  const field = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, full = false) => (
    <div className={`field${full ? " full" : ""}`}>
      <label htmlFor={`f-${k}`}>{label}</label>
      <input
        id={`f-${k}`}
        value={f[k]}
        onChange={(e) => setF({ ...f, [k]: e.target.value })}
        aria-invalid={!!errors[k]}
        {...props}
      />
      {errors[k] && <span className="err">{errors[k]}</span>}
    </div>
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(f);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    setServerErr("");
    try {
      const r = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: f, items: lines.map((l) => ({ slug: l.slug, qty: l.qty })) }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "Greška");
      clear();
      router.push(`/hvala?broj=${encodeURIComponent(data.number)}`);
    } catch (err) {
      setServerErr(
        err instanceof Error && err.message !== "Greška"
          ? err.message
          : "Porudžbina nije poslata. Pokušaj ponovo ili nas pozovi na +381 64 533-4370."
      );
      setBusy(false);
    }
  }

  return (
    <div className="co-grid">
      <form onSubmit={submit} noValidate>
        <div className="co-box">
          <h2>Podaci za dostavu</h2>
          <div className="fgrid">
            {field("name", "Ime i prezime", { autoComplete: "name" }, true)}
            {field("phone", "Telefon", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "06x xxx xxxx" })}
            {field("email", "Email (opciono)", { type: "email", autoComplete: "email" })}
            {field("address", "Ulica i broj", { autoComplete: "street-address" }, true)}
            {field("city", "Grad", { autoComplete: "address-level2" })}
            {field("zip", "Poštanski broj", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 5 })}
            <div className="field full">
              <label htmlFor="f-note">Napomena (opciono)</label>
              <textarea id="f-note" rows={3} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="Npr. sprat, interfon, poruka uz poklon" />
            </div>
          </div>
          <h2 style={{ marginTop: 28 }}>Plaćanje</h2>
          <div className="pay-opt">
            <IconCash />
            <div>
              <b>Plaćanje pouzećem</b>
              <span>Plaćaš kuriru gotovinom kad preuzmeš paket. Bez plaćanja unapred.</span>
            </div>
          </div>
          {serverErr && <p className="form-err">{serverErr}</p>}
          <button type="submit" className="btn btn-block" style={{ marginTop: 22, padding: 17 }} disabled={busy}>
            {busy ? "Šaljem porudžbinu…" : `Poruči · ${rsd(subtotal + shipping)}`}
          </button>
          <p className="consent">
            Klikom na „Poruči“ prihvataš <Link href="/uslovi-koriscenja">uslove korišćenja</Link>. Tvoje podatke koristimo samo za dostavu ove porudžbine (
            <Link href="/politika-privatnosti">politika privatnosti</Link>).
          </p>
        </div>
      </form>

      <aside className="co-summary">
        <div className="co-box" style={{ padding: 0 }}>
          <FreeShipBar subtotal={subtotal} />
          <div style={{ padding: "8px 22px 22px" }}>
            <div className="co-items">
              {lines.map((l) => (
                <div className="cd-item" key={l.slug}>
                  <img src={l.image} alt="" />
                  <div className="info">
                    <h4>
                      <Link href={`/proizvod/${l.slug}`}>{l.name}</Link>
                    </h4>
                    <div className="pr">
                      {l.regularPrice && <span className="so">{rsd(l.regularPrice)}</span>}
                      {rsd(l.price)}
                    </div>
                    <div className="row">
                      <div className="cd-qty">
                        <button type="button" onClick={() => setQty(l.slug, l.qty - 1)} aria-label="Smanji količinu">
                          −
                        </button>
                        <span>{l.qty}</span>
                        <button type="button" onClick={() => setQty(l.slug, l.qty + 1)} aria-label="Povećaj količinu">
                          +
                        </button>
                      </div>
                      <button type="button" className="rm" onClick={() => remove(l.slug)}>
                        Ukloni
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="sum-row">
              <span>Proizvodi</span>
              <span>{rsd(subtotal)}</span>
            </div>
            <div className="sum-row">
              <span>Dostava</span>
              <span>{shipping ? rsd(shipping) : "Besplatna"}</span>
            </div>
            <div className="sum-row total">
              <span>Ukupno za plaćanje</span>
              <span className="v">{rsd(subtotal + shipping)}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
