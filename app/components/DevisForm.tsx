"use client";

import { useState } from "react";

// Options du type de besoin (la valeur est stockée telle quelle dans
// la colonne `type_besoin`).
const TYPES_BESOIN = [
  "Dépannage / Urgence",
  "Rénovation salle de bain ou cuisine",
  "Chauffe-eau / Ballon",
  "Recherche de fuite",
  "Plomberie générale",
  "Autre",
];

// Canal préféré → valeurs de la colonne `canal_prefere`.
const CANAUX = [
  { value: "telephone", label: "Téléphone" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
];

const normalizePhone = (v: string) => v.replace(/[\s.\-()]/g, "");
const isPhoneValid = (v: string) => /^(?:\+33|0)[1-9]\d{8}$/.test(normalizePhone(v));
const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type Errors = Partial<Record<"nom" | "telephone" | "type_besoin" | "email", string>>;

export default function DevisForm() {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [typeBesoin, setTypeBesoin] = useState("");
  const [message, setMessage] = useState("");
  const [urgence, setUrgence] = useState(false);
  const [canal, setCanal] = useState("telephone");

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (!nom.trim()) e.nom = "Merci d'indiquer votre nom.";
    if (!telephone.trim()) {
      e.telephone = "Merci d'indiquer votre téléphone.";
    } else if (!isPhoneValid(telephone)) {
      e.telephone = "Numéro invalide (ex. 06 12 34 56 78 ou +33 6 12 34 56 78).";
    }
    if (!typeBesoin) e.type_besoin = "Merci de choisir votre besoin.";
    if (email.trim() && !isEmailValid(email)) {
      e.email = "Adresse email invalide.";
    }
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitError(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom.trim(),
          telephone: telephone.trim(),
          email: email.trim() || null,
          type_besoin: typeBesoin,
          message: message.trim() || null,
          urgence,
          canal_prefere: canal,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setSubmitError(
          data.error ||
            "Une erreur est survenue lors de l'envoi. Réessayez ou appelez-nous directement.",
        );
      }
    } catch {
      setSubmitError(
        "Impossible d'envoyer la demande (connexion). Réessayez ou appelez-nous directement.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="devis-success">
        <div className="devis-success-icon">
          <svg viewBox="0 0 24 24">
            <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
          </svg>
        </div>
        <h2>Demande reçue ✅</h2>
        <p>
          Merci {nom.trim() ? nom.trim().split(" ")[0] : ""} ! Mehdi vous rappelle
          dans les plus brefs délais.
          <br />
          Pour une urgence, appelez directement :
        </p>
        <a href="tel:0484350486" className="cta-call">
          <svg viewBox="0 0 24 24">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
          </svg>
          <div className="cta-call-inner">
            <span>04 84 35 04 86</span>
            <span className="cta-call-sub">Disponible 24h/24 – 7j/7</span>
          </div>
        </a>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {submitError ? (
        <div className="form-error-banner" role="alert">
          {submitError}{" "}
          <a href="tel:0484350486">Appeler le 04 84 35 04 86</a>
        </div>
      ) : null}

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="nom">
            Nom <span className="req">*</span>
          </label>
          <input
            id="nom"
            name="nom"
            type="text"
            autoComplete="name"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className={errors.nom ? "invalid" : undefined}
            aria-invalid={!!errors.nom}
          />
          {errors.nom ? <span className="form-error">{errors.nom}</span> : null}
        </div>
        <div className="form-field">
          <label htmlFor="telephone">
            Téléphone <span className="req">*</span>
          </label>
          <input
            id="telephone"
            name="telephone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className={errors.telephone ? "invalid" : undefined}
            aria-invalid={!!errors.telephone}
          />
          {errors.telephone ? (
            <span className="form-error">{errors.telephone}</span>
          ) : null}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="email">Email (optionnel)</label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="vous@exemple.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={errors.email ? "invalid" : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email ? <span className="form-error">{errors.email}</span> : null}
      </div>

      <div className="form-field">
        <label htmlFor="type_besoin">
          Type de besoin <span className="req">*</span>
        </label>
        <select
          id="type_besoin"
          name="type_besoin"
          value={typeBesoin}
          onChange={(e) => setTypeBesoin(e.target.value)}
          className={errors.type_besoin ? "invalid" : undefined}
          aria-invalid={!!errors.type_besoin}
        >
          <option value="">— Choisissez —</option>
          {TYPES_BESOIN.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.type_besoin ? (
          <span className="form-error">{errors.type_besoin}</span>
        ) : null}
      </div>

      <div className="form-field">
        <label htmlFor="message">Votre message (optionnel)</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Décrivez votre besoin, l'adresse, vos disponibilités…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <label className="urgence-field">
        <input
          type="checkbox"
          checked={urgence}
          onChange={(e) => setUrgence(e.target.checked)}
        />
        <span className="urgence-label">
          C&apos;est une urgence — rappel immédiat
        </span>
      </label>

      <div className="form-field">
        <label id="canal-label">Canal préféré</label>
        <div className="canal-options" role="radiogroup" aria-labelledby="canal-label">
          {CANAUX.map((c) => (
            <label className="canal-option" key={c.value}>
              <input
                type="radio"
                name="canal_prefere"
                value={c.value}
                checked={canal === c.value}
                onChange={(e) => setCanal(e.target.value)}
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="form-submit" disabled={submitting}>
        {submitting ? (
          "Envoi…"
        ) : (
          <>
            <svg viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
            Rappelez-moi
          </>
        )}
      </button>
      <p className="form-hint">
        Gratuit et sans engagement. Vos coordonnées ne servent qu&apos;à vous
        recontacter.
      </p>
    </form>
  );
}
