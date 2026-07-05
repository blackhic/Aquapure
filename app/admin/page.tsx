import AdminLogoutButton from "@/app/components/AdminLogoutButton";

// Shell provisoire. Le contenu réel (liste des demandes de devis) arrive en 6b.
// L'accès est protégé par `middleware.ts` (session HMAC).
export default function AdminPage() {
  return (
    <main className="admin-shell">
      <header className="admin-shell-header">
        <h1 className="admin-shell-title">Espace admin — AQUAPURE</h1>
        <AdminLogoutButton />
      </header>

      <p className="admin-shell-placeholder">
        La liste des demandes de devis apparaîtra ici (étape 6b).
      </p>
    </main>
  );
}
