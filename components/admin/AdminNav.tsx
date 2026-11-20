"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const ITEMS = [
  { href: "/admin", label: "Pregled" },
  { href: "/admin/porudzbine", label: "Porudžbine" },
  { href: "/admin/proizvodi", label: "Proizvodi" },
  { href: "/admin/newsletter", label: "Newsletter" },
];

export default function AdminNav({ email, newOrders }: { email: string; newOrders: number }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => (href === "/admin" ? path === href : path.startsWith(href));
  return (
    <aside className="adm-nav">
      <div className="adm-nav-top">
        <Link href="/admin" className="adm-brand">
          <img src="/brand/logo.webp" alt="" width={66} height={30} />
          <span>admin</span>
        </Link>
        <button className="adm-burger" aria-label="Meni" onClick={() => setOpen((o) => !o)}>
          ☰
        </button>
      </div>
      <nav className={open ? "open" : ""}>
        <ul>
          {ITEMS.map((i) => (
            <li key={i.href}>
              <Link href={i.href} onClick={() => setOpen(false)} className={active(i.href) ? "on" : ""}>
                {i.label}
                {i.href === "/admin/porudzbine" && newOrders > 0 && <span className="adm-badge">{newOrders}</span>}
              </Link>
            </li>
          ))}
        </ul>
        <div className="adm-nav-foot">
          <Link href="/" target="_blank">
            Otvori prodavnicu ↗
          </Link>
          <p>{email}</p>
          <form action="/admin/odjava" method="post">
            <button>Odjava</button>
          </form>
        </div>
      </nav>
    </aside>
  );
}
