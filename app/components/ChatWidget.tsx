"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Msg = { role: "user" | "assistant"; content: string };
type LeadErrors = Partial<Record<"nom" | "telephone" | "email", string>>;

const WELCOME =
  "Bonjour 👋 Je suis Aqua, l'assistant d'AQUAPURE. Une question sur nos prestations de plomberie ?";

const normalizePhone = (v: string) => v.replace(/[\s.\-()]/g, "");
const isPhoneValid = (v: string) => /^(?:\+33|0)[1-9]\d{8}$/.test(normalizePhone(v));
const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"chat" | "lead">("chat");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Formulaire de rappel
  const [lead, setLead] = useState({ nom: "", telephone: "", email: "", besoin: "" });
  const [leadErrors, setLeadErrors] = useState<LeadErrors>({});
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "done">("idle");
  const [leadSubmitError, setLeadSubmitError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const lastUserMessage = useMemo(
    () => [...messages].reverse().find((m) => m.role === "user")?.content ?? "",
    [messages],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading, mode]);

  useEffect(() => {
    if (open && mode === "chat") inputRef.current?.focus();
  }, [open, mode]);

  // Masqué dans l'espace admin (inutile pour Mehdi).
  if (pathname?.startsWith("/admin")) return null;

  function openLeadForm() {
    // Pré-remplit « besoin » avec le dernier sujet abordé (tronqué).
    setLead((l) => ({
      ...l,
      besoin: l.besoin || lastUserMessage.slice(0, 200),
    }));
    setLeadErrors({});
    setLeadSubmitError(null);
    setLeadStatus("idle");
    setMode("lead");
  }

  function backToChat() {
    setMode("chat");
    setLeadStatus("idle");
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const history = [...messages, { role: "user" as const, content: text }];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.error ||
              "Désolé, une erreur est survenue. Vous pouvez nous appeler au 04 84 35 04 86.",
          },
        ]);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + chunk,
          };
          return next;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Connexion impossible. Vous pouvez nous appeler directement au 04 84 35 04 86.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function validateLead(): LeadErrors {
    const e: LeadErrors = {};
    if (!lead.nom.trim()) e.nom = "Merci d'indiquer votre nom.";
    if (!lead.telephone.trim()) {
      e.telephone = "Merci d'indiquer votre téléphone.";
    } else if (!isPhoneValid(lead.telephone)) {
      e.telephone = "Numéro invalide (ex. 06 12 34 56 78).";
    }
    if (lead.email.trim() && !isEmailValid(lead.email)) {
      e.email = "Adresse email invalide.";
    }
    return e;
  }

  async function submitLead(ev: React.FormEvent) {
    ev.preventDefault();
    setLeadSubmitError(null);
    const e = validateLead();
    setLeadErrors(e);
    if (Object.keys(e).length > 0) return;

    setLeadStatus("sending");
    try {
      const res = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: lead.nom.trim(),
          telephone: lead.telephone.trim(),
          email: lead.email.trim() || null,
          besoin: lead.besoin.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setLeadStatus("done");
      } else {
        setLeadStatus("idle");
        setLeadSubmitError(
          data.error ||
            "Une erreur est survenue. Appelez-nous directement au 04 84 35 04 86.",
        );
      }
    } catch {
      setLeadStatus("idle");
      setLeadSubmitError(
        "Connexion impossible. Appelez-nous directement au 04 84 35 04 86.",
      );
    }
  }

  return (
    <>
      <button
        type="button"
        className="chat-fab"
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant Aqua"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "✕" : "💬"}
      </button>

      {open ? (
        <section className="chat-panel" role="dialog" aria-label="Assistant AQUAPURE">
          <header className="chat-header">
            <div>
              <div className="chat-header-title">Aqua</div>
              <div className="chat-header-sub">Assistant AQUAPURE Plomberie</div>
            </div>
            <button
              type="button"
              className="chat-close"
              aria-label="Fermer"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </header>

          <div className="chat-messages" ref={scrollRef}>
            <div className="chat-msg assistant">{WELCOME}</div>
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.content ||
                  (loading && i === messages.length - 1 ? (
                    <span className="chat-typing">Aqua écrit…</span>
                  ) : (
                    ""
                  ))}
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === "user" ? (
              <div className="chat-msg assistant">
                <span className="chat-typing">Aqua écrit…</span>
              </div>
            ) : null}
          </div>

          {mode === "chat" ? (
            <>
              <div className="chat-quick">
                <a href="tel:0484350486" className="chat-quick-btn call">
                  📞 Appeler
                </a>
                <a href="/devis" className="chat-quick-btn devis">
                  Devis
                </a>
                <button
                  type="button"
                  className="chat-quick-btn rappel"
                  onClick={openLeadForm}
                >
                  Être rappelé
                </button>
              </div>

              <div className="chat-input-row">
                <textarea
                  ref={inputRef}
                  className="chat-input"
                  rows={1}
                  placeholder="Votre question…"
                  value={input}
                  maxLength={1000}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Votre message"
                />
                <button
                  type="button"
                  className="chat-send"
                  onClick={send}
                  disabled={loading || !input.trim()}
                  aria-label="Envoyer"
                >
                  ➤
                </button>
              </div>
            </>
          ) : leadStatus === "done" ? (
            <div className="chat-lead-success" role="status">
              <div className="chat-lead-success-icon">✅</div>
              <p>
                Merci {lead.nom.trim().split(" ")[0]} ! Mehdi vous rappellera au
                plus vite.
              </p>
              <button type="button" className="chat-lead-back" onClick={backToChat}>
                Retour à la discussion
              </button>
            </div>
          ) : (
            <form className="chat-lead" onSubmit={submitLead} noValidate>
              <div className="chat-lead-title">Être rappelé par Mehdi</div>

              {leadSubmitError ? (
                <div className="chat-lead-banner" role="alert">
                  {leadSubmitError}{" "}
                  <a href="tel:0484350486">04 84 35 04 86</a>
                </div>
              ) : null}

              <div className="chat-lead-field">
                <label htmlFor="lead-nom">
                  Nom <span aria-hidden="true">*</span>
                </label>
                <input
                  id="lead-nom"
                  type="text"
                  autoComplete="name"
                  value={lead.nom}
                  maxLength={100}
                  onChange={(e) => setLead((l) => ({ ...l, nom: e.target.value }))}
                  aria-invalid={!!leadErrors.nom}
                />
                {leadErrors.nom ? (
                  <span className="chat-lead-err">{leadErrors.nom}</span>
                ) : null}
              </div>

              <div className="chat-lead-field">
                <label htmlFor="lead-tel">
                  Téléphone <span aria-hidden="true">*</span>
                </label>
                <input
                  id="lead-tel"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="06 12 34 56 78"
                  value={lead.telephone}
                  maxLength={30}
                  onChange={(e) =>
                    setLead((l) => ({ ...l, telephone: e.target.value }))
                  }
                  aria-invalid={!!leadErrors.telephone}
                />
                {leadErrors.telephone ? (
                  <span className="chat-lead-err">{leadErrors.telephone}</span>
                ) : null}
              </div>

              <div className="chat-lead-field">
                <label htmlFor="lead-email">Email (optionnel)</label>
                <input
                  id="lead-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="vous@exemple.fr"
                  value={lead.email}
                  maxLength={150}
                  onChange={(e) =>
                    setLead((l) => ({ ...l, email: e.target.value }))
                  }
                  aria-invalid={!!leadErrors.email}
                />
                {leadErrors.email ? (
                  <span className="chat-lead-err">{leadErrors.email}</span>
                ) : null}
              </div>

              <div className="chat-lead-field">
                <label htmlFor="lead-besoin">Votre besoin (optionnel)</label>
                <textarea
                  id="lead-besoin"
                  rows={2}
                  placeholder="Décrivez brièvement votre besoin…"
                  value={lead.besoin}
                  maxLength={500}
                  onChange={(e) =>
                    setLead((l) => ({ ...l, besoin: e.target.value }))
                  }
                />
              </div>

              <div className="chat-lead-actions">
                <button
                  type="button"
                  className="chat-lead-cancel"
                  onClick={backToChat}
                  disabled={leadStatus === "sending"}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="chat-lead-submit"
                  disabled={leadStatus === "sending"}
                >
                  {leadStatus === "sending" ? "Envoi…" : "Envoyer"}
                </button>
              </div>
            </form>
          )}
        </section>
      ) : null}
    </>
  );
}
