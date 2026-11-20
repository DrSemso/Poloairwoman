import Link from "next/link";
import { CATEGORIES, HELP_LINKS, SITE } from "@/lib/site";
import { type Product, discountPct } from "@/lib/products";
import { rsd } from "@/lib/format";
import { IconCash, IconGift, IconInstagram, IconMail, IconPhone, IconReturn, IconTruck } from "./Icons";
import Newsletter from "./Newsletter";

export function ProductCard({ p, priority }: { p: Product; priority?: boolean }) {
  const pct = discountPct(p);
  return (
    <article className="pcard">
      <div className="pimg">
        <img src={p.images[0]} alt={p.name} loading={priority ? "eager" : "lazy"} width={600} height={600} />
        {p.images[1] && <img className="alt" src={p.images[1]} alt="" loading="lazy" width={600} height={600} />}
        <div className="pbadges">
          {pct > 0 && <span className="pbadge sale">−{pct}%</span>}
          {p.isNew && <span className="pbadge">Novo</span>}
          {!p.inStock && <span className="pbadge" style={{ background: "#707070" }}>Rasprodato</span>}
        </div>
      </div>
      <h3>
        <Link href={`/proizvod/${p.slug}`}>{p.name}</Link>
      </h3>
      <div className="price">
        {p.regularPrice && <span className="old">{rsd(p.regularPrice)}</span>}
        <span className={`now${p.regularPrice ? " sale" : ""}`}>{rsd(p.price)}</span>
      </div>
    </article>
  );
}

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <div className="prod-grid">
      {products.map((p, i) => (
        <ProductCard key={p.id} p={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}

export function Faq({ items, title = "Sve što te zanima pre kupovine", eyebrow = "Česta pitanja" }: { items: { q: string; a: string }[]; title?: string; eyebrow?: string }) {
  return (
    <section className="sec">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <div className="faq-list">
          {items.map((f) => (
            <details className="acc" key={f.q}>
              <summary>
                {f.q}
                <i aria-hidden />
              </summary>
              <div className="acc-body">
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta({ title, href = "/kategorija/svi-proizvodi", cta = "Pogledaj celu kolekciju", dark }: { title: React.ReactNode; href?: string; cta?: string; dark?: boolean }) {
  return (
    <section className={`sec finalcta${dark ? " dark" : " cream"}`}>
      <div className="wrap">
        <span className="eyebrow">Naruči sa sigurnošću</span>
        <h2>{title}</h2>
        <div className="fcta-points">
          <span>
            <IconCash /> Prvo preuzmi, pa plati pouzećem
          </span>
          <span>
            <IconReturn /> 14 dana za zamenu ili povrat
          </span>
          <span>
            <IconTruck /> Slanje u roku od 24h
          </span>
        </div>
        <Link href={href} className={`btn${dark ? " btn-light" : ""}`}>
          {cta}
        </Link>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section className="sec news">
      <div className="wrap">
        <span className="eyebrow">Budi prva</span>
        <h2>Novi modeli i akcije — pre svih</h2>
        <p className="lead">Prijavi se i javljamo ti kad stignu novi modeli, akcije i pokloni.</p>
        <Newsletter />
      </div>
    </section>
  );
}

export function InstagramSection() {
  return (
    <section className="sec insta cream">
      <div className="wrap">
        <span className="eyebrow">Iz zajednice</span>
        <h2>Pogledaj kako ih nose naše kupkinje</h2>
        <a className="ig-handle" href={SITE.instagram} target="_blank" rel="noopener">
          <IconInstagram /> {SITE.instagramHandle}
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link href="/" className="foot-logo" aria-label="Početna">
              <img src="/brand/logo.webp" alt="POLO air woman" width={97} height={44} />
            </Link>
            <p>Ženski satovi, setovi i aksesoari. Pažljivo birano, po ceni koja prija. Dostava u celoj Srbiji.</p>
            <div className="pay">
              <span>Plaćanje pouzećem</span>
              <span>Brza dostava</span>
              <span>14 dana povrat</span>
            </div>
          </div>
          <div>
            <h4>Kupovina</h4>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/kategorija/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/kategorija/akcije">Akcije</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Pomoć</h4>
            <ul>
              {HELP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/o-nama">O nama</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Kontakt</h4>
            <ul>
              <li>
                <a href={SITE.phoneHref}>
                  <IconPhone width={14} height={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={SITE.viberHref}>Viber podrška</a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`}>
                  <IconMail width={14} height={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.instagram} target="_blank" rel="noopener">
                  <IconInstagram width={14} height={14} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
                  Instagram {SITE.instagramHandle}
                </a>
              </li>
              <li>Srbija</li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Poloair Woman · Sva prava zadržana</span>
          <span>
            <Link href="/uslovi-koriscenja">Uslovi korišćenja</Link> · <Link href="/politika-privatnosti">Politika privatnosti</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

export function TrustLine() {
  return (
    <div className="cat-trust">
      <span>
        <IconReturn /> 14 dana za zamenu ili povrat
      </span>
      <span>
        <IconTruck /> Slanje u roku od 24h · plaćanje pouzećem
      </span>
      <span>
        <IconGift /> Stiže upakovano za poklon
      </span>
    </div>
  );
}
