"use client";

import { useEffect, useState } from "react";

const normalizePhone = (v: string) => v.replace(/[\s.\-()]/g, "");
const isPhoneValid = (v: string) => /^(?:\+33|0)[1-9]\d{8}$/.test(normalizePhone(v));
const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPostalValid = (v: string) => /^\d{5}$/.test(v.trim());

type Errors = Partial<
  Record<"prenom" | "email" | "telephone" | "code_postal" | "ville" | "message", string>
>;

// États de la détection ville à partir du code postal (geo.api.gouv.fr).
type CpState = "idle" | "loading" | "single" | "multi" | "notfound" | "error";

export default function ContactForm() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville, setVille] = useState("");
  const [communes, setCommunes] = useState<string[]>([]);
  const [cpState, setCpState] = useState<CpState>("idle");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Détection de la ville à partir du code postal via l'API officielle
  // geo.api.gouv.fr (publique, CORS-friendly). Debounce léger + annulation de
  // la requête précédente. (Même logique que le formulaire de devis.)
  useEffect(() => {
    const cp = codePostal.trim();
    const valid = /^\d{5}$/.test(cp);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      if (!valid) {
        setCpState("idle");
        setCommunes([]);
        setVille("");
        return;
      }
      setCpState("loading");
      try {
        const res = await fetch(
          `https://geo.api.gouv.fr/communes?codePostal=${cp}&fields=nom&format=json`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Array<{ nom?: string }> = await res.json();
        const noms = Array.from(
          new Set(data.map((c) => c.nom).filter((n): n is string => Boolean(n))),
        ).sort((a, b) => a.localeCompare(b, "fr"));

        if (noms.length === 0) {
          setCpState("notfound");
          setCommunes([]);
          setVille("");
        } else if (noms.length === 1) {
          setCommunes(noms);
          setVille(noms[0]);
          setCpState("single");
        } else {
          setCommunes(noms);
          setCpState("multi");
          setVille((v) => (noms.includes(v) ? v : ""));
        }
      } catch {
        if (controller.signal.aborted) return;
        setCpState("error");
        setCommunes([]);
      }
    }, valid ? 400 : 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [codePostal]);

  function validate(): Errors {
    const e: Errors = {};
    if (!prenom.trim()) e.prenom = "Merci d'indiquer votre prénom.";
    if (!email.trim()) {
      e.email = "Merci d'indiquer votre email.";
    } else if (!isEmailValid(email)) {
      e.email = "Adresse email invalide.";
    }
    if (!telephone.trim()) {
      e.telephone = "Merci d'indiquer votre téléphone.";
    } else if (!isPhoneValid(telephone)) {
      e.telephone = "Numéro invalide (ex. 06 12 34 56 78).";
    }
    if (!codePostal.trim()) {
      e.code_postal = "Merci d'indiquer votre code postal.";
    } else if (!isPostalValid(codePostal)) {
      e.code_postal = "Code postal invalide (5 chiffres).";
    }
    if (!ville.trim()) {
      e.ville =
        cpState === "multi"
          ? "Sélectionnez votre commune."
          : "Merci d'indiquer votre ville.";
    }
    if (!message.trim()) e.message = "Merci d'écrire votre message.";
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom.trim() || null,
          prenom: prenom.trim(),
          email: email.trim(),
          telephone: telephone.trim(),
          code_postal: codePostal.trim(),
          ville: ville.trim(),
          message: message.trim(),
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
        "Impossible d'envoyer le message (connexion). Réessayez ou appelez-nous directement.",
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
        <h2>Message envoyé ✅</h2>
        <p>
          Merci {prenom.trim()} ! Votre message a bien été envoyé, nous vous
          répondons rapidement.
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
      <h2 className="section-title" style={{ fontSize: "20px" }}>
        Envoyez-nous un message
      </h2>

      {submitError ? (
        <div className="form-error-banner" role="alert">
          {submitError} <a href="tel:0484350486">Appeler le 04 84 35 04 86</a>
        </div>
      ) : null}

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="prenom">
            Prénom <span className="req">*</span>
          </label>
          <input
            id="prenom"
            name="prenom"
            type="text"
            autoComplete="given-name"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className={errors.prenom ? "invalid" : undefined}
            aria-invalid={!!errors.prenom}
          />
          {errors.prenom ? (
            <span className="form-error">{errors.prenom}</span>
          ) : null}
        </div>
        <div className="form-field">
          <label htmlFor="nom">Nom</label>
          <input
            id="nom"
            name="nom"
            type="text"
            autoComplete="family-name"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="email">
            Email <span className="req">*</span>
          </label>
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
          {errors.email ? (
            <span className="form-error">{errors.email}</span>
          ) : null}
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

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="code_postal">
            Code postal <span className="req">*</span>
          </label>
          <input
            id="code_postal"
            name="code_postal"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="06000"
            maxLength={5}
            value={codePostal}
            onChange={(e) =>
              setCodePostal(e.target.value.replace(/\D/g, "").slice(0, 5))
            }
            className={errors.code_postal ? "invalid" : undefined}
            aria-invalid={!!errors.code_postal}
          />
          {errors.code_postal ? (
            <span className="form-error">{errors.code_postal}</span>
          ) : cpState === "loading" ? (
            <span className="form-hint cp-hint">Recherche de la commune…</span>
          ) : cpState === "notfound" ? (
            <span className="form-error">
              Code postal introuvable, vérifiez votre saisie.
            </span>
          ) : null}
        </div>

        <div className="form-field">
          <label htmlFor="ville">
            Ville <span className="req">*</span>
          </label>

          {cpState === "multi" ? (
            <select
              id="ville"
              name="ville"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className={errors.ville ? "invalid" : undefined}
              aria-invalid={!!errors.ville}
            >
              <option value="">— Choisissez votre commune —</option>
              {communes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          ) : cpState === "single" ? (
            <input
              id="ville"
              name="ville"
              type="text"
              value={ville}
              readOnly
              aria-readonly="true"
              className="ville-detectee"
            />
          ) : (
            <input
              id="ville"
              name="ville"
              type="text"
              autoComplete="address-level2"
              placeholder="Votre commune"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className={errors.ville ? "invalid" : undefined}
              aria-invalid={!!errors.ville}
            />
          )}

          {cpState === "single" ? (
            <span className="form-hint cp-hint cp-ok">
              ✓ Ville détectée automatiquement
            </span>
          ) : cpState === "error" ? (
            <span className="form-hint cp-hint">
              Détection indisponible — saisissez votre ville.
            </span>
          ) : null}
          {errors.ville ? (
            <span className="form-error">{errors.ville}</span>
          ) : null}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="message">
          Votre demande <span className="req">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={errors.message ? "invalid" : undefined}
          aria-invalid={!!errors.message}
        />
        {errors.message ? (
          <span className="form-error">{errors.message}</span>
        ) : null}
      </div>

      <button type="submit" className="btn-cta-inline" disabled={submitting}>
        <svg viewBox="0 0 24 24">
          <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
        </svg>
        {submitting ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
