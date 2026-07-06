import { Resend } from "resend";

// ─────────────────────────────────────────────────────────────────────────
// Emails de notification (Resend). Utilisé côté serveur uniquement.
//
// Expéditeur : domaine de TEST Resend pour l'instant. Au go-live, vérifier le
// domaine aquapureplomberie.fr dans Resend et remplacer FROM par une adresse
// de ce domaine (ex. "AQUAPURE Plomberie <devis@aquapureplomberie.fr>").
// ─────────────────────────────────────────────────────────────────────────
const FROM = "AQUAPURE Plomberie <onboarding@resend.dev>";

// Boîte de réception AQUAPURE : reçoit les messages du formulaire de contact
// ET une copie de chaque demande de devis (en plus de DEVIS_NOTIFICATION_EMAIL).
const AQUAPURE_INBOX = "aquapureplomberie@gmail.com";

const NAVY = "#0D2B45";
const ORANGE = "#E8640A";
const WHATSAPP = "#25D366";

let resendClient: Resend | null = null;
function getResend(): Resend {
  if (resendClient) return resendClient;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY manquante.");
  resendClient = new Resend(key);
  return resendClient;
}

export type DevisData = {
  id: string;
  nom: string;
  telephone: string;
  email: string | null;
  code_postal: string | null;
  ville: string | null;
  type_besoin: string;
  message: string | null;
  urgence: boolean;
  canal_prefere: string | null;
  created_at?: string;
};

// Échappe le HTML des valeurs saisies par l'utilisateur.
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Normalise un numéro FR en format international sans "+" (ex. "33612345678").
// Renvoie null si le numéro n'est pas exploitable.
export function toIntlFr(raw: string): string | null {
  let p = raw.replace(/[\s.\-()]/g, "").replace(/^\+/, "");
  if (p.startsWith("0033")) p = p.slice(2);
  else if (p.startsWith("33")) {
    /* déjà au format international */
  } else if (p.startsWith("0")) p = "33" + p.slice(1);
  return /^33[1-9]\d{8}$/.test(p) ? p : null;
}

function telHref(raw: string): string {
  return "tel:" + raw.replace(/[\s.\-()]/g, "");
}

function formatDate(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    dateStyle: "long",
    timeStyle: "short",
  });
}

function button(href: string, label: string, bg: string): string {
  return `<a href="${href}" style="display:inline-block;background:${bg};color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 22px;border-radius:10px;margin:6px 6px 6px 0;">${label}</a>`;
}

function shell(title: string, inner: string): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;padding:0;background:#f2f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f4f7;padding:20px 0;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
        <tr><td style="background:${NAVY};padding:22px 24px;">
          <span style="color:#ffffff;font-size:18px;font-weight:800;">AQUAPURE Plomberie</span>
          <span style="color:#9fb3c8;font-size:13px;"> — ${title}</span>
        </td></tr>
        <tr><td style="padding:24px;color:#0D1B2A;font-size:15px;line-height:1.6;">${inner}</td></tr>
        <tr><td style="background:#f7f8fa;padding:16px 24px;color:#6b7280;font-size:12px;line-height:1.5;border-top:1px solid #e5e7eb;">
          AQUAPURE Plomberie · 29 Boulevard Victor Hugo, 06000 Nice · 7j/7 24h/24<br>
          Zone d'intervention : Côte d'Azur — Alpes-Maritimes (06) &amp; Var (83)<br>
          <a href="tel:0484350486" style="color:${ORANGE};text-decoration:none;">04 84 35 04 86</a> ·
          <a href="mailto:contact@aquapureplomberie.fr" style="color:${ORANGE};text-decoration:none;">contact@aquapureplomberie.fr</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// ── Email de NOTIFICATION (pour Mehdi) ──
function notificationHtml(d: DevisData): string {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;width:150px;vertical-align:top;">${k}</td><td style="padding:8px 0;color:#0D1B2A;font-size:15px;font-weight:600;">${v}</td></tr>`;

  const intl = toIntlFr(d.telephone);
  const buttons =
    button(telHref(d.telephone), "📞 Appeler le client", ORANGE) +
    (intl ? button(`https://wa.me/${intl}`, "💬 Rappeler sur WhatsApp", WHATSAPP) : "");

  const urgenceBadge = d.urgence
    ? `<div style="display:inline-block;background:#FEE2E2;color:#B91C1C;font-weight:800;font-size:13px;padding:6px 12px;border-radius:8px;margin-bottom:14px;">⚠️ URGENCE — rappel immédiat</div><br>`
    : "";

  const inner = `
    ${urgenceBadge}
    <p style="margin:0 0 16px;font-size:16px;">Nouvelle demande de devis reçue :</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;">
      ${row("Nom", esc(d.nom))}
      ${row("Téléphone", esc(d.telephone))}
      ${row("Email", d.email ? esc(d.email) : "—")}
      ${row("Code postal", d.code_postal ? esc(d.code_postal) : "—")}
      ${row("Ville", d.ville ? esc(d.ville) : "—")}
      ${row("Type de besoin", esc(d.type_besoin))}
      ${row("Message", d.message ? esc(d.message).replace(/\n/g, "<br>") : "—")}
      ${row("Urgence", d.urgence ? "OUI" : "Non")}
      ${row("Canal préféré", d.canal_prefere ? esc(d.canal_prefere) : "—")}
      ${row("Reçu le", formatDate(d.created_at))}
    </table>
    <div style="margin-top:22px;">${buttons}</div>`;

  return shell("nouvelle demande", inner);
}

// ── ACCUSÉ DE RÉCEPTION (pour le client) ──
function acknowledgementHtml(d: DevisData): string {
  const inner = `
    <p style="margin:0 0 14px;font-size:16px;">Bonjour ${esc(d.nom)},</p>
    <p style="margin:0 0 14px;">Merci pour votre demande de devis — nous l'avons bien reçue. Mehdi vous recontacte dans les plus brefs délais.</p>
    <div style="background:#FFF3EA;border-left:4px solid ${ORANGE};border-radius:0 10px 10px 0;padding:14px 18px;margin:18px 0;">
      <strong>C'est une urgence ?</strong> Appelez-nous directement au
      <a href="tel:0484350486" style="color:${ORANGE};text-decoration:none;font-weight:700;">04 84 35 04 86</a> — disponible 24h/24, 7j/7.
    </div>
    <p style="margin:0 0 6px;color:#6b7280;font-size:13px;">Récapitulatif de votre demande :</p>
    <p style="margin:0 0 14px;font-size:15px;">${esc(d.type_besoin)}${d.message ? " — " + esc(d.message) : ""}</p>
    ${
      d.code_postal || d.ville
        ? `<p style="margin:0 0 14px;font-size:15px;">📍 ${esc([d.code_postal, d.ville].filter(Boolean).join(" "))}</p>`
        : ""
    }
    <p style="margin:18px 0 0;">Nos coordonnées :<br>
      ☎ <a href="tel:0484350486" style="color:${ORANGE};text-decoration:none;">04 84 35 04 86</a><br>
      ✉ <a href="mailto:contact@aquapureplomberie.fr" style="color:${ORANGE};text-decoration:none;">contact@aquapureplomberie.fr</a>
    </p>
    <p style="margin:16px 0 0;color:#6b7280;">À très vite,<br>L'équipe AQUAPURE Plomberie</p>`;

  return shell("votre demande de devis", inner);
}

// Envoie un email vers les boîtes de notification AQUAPURE : l'adresse
// configurée (DEVIS_NOTIFICATION_EMAIL) ET aquapureplomberie@gmail.com. Chaque
// destinataire est traité par un envoi INDÉPENDANT : l'échec de l'un (ex.
// restriction du domaine d'envoi en mode test Resend) ne prive pas l'autre.
// Ne lève que si TOUS les envois échouent (l'appelant gère).
async function sendToInboxes(opts: {
  subject: string;
  html: string;
  replyTo?: string;
  label: string;
}): Promise<void> {
  const configured = process.env.DEVIS_NOTIFICATION_EMAIL;
  const recipients = Array.from(
    new Set([configured, AQUAPURE_INBOX].filter((v): v is string => !!v)),
  );
  if (recipients.length === 0) {
    throw new Error("Aucune adresse de notification configurée.");
  }

  const results = await Promise.allSettled(
    recipients.map(async (to) => {
      const { error } = await getResend().emails.send({
        from: FROM,
        to,
        replyTo: opts.replyTo,
        subject: opts.subject,
        html: opts.html,
      });
      if (error) throw new Error(error.message || "Échec envoi.");
    }),
  );

  const failures = results.filter((r) => r.status === "rejected");
  for (const f of failures) {
    console.error(
      `[email] ${opts.label} — échec partiel :`,
      (f as PromiseRejectedResult).reason,
    );
  }
  if (failures.length === recipients.length) {
    throw new Error(`Échec envoi ${opts.label} à tous les destinataires.`);
  }
}

// Notification d'une demande de devis → boîtes AQUAPURE.
export async function sendDevisNotification(d: DevisData): Promise<void> {
  await sendToInboxes({
    subject: `${d.urgence ? "[URGENCE] " : ""}Nouvelle demande de devis - ${d.nom} - ${d.type_besoin}`,
    html: notificationHtml(d),
    replyTo: d.email || undefined,
    label: "notification devis",
  });
}

// Envoie l'accusé de réception au client (uniquement s'il a fourni un email).
export async function sendClientAcknowledgement(d: DevisData): Promise<void> {
  if (!d.email) return;

  const { error } = await getResend().emails.send({
    from: FROM,
    to: d.email,
    subject: "Votre demande de devis - AQUAPURE Plomberie",
    html: acknowledgementHtml(d),
  });
  if (error) throw new Error(error.message || "Échec envoi accusé.");
}

// ── Message du formulaire de CONTACT ─────────────────────────────────────────
export type ContactData = {
  nom: string | null;
  prenom: string;
  email: string;
  telephone: string;
  code_postal: string;
  ville: string;
  message: string;
};

// Envoie le message du formulaire de contact vers les boîtes AQUAPURE.
// replyTo = email du visiteur pour répondre directement. Lève en cas d'échec
// total (géré par la route /api/contact).
export async function sendContactMessage(d: ContactData): Promise<void> {
  const row = (k: string, v: string) =>
    `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;width:120px;vertical-align:top;">${k}</td><td style="padding:8px 0;color:#0D1B2A;font-size:15px;font-weight:600;">${v}</td></tr>`;

  const inner = `
    <p style="margin:0 0 16px;font-size:16px;">Nouveau message depuis le formulaire de contact du site :</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;">
      ${row("Prénom", esc(d.prenom))}
      ${row("Nom", d.nom ? esc(d.nom) : "—")}
      ${row("Email", esc(d.email))}
      ${row("Téléphone", esc(d.telephone))}
      ${row("Code postal", esc(d.code_postal))}
      ${row("Ville", esc(d.ville))}
      ${row("Message", esc(d.message).replace(/\n/g, "<br>"))}
    </table>`;

  await sendToInboxes({
    subject: `Nouveau message de contact - ${d.prenom}${d.nom ? " " + d.nom : ""} (${d.ville})`,
    html: shell("nouveau message de contact", inner),
    replyTo: d.email || undefined,
    label: "message de contact",
  });
}
