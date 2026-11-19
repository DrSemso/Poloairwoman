import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PAGES, getPage } from "@/lib/pages";
import { SITE } from "@/lib/site";
import { IconInstagram, IconMail, IconPhone } from "@/components/Icons";

type Props = { params: Promise<{ page: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return PAGES.map((p) => ({ page: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const p = getPage(page);
  if (!p) return {};
  return { title: p.title, description: p.description, alternates: { canonical: `/${p.slug}` } };
}

export default async function InfoPage({ params }: Props) {
  const { page } = await params;
  const p = getPage(page);
  if (!p) notFound();
  return (
    <div className="wrap info-page">
      <div className="prose">
        <h1>{p.title}</h1>
        {p.slug === "kontakt" ? (
          <>
            <p style={{ textAlign: "center" }} className="lead">
              Tu smo za svako pitanje — o modelu, porudžbini ili poklonu. Najbrže odgovaramo na Viberu i Instagramu.
            </p>
            <div className="contact-cards">
              <a className="contact-card" href={SITE.phoneHref}>
                <div className="tic">
                  <IconPhone />
                </div>
                <b>Telefon i Viber</b>
                <span>{SITE.phone}</span>
              </a>
              <a className="contact-card" href={`mailto:${SITE.email}`}>
                <div className="tic">
                  <IconMail />
                </div>
                <b>Email</b>
                <span>{SITE.email}</span>
              </a>
              <a className="contact-card" href={SITE.instagram} target="_blank" rel="noopener">
                <div className="tic">
                  <IconInstagram />
                </div>
                <b>Instagram</b>
                <span>{SITE.instagramHandle}</span>
              </a>
            </div>
          </>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: p.html }} />
        )}
      </div>
    </div>
  );
}
