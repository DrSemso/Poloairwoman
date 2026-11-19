import Link from "next/link";
import { PRODUCTS, productsIn, sortProducts } from "@/lib/products";
import { CATEGORIES, FAQ_GENERAL } from "@/lib/site";
import { Faq, FinalCta, InstagramSection, NewsletterSection, ProductGrid } from "@/components/Sections";
import { IconDrop, IconGift, IconReturn, IconSparkle, IconTruck } from "@/components/Icons";

export default function Home() {
  const favorites = [
    ...sortProducts(productsIn("pokloni"), "popularno").slice(0, 2),
    sortProducts(productsIn("setovi"), "popularno")[0],
    productsIn("satovi")[6] ?? productsIn("satovi")[0],
  ];
  const newest = PRODUCTS.filter((p) => !favorites.includes(p)).slice(0, 8);
  // Koji proizvod predstavlja kategoriju na pločici (indeks u listi kategorije)
  const TILE: Record<string, number> = { satovi: 6, novcanici: 1 };
  const tiles = CATEGORIES.map((c) => {
    const list = productsIn(c.slug);
    return { c, img: (list[TILE[c.slug] ?? 0] ?? list[0])?.images[0], n: list.length };
  }).filter((t) => t.img);

  return (
    <>
      <section className="hero">
        <img className="hero-bg hero-bg-desktop" src="/brand/hero.webp" alt="" fetchPriority="high" />
        <img className="hero-bg-mobile" src="/brand/hero-mobile.webp" alt="" fetchPriority="high" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="wrap">
            <div className="hero-text">
              <span className="eyebrow">Najprodavaniji — Premium set</span>
              <h1>
                Detalj koji menja
                <br />
                celu kombinaciju
              </h1>
              <p className="lead">Sat, narukvica i ogrlica — usklađeni, već upakovani za poklon. Luksuzan izgled, po ceni koja prija.</p>
              <Link href="/kategorija/pokloni" className="btn">
                Pogledaj setove
              </Link>
              <p className="hero-note">Dostava u celoj Srbiji · plaćanje pouzećem</p>
            </div>
          </div>
        </div>
      </section>

      <div className="microtrust">
        <div className="wrap">
          {[
            { i: <IconReturn />, t: "Zamena ili povrat u 14 dana", s: "Kupovina bez stresa" },
            { i: <IconDrop />, t: "Nežno prema koži", s: "Ne menja boju, prijatno za nošenje" },
            { i: <IconTruck />, t: "Slanje u roku od 24h", s: "Plaćanje pouzećem" },
            { i: <IconGift />, t: "Besplatno poklon-pakovanje", s: "Spremno za poklon" },
          ].map((x) => (
            <div className="mt-item" key={x.t}>
              <span className="tic">{x.i}</span>
              <span>
                {x.t}
                <small>{x.s}</small>
              </span>
            </div>
          ))}
        </div>
      </div>

      <section className="sec">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow pink">Omiljeno među kupcima</span>
            <h2>Ono što naše kupkinje najviše biraju</h2>
            <p className="lead">Provereni favoriti — već upakovani za poklon.</p>
          </div>
          <ProductGrid products={favorites} />
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/kategorija/svi-proizvodi" className="btn btn-outline">
              Pogledaj sve proizvode
            </Link>
          </div>
        </div>
      </section>

      <div className="dual">
        <Link href="/kategorija/satovi" className="dpanel">
          <img src="/brand/lifestyle-satovi.webp" alt="Ženski sat sa zelenim brojčanikom" loading="lazy" />
          <div className="dcontent">
            <h2>Satovi</h2>
            <span className="btn btn-light">Istraži</span>
          </div>
        </Link>
        <Link href="/kategorija/setovi" className="dpanel">
          <img src="/brand/lifestyle-setovi.webp" alt="Set sat i narukvica" loading="lazy" />
          <div className="dcontent">
            <h2>Setovi &amp; aksesoari</h2>
            <span className="btn btn-light">Istraži</span>
          </div>
        </Link>
      </div>

      <section className="sec">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow pink">Tek stiglo</span>
            <h2>Novo u ponudi</h2>
          </div>
          <ProductGrid products={newest} />
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link href="/kategorija/novo" className="btn btn-outline">
              Pogledaj sve novitete
            </Link>
          </div>
        </div>
      </section>

      <section className="sec cream">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Kolekcija</span>
            <h2>Pronađi svoj komad</h2>
          </div>
          <div className="cat-tiles">
            {tiles.map(({ c, img, n }) => (
              <Link href={`/kategorija/${c.slug}`} className="cat-tile" key={c.slug}>
                <div className="ci">
                  <img src={img} alt={c.title} loading="lazy" />
                </div>
                <span>{c.name}</span>
                <small>{n} {n === 1 ? "model" : "modela"}</small>
              </Link>
            ))}
            <Link href="/kategorija/akcije" className="cat-tile">
              <div className="ci" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--pink-pale)" }}>
                <span style={{ fontFamily: "var(--serif)", fontSize: 44, color: "var(--pink)", border: "none", letterSpacing: 0 }}>%</span>
              </div>
              <span style={{ color: "var(--pink)" }}>Akcije</span>
              <small>Snižene cene</small>
            </Link>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow pink">Polo Air — međunarodni brend</span>
            <h2>Brend kome žene veruju</h2>
            <p className="lead">Stil nije luksuz — pravo je svake žene.</p>
          </div>
          <div className="why-grid">
            <div className="why-item">
              <div className="tic">
                <IconSparkle />
              </div>
              <h3>Izgleda skuplje nego što košta</h3>
              <p>Pažljivo birani modeli sa detaljima koji privlače poglede — premium utisak, po ceni koja prija.</p>
            </div>
            <div className="why-item">
              <div className="tic">
                <IconDrop />
              </div>
              <h3>Nežno prema koži</h3>
              <p>Hipoalergenski materijali sa kvalitetnom pozlatom — ne tamne i prijaju i osetljivoj koži.</p>
            </div>
            <div className="why-item">
              <div className="tic">
                <IconGift />
              </div>
              <h3>Spremno za poklon</h3>
              <p>Svaki komad stiže u elegantnoj poklon-kutiji — kao nagrada sebi ili poklon dragoj osobi.</p>
            </div>
          </div>
        </div>
      </section>

      <InstagramSection />
      <NewsletterSection />
      <Faq items={FAQ_GENERAL} />
      <FinalCta
        title={
          <>
            Tvoj novi omiljeni komad
            <br />
            te već čeka
          </>
        }
      />
    </>
  );
}
