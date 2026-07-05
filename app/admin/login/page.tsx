"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        // Rafraîchit pour que le middleware voie le nouveau cookie.
        router.replace("/admin");
        router.refresh();
      } else {
        setError(data.error || "Mot de passe incorrect.");
      }
    } catch {
      setError("Connexion impossible. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-auth">
      <form className="admin-auth-card" onSubmit={handleSubmit} noValidate>
        <div className="admin-auth-brand">AQUAPURE</div>
        <h1 className="admin-auth-title">Espace admin</h1>
        <p className="admin-auth-lead">Accès réservé — veuillez vous identifier.</p>

        {error ? (
          <div className="admin-auth-error" role="alert">
            {error}
          </div>
        ) : null}

        <div className="admin-auth-field">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!error}
          />
        </div>

        <button
          type="submit"
          className="admin-auth-submit"
          disabled={submitting || password.length === 0}
        >
          {submitting ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </main>
  );
}
