import Link from "next/link";
import ShopChrome from "@/components/ShopChrome";

export default function NotFound() {
  return (
    <ShopChrome>
    <div className="wrap thanks">
      <h1>Stranica nije pronađena</h1>
      <p className="lead">Možda je model rasprodat ili je link promenjen. Pogledaj kolekciju — sigurno ćeš naći nešto lepo.</p>
      <p style={{ marginTop: 26 }}>
        <Link href="/kategorija/svi-proizvodi" className="btn">
          Pogledaj kolekciju
        </Link>
      </p>
    </div>
    </ShopChrome>
  );
}
