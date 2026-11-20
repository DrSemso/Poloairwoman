import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Admin prijava", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  return (
    <div className="adm-login">
      <div className="adm-login-box">
        <img src="/brand/logo.webp" alt="POLO air woman" width={111} height={50} style={{ height: 50, width: "auto" }} />
        <h1>Admin panel</h1>
        {"nema-pristupa" in sp ? (
          <p className="form-err">Ovaj email nema administratorski pristup. Prijavi se emailom vlasnika prodavnice.</p>
        ) : "greska" in sp ? (
          <p className="form-err">Link za prijavu je istekao ili je već iskorišćen. Zatraži novi kod.</p>
        ) : (
          <p className="muted">Prijavi se emailom vlasnika. Kod stiže na email.</p>
        )}
        <LoginForm />
        <Link href="/" className="adm-back">
          ← Nazad na prodavnicu
        </Link>
      </div>
    </div>
  );
}
