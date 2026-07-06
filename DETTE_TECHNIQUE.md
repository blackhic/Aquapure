# Dette technique — AQUAPURE Plomberie

Registre des points en attente / à finaliser avant (ou après) le go-live.
Chaque entrée : **contexte**, **impact**, **action requise**, **fichiers**.

Dernière mise à jour : 2026-07-06.

---

## 1. 🔴 Emails Resend — délivrance vers `aquapureplomberie@gmail.com` (mode test)

**Contexte.** Les emails partent via Resend avec l'expéditeur de **test** `onboarding@resend.dev`. En mode test, Resend ne délivre **qu'à l'adresse du compte** (l'adresse configurée dans `DEVIS_NOTIFICATION_EMAIL`). Tout envoi vers une autre adresse — dont **`aquapureplomberie@gmail.com`** — est refusé (HTTP 403 :
« *You can only send testing emails to your own email address… verify a domain at resend.com/domains* »).

**Impact aujourd'hui.**
- Formulaire de **contact** et **notifications de devis** fonctionnent : ils sont envoyés à l'adresse qui marche (compte Resend) **ET** tentés vers `aquapureplomberie@gmail.com`.
- Les envois sont **indépendants** par destinataire : l'échec vers le gmail ne bloque jamais l'autre envoi (aucune perte de notification). Voir `sendToInboxes()`.
- ⚠️ Résultat : `aquapureplomberie@gmail.com` **ne reçoit encore rien** tant que le domaine n'est pas vérifié.

**Action requise (config, ~5 min).**
1. Sur **resend.com/domains** : ajouter et **vérifier le domaine `aquapureplomberie.fr`** (ajout des enregistrements DNS SPF / DKIM chez le registrar).
2. Changer l'expéditeur `FROM` par une adresse de ce domaine, ex. `AQUAPURE Plomberie <contact@aquapureplomberie.fr>`.
3. (Optionnel) Externaliser `FROM` en variable d'environnement.

Une fois fait, `aquapureplomberie@gmail.com` reçoit contact + devis automatiquement, **sans autre modification de code**.

**Fichiers.** `app/lib/email.ts` (`FROM`, `AQUAPURE_INBOX`, `sendToInboxes`), `app/api/contact/route.ts`, `app/components/ContactForm.tsx`.

---

## 2. 🔴 Go-live — indexation Google (noindex actif)

**Contexte.** Le site est en `noindex, nofollow` tant que `NEXT_PUBLIC_ALLOW_INDEXING` n'est pas à `true` (garde-fou anti-duplicate-content pendant la preview `vercel.app`).

**Action requise.** Au go-live : passer `NEXT_PUBLIC_ALLOW_INDEXING=true` en Production Vercel, sur domaine final. Décision de Brahim (étape 8).

**Fichiers.** `app/layout.tsx` (`allowIndexing`), `docs/go-live.md`.

---

## 3. 🟠 CGV — validation juridique + médiateur de la consommation

**Contexte.** Les CGV sont un **modèle** adapté à l'activité, non validé par un juriste. La désignation d'un **médiateur de la consommation** (obligation légale) est un placeholder `[Médiateur à désigner]`.

**Action requise.** Faire valider les CGV par un professionnel du droit **avant le go-live** ; renseigner le médiateur réel (nom + coordonnées) auquel AQUAPURE adhère.

**Fichiers.** `app/cgv.html/page.tsx`.

---

## 4. 🟠 Tarifs indicatifs — à confirmer par le client

**Contexte.** La grille tarifaire (« à partir de X € ») est calée sur le marché France/PACA 2025-2026, **provisoire**, en attente de validation de Mehdi.

**Action requise.** Confirmer / ajuster les montants (source unique : la const `PRICING`).

**Fichiers.** `app/page.tsx` (const `PRICING`, balisée `TARIFS PROVISOIRES — à confirmer par Mehdi`).

---

## 5. 🟡 Landing pages par ville (`/plombier-[ville]`) — étape 7i

**Contexte.** La bande « villes desservies » du footer et la section villes de la home listent des communes en `<span>` **non cliquables** (aucune page dédiée n'existe encore → pas de lien mort / 404). Les slugs sont déjà prêts.

**Action requise.** Étape 7i : créer les pages `/plombier-[slug]` puis remplacer les `<span>` par des `<Link href={`/plombier-${slug}`}>` (+ ajout au sitemap).

**Fichiers.** `app/components/Footer.tsx` (`FOOTER_CITIES`), `app/page.tsx` (`CITIES`).

---

## 6. 🟡 Photo du fondateur — placeholder

**Contexte.** La section « Le fondateur » utilise une photo générique en attendant une vraie photo de Mehdi Van Ardenne / de l'équipe.

**Action requise.** Remplacer par une photo réelle.

**Fichiers.** `app/page.tsx` (`TODO CLIENT`), `public/photos/plomberie-generale.webp`.

---

## 7. 🟡 JSON-LD — coordonnées géo approximatives

**Contexte.** Les coordonnées `geo` (latitude/longitude) du `LocalBusiness` sont au niveau ville (Nice), non géocodées à l'adresse exacte.

**Action requise.** Affiner au géocodage exact de l'adresse au go-live.

**Fichiers.** `app/layout.tsx` (`localBusinessJsonLd.geo`).

---

## 8. 🟡 Rate-limiting en mémoire (non partagé)

**Contexte.** Les garde-fous anti-abus (`/api/chat`, `/api/chat/lead`, `/api/contact`) utilisent un compteur **en mémoire**, non partagé entre instances serverless Vercel → contournable par un attaquant réparti. Suffisant comme frein v1.

**Action requise (si besoin de robustesse).** Passer à un store partagé (Supabase, Upstash Redis…).

**Fichiers.** `app/api/chat/route.ts`, `app/api/chat/lead/route.ts`, `app/api/contact/route.ts`.
