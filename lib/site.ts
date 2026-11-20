export const SITE = {
  name: "Poloair Woman",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://poloairwoman.rs",
  phone: "+381 64 533-4370",
  phoneHref: "tel:+381645334370",
  viberHref: "viber://chat?number=%2B381645334370",
  email: "info@poloairwoman.rs",
  instagram: "https://www.instagram.com/poloairwoman/",
  instagramHandle: "@poloairwoman",
  /** Cena dostave ispod praga za besplatnu dostavu (RSD). */
  shippingPrice: 400,
  /** Prag za besplatnu dostavu (RSD). */
  freeShippingFrom: 5500,
  courier: "Post Express",
};

export type Category = {
  slug: string;
  name: string; // naziv u meniju
  title: string; // H1 na stranici kategorije
  description: string;
  singular: string; // "sat", "set"... za tekstove
};

export const CATEGORIES: Category[] = [
  {
    slug: "satovi",
    name: "Satovi",
    title: "Ženski satovi",
    description: "Elegantni satovi za svaki dan — diskretan luksuz koji upotpunjuje svaku kombinaciju.",
    singular: "sat",
  },
  {
    slug: "setovi",
    name: "Setovi",
    title: "Setovi — sat i narukvica",
    description: "Sat i narukvica usklađeni do detalja. Spremni za poklon, po ceni koja prija.",
    singular: "set",
  },
  {
    slug: "narukvice",
    name: "Narukvice",
    title: "Narukvice",
    description: "Nežne narukvice koje sijaju same ili uz omiljeni sat.",
    singular: "narukvica",
  },
  {
    slug: "torbice",
    name: "Torbice",
    title: "Ženske torbice",
    description: "Kompaktne torbice u bojama koje osvežavaju svaku kombinaciju.",
    singular: "torbica",
  },
  {
    slug: "novcanici",
    name: "Novčanici",
    title: "Ženski novčanici",
    description: "Praktični novčanici u elegantnim tonovima — mesto za sve, a lepo izgleda.",
    singular: "novčanik",
  },
  {
    slug: "naocare",
    name: "Naočare",
    title: "Ženske naočare za sunce",
    description: "Naočare za sunce koje upotpunjuju stil — od klasičnih do modernih oblika.",
    singular: "naočare",
  },
  {
    slug: "pokloni",
    name: "Pokloni",
    title: "Premium poklon setovi",
    description: "Sat, narukvica i ogrlica — usklađeni i već upakovani u poklon-kutiju. Poklon koji se pamti.",
    singular: "set",
  },
];

/** Posebne kolekcije (nisu kategorije u bazi). */
export const COLLECTIONS: Category[] = [
  {
    slug: "novo",
    name: "Novo",
    title: "Novo u ponudi",
    description: "Najnoviji modeli satova, setova i aksesoara — tek stigli.",
    singular: "komad",
  },
  {
    slug: "akcije",
    name: "Akcije",
    title: "Akcije",
    description: "Omiljeni komadi po sniženoj ceni — dok traju zalihe.",
    singular: "komad",
  },
  {
    slug: "svi-proizvodi",
    name: "Svi proizvodi",
    title: "Svi proizvodi",
    description: "Cela kolekcija Poloair Woman — satovi, setovi i aksesoari na jednom mestu.",
    singular: "komad",
  },
];

export const MENU = [
  { href: "/kategorija/novo", label: "Novo", isNew: true },
  { href: "/kategorija/satovi", label: "Satovi" },
  { href: "/kategorija/setovi", label: "Setovi" },
  { href: "/kategorija/narukvice", label: "Narukvice" },
  { href: "/kategorija/torbice", label: "Torbice" },
  { href: "/kategorija/novcanici", label: "Novčanici" },
  { href: "/kategorija/naocare", label: "Naočare" },
  { href: "/kategorija/pokloni", label: "Pokloni" },
  { href: "/kategorija/akcije", label: "Akcije", isSale: true },
];

export const HELP_LINKS = [
  { href: "/dostava-i-placanje", label: "Dostava i plaćanje" },
  { href: "/zamena-i-povrat", label: "Zamena i povrat" },
  { href: "/reklamacije", label: "Reklamacije" },
  { href: "/cesta-pitanja", label: "Česta pitanja" },
  { href: "/kontakt", label: "Kontakt" },
];

export const FAQ_GENERAL = [
  {
    q: "Da li nakit menja boju ili izaziva alergiju?",
    a: "Ne. Koristimo hipoalergenske materijale sa kvalitetnom pozlatom — ne tamne, ne ostavljaju zelene tragove i prijaju i osetljivoj koži.",
  },
  {
    q: "Kako i kada plaćam?",
    a: "Plaćaš pouzećem — prvo preuzmeš paket od kurira, pa onda platiš. Bez avansa, bez rizika.",
  },
  {
    q: "Koliko traje dostava?",
    a: `Šaljemo u roku od 24h, a paket najčešće stiže za 1–2 radna dana, u celoj Srbiji. Besplatna dostava za porudžbine preko ${SITE.freeShippingFrom.toLocaleString("sr-RS")} RSD.`,
  },
  {
    q: "Kako šaljete paket?",
    a: `Paket šaljemo ${SITE.courier}om. Možeš ga preuzeti u roku od 5 dana od dostave.`,
  },
  {
    q: "Šta ako mi se ne svidi ili ne odgovara?",
    a: "Imaš 14 dana za laku zamenu ili povrat novca. Bez objašnjavanja i bez komplikacija.",
  },
  {
    q: "Da li stiže upakovano za poklon?",
    a: "Da — svaki komad stiže u elegantnoj poklon-kutiji, spreman za darivanje.",
  },
];
