"use client";

import { useState, useTransition } from "react";
import { saveOrderNote, setOrderStatus } from "@/app/admin/actions";

type S = { key: string; label: string; tone: string };

export function StatusButtons({ id, status, statuses }: { id: number; status: string; statuses: readonly S[] }) {
  const [cur, setCur] = useState(status);
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");
  return (
    <div>
      <div className="adm-status-btns">
        {statuses.map((s) => (
          <button
            key={s.key}
            disabled={pending}
            className={`adm-pill ${s.tone}${cur === s.key ? " on" : ""}`}
            onClick={() =>
              start(async () => {
                setErr("");
                try {
                  await setOrderStatus(id, s.key);
                  setCur(s.key);
                } catch {
                  setErr("Status nije sačuvan. Pokušaj ponovo.");
                }
              })
            }
          >
            {s.label}
          </button>
        ))}
      </div>
      {err && <p className="form-err">{err}</p>}
    </div>
  );
}

export function NoteBox({ id, note }: { id: number; note: string }) {
  const [v, setV] = useState(note);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  return (
    <div className="field">
      <label htmlFor="note">Interna beleška (kupac je ne vidi)</label>
      <textarea id="note" rows={3} value={v} onChange={(e) => (setV(e.target.value), setSaved(false))} placeholder="Npr. broj pošiljke, dogovor sa kupcem…" />
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
        <button className="btn btn-outline" disabled={pending} onClick={() => start(async () => (await saveOrderNote(id, v), setSaved(true)))} style={{ padding: "10px 20px" }}>
          Sačuvaj belešku
        </button>
        {saved && <span className="muted">Sačuvano ✓</span>}
      </div>
    </div>
  );
}
