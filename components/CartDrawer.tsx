"use client";

import Link from "next/link";
import { useCart, type CartLine } from "./CartProvider";
import { rsd } from "@/lib/format";
import { SITE } from "@/lib/site";

export type Suggestion = Omit<CartLine, "qty">;

export function shippingFor(subtotal: number) {
  return subtotal >= SITE.freeShippingFrom || subtotal === 0 ? 0 : SITE.shippingPrice;
}

export function FreeShipBar({ subtotal }: { subtotal: number }) {
  const left = SITE.freeShippingFrom - subtotal;
  const pct = Math.min(100, (subtotal / SITE.freeShippingFrom) * 100);
  return (
    <div className="cd-ship">
      <p>
        {left > 0 ? (
          <>
            Još <b>{rsd(left)}</b> do besplatne dostave
          </>
        ) : (
          <>
            <b>Besplatna dostava</b> je tvoja 🎉
          </>
        )}
      </p>
      <div className="cd-bar">
        <i style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CartDrawer({ suggestions }: { suggestions: Suggestion[] }) {
  const { lines, open, setOpen, setQty, remove, subtotal, add } = useCart();
  const xs = suggestions.find((s) => !lines.some((l) => l.slug === s.slug));

  return (
    <>
      <div className={`overlay${open ? " open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`panel right${open ? " open" : ""}`} aria-label="Korpa" aria-hidden={!open}>
        <div className="panel-head">
          <span className="ttl">Korpa ({lines.reduce((s, l) => s + l.qty, 0)})</span>
          <button className="panel-close" onClick={() => setOpen(false)} aria-label="Zatvori korpu">
            ×
          </button>
        </div>
        {lines.length > 0 && <FreeShipBar subtotal={subtotal} />}
        <div className="cd-items">
          {lines.length === 0 ? (
            <div className="cd-empty">
              <p>Korpa je prazna.</p>
              <Link href="/kategorija/svi-proizvodi" className="btn" onClick={() => setOpen(false)}>
                Pogledaj kolekciju
              </Link>
            </div>
          ) : (
            lines.map((l) => (
              <div className="cd-item" key={l.slug}>
                <img src={l.image} alt="" />
                <div className="info">
                  <h4>
                    <Link href={`/proizvod/${l.slug}`} onClick={() => setOpen(false)}>
                      {l.name}
                    </Link>
                  </h4>
                  <div className="pr">
                    {l.regularPrice && <span className="so">{rsd(l.regularPrice)}</span>}
                    {rsd(l.price)}
                  </div>
                  <div className="row">
                    <div className="cd-qty">
                      <button onClick={() => setQty(l.slug, l.qty - 1)} aria-label="Smanji količinu">
                        −
                      </button>
                      <span>{l.qty}</span>
                      <button onClick={() => setQty(l.slug, l.qty + 1)} aria-label="Povećaj količinu">
                        +
                      </button>
                    </div>
                    <button className="rm" onClick={() => remove(l.slug)}>
                      Ukloni
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {lines.length > 0 && xs && (
          <div className="cd-xsell">
            <div className="lab">Dodaj i ovo</div>
            <div className="cd-xrow">
              <img src={xs.image} alt="" />
              <div className="xi">
                <b>{xs.name}</b>
                <span>{rsd(xs.price)}</span>
              </div>
              <button className="cd-xadd" onClick={() => add(xs, 1, false)}>
                Dodaj +
              </button>
            </div>
          </div>
        )}
        {lines.length > 0 && (
          <div className="cd-foot">
            <div className="cd-total">
              <span className="l">Ukupno</span>
              <span className="v">{rsd(subtotal)}</span>
            </div>
            <Link href="/korpa" className="btn btn-block" onClick={() => setOpen(false)}>
              Nastavi na podatke za dostavu →
            </Link>
            <p className="cd-note">Plaćanje pouzećem — prvo preuzmi, onda plati.</p>
          </div>
        )}
      </aside>
    </>
  );
}
