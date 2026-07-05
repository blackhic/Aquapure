import { getSupabaseAdmin } from "@/app/lib/supabase";
import AdminLogoutButton from "@/app/components/AdminLogoutButton";
import AdminNav from "@/app/components/AdminNav";
import AdminDevisTable, { type Devis } from "@/app/components/AdminDevisTable";

// Toujours rendu à la demande (données Supabase à jour à chaque affichage).
// L'accès est protégé par `middleware.ts` (session HMAC).
export const dynamic = "force-dynamic";

async function fetchDevis(): Promise<{ rows: Devis[]; error: string | null }> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("devis")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[admin] Erreur lecture devis :", error.message);
      return { rows: [], error: "Impossible de charger les demandes." };
    }
    return { rows: (data as Devis[]) ?? [], error: null };
  } catch (err) {
    console.error("[admin] Exception lecture devis :", err);
    return { rows: [], error: "Impossible de charger les demandes." };
  }
}

export default async function AdminPage() {
  const { rows, error } = await fetchDevis();

  return (
    <main className="admin-shell">
      <header className="admin-shell-header">
        <h1 className="admin-shell-title">Espace admin — AQUAPURE</h1>
        <AdminLogoutButton />
      </header>

      <AdminNav active="devis" />

      {error ? (
        <div className="admin-shell-alert" role="alert">
          {error} Réessayez dans un instant ou rechargez la page.
        </div>
      ) : (
        <AdminDevisTable devis={rows} />
      )}
    </main>
  );
}
