"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { rsd } from "@/lib/format";
import { SITE } from "@/lib/site";
import { IconLock, IconTruck } from "./Icons";

type Item = { slug: string; name: string; price: number; regularPrice: number | null; image: string };

export default function BuyBox({ item }: { item: Item }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [showBar, setShowBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const free = item.price * qty >= SITE.freeShippingFrom;

  return (
    <>
      <p className="ship-hint">
        <IconTruck />
        {free ? (
          <span>
            <b style={{ fontWeight: 500 }}>Besplatna dostava</b> za ovu porudžbinu
          </span>
        ) : (
          <span>
            Besplatna dostava za porudžbine preko {rsd(SITE.freeShippingFrom)}
          </span>
        )}
      </p>
      <div className="qty-row" ref={ctaRef}>
        <div className="qty">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Smanji količinu">
            −
          </button>
          <span aria-live="polite">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="Povećaj količinu">
            +
          </button>
        </div>
        <button className="btn" onClick={() => add(item, qty)}>
          Dodaj u korpu
        </button>
      </div>
      <p className="next-step">
        <IconLock /> Bez plaćanja unapred — plaćaš tek kad ti kurir donese paket.
      </p>

      <div className={`sticky-bar${showBar ? " show" : ""}`} aria-hidden={!showBar}>
        <div className="wrap">
          <div className="sb-info">
            <img src={item.image} alt="" />
            <div className="sb-text">
              <b>{item.name}</b>
              <span className={`sp${item.regularPrice ? " sale" : ""}`}>
                {item.regularPrice && <span className="so">{rsd(item.regularPrice)}</span>}
                {rsd(item.price)}
              </span>
            </div>
          </div>
          <button className="btn" onClick={() => add(item, qty)} tabIndex={showBar ? 0 : -1}>
            Dodaj u korpu
          </button>
        </div>
      </div>
    </>
  );
}

export function AddButton({ item, className = "btn btn-light" }: { item: Item; className?: string }) {
  const { add } = useCart();
  return (
    <button className={className} onClick={() => add(item, 1)}>
      Dodaj u korpu
    </button>
  );
}
