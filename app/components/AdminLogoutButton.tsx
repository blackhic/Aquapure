"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // Peu importe : sans cookie valide, le middleware redirigera de toute façon.
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      className="admin-logout"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}
