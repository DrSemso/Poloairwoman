"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { browserSupabase } from "@/lib/supabase-browser";

const sb = browserSupabase;

// Prijava bez lozinke: email -> kod iz emaila -> prijavljen.
export default function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await sb().auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/admin/potvrda` },
    });
    setBusy(false);
    if (error) return setError(error.status === 429 ? "Previše pokušaja. Sačekaj minut pa pokušaj ponovo." : "Kod nije poslat. Proveri email adresu.");
    setStep("code");
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await sb().auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: "email" });
    setBusy(false);
    if (error) return setError("Kod nije ispravan ili je istekao. Pokušaj ponovo ili zatraži novi kod.");
    router.replace("/admin");
    router.refresh();
  }

  return step === "email" ? (
    <form onSubmit={sendCode} className="adm-form">
      <div className="field">
        <label htmlFor="login-email">Email adresa</label>
        <input id="login-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ime@primer.rs" />
      </div>
      {error && <p className="form-err">{error}</p>}
      <button disabled={busy} className="btn btn-block">
        {busy ? "Šaljem kod…" : "Pošalji kod za prijavu"}
      </button>
      <p className="adm-hint">Lozinka nije potrebna. Kod (ili link za prijavu) stiže na email za nekoliko sekundi.</p>
    </form>
  ) : (
    <form onSubmit={verify} className="adm-form">
      <p>
        Poslali smo kod na <b>{email}</b>. Upiši ga ispod — ili samo klikni na link iz emaila.
      </p>
      <div className="field">
        <label htmlFor="login-code">Kod iz emaila</label>
        <input
          id="login-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={10}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          style={{ textAlign: "center", fontSize: 22, letterSpacing: "0.4em" }}
        />
      </div>
      {error && <p className="form-err">{error}</p>}
      <button disabled={busy || code.length < 6} className="btn btn-block">
        {busy ? "Proveravam…" : "Prijavi se"}
      </button>
      <button
        type="button"
        className="rm"
        onClick={() => {
          setStep("email");
          setCode("");
          setError(null);
        }}
      >
        Promeni email ili pošalji novi kod
      </button>
    </form>
  );
}
