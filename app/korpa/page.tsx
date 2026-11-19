import type { Metadata } from "next";
import Checkout from "./Checkout";

export const metadata: Metadata = { title: "Korpa i porudžbina", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="wrap co">
      <h1>Završi porudžbinu</h1>
      <p className="lead">Bez registracije i bez plaćanja unapred — plaćaš kuriru kad preuzmeš paket.</p>
      <Checkout />
    </div>
  );
}
