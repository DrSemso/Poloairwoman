"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MENU, HELP_LINKS, SITE } from "@/lib/site";
import { useCart } from "./CartProvider";
import { IconBag, IconPhone, IconSearch, IconTruck } from "./Icons";
import { num } from "@/lib/format";

function SearchBox({ autoFocus, onDone }: { autoFocus?: boolean; onDone?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      className="sbox"
      onSubmit={(e) => {
        e.preventDefault();
        if (!q.trim()) return;
        router.push(`/pretraga?q=${encodeURIComponent(q.trim())}`);
        onDone?.();
      }}
    >
      <IconSearch />
      <input
        type="search"
        placeholder="Pretraži satove, setove, naočare…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus={autoFocus}
        aria-label="Pretraga"
      />
    </form>
  );
}

export default function Header() {
  const { count, setOpen: setCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <div className="announce">
        Besplatna dostava preko <b>{num(SITE.freeShippingFrom)} RSD</b>
        <span className="hide-m"> · Slanje u roku od 24h · Plaćanje pouzećem</span>
      </div>
      <header className="site-header" ref={headerRef}>
        <div className="wrap nav">
          <div className="nav-left">
            <button className="nav-btn menu-btn" onClick={() => setMenuOpen(true)} aria-label="Otvori meni">
              <span className="hamburger" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </button>
            <button className="nav-btn nav-search-d" onClick={() => setSearchOpen((v) => !v)} aria-expanded={searchOpen}>
              <IconSearch /> <span className="menu-label">Pretraga</span>
            </button>
          </div>
          <Link href="/" className="logo" aria-label="Poloair Woman — početna">
            <img src="/brand/logo.webp" alt="POLO air woman" width={111} height={50} />
          </Link>
          <div className="nav-right">
            <a href={SITE.phoneHref} className="nav-btn nav-search-d" aria-label="Pozovi nas">
              <IconPhone />
            </a>
            <button className="nav-btn" onClick={() => setCartOpen(true)} aria-label={`Korpa, ${count} artikala`}>
              <IconBag />
              <span className="lbl">Korpa</span>
              <span className="cart-count">{count}</span>
            </button>
          </div>
        </div>
        <nav className="mainmenu" aria-label="Glavni meni">
          <ul>
            {MENU.map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className={m.isSale ? "sale" : m.isNew ? "new-dot" : undefined}
                  aria-current={pathname === m.href ? "page" : undefined}
                >
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {searchOpen && (
          <div className="search-pop">
            <div className="wrap">
              <SearchBox autoFocus onDone={() => setSearchOpen(false)} />
            </div>
          </div>
        )}
      </header>

      {/* Mobilni meni */}
      <div className={`overlay${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)} />
      <aside className={`panel left${menuOpen ? " open" : ""}`} aria-label="Meni" aria-hidden={!menuOpen}>
        <div className="panel-head">
          <span className="ttl">Meni</span>
          <button className="panel-close" onClick={() => setMenuOpen(false)} aria-label="Zatvori meni">
            ×
          </button>
        </div>
        <div className="mnav-search">
          <SearchBox onDone={() => setMenuOpen(false)} />
        </div>
        <ul className="mnav-links">
          {MENU.map((m) => (
            <li key={m.href}>
              <Link href={m.href} className={m.isSale ? "sale" : undefined}>
                {m.label}
                {m.isNew ? <span className="tag">NEW</span> : m.isSale ? <span className="badge">% Sniženje</span> : <span className="arr">›</span>}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mnav-promo">
          <IconTruck />
          <span>
            <b>Besplatna dostava</b> za porudžbine preko {num(SITE.freeShippingFrom)} RSD
          </span>
        </div>
        <div className="mnav-foot">
          {HELP_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="mnav-tel">
          <IconPhone />
          <div>
            <small>Pozovi nas</small>
            <a href={SITE.phoneHref}>{SITE.phone}</a>
          </div>
        </div>
      </aside>
    </>
  );
}
