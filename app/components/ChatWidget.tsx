"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME =
  "Bonjour 👋 Je suis Aqua, l'assistant d'AQUAPURE. Une question sur nos prestations de plomberie ?";

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Défilement automatique vers le bas à chaque nouveau contenu.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  // Focus sur le champ à l'ouverture.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Masqué dans l'espace admin (inutile pour Mehdi).
  if (pathname?.startsWith("/admin")) return null;

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

      // Ajoute un message assistant vide puis le remplit au fil du stream.
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

          <div className="chat-quick">
            <a href="tel:0484350486" className="chat-quick-btn call">
              📞 Appeler
            </a>
            <a href="/devis" className="chat-quick-btn devis">
              Devis gratuit
            </a>
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
        </section>
      ) : null}
    </>
  );
}
