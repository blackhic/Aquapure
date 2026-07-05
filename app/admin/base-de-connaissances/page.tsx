import { getSupabaseAdmin } from "@/app/lib/supabase";
import AdminLogoutButton from "@/app/components/AdminLogoutButton";
import AdminNav from "@/app/components/AdminNav";
import AdminKnowledge, {
  type KnowledgeEntry,
} from "@/app/components/AdminKnowledge";

// Rendu à la demande (données Supabase à jour). Protégé par le middleware.
export const dynamic = "force-dynamic";

async function fetchKnowledge(): Promise<{
  rows: KnowledgeEntry[];
  error: string | null;
}> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[admin/kb] Erreur lecture :", error.message);
      return { rows: [], error: "Impossible de charger la base de connaissances." };
    }
    return { rows: (data as KnowledgeEntry[]) ?? [], error: null };
  } catch (err) {
    console.error("[admin/kb] Exception lecture :", err);
    return { rows: [], error: "Impossible de charger la base de connaissances." };
  }
}

export default async function AdminKnowledgePage() {
  const { rows, error } = await fetchKnowledge();

  return (
    <main className="admin-shell">
      <header className="admin-shell-header">
        <h1 className="admin-shell-title">Base de connaissances — AQUAPURE</h1>
        <AdminLogoutButton />
      </header>

      <AdminNav active="kb" />

      {error ? (
        <div className="admin-shell-alert" role="alert">
          {error} Réessayez dans un instant ou rechargez la page.
        </div>
      ) : (
        <AdminKnowledge entries={rows} />
      )}
    </main>
  );
}
