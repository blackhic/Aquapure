"use client";

import { useState } from "react";

export type KnowledgeType = "document" | "qa";

export type KnowledgeEntry = {
  id: string;
  created_at: string;
  updated_at: string;
  type: KnowledgeType;
  title: string | null;
  question: string | null;
  content: string;
};

function formatDateFr(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Champs éditables partagés par le formulaire d'ajout et l'édition inline.
type Draft = { type: KnowledgeType; title: string; question: string; content: string };

const EMPTY_DRAFT: Draft = { type: "document", title: "", question: "", content: "" };

function draftFromEntry(e: KnowledgeEntry): Draft {
  return {
    type: e.type,
    title: e.title ?? "",
    question: e.question ?? "",
    content: e.content,
  };
}

// Validation côté client (miroir de l'API) : renvoie un message ou null.
function validateDraft(d: Draft): string | null {
  if (!d.content.trim()) return "Le contenu est obligatoire.";
  if (d.type === "qa" && !d.question.trim()) return "La question est obligatoire pour une Q/R.";
  return null;
}

function draftToBody(d: Draft) {
  return {
    type: d.type,
    title: d.title.trim() || null,
    question: d.type === "qa" ? d.question.trim() : null,
    content: d.content.trim(),
  };
}

export default function AdminKnowledge({ entries }: { entries: KnowledgeEntry[] }) {
  const [rows, setRows] = useState<KnowledgeEntry[]>(entries);

  // ── Formulaire d'ajout ──
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // ── Édition inline ──
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(EMPTY_DRAFT);
  const [editError, setEditError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleAdd(ev: React.FormEvent) {
    ev.preventDefault();
    setAddError(null);
    const err = validateDraft(draft);
    if (err) {
      setAddError(err);
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/admin/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftToBody(draft)),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "Échec");
      setRows((prev) => [data.entry as KnowledgeEntry, ...prev]);
      setDraft(EMPTY_DRAFT);
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "Échec de l'ajout.");
    } finally {
      setAdding(false);
    }
  }

  function startEdit(entry: KnowledgeEntry) {
    setEditingId(entry.id);
    setEditDraft(draftFromEntry(entry));
    setEditError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditError(null);
  }

  async function handleSave(id: string) {
    setEditError(null);
    const err = validateDraft(editDraft);
    if (err) {
      setEditError(err);
      return;
    }
    setSavingId(id);
    try {
      const res = await fetch("/api/admin/knowledge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...draftToBody(editDraft) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "Échec");
      setRows((prev) =>
        prev.map((r) => (r.id === id ? (data.entry as KnowledgeEntry) : r)),
      );
      setEditingId(null);
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Échec de l'enregistrement.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(entry: KnowledgeEntry) {
    const label =
      entry.title || entry.question || entry.content.slice(0, 40) + "…";
    if (!window.confirm(`Supprimer définitivement cette entrée ?\n\n« ${label} »`)) {
      return;
    }
    setDeletingId(entry.id);
    try {
      const res = await fetch("/api/admin/knowledge", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "Échec");
      setRows((prev) => prev.filter((r) => r.id !== entry.id));
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Échec de la suppression.");
    } finally {
      setDeletingId(null);
    }
  }

  // Champs éditables (utilisés à l'ajout et à l'édition).
  function fields(d: Draft, set: (d: Draft) => void, idPrefix: string) {
    return (
      <>
        <div className="admin-kb-typeswitch">
          <label>
            <input
              type="radio"
              name={`${idPrefix}-type`}
              checked={d.type === "document"}
              onChange={() => set({ ...d, type: "document" })}
            />
            Document
          </label>
          <label>
            <input
              type="radio"
              name={`${idPrefix}-type`}
              checked={d.type === "qa"}
              onChange={() => set({ ...d, type: "qa" })}
            />
            Q / R
          </label>
        </div>

        {d.type === "qa" ? (
          <>
            <div className="admin-kb-field">
              <label htmlFor={`${idPrefix}-question`}>Question</label>
              <input
                id={`${idPrefix}-question`}
                type="text"
                value={d.question}
                onChange={(e) => set({ ...d, question: e.target.value })}
                placeholder="Ex. Intervenez-vous le dimanche ?"
              />
            </div>
            <div className="admin-kb-field">
              <label htmlFor={`${idPrefix}-content`}>Réponse</label>
              <textarea
                id={`${idPrefix}-content`}
                rows={3}
                value={d.content}
                onChange={(e) => set({ ...d, content: e.target.value })}
                placeholder="Ex. Oui, nous intervenons 7j/7, 24h/24…"
              />
            </div>
            <div className="admin-kb-field">
              <label htmlFor={`${idPrefix}-title`}>Libellé court (optionnel)</label>
              <input
                id={`${idPrefix}-title`}
                type="text"
                value={d.title}
                onChange={(e) => set({ ...d, title: e.target.value })}
                placeholder="Ex. Disponibilité"
              />
            </div>
          </>
        ) : (
          <>
            <div className="admin-kb-field">
              <label htmlFor={`${idPrefix}-title`}>Titre (optionnel)</label>
              <input
                id={`${idPrefix}-title`}
                type="text"
                value={d.title}
                onChange={(e) => set({ ...d, title: e.target.value })}
                placeholder="Ex. Zone d'intervention"
              />
            </div>
            <div className="admin-kb-field">
              <label htmlFor={`${idPrefix}-content`}>Texte</label>
              <textarea
                id={`${idPrefix}-content`}
                rows={5}
                value={d.content}
                onChange={(e) => set({ ...d, content: e.target.value })}
                placeholder="Contenu du document…"
              />
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="admin-kb">
      {/* Formulaire d'ajout */}
      <form className="admin-kb-add" onSubmit={handleAdd}>
        <h2 className="admin-kb-subtitle">Ajouter une entrée</h2>
        {fields(draft, setDraft, "add")}
        {addError ? (
          <p className="admin-devis-error" role="alert">
            {addError}
          </p>
        ) : null}
        <button type="submit" className="admin-action toggle" disabled={adding}>
          {adding ? "Ajout…" : "Ajouter"}
        </button>
      </form>

      {/* Liste des entrées */}
      <h2 className="admin-kb-subtitle">
        Entrées existantes{" "}
        <span className="admin-filtre-count">{rows.length}</span>
      </h2>

      {rows.length === 0 ? (
        <p className="admin-devis-empty">
          Aucune entrée pour le moment. Ajoutez un document ou une Q/R ci-dessus.
        </p>
      ) : (
        <ul className="admin-devis-list">
          {rows.map((entry) => {
            const isEditing = editingId === entry.id;
            return (
              <li key={entry.id} className="admin-devis-card">
                <div className="admin-devis-top">
                  <span
                    className={`admin-badge kb ${entry.type === "qa" ? "qa" : "doc"}`}
                  >
                    {entry.type === "qa" ? "Q / R" : "Document"}
                  </span>
                  <time className="admin-devis-date" dateTime={entry.updated_at}>
                    maj {formatDateFr(entry.updated_at)}
                  </time>
                </div>

                {isEditing ? (
                  <div className="admin-kb-editform">
                    {fields(editDraft, setEditDraft, `edit-${entry.id}`)}
                    {editError ? (
                      <p className="admin-devis-error" role="alert">
                        {editError}
                      </p>
                    ) : null}
                    <div className="admin-devis-actions">
                      <button
                        type="button"
                        className="admin-action toggle"
                        onClick={() => handleSave(entry.id)}
                        disabled={savingId === entry.id}
                      >
                        {savingId === entry.id ? "Enregistrement…" : "Enregistrer"}
                      </button>
                      <button
                        type="button"
                        className="admin-action mail"
                        onClick={cancelEdit}
                        disabled={savingId === entry.id}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {entry.type === "qa" ? (
                      <>
                        <div className="admin-devis-main">
                          <div className="admin-devis-nom">{entry.question}</div>
                          {entry.title ? (
                            <div className="admin-devis-type">{entry.title}</div>
                          ) : null}
                        </div>
                        <p className="admin-devis-message">{entry.content}</p>
                      </>
                    ) : (
                      <>
                        {entry.title ? (
                          <div className="admin-devis-main">
                            <div className="admin-devis-nom">{entry.title}</div>
                          </div>
                        ) : null}
                        <p className="admin-devis-message">{entry.content}</p>
                      </>
                    )}

                    <div className="admin-devis-actions">
                      <button
                        type="button"
                        className="admin-action mail"
                        onClick={() => startEdit(entry)}
                      >
                        ✏️ Éditer
                      </button>
                      <button
                        type="button"
                        className="admin-action delete"
                        onClick={() => handleDelete(entry)}
                        disabled={deletingId === entry.id}
                      >
                        {deletingId === entry.id ? "Suppression…" : "🗑 Supprimer"}
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
