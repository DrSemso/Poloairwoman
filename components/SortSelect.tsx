"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORTS } from "@/lib/products";

export default function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  return (
    <select
      aria-label="Sortiraj"
      value={value}
      onChange={(e) => {
        const p = new URLSearchParams(sp.toString());
        p.delete("strana");
        if (e.target.value === "popularno") p.delete("sort");
        else p.set("sort", e.target.value);
        const qs = p.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }}
    >
      {SORTS.map((s) => (
        <option key={s.key} value={s.key}>
          Sortiraj: {s.label}
        </option>
      ))}
    </select>
  );
}
