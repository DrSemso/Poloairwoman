import { NextResponse } from "next/server";
import { getProduct } from "@/lib/products";
import { SITE } from "@/lib/site";
import { rsd } from "@/lib/format";
import { adminEmails, dbInsert, esc, hasDb, hasMail, sendMail } from "@/lib/server";

type Body = {
  customer?: Record<string, string>;
  items?: { slug: string; qty: number }[];
};

const clip = (s: unknown, n: number) => String(s ?? "").trim().slice(0, n);

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtev." }, { status: 400 });
  }

  const c = body.customer || {};
  const customer = {
    name: clip(c.name, 120),
    phone: clip(c.phone, 40),
    email: clip(c.email, 160),
    address: clip(c.address, 200),
    city: clip(c.city, 80),
    zip: clip(c.zip, 10),
    note: clip(c.note, 1000),
  };
  if (customer.name.split(/\s+/).length < 2 || customer.phone.replace(/\D/g, "").length < 8 || customer.address.length < 4 || customer.city.length < 2 || !/^\d{5}$/.test(customer.zip)) {
    return NextResponse.json({ error: "Proveri podatke za dostavu." }, { status: 400 });
  }

  // Cene se uvek računaju na serveru, iz kataloga — ne verujemo korpi iz browsera.
  const items = (body.items || [])
    .slice(0, 50)
    .map((i) => {
      const p = getProduct(String(i.slug));
      const qty = Math.max(1, Math.min(20, Math.floor(Number(i.qty) || 1)));
      return p ? { slug: p.slug, name: p.name, price: p.price, qty, total: p.price * qty } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
  if (!items.length) return NextResponse.json({ error: "Korpa je prazna." }, { status: 400 });

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const shipping = subtotal >= SITE.freeShippingFrom ? 0 : SITE.shippingPrice;
  const total = subtotal + shipping;

  const d = new Date();
  const number = `PAW-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

  if (!hasDb && !hasMail) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[order:dev]", number, customer, items, total);
      return NextResponse.json({ number, dev: true });
    }
    return NextResponse.json({ error: `Online porudžbine se upravo podešavaju. Poruči telefonom ili Viberom: ${SITE.phone}` }, { status: 503 });
  }

  let saved = false;
  if (hasDb) {
    try {
      await dbInsert("orders", { number, customer, items, subtotal, shipping, total, status: "nova" });
      saved = true;
    } catch (e) {
      console.error("order db", e);
    }
  }

  const rows = items.map((i) => `<tr><td>${esc(i.name)}</td><td align="center">${i.qty}</td><td align="right">${rsd(i.total)}</td></tr>`).join("");
  const table = `<table cellpadding="6" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px">${rows}
    <tr><td colspan="2">Dostava</td><td align="right">${shipping ? rsd(shipping) : "Besplatna"}</td></tr>
    <tr><td colspan="2"><b>Ukupno (pouzećem)</b></td><td align="right"><b>${rsd(total)}</b></td></tr></table>`;
  const who = `<p style="font-family:Arial,sans-serif;font-size:14px">${esc(customer.name)}<br>${esc(customer.address)}<br>${esc(customer.zip)} ${esc(customer.city)}<br>Tel: ${esc(customer.phone)}${
    customer.email ? `<br>Email: ${esc(customer.email)}` : ""
  }${customer.note ? `<br><br>Napomena: ${esc(customer.note)}` : ""}</p>`;

  const mailed = await sendMail(adminEmails(), `Nova porudžbina ${number} — ${rsd(total)}`, `<h2 style="font-family:Arial,sans-serif">Nova porudžbina ${number}</h2>${who}${table}`, customer.email || undefined);

  if (!saved && !mailed) {
    return NextResponse.json({ error: `Porudžbina nije poslata. Pokušaj ponovo ili poruči telefonom: ${SITE.phone}` }, { status: 502 });
  }

  if (customer.email) {
    await sendMail(
      [customer.email],
      `Hvala na porudžbini ${number} — Poloair Woman`,
      `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a"><h2 style="font-weight:normal">Hvala na porudžbini!</h2>
       <p>Primili smo tvoju porudžbinu <b>${number}</b>. Šaljemo je u roku od 24h, a plaćaš kuriru pouzećem.</p>${table}
       <p>Adresa za dostavu:</p>${who}<p>Pitanja? Pozovi ili piši na Viber: ${SITE.phone}</p></div>`,
      adminEmails()[0]
    );
  }

  return NextResponse.json({ number });
}
