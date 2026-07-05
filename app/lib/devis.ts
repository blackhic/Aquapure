import { getSupabaseAdmin } from "@/app/lib/supabase";
import {
  sendDevisNotification,
  sendClientAcknowledgement,
  type DevisData,
} from "@/app/lib/email";

// Cœur commun de création d'une demande de devis, partagé par la route
// publique du formulaire (/api/devis) et la capture de lead du chatbot
// (/api/chat/lead). Serveur only (service_role). Ne pas importer côté client.

export type DevisRow = {
  nom: string;
  telephone: string;
  email: string | null;
  type_besoin: string;
  message: string | null;
  urgence: boolean;
  canal_prefere: string | null;
};

// Insère la ligne (service_role, bypass RLS) PUIS déclenche les notifications
// Resend de façon NON bloquante : la demande est déjà persistée, un échec
// d'email ne perd jamais le lead (chaque envoi a son propre catch). Lance une
// erreur uniquement si l'insertion elle-même échoue.
export async function createDevis(
  row: DevisRow,
): Promise<{ id: string; created_at: string }> {
  const { data, error } = await getSupabaseAdmin()
    .from("devis")
    .insert(row)
    .select("id, created_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Insertion devis échouée.");
  }

  const devis: DevisData = { ...row, id: data.id, created_at: data.created_at };
  await Promise.allSettled([
    sendDevisNotification(devis).catch((e) =>
      console.error("[devis] Échec email notification :", e),
    ),
    sendClientAcknowledgement(devis).catch((e) =>
      console.error("[devis] Échec email accusé client :", e),
    ),
  ]);

  return { id: data.id, created_at: data.created_at };
}
