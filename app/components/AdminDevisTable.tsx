"use client";

import { useMemo, useState } from "react";

export type Devis = {
  id: string;
  created_at: string;
  nom: string;
  telephone: string;
  email: string | null;
  type_besoin: string;
  message: string | null;
  urgence: boolean;
  canal_prefere: string | null;
  statut: string;
};

type Filtre = "tout" | "nouveau" | "traité";

// Normalise un numéro FR en format international sans "+" (ex. "33612345678")
// pour le lien WhatsApp. Renvoie null si le numéro n'est pas exploitable.
// (Même logique que `toIntlFr` de lib/email.ts, dupliquée ici car ce module
// est client — email.ts est serveur only.)
function toIntlFr(raw: string): string | null {
  let p = raw.replace(/[\s.\-()]/g, "").replace(/^\+/, "");
  if (p.startsWith("0033")) p = p.slice(2);
  else if (p.startsWith("33")) {
    /* déjà international */
  } else if (p.startsWith("0")) p = "33" + p.slice(1);
  return /^33[1-9]\d{8}$/.test(p) ? p : null;
}

function telHref(raw: string): string {
  return "tel:" + raw.replace(/[\s.\-()]/g, "");
}

function formatDateFr(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminDevisTable({ devis }: { devis: Devis[] }) {
  // Copie locale mutable pour refléter les bascules de statut sans recharger.
  const [rows, setRows] = useState<Devis[]>(devis);
  const [filtre, setFiltre] = useState<Filtre>("tout");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      tout: rows.length,
      nouveau: rows.filter((r) => r.statut === "nouveau").length,
      traité: rows.filter((r) => r.statut === "traité").length,
    }),
    [rows],
  );

  const visibles = useMemo(
    () => (filtre === "tout" ? rows : rows.filter((r) => r.statut === filtre)),
    [rows, filtre],
  );

  async function toggleStatut(row: Devis) {
    const nouveau = row.statut === "nouveau" ? "traité" : "nouveau";
    setPendingId(row.id);
    setErrorId(null);

    // Optimiste : on met à jour l'affichage immédiatement.
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, statut: nouveau } : r)),
    );

    try {
      const res = await fetch("/api/admin/devis", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, statut: nouveau }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Échec");
      }
      // Recale sur la ligne renvoyée par le serveur (source de vérité).
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, ...data.devis } : r)),
      );
    } catch {
      // Rollback en cas d'erreur.
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, statut: row.statut } : r)),
      );
      setErrorId(row.id);
    } finally {
      setPendingId(null);
    }
  }

  const FILTRES: { key: Filtre; label: string }[] = [
    { key: "tout", label: "Tout" },
    { key: "nouveau", label: "Nouveau" },
    { key: "traité", label: "Traité" },
  ];

  return (
    <div className="admin-devis">
      <div className="admin-filtres" role="tablist" aria-label="Filtrer par statut">
        {FILTRES.map((f) => (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={filtre === f.key}
            className={`admin-filtre${filtre === f.key ? " active" : ""}`}
            onClick={() => setFiltre(f.key)}
          >
            {f.label}
            <span className="admin-filtre-count">{counts[f.key]}</span>
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <p className="admin-devis-empty">
          {rows.length === 0
            ? "Aucune demande de devis pour le moment."
            : "Aucune demande dans ce filtre."}
        </p>
      ) : (
        <ul className="admin-devis-list">
          {visibles.map((r) => {
            const intl = toIntlFr(r.telephone);
            const isNouveau = r.statut === "nouveau";
            return (
              <li key={r.id} className="admin-devis-card">
                <div className="admin-devis-top">
                  <div className="admin-devis-badges">
                    {r.urgence ? (
                      <span className="admin-badge urgence">⚠️ URGENCE</span>
                    ) : null}
                    <span
                      className={`admin-badge statut ${isNouveau ? "nouveau" : "traite"}`}
                    >
                      {isNouveau ? "Nouveau" : "Traité"}
                    </span>
                  </div>
                  <time className="admin-devis-date" dateTime={r.created_at}>
                    {formatDateFr(r.created_at)}
                  </time>
                </div>

                <div className="admin-devis-main">
                  <div className="admin-devis-nom">{r.nom}</div>
                  <div className="admin-devis-type">{r.type_besoin}</div>
                </div>

                {r.message ? (
                  <p className="admin-devis-message">{r.message}</p>
                ) : null}

                <dl className="admin-devis-meta">
                  <div>
                    <dt>Téléphone</dt>
                    <dd>
                      <a href={telHref(r.telephone)}>{r.telephone}</a>
                    </dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>
                      {r.email ? (
                        <a href={`mailto:${r.email}`}>{r.email}</a>
                      ) : (
                        <span className="admin-devis-vide">—</span>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Canal préféré</dt>
                    <dd>
                      {r.canal_prefere ? (
                        r.canal_prefere
                      ) : (
                        <span className="admin-devis-vide">—</span>
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="admin-devis-actions">
                  <a
                    href={telHref(r.telephone)}
                    className="admin-action call"
                  >
                    📞 Appeler
                  </a>
                  {intl ? (
                    <a
                      href={`https://wa.me/${intl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-action whatsapp"
                    >
                      💬 WhatsApp
                    </a>
                  ) : null}
                  {r.email ? (
                    <a href={`mailto:${r.email}`} className="admin-action mail">
                      ✉ Email
                    </a>
                  ) : null}
                  <button
                    type="button"
                    className={`admin-action toggle${isNouveau ? "" : " done"}`}
                    onClick={() => toggleStatut(r)}
                    disabled={pendingId === r.id}
                  >
                    {pendingId === r.id
                      ? "…"
                      : isNouveau
                        ? "Marquer traité"
                        : "Rouvrir"}
                  </button>
                </div>

                {errorId === r.id ? (
                  <p className="admin-devis-error" role="alert">
                    Échec de la mise à jour. Réessayez.
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
