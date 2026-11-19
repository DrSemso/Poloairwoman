import type { NextConfig } from "next";

// Preusmerenja sa starog WooCommerce sajta (čuva SEO i stare linkove)
const CAT: Record<string, string> = {
  "zenski-satovi": "satovi",
  "set-zenski-sat-i-narukvica": "setovi",
  "premium-poklon-set-3-u-1": "pokloni",
  narukvice: "narukvice",
  "zenske-torbice": "torbice",
  "zenski-novcanici": "novcanici",
  "zenske-naocare": "naocare",
  sviproizvodi: "svi-proizvodi",
};
const PAGES: Record<string, string> = {
  "informacije-o-dostavi": "/dostava-i-placanje",
  "zamene-i-reklamacije": "/reklamacije",
  "pravo-na-odustajanje": "/zamena-i-povrat",
  "najcesca-pitanja": "/cesta-pitanja",
  proizvodi: "/kategorija/svi-proizvodi",
  shop: "/kategorija/svi-proizvodi",
  cart: "/korpa",
  checkout: "/korpa",
  "checkout-2": "/korpa",
  "nova-pocetna": "/",
  "my-account": "/",
  wishlist: "/",
};

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/p/poloair-:slug/", destination: "/proizvod/:slug", permanent: true },
      { source: "/p/poloair-:slug", destination: "/proizvod/:slug", permanent: true },
      { source: "/p/:slug/", destination: "/proizvod/:slug", permanent: true },
      { source: "/p/:slug", destination: "/proizvod/:slug", permanent: true },
      ...Object.entries(CAT).flatMap(([from, to]) => [
        { source: `/k/${from}`, destination: `/kategorija/${to}`, permanent: true },
        { source: `/k/${from}/`, destination: `/kategorija/${to}`, permanent: true },
      ]),
      ...Object.entries(PAGES).flatMap(([from, to]) => [
        { source: `/${from}`, destination: to, permanent: true },
        { source: `/${from}/`, destination: to, permanent: true },
      ]),
    ];
  },
  async headers() {
    return [
      { source: "/img/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
    ];
  },
};

export default nextConfig;
