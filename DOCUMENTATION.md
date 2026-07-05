# AQUAPURE Plomberie — Documentation du projet

**Version : 0.6.0** · Mise à jour : 2026-07-05 · Statut : **en préproduction (preview Vercel, non indexé)**

Site web de refonte pour **AQUAPURE Plomberie** (plombier à Nice). Application
Next.js remplaçant l'ancien site statique, avec conservation des URLs pour le
SEO, génération de demandes de devis (base de données + emails), et déploiement
continu sur Vercel.

- **Prod (preview)** : https://aquapure-umber.vercel.app
- **Domaine cible (go-live)** : https://aquapureplomberie.fr *(pas encore basculé)*
- **Dépôt** : https://github.com/blackhic/Aquapure (branche `main`)

---

## 1. Informations business (source unique — NAP)

| Champ | Valeur |
|---|---|
| Nom | AQUAPURE Plomberie |
| Exploitant | Mehdi Van Ardenne |
| Adresse | 29 Boulevard Victor Hugo, 06000 Nice |
| Téléphone | 04 84 35 04 86 (`+33 4 84 35 04 86`) |
| Email | contact@aquapureplomberie.fr |
| SIRET | 934 336 637 00012 |
| Horaires | 7j/7, 24h/24 |
| Zone | Alpes-Maritimes (06) et est du Var (83) |
| Note | 4,8/5 sur 98 avis Google |

> Le NAP doit rester **strictement identique** partout (SEO local). Contenu de
> référence complet : [`docs/contenu-ancien-site.md`](docs/contenu-ancien-site.md).

---

## 2. Stack technique

| Élément | Détail |
|---|---|
| Framework | **Next.js 16.2.10** (App Router, Turbopack) |
| Langage | **TypeScript**, React 19.2.4 |
| Styling | **CSS pur** (pas de Tailwind) — variables CSS dans `app/globals.css` |
| Rendu | Statique (SSG) + une route API dynamique (`/api/devis`) |
| Base de données | **Supabase** (Postgres) |
| Emails | **Resend** |
| Images | **sharp** (optimisation) + script **OpenAI gpt-image-2** (génération) |
| Hébergement | **Vercel** (projet `lereglo/aquapure`), auto-deploy sur push `main` |
| Node | v26 (dev) |

Palette : navy `#0D2B45`, orange `#E8640A` (+ variables dans `:root`).

---

## 3. Structure du projet

```
app/
  layout.tsx                     Layout racine : metadata globale, Open Graph,
                                 JSON-LD LocalBusiness, garde-fou noindex
  page.tsx                       Page d'accueil (client — FAQ + JSON-LD FAQPage)
  globals.css                    Toutes les styles (variables + composants)
  icon.png / apple-icon.png      Favicons (convention Next)
  favicon.ico                    (aussi dans public/)

  components/
    Navbar.tsx                   Barre de nav (menu déroulant services) [client]
    Footer.tsx                   Pied de page + liens + mentions légales
    StickyBar.tsx                Barre mobile fixe (Appeler / Devis)
    ServicePage.tsx              Gabarit réutilisable des pages service
    DevisForm.tsx                Formulaire de devis [client]
    navLinks.ts                  Source unique des liens de navigation

  lib/
    metadata.ts                  Helper pageMetadata() (title/desc/canonical/OG)
    supabase.ts                  Client Supabase serveur (service_role)
    email.ts                     Envois Resend (notif Mehdi + accusé client)

  api/
    devis/route.ts               POST /api/devis : validation → insert → emails

  # Pages (URLs .html conservées de l'ancien site) :
  depannage-plombier-06-83.html/page.tsx
  installation-renovation-sdb-cuisine-nice.html/page.tsx
  installation-depannage-chauffe-eau-a-nice.html/page.tsx
  plomberie-generale-a-nice.html/page.tsx
  contacter-aquapure-plomberie.html/page.tsx
  mentionslegales.html/page.tsx
  devis/page.tsx                 /devis (formulaire)

  robots.ts                      /robots.txt (conditionnel indexation)
  sitemap.ts                     /sitemap.xml

public/
  photos/*.webp                  9 photos AQUAPURE (générées + optimisées)
  photos/_originals/             Originaux non optimisés (gitignoré, non déployé)

scripts/
  generate-images.mjs            Génération d'images via OpenAI gpt-image-2
  optimize-images.mjs            Compression/redimensionnement via sharp

supabase/
  schema.sql                     Schéma de la table `devis` (à exécuter)

docs/
  contenu-ancien-site.md         Contenu de référence (Google Doc de migration)
  go-live.md                     Checklist de mise en production

_reference/index.html            Maquette HTML/CSS d'origine (référence visuelle)
```

---

## 4. Pages & routes

| URL | Fichier | Description |
|---|---|---|
| `/` | `app/page.tsx` | Accueil : hero, services, processus, tarifs (placeholders), réalisations avant/après, villes, avis, FAQ, réassurance |
| `/depannage-plombier-06-83.html` | `…/page.tsx` | Dépannage & urgences (+ ancres internes) |
| `/installation-renovation-sdb-cuisine-nice.html` | `…/page.tsx` | Rénovation SdB & cuisine |
| `/installation-depannage-chauffe-eau-a-nice.html` | `…/page.tsx` | Chauffe-eau / ballon |
| `/plomberie-generale-a-nice.html` | `…/page.tsx` | Plomberie générale |
| `/contacter-aquapure-plomberie.html` | `…/page.tsx` | Contact (coordonnées + formulaire mailto) |
| `/mentionslegales.html` | `…/page.tsx` | Mentions légales & RGPD |
| `/devis` | `app/devis/page.tsx` | Formulaire de demande de devis (→ Supabase) |
| `/api/devis` | `app/api/devis/route.ts` | **POST** — enregistre une demande + emails |
| `/robots.txt`, `/sitemap.xml` | `robots.ts`, `sitemap.ts` | SEO |

Les pages service partagent le composant `ServicePage` (hero + sections +
photo). Navbar/Footer/StickyBar sont réutilisés sur toutes les pages.

---

## 5. Fonctionnalités

### 5.1 Front / contenu
- Refonte complète de la maquette d'origine en composants React.
- Navigation : **Accueil · Les services proposés ▾ (déroulant) · Contact**
  (desktop) ; liens dans le footer + sticky bar (mobile).
- Home enrichie : processus en 5 étapes, tarifs indicatifs (**placeholders
  `XX €` balisés `TODO CLIENT`**), galerie avant/après, villes desservies
  (slugs prêts pour de futures pages `/plombier-[ville]`), bandeau réassurance.
- Responsive mobile-first (breakpoints 1024 / 900 / 600 px).

### 5.2 SEO technique
- **Title + meta description** exacts de l'ancien site sur chaque page.
- **URLs `.html` conservées** à l'identique (dossiers nommés avec `.html`).
- **Open Graph** (fr_FR) par page via `pageMetadata()` + `metadataBase`.
- **canonical** par page.
- **JSON-LD** : `LocalBusiness`/`Plumber` (NAP, geo, horaires 24/7, areaServed
  06+83, aggregateRating 4,8/98) dans le layout + `FAQPage` sur la home.
- **sitemap.xml** (7 URLs, priorités 1.0/0.9/0.5) et **robots.txt**, pointant
  vers le domaine final `aquapureplomberie.fr`.
- **Garde-fou anti-indexation** (voir §8).

### 5.3 Images
- 9 photos générées via **OpenAI gpt-image-2** (`scripts/generate-images.mjs`,
  streaming + retries), puis optimisées via **sharp**
  (`scripts/optimize-images.mjs`) : toutes **< 200 Ko**, originaux conservés
  dans `public/photos/_originals/` (non déployés).
- Favicons dérivés du logo goutte d'eau (détouré via masque canal rouge).
- Toutes les images en `<img>` locales (plus aucune dépendance Pexels).

### 5.4 Demande de devis (parcours complet)
1. **Page `/devis`** — formulaire client (`DevisForm.tsx`) : nom, téléphone,
   email, type de besoin, message, urgence, canal préféré. Validation FR côté
   client + états envoi / succès / erreur.
2. **`POST /api/devis`** — validation serveur (nom, téléphone, type_besoin) →
   insertion Supabase (client `service_role`) → emails Resend.
3. **Emails** (`lib/email.ts`) : notification à Mehdi (infos + bouton WhatsApp
   `wa.me/33…` + bouton appel) et accusé de réception au client (si email
   fourni). HTML responsive navy/orange.
- **Robustesse** : les emails sont envoyés **après** l'insertion et n'échouent
  jamais la réponse (`Promise.allSettled`, catch indépendants) — un lead n'est
  jamais perdu même si Resend est indisponible.

---

## 6. Modèle de données — table `devis` (Supabase)

| Colonne | Type | Contrainte |
|---|---|---|
| `id` | uuid | PK, `gen_random_uuid()` |
| `created_at` | timestamptz | `now()` |
| `nom` | text | NOT NULL |
| `telephone` | text | NOT NULL |
| `email` | text | nullable |
| `type_besoin` | text | NOT NULL |
| `message` | text | nullable |
| `urgence` | boolean | défaut `false` |
| `canal_prefere` | text | `telephone` / `whatsapp` / `email` |
| `statut` | text | défaut `nouveau` (→ `traité`, pour l'admin à venir) |

**RLS activée, sans policy** : le rôle public (`anon`) n'a aucun accès. Les
écritures passent uniquement par la route API serveur (clé `service_role`, qui
contourne la RLS). Schéma : [`supabase/schema.sql`](supabase/schema.sql).

---

## 7. Variables d'environnement

Définies dans `.env.local` (local, **gitignoré**) et sur **Vercel** (Production).

| Variable | Rôle | Exposée client ? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | oui (publique) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon Supabase | oui (publique) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé admin Supabase (bypass RLS) | **non — serveur only** |
| `RESEND_API_KEY` | Clé API Resend | **non — serveur only** |
| `DEVIS_NOTIFICATION_EMAIL` | Destinataire des notifications | non |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Autorise l'indexation (défaut `false`) | oui |
| `ADMIN_PASSWORD` | Mot de passe unique de l'espace `/admin` (Mehdi) | **non — serveur only** |
| `ADMIN_SESSION_SECRET` | Secret aléatoire pour signer le cookie de session admin (HMAC-SHA256) | **non — serveur only** |
| `OPENAI_API_KEY` | Embeddings base de connaissances (`text-embedding-3-small`, serveur) + génération d'images (script dev) | **non — serveur only** |

> ⚠️ Aucune clé ne doit être commitée. `.env.local` est ignoré par git ;
> `public/photos/_originals/` aussi. Le fichier **`.env.local.example`**
> (versionné, sans aucune valeur réelle) sert de référence pour les variables
> à définir en local et sur Vercel.
>
> `ADMIN_SESSION_SECRET` : générer une valeur aléatoire, p.ex.
> `openssl rand -hex 32`.

---

## 8. Sécurité & garde-fous

- **Secrets** : jamais commités (`.env*` gitignoré).
- **`service_role`** : uniquement côté serveur (pas de préfixe `NEXT_PUBLIC_`),
  importée seulement par la route API.
- **RLS** Supabase activée (aucun accès public direct).
- **Anti-indexation** : tant que `NEXT_PUBLIC_ALLOW_INDEXING` ≠ `true`,
  `robots.txt` renvoie `Disallow: /` **et** toutes les pages portent
  `<meta name="robots" content="noindex, nofollow">`. Objectif : éviter le
  duplicate content avec l'ancien site encore en ligne. Se lève d'un seul
  réglage au go-live.
- **Validation** double (client + serveur) sur le formulaire de devis.
- **Emails** : erreurs génériques côté client, détails loggés côté serveur.

---

## 9. Scripts npm

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint |
| `npm run generate-images` | Génère les images via OpenAI gpt-image-2 |
| `npm run optimize-images` | Compresse/redimensionne les images via sharp |

---

## 10. Déploiement

- **Vercel**, projet `lereglo/aquapure`, connecté au dépôt GitHub.
- **Auto-deploy** : chaque `push` sur `main` déclenche un build + déploiement.
- URL de prod (alias stable) : `aquapure-umber.vercel.app`.
- Les variables d'environnement doivent être présentes sur Vercel (Production)
  pour que Supabase et Resend fonctionnent. Un changement de variable nécessite
  un **redéploiement** (les `NEXT_PUBLIC_*` sont injectées au build).

---

## 11. Checklist go-live

Voir [`docs/go-live.md`](docs/go-live.md). En résumé :

1. Basculer le domaine `aquapureplomberie.fr` + éteindre l'ancien site.
2. `NEXT_PUBLIC_ALLOW_INDEXING=true` sur Vercel + redéployer (lève le noindex).
3. **Resend** : vérifier le domaine `aquapureplomberie.fr` + changer la
   constante `FROM` dans `app/lib/email.ts` (sinon les accusés clients et la
   notif vers le vrai email de Mehdi ne partent pas — limite du mode test).
4. `DEVIS_NOTIFICATION_EMAIL` = email réel de Mehdi.
5. Corriger l'hébergeur des **mentions légales** (OVH → Vercel).
6. Soumettre le sitemap dans **Google Search Console**.
7. Nettoyer les **lignes de test** de la table `devis`.
8. Remplacer les **placeholders** : prix réels (`TODO CLIENT`), vraie photo de
   Mehdi (section fondateur), logo vectoriel HD pour le favicon.

---

## 12. Historique (commits)

| Étape | Commit | Description |
|---|---|---|
| 5c | `4afbd72` | Notifications email Resend (notif Mehdi + accusé client) |
| 5b | `0c9d973` | Page `/devis` + formulaire branché sur `/api/devis` |
| 5a | `864ae6a` | Fondation DB Supabase (table `devis` + route API) |
| — | `6713e27` | Favicon AQUAPURE |
| — | `d146adf` | SEO technique + garde-fou noindex |
| — | `14e0e98` | Photos gpt-image-2 optimisées (sharp), remplacement Pexels |
| — | `37b8983` | Home enrichie (processus, tarifs, réalisations, villes, réassurance) |
| — | `c0276a2` | Menu déroulant services + page Contact |
| — | `00dc0ca` | 4 pages service (URLs `.html`) + composants |
| — | `6df9b86` | Setup Next.js + portage de la maquette |

---

## 13. Roadmap / à venir

- **Étape 6** : espace admin (lister/traiter les demandes, statut `nouveau`/`traité`).
- Formulaire de la page **Contact** à brancher (actuellement `mailto:`).
- **Enrichissement contenu** : textes définitifs, vrais tarifs, vraies photos de
  chantier (avant/après supplémentaires), image Open Graph dédiée 1200×630.
- **Pages locales** par ville (`/plombier-[ville]`), slugs déjà préparés.
- Décision sur les CTA `inline-cta` (actuellement appel direct `tel:`).
