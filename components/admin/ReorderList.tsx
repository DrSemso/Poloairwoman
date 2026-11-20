"use client";

import { useState, useTransition } from "react";
import { reorderProducts } from "@/app/admin/actions";
import { rsd } from "@/lib/format";

type Row = { id: number; name: string; price: number; image: string; inStock: boolean; active: boolean };

export default function ReorderList({ items }: { items: Row[] }) {
  const [list, setList] = useState(items);
  const [drag, setDrag] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState("");
  const [pending, start] = useTransition();

  const move = (from: number, to: number) => {
    if (to < 0 || to >= list.length || from === to) return;
    setList((l) => {
      const a = [...l];
      const [x] = a.splice(from, 1);
      a.splice(to, 0, x);
      return a;
    });
    setDirty(true);
    setMsg("");
  };

  const save = () =>
    start(async () => {
      try {
        await reorderProducts(list.map((r) => r.id));
        setDirty(false);
        setMsg("Sačuvano ✓ Sajt je osvežen.");
      } catch {
        setMsg("Nije sačuvano. Pokušaj ponovo.");
      }
    });

  return (
    <>
      <ol className="adm-order">
        {list.map((r, i) => (
          <li
            key={r.id}
            draggable
            onDragStart={() => setDrag(i)}
            onDragOver={(e) => {
              e.preventDefault();
              if (drag !== null && drag !== i) {
                move(drag, i);
                setDrag(i);
              }
            }}
            onDragEnd={() => setDrag(null)}
            className={`${drag === i ? "drag" : ""}${!r.inStock || !r.active ? " off" : ""}`}
          >
            <span className="adm-grip" aria-hidden>
              ⋮⋮
            </span>
            <span className="adm-pos">{i + 1}</span>
            <img src={r.image} alt="" />
            <span className="adm-oname">
              {r.name}
              <small>
                {rsd(r.price)}
                {!r.active ? " · skriven" : !r.inStock ? " · rasprodato" : ""}
              </small>
            </span>
            <span className="adm-obtns">
              <button type="button" onClick={() => move(i, 0)} disabled={i === 0} title="Na vrh">
                ⤒
              </button>
              <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} title="Gore">
                ↑
              </button>
              <button type="button" onClick={() => move(i, i + 1)} disabled={i === list.length - 1} title="Dole">
                ↓
              </button>
            </span>
          </li>
        ))}
      </ol>
      <div className="adm-actions sticky">
        <button className="btn" onClick={save} disabled={!dirty || pending}>
          {pending ? "Čuvam…" : "Sačuvaj raspored"}
        </button>
        {dirty && !pending && (
          <button className="btn btn-outline" onClick={() => (setList(items), setDirty(false))}>
            Poništi
          </button>
        )}
        {msg && <span className="muted">{msg}</span>}
      </div>
    </>
  );
}
