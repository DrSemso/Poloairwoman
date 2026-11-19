import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import CartDrawer, { type Suggestion } from "@/components/CartDrawer";
import { Footer } from "@/components/Sections";
import { PRODUCTS } from "@/lib/products";
import { SITE } from "@/lib/site";

const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Poloair Woman — ženski satovi, setovi i aksesoari",
    template: "%s · Poloair Woman",
  },
  description:
    "Ženski satovi, setovi sat i narukvica, premium poklon setovi, naočare i novčanici. Slanje u roku od 24h, plaćanje pouzećem, 14 dana za zamenu ili povrat.",
  openGraph: { siteName: "Poloair Woman", locale: "sr_RS", type: "website", images: ["/brand/hero.webp"] },
  alternates: { canonical: "/" },
  robots: process.env.NEXT_PUBLIC_NOINDEX === "1" ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };

// Predlozi za "Dodaj i ovo" u korpi: pristupačni komadi iz drugih kategorija
const suggestions: Suggestion[] = PRODUCTS.filter((p) => ["narukvice", "novcanici", "naocare"].includes(p.category))
  .sort((a, b) => a.price - b.price)
  .slice(0, 6)
  .map((p) => ({ slug: p.slug, name: p.name, price: p.price, regularPrice: p.regularPrice, image: p.images[0] }));

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: "Poloair Woman",
  url: SITE.url,
  logo: `${SITE.url}/brand/logo.webp`,
  email: SITE.email,
  telephone: SITE.phone.replace(/[\s-]/g, ""),
  sameAs: [SITE.instagram],
  address: { "@type": "PostalAddress", addressCountry: "RS" },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE.url}/pretraga?q={q}`,
    "query-input": "required name=q",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr-Latn-RS" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer suggestions={suggestions} />
        </CartProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
