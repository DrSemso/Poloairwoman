"use client";

import { useState, useTransition } from "react";
import { quickUpdate } from "@/app/admin/actions";

type Flags = { inStock: boolean; active: boolean; featured: boolean };

const LABELS: { key: keyof Flags; db: "in_stock" | "active" | "featured"; on: string; off: string }[] = [
  { key: "inStock", db: "in_stock", on: "Na stanju", off: "Rasprodato" },
  { key: "active", db: "active", on: "Vidljiv", off: "Skriven" },
  { key: "featured", db: "featured", on: "Izdvojen", off: "Izdvoji" },
];

export default function ProductToggles({ id, stock, ...init }: { id: number; stock?: number | null } & Flags) {
  const [f, setF] = useState<Flags>(init);
  const [pending, start] = useTransition();
  const [err, setErr] = useState(false);
  return (
    <div className="adm-toggles">
      {stock != null && (
        <span className={`adm-tog adm-stock-pill${stock === 0 ? " warn" : stock <= 3 ? " low" : ""}`} title="Zalihe se prate">
          {stock === 0 ? "Rasprodato" : `${stock} kom`}
        </span>
      )}
      {LABELS.filter((l) => !(stock != null && l.key === "inStock")).map((l) => (
        <button
          key={l.key}
          type="button"
          disabled={pending}
          className={`adm-tog${f[l.key] ? " on" : ""}${l.key === "inStock" && !f.inStock ? " warn" : ""}`}
          onClick={() =>
            start(async () => {
              const next = !f[l.key];
              setErr(false);
              try {
                await quickUpdate(id, { [l.db]: next });
                setF((s) => ({ ...s, [l.key]: next }));
              } catch {
                setErr(true);
              }
            })
          }
        >
          {f[l.key] ? l.on : l.off}
        </button>
      ))}
      {err && <span className="form-err">Nije sačuvano</span>}
    </div>
  );
}
