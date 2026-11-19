import Link from "next/link";
import type { Metadata } from "next";
import { IconCheck } from "@/components/Icons";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Hvala na porudžbini", robots: { index: false } };

export default async function Thanks({ searchParams }: { searchParams: Promise<{ broj?: string }> }) {
  const { broj } = await searchParams;
  return (
    <div className="wrap thanks">
      <div className="tic">
        <IconCheck />
      </div>
      <h1>Hvala na porudžbini!</h1>
      <p className="lead">Primili smo tvoju porudžbinu. Javićemo ti se telefonom ili porukom da potvrdimo, a paket šaljemo u roku od 24h.</p>
      {broj && <div className="ordno">Broj porudžbine: {broj}</div>}
      <p className="muted" style={{ fontSize: 14, marginBottom: 28 }}>
        Plaćaš pouzećem, kad ti kurir donese paket. Pitanja? Pozovi ili piši na Viber: <a href={SITE.phoneHref} className="link-pink">{SITE.phone}</a>
      </p>
      <Link href="/" className="btn">
        Nazad na početnu
      </Link>
    </div>
  );
}
