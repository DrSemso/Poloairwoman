import { FAQ_GENERAL, SITE } from "./site";

const fs = SITE.freeShippingFrom.toLocaleString("sr-RS");
const sp = SITE.shippingPrice.toLocaleString("sr-RS");

export type InfoPage = { slug: string; title: string; description: string; html: string };

const contactLine = `<p>Telefon i Viber: <a href="${SITE.phoneHref}">${SITE.phone}</a> · Email: <a href="mailto:${SITE.email}">${SITE.email}</a> · Instagram: <a href="${SITE.instagram}" target="_blank" rel="noopener">${SITE.instagramHandle}</a></p>`;

export const PAGES: InfoPage[] = [
  {
    slug: "dostava-i-placanje",
    title: "Dostava i plaćanje",
    description: "Slanje u roku od 24h, dostava u celoj Srbiji i plaćanje pouzećem.",
    html: `
<h2>Plaćanje pouzećem</h2>
<p>Plaćaš gotovinom kuriru u trenutku preuzimanja paketa. Bez plaćanja unapred i bez rizika — prvo preuzmeš, pa platiš.</p>
<h2>Rok isporuke</h2>
<p>Porudžbine šaljemo u roku od 24h (radnim danima). Paket najčešće stiže za 1–2 radna dana, u celoj Srbiji. Isporuka može kasniti zbog praznika ili vanrednih okolnosti — u tom slučaju te obaveštavamo.</p>
<h2>Cena dostave</h2>
<ul>
<li>Dostava: <strong>${sp} RSD</strong></li>
<li><strong>Besplatna dostava</strong> za porudžbine preko ${fs} RSD</li>
</ul>
<h2>Kurirska služba</h2>
<p>Pakete šaljemo ${SITE.courier}om. Ako te kurir ne zatekne, paket možeš preuzeti u roku od 5 dana od dostave.</p>
<h2>Pitanja</h2>
${contactLine}`,
  },
  {
    slug: "zamena-i-povrat",
    title: "Zamena i povrat",
    description: "Imaš 14 dana za zamenu ili povrat novca, bez objašnjavanja.",
    html: `
<p>Želimo da budeš potpuno zadovoljna kupovinom. Ako ti komad ne odgovara, imaš <strong>14 dana od prijema paketa</strong> da ga zameniš ili vratiš, bez navođenja razloga.</p>
<h2>Kako da zameniš ili vratiš proizvod</h2>
<ul>
<li>Javi nam se telefonom, Viberom, emailom ili na Instagramu i navedi ime i prezime, broj porudžbine i proizvod.</li>
<li>Vrati proizvod nenošen, neoštećen, u originalnom pakovanju i sa svim etiketama i dodacima.</li>
<li>Po prijemu i proveri proizvoda šaljemo zamenu ili vraćamo novac najkasnije u roku od 14 dana.</li>
</ul>
<h2>Troškovi povratne pošiljke</h2>
<p>Troškove povratne pošiljke snosi kupac, osim kada je greška sa naše strane (pogrešan ili oštećen proizvod).</p>
<h2>Kada zamena ili povrat nisu mogući</h2>
<ul>
<li>proizvod je nošen ili korišćen,</li>
<li>proizvod je oštećen neadekvatnim korišćenjem,</li>
<li>proizvod je vraćen bez originalnog pakovanja i etiketa.</li>
</ul>
<p>Za proizvode sa greškom pogledaj stranicu <a href="/reklamacije">Reklamacije</a>.</p>
${contactLine}`,
  },
  {
    slug: "reklamacije",
    title: "Reklamacije",
    description: "Kako da prijaviš pogrešan, oštećen ili neispravan proizvod.",
    html: `
<p>Trudimo se da svaki proizvod stigne ispravan i lepo upakovan. Ako ipak nešto nije u redu, pomoći ćemo ti brzo.</p>
<h2>Kada možeš da podneseš reklamaciju</h2>
<ul>
<li>stigao je pogrešan proizvod,</li>
<li>proizvod je oštećen tokom transporta,</li>
<li>uočila si fabrički nedostatak.</li>
</ul>
<p>Reklamaciju možeš podneti u skladu sa Zakonom o zaštiti potrošača Republike Srbije. Preporučujemo da nam se javiš odmah po prijemu paketa.</p>
<h2>Kako da podneseš reklamaciju</h2>
<p>Pošalji nam poruku sa sledećim podacima:</p>
<ul>
<li>ime i prezime i broj porudžbine,</li>
<li>naziv proizvoda,</li>
<li>opis problema i fotografije proizvoda.</li>
</ul>
<p>Javićemo ti se u najkraćem roku sa daljim koracima. Kada je greška sa naše strane, troškove slanja snosimo mi.</p>
${contactLine}`,
  },
  {
    slug: "cesta-pitanja",
    title: "Česta pitanja",
    description: "Odgovori na najčešća pitanja o plaćanju, dostavi, zameni i proizvodima.",
    html:
      FAQ_GENERAL.map((f) => `<h2>${f.q}</h2><p>${f.a}</p>`).join("") +
      `<h2>Da li je potrebna registracija?</h2><p>Ne. Poručuješ bez naloga — dovoljno je da uneseš podatke za dostavu.</p>
<h2>Kako da vas kontaktiram?</h2>${contactLine}`,
  },
  {
    slug: "kontakt",
    title: "Kontakt",
    description: "Pozovi nas, piši na Viber, email ili Instagram.",
    html: "",
  },
  {
    slug: "o-nama",
    title: "O nama",
    description: "Poloair Woman — ženski satovi, setovi i aksesoari sa potpisom elegancije.",
    html: `
<p>Poloair Woman je nastao iz ideje da elegancija nikada ne izlazi iz mode. Verujemo u bezvremenski stil, kvalitetne materijale i pažljivo odabrane detalje koji čine razliku.</p>
<p>U našoj ponudi pronaći ćeš pažljivo birane satove, setove i modne dodatke koji se lako uklapaju u različite stilove i prilike — od svakodnevnih obaveza do posebnih trenutaka. Svaki komad biramo sa posebnom pažnjom, vodeći se idejom da pravi stil ne mora biti upadljiv, već prepoznatljiv.</p>
<p>Poloair Woman je za žene koje cene jednostavnost, eleganciju i kvalitet. Naš cilj nije samo prodaja, već poverenje i dugoročan odnos sa kupcima — zato je kupovina kod nas jednostavna i sigurna: plaćaš pouzećem, a imaš 14 dana za zamenu ili povrat.</p>
<p>Dobrodošla u Poloair Woman — mesto gde se stil, kvalitet i elegancija susreću.</p>`,
  },
  {
    slug: "uslovi-koriscenja",
    title: "Uslovi korišćenja",
    description: "Uslovi korišćenja internet prodavnice Poloair Woman.",
    html: `
<p>Korišćenjem sajta ${SITE.url.replace("https://", "")} prihvataš ove uslove korišćenja.</p>
<h2>Opšte informacije</h2>
<p>Sajt Poloair Woman namenjen je prezentaciji i prodaji proizvoda putem interneta. Zadržavamo pravo izmene sadržaja sajta, ponude, cena i ovih uslova.</p>
<h2>Cene i dostupnost</h2>
<p>Sve cene su izražene u dinarima (RSD) i uključuju PDV. Proizvodi su dostupni do isteka zaliha. Trudimo se da svi podaci budu tačni; u slučaju greške u ceni ili opisu, kontaktiraćemo te pre slanja.</p>
<h2>Poručivanje</h2>
<p>Porudžbina se šalje popunjavanjem forme na sajtu. Nakon porudžbine kontaktiramo te radi potvrde. Zadržavamo pravo da odbijemo porudžbinu u slučaju tehničke greške ili sumnje na zloupotrebu.</p>
<h2>Plaćanje i isporuka</h2>
<p>Plaćanje se vrši isključivo pouzećem, kuriru pri preuzimanju. Uslovi dostave su opisani na stranici <a href="/dostava-i-placanje">Dostava i plaćanje</a>.</p>
<h2>Odustanak od ugovora</h2>
<p>Imaš pravo da odustaneš od kupovine u roku od 14 dana od prijema, bez navođenja razloga. Detalji su na stranici <a href="/zamena-i-povrat">Zamena i povrat</a>.</p>
<h2>Intelektualna svojina</h2>
<p>Sadržaj sajta (tekstovi, fotografije, logo i dizajn) zaštićen je i ne sme se koristiti bez pisane saglasnosti.</p>
<h2>Završne odredbe</h2>
<p>Na ove uslove primenjuju se zakoni Republike Srbije. U slučaju spora nadležan je stvarno nadležni sud u Republici Srbiji.</p>`,
  },
  {
    slug: "politika-privatnosti",
    title: "Politika privatnosti",
    description: "Kako prikupljamo i koristimo lične podatke.",
    html: `
<h2>Koje podatke prikupljamo</h2>
<p>Kada poručuješ, prikupljamo ime i prezime, adresu za dostavu, broj telefona, email adresu (ako je uneseš) i podatke o poručenim proizvodima.</p>
<h2>Zašto ih koristimo</h2>
<ul>
<li>za obradu i isporuku porudžbine,</li>
<li>za komunikaciju u vezi sa porudžbinom,</li>
<li>za vođenje zakonski obavezne evidencije.</li>
</ul>
<h2>Sa kim delimo podatke</h2>
<p>Podatke za dostavu prosleđujemo isključivo kurirskoj službi radi isporuke. Ne prodajemo i ne delimo podatke u druge svrhe.</p>
<h2>Plaćanje</h2>
<p>Plaćanje se vrši isključivo pouzećem, pa na sajtu ne unosiš nikakve platne podatke.</p>
<h2>Newsletter</h2>
<p>Ako se prijaviš na obaveštenja, tvoju email adresu koristimo samo za vesti o novim modelima i akcijama. Odjaviti se možeš u svakom trenutku.</p>
<h2>Kolačići</h2>
<p>Sajt koristi lokalno skladište pregledača da zapamti sadržaj korpe. Ne koristimo kolačiće za praćenje bez tvoje saglasnosti.</p>
<h2>Tvoja prava</h2>
<p>Možeš zatražiti uvid, ispravku ili brisanje svojih podataka, osim onih koje moramo čuvati po zakonu.</p>
${contactLine}`,
  },
];

export function getPage(slug: string) {
  return PAGES.find((p) => p.slug === slug);
}
