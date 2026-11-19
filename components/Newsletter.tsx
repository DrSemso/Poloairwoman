"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");

  return (
    <>
      <form
        className="news-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setState("busy");
          try {
            const r = await fetch("/api/newsletter", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email }),
            });
            setState(r.ok ? "ok" : "err");
            if (r.ok) setEmail("");
          } catch {
            setState("err");
          }
        }}
      >
        <input type="email" required placeholder="Tvoja email adresa" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email adresa" />
        <button type="submit" disabled={state === "busy"}>
          Prijavi se
        </button>
      </form>
      {state === "ok" && <p className="news-msg">Hvala! Prijava je uspela.</p>}
      {state === "err" && <p className="news-msg">Prijava trenutno nije uspela. Pokušaj ponovo malo kasnije.</p>}
      <p className="news-fine">Bez spama. Odjava jednim klikom.</p>
    </>
  );
}
