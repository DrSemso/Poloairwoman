import { CartProvider } from "./CartProvider";
import Header from "./Header";
import CartDrawer, { type Suggestion } from "./CartDrawer";
import { Footer } from "./Sections";
import { getCatalog } from "@/lib/catalog";

// Predlozi za "Dodaj i ovo" u korpi: pristupačni komadi iz drugih kategorija
async function getSuggestions(): Promise<Suggestion[]> {
  return (await getCatalog())
    .filter((p) => p.inStock && ["narukvice", "novcanici", "naocare"].includes(p.category))
    .sort((a, b) => a.price - b.price)
    .slice(0, 6)
    .map((p) => ({ slug: p.slug, name: p.name, price: p.price, regularPrice: p.regularPrice, image: p.images[0], max: p.stock ?? null }));
}


export default async function ShopChrome({ children }: { children: React.ReactNode }) {
  const suggestions = await getSuggestions();
  return (
    <CartProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer suggestions={suggestions} />
    </CartProvider>
  );
}
