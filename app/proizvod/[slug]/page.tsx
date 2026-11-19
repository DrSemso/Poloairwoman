import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PRODUCTS, discountPct, getCategory, getProduct, related } from "@/lib/products";
import { FAQ_GENERAL, SITE } from "@/lib/site";
import { rsd } from "@/lib/format";
import Gallery from "@/components/Gallery";
import BuyBox, { AddButton } from "@/components/BuyBox";
import { Faq, NewsletterSection, ProductGrid } from "@/components/Sections";
import { IconCash, IconDrop, IconGift, IconReturn, IconShield, IconSparkle, IconTruck, IconPhone } from "@/components/Icons";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.summary.slice(0, 140)} Cena ${rsd(p.price)}. Plaćanje pouzećem.`,
    alternates: { canonical: `/proizvod/${p.slug}` },
    openGraph: { images: [p.images[0]], title: p.name },
  };
}

const JEWELRY = ["satovi", "setovi", "pokloni", "narukvice"];

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = getCategory(p.category)!;
  const pct = discountPct(p);
  const item = { slug: p.slug, name: p.name, price: p.price, regularPrice: p.regularPrice, image: p.images[0] };
  const jewelry = JEWELRY.includes(p.category);

  const benefits = jewelry
    ? [
        { i: <IconSparkle />, t: "Izgleda skuplje nego što košta", d: "Detalji koji privlače poglede i komplimente — premium utisak, bez griže savesti zbog cene." },
        { i: <IconDrop />, t: "Nežno prema koži", d: "Hipoalergenski materijali koji ne tamne i ne ostavljaju zelene tragove — nosiš bez brige." },
        { i: <IconGift />, t: "Spremno za poklon", d: "Stiže u elegantnoj POLO air kutiji — savršeno kao nagrada sebi ili poklon dragoj osobi." },
      ]
    : [
        { i: <IconSparkle />, t: "Pažljivo birano", d: "Modeli koji se lako uklapaju uz svaki stil — od svakodnevnih obaveza do posebnih prilika." },
        { i: <IconShield />, t: "Kvalitetna izrada", d: "Pažnja na materijalima i završnoj obradi, da komad dugo izgleda kao nov." },
        { i: <IconGift />, t: "Lep poklon", d: "Lepo upakovano i spremno za darivanje — uz sat ili set, poklon je kompletan." },
      ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      image: p.images.map((i) => `${SITE.url}${i}`),
      description: p.summary,
      brand: { "@type": "Brand", name: "Polo Air" },
      category: cat.title,
      offers: {
        "@type": "Offer",
        url: `${SITE.url}/proizvod/${p.slug}`,
        priceCurrency: "RSD",
        price: p.price,
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: "Poloair Woman" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Početna", item: `${SITE.url}/` },
        { "@type": "ListItem", position: 2, name: cat.name, item: `${SITE.url}/kategorija/${cat.slug}` },
        { "@type": "ListItem", position: 3, name: p.name, item: `${SITE.url}/proizvod/${p.slug}` },
      ],
    },
  ];

  return (
    <>
      <div className="wrap pdp-top">
        <nav className="crumb" aria-label="Putanja">
          <Link href="/">Početna</Link>
          <span className="sep">/</span>
          <Link href={`/kategorija/${cat.slug}`}>{cat.name}</Link>
          <span className="sep">/</span>
          {p.name}
        </nav>
        <div className="pdp-grid">
          <Gallery images={p.images} name={p.name} badge={pct ? `−${pct}%` : undefined} />
          <div className="buy pdp-sticky">
            <p className="brand">POLO air woman</p>
            <h1>{p.name}</h1>
            <div className="bprice">
              {p.regularPrice && <span className="old">{rsd(p.regularPrice)}</span>}
              <span className={`now${p.regularPrice ? " sale" : ""}`}>{rsd(p.price)}</span>
              {p.regularPrice && <span className="save">Uštedi {rsd(p.regularPrice - p.price)}</span>}
            </div>
            <p className="vat">Cena sa PDV-om</p>
            {p.summary && <p className="sub">{p.summary.length > 200 ? `${p.summary.slice(0, p.summary.lastIndexOf(" ", 200))}…` : p.summary}</p>}
            <BuyBox item={item} />
            <div className="b-trust">
              <span>
                <IconTruck /> Slanje u roku od 24h · stiže za 1–2 radna dana
              </span>
              <span>
                <IconCash /> Plaćanje pouzećem — prvo proveri, pa plati
              </span>
              <span>
                <IconReturn /> 14 dana za laku zamenu ili povrat
              </span>
              <span>
                <IconGift /> Stiže u POLO air poklon-kutiji
              </span>
            </div>
            <p className="b-help">
              Pitanje o ovom modelu? Pozovi ili piši na Viber:{" "}
              <a href={SITE.phoneHref}>
                <IconPhone width={13} height={13} style={{ display: "inline", verticalAlign: "-1px" }} /> {SITE.phone}
              </a>
            </p>
          </div>
        </div>
      </div>

      <section className="sec cream">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Zašto ćeš ga zavoleti</span>
            <h2>Lep detalj koji ostaje lep</h2>
          </div>
          <div className="why-grid">
            {benefits.map((b) => (
              <div className="why-item" key={b.t}>
                <div className="tic">{b.i}</div>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap details">
          <div className="section-head">
            <span className="eyebrow">Detalji</span>
            <h2>Opis i informacije</h2>
          </div>
          <details className="acc" open>
            <summary>
              Opis proizvoda
              <i aria-hidden />
            </summary>
            <div className="acc-body desc-body">
              {p.description ? <div dangerouslySetInnerHTML={{ __html: p.description }} /> : <p>{cat.description}</p>}
              <table className="spec" style={{ marginTop: 18 }}>
                <tbody>
                  <tr>
                    <td>Kategorija</td>
                    <td>{cat.title}</td>
                  </tr>
                  <tr>
                    <td>Brend</td>
                    <td>POLO air</td>
                  </tr>
                  <tr>
                    <td>Pakovanje</td>
                    <td>Poklon-kutija</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </details>
          {jewelry && (
            <details className="acc">
              <summary>
                Materijal i nega
                <i aria-hidden />
              </summary>
              <div className="acc-body">
                <p>Hipoalergenski materijali sa kvalitetnom pozlatom — ne tamne, ne ostavljaju zelene tragove i prijaju i osetljivoj koži. Da bi dugo sijao, čuvaj ga u kutiji i izbegavaj kontakt sa parfemom i kremama.</p>
              </div>
            </details>
          )}
          <details className="acc">
            <summary>
              Dostava i plaćanje
              <i aria-hidden />
            </summary>
            <div className="acc-body">
              <p>
                Šaljemo u roku od 24h, paket stiže za 1–2 radna dana u celoj Srbiji. Plaćaš pouzećem — prvo preuzmeš, pa platiš kuriru. Dostava {rsd(SITE.shippingPrice)}, a besplatna za
                porudžbine preko {rsd(SITE.freeShippingFrom)}.
              </p>
            </div>
          </details>
          <details className="acc">
            <summary>
              Zamena i povrat
              <i aria-hidden />
            </summary>
            <div className="acc-body">
              <p>
                Imaš 14 dana za laku zamenu ili povrat novca, bez objašnjavanja. Detalji na stranici <Link href="/zamena-i-povrat" className="link-pink">Zamena i povrat</Link>.
              </p>
            </div>
          </details>
        </div>
      </section>

      <section className="sec cream">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Savršen par</span>
            <h2>Možda će ti se dopasti i</h2>
          </div>
          <ProductGrid products={related(p)} />
        </div>
      </section>

      <Faq items={FAQ_GENERAL.slice(0, 5)} title="Pre nego što naručiš" />

      <section className="sec finalcta dark">
        <div className="wrap">
          <span className="eyebrow">Naruči sa sigurnošću</span>
          <h2>Tvoj novi omiljeni komad te čeka</h2>
          <div className="fcta-points">
            <span>
              <IconCash /> Prvo preuzmi, pa plati pouzećem
            </span>
            <span>
              <IconReturn /> 14 dana za zamenu ili povrat
            </span>
            <span>
              <IconGift /> Stiže u poklon-kutiji
            </span>
          </div>
          <AddButton item={item} />
        </div>
      </section>
      <NewsletterSection />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
