# AQUAPURE Plomberie — Documentation du projet

**Version : 0.7.0** · Mise à jour : 2026-07-06 · Statut : **en préproduction (preview Vercel, non indexé)**

Site web de refonte pour **AQUAPURE Plomberie** (plombier à Nice et sur la Côte
d'Azur). Application Next.js remplaçant l'ancien site statique, avec conservation
des URLs pour le SEO, génération de demandes de devis (base de données + emails),
chatbot RAG, espace admin, et déploiement continu sur Vercel.

- **Prod (preview)** : https://aquapure-umber.vercel.app
- **Domaine cible (go-live)** : https://aquapureplomberie.fr *(pas encore basculé)*
- **Dépôt** : https://github.com/blackhic/Aquapure (branche `main`)
- **Dette technique / points en attente** : [`DETTE_TECHNIQUE.md`](DETTE_TECHNIQUE.md)

---

## 1. Informations business (source unique — NAP)

| Champ | Valeur |
|---|---|
| Nom | AQUAPURE Plomberie |
| Exploitant | Mehdi Van Ardenne (entreprise individuelle) |
| Adresse | 29 Boulevard Victor Hugo, 06000 Nice |
| Téléphone | 04 84 35 04 86 (`+33 4 84 35 04 86`) |
| Email | contact@aquapureplomberie.fr |
| SIRET | 934 336 637 00012 |
| Horaires | 7j/7, 24h/24 |
| Zone | **Côte d'Azur — Alpes-Maritimes (06) et Var (83)** |
| Note | **5,0/5 sur 29 avis Google** |
| Assurances | Garantie décennale + responsabilité civile professionnelle |

> **NAP SEO** : le nom, l'adresse et le téléphone (+ le mot-clé « Nice » dans les
> `title`/`H1`/`meta`/JSON-LD) restent **strictement identiques** partout. Le
> discours géographique éditorial (hors balises SEO) a été élargi vers « Côte
> d'Azur · 06 & 83 » avec le **Var mis en avant** (Mehdi basé côté Var).

---

## 2. Stack technique

| Élément | Détail |
|---|---|
| Framework | **Next.js 16.2.10** (App Router, Turbopack) |
| Langage | **TypeScript**, React 19.2.4 |
| Styling | **CSS pur** (pas de Tailwind) — variables CSS dans `app/globals.css` |
| Rendu | Statique (SSG) + routes API dynamiques (devis, contact, chat, admin) |
| Base de données | **Supabase** (Postgres + **pgvector** pour le RAG) |
| Emails | **Resend** |
| Chatbot | **Anthropic** `claude-haiku-4-5` (RAG en streaming) |
| Embeddings | **OpenAI** `text-embedding-3-small` (1536 dim) |
| Détection ville | **geo.api.gouv.fr** (API publique de l'État, côté client) |
| Images | **sharp** (optimisation) + script **OpenAI gpt-image-2** (génération) |
| Hébergement | **Vercel** (projet `lereglo/aquapure`), auto-deploy sur push `main` |
| Node | v26 (dev) |

Palette : navy `#0D2B45`, orange `#E8640A` (+ variables dans `:root`).

---

## 3. Structure du projet

```
app/
  layout.tsx                     Layout racine : metadata globale, Open Graph,
                                 JSON-LD LocalBusiness, garde-fou noindex, ChatWidget
  page.tsx                       Accueil [client] (FAQ + JSON-LD FAQPage)
  globals.css                    Toutes les styles (variables + composants)
  icon.png / apple-icon.png      Favicons (convention Next)

  components/
    Navbar.tsx                   Nav + menu déroulant desktop + BURGER mobile accessible [client]
    Footer.tsx                   Pied de page : liens, bande villes (Var-first),
                                 liens légaux, crédit agence
    StickyBar.tsx                Barre mobile fixe (Appeler / Devis)
    ServicePage.tsx              Gabarit réutilisable des pages service
    DevisForm.tsx                Formulaire de devis + code postal → ville [client]
    ContactForm.tsx              Formulaire de contact serveur + code postal → ville [client]
    ChatWidget.tsx               Bulle chatbot « Aqua » + capture de lead [client]
    AdminDevisTable.tsx          Liste/traitement des demandes (admin) [client]
    AdminKnowledge.tsx           CRUD base de connaissances (admin) [client]
    AdminNav.tsx / AdminLogoutButton.tsx
    navLinks.ts                  Source unique des liens de navigation

  lib/
    metadata.ts                  Helper pageMetadata() (title/desc/canonical/OG)
    supabase.ts                  Client Supabase serveur (service_role)
    email.ts                     Envois Resend (notif devis + accusé + contact)
    devis.ts                     createDevis() partagé (insert + emails)
    embeddings.ts                Chunking + embeddings OpenAI + littéral pgvector
    chatPrompt.ts                System prompt verrouillé du chatbot « Aqua »
    adminAuth.ts                 Auth admin (HMAC-SHA256, Web Crypto, Edge-ready)

  api/
    devis/route.ts               POST — validation → insert → emails
    contact/route.ts             POST — validation → email de contact (Resend)
    chat/route.ts                POST — RAG + Anthropic en streaming (public)
    chat/lead/route.ts           POST — capture de lead depuis le chatbot
    admin/login|logout/route.ts  Auth admin (cookie de session signé)
    admin/devis/route.ts         PATCH — statut d'une demande
    admin/knowledge/route.ts     POST/PATCH/DELETE — base de connaissances (+embeddings)
    admin/knowledge/search/route.ts  Recherche par similarité (debug)

  admin/                         Espace privé (protégé par middleware.ts)
    login/page.tsx · page.tsx · base-de-connaissances/page.tsx

  # Pages publiques (URLs .html conservées de l'ancien site) :
  depannage-plombier-06-83.html/ · installation-renovation-sdb-cuisine-nice.html/
  installation-depannage-chauffe-eau-a-nice.html/ · plomberie-generale-a-nice.html/
  contacter-aquapure-plomberie.html/ · mentionslegales.html/
  cgu.html/ · cgv.html/ · politique-de-confidentialite.html/ · politique-de-cookies.html/
  devis/page.tsx                 /devis (formulaire)

  robots.ts / sitemap.ts         SEO (indexation conditionnelle)
middleware.ts                    Protège /admin/* (session HMAC)

public/photos/*.webp             11 photos (générées gpt-image-2 + optimisées sharp)
public/photos/_originals/        Originaux non optimisés (gitignoré, non déployé)

scripts/
  generate-images.mjs            Génération OpenAI gpt-image-2 (filtre CLI par nom)
  optimize-images.mjs            Compression/redim. sharp (filtre CLI par nom)

supabase/
  schema.sql                     Table `devis`
  add_cp_ville.sql               + colonnes code_postal / ville
  knowledge_base.sql             Table base de connaissances (documents + Q/R)
  knowledge_chunks.sql           Embeddings pgvector + RPC match_knowledge_chunks
  seed_knowledge_aqua.sql        Seed de 8 entrées « Aqua » (chargées via l'admin)

docs/                            contenu-ancien-site.md · go-live.md
```

---

## 4. Pages & routes

| URL | Description |
|---|---|
| `/` | Accueil : hero immersif, services (cartes cliquables), processus, **tarifs réels**, réalisations avant/après (**+ piscine**), villes, avis (lien Google), FAQ, réassurance |
| `/depannage-plombier-06-83.html` | Dépannage & urgences (ancres internes) |
| `/installation-renovation-sdb-cuisine-nice.html` | Rénovation SdB & cuisine |
| `/installation-depannage-chauffe-eau-a-nice.html` | Chauffe-eau / ballon |
| `/plomberie-generale-a-nice.html` | Plomberie générale |
| `/contacter-aquapure-plomberie.html` | Contact (coordonnées + **formulaire serveur**) |
| `/devis` | Demande de devis (→ Supabase + emails) |
| `/mentionslegales.html` | Mentions légales & RGPD (hébergeur **Vercel**) |
| `/cgu.html` · `/cgv.html` | CGU · CGV *(CGV = modèle à valider par un juriste)* |
| `/politique-de-confidentialite.html` · `/politique-de-cookies.html` | RGPD détaillé · cookies |
| `/admin` (+ `/login`, `/base-de-connaissances`) | Espace privé (Mehdi) — protégé |
| `/api/devis` · `/api/contact` · `/api/chat` · `/api/chat/lead` | Routes publiques |
| `/api/admin/*` | Routes admin (auth requise) |
| `/robots.txt` · `/sitemap.xml` | SEO (11 URLs publiques au sitemap) |

Les pages service partagent `ServicePage`. Navbar/Footer/StickyBar/ChatWidget
sont présents sur toutes les pages publiques.

---

## 5. Fonctionnalités

### 5.1 Front / contenu
- Refonte complète en composants React ; **hero immersif** (photo van + overlay
  navy, bandeau photo mobile).
- **Navigation** : Accueil · Les services proposés ▾ · Contact (desktop) ;
  **menu burger accessible** (drawer, sous-menu services, focus géré, `inert`,
  scroll-lock) sur mobile/tablette (≤ 1024 px).
- **Responsive complet** : zéro débordement horizontal (320 → 1440 px), cibles
  tactiles ≥ 44 px, grilles qui s'empilent ; bulle chat remontée au-dessus de la
  sticky-bar sur mobile.
- Home : processus 5 étapes, **tarifs réels indicatifs** (« à partir de », const
  `PRICING` balisée *à confirmer par Mehdi*), galerie **avant/après** (SdB +
  **local technique piscine**), villes desservies (spans, slugs prêts pour
  `/plombier-[ville]`), cartes services **cliquables**, lien **avis Google**.
- Discours géographique élargi « Côte d'Azur · 06 & 83 » (Var mis en avant) hors
  balises SEO.

### 5.2 SEO technique
- **Title + meta description** exacts de l'ancien site (mot-clé « Nice » conservé).
- **URLs `.html` conservées** à l'identique.
- **Open Graph** (fr_FR) + **canonical** par page via `pageMetadata()`.
- **JSON-LD** : `LocalBusiness`/`Plumber` (NAP, geo, 24/7, areaServed 06+83,
  aggregateRating **5,0 / 29**) + `FAQPage` sur la home.
- **sitemap.xml** (11 URLs) + **robots.txt** → domaine final.
- **Garde-fou anti-indexation** (voir §8).

### 5.3 Images
- **11 photos** générées via **OpenAI gpt-image-2** puis optimisées via **sharp**
  (toutes **< 200 Ko**, originaux dans `_originals/` gitignoré). Les deux scripts
  acceptent un **filtre CLI par nom** pour ne (re)générer/optimiser que des
  images ciblées (évite de refacturer/écraser les autres).

### 5.4 Demande de devis
1. **`/devis`** (`DevisForm`) : nom, téléphone, email, **code postal → ville
   auto** (geo.api.gouv.fr), type de besoin, message, urgence, canal. Validation
   FR client + états envoi/succès/erreur (+ scroll auto vers la confirmation).
2. **`POST /api/devis`** → validation serveur (dont CP 5 chiffres + ville) →
   insert Supabase (`service_role`) → emails Resend, via `createDevis()` partagé.
3. **Emails** (`lib/email.ts`) : notification (infos + WhatsApp + appel) envoyée à
   `DEVIS_NOTIFICATION_EMAIL` **ET** `aquapureplomberie@gmail.com` (**envois
   indépendants** — l'échec d'un destinataire ne bloque pas l'autre) + accusé au
   client. Non bloquant (`Promise.allSettled`).

### 5.5 Formulaire de contact
- **`ContactForm` + `POST /api/contact`** : envoi **serveur** via Resend (remplace
  l'ancien `mailto:`). Champs : **prénom, email, téléphone, code postal → ville
  auto, message** (obligatoires) ; **nom** facultatif. Destinataires : mêmes
  boîtes que la notif devis (adresse configurée + `aquapureplomberie@gmail.com`).

### 5.6 Chatbot « Aqua » (RAG)
- Bulle publique (`ChatWidget`) → **`POST /api/chat`** : embed de la question →
  recherche de similarité pgvector (`match_knowledge_chunks`) → réponse
  **Anthropic** en streaming, ancrée dans la base de connaissances uniquement.
- **System prompt verrouillé** (`chatPrompt.ts`) : périmètre plomberie (dont
  **piscine** : plomberie/filtration/local technique), réponses **courtes en
  prose** (pas de listes/émojis), orientation appel/devis, jamais de prix ferme.
  Nomme le fondateur **uniquement** pour l'identité/présentation, jamais pour le
  contact (« appelez-nous »).
- **Base de connaissances** : 8 entrées thématiques (`seed_knowledge_aqua.sql`),
  chargées **via l'API admin** (POST → embedding auto « embed avant écriture »).
- **Capture de lead** (`/api/chat/lead`) : bouton « Être rappelé » → écrit dans
  la table `devis` (préfixe `[Chatbot]`).

### 5.7 Espace admin (`/admin`)
- Accès protégé par **cookie de session HMAC** (`middleware.ts` + `adminAuth.ts`),
  mot de passe unique `ADMIN_PASSWORD`.
- **Demandes de devis** : liste, filtres, bascule statut, actions appel/WhatsApp/mail.
- **Base de connaissances** : CRUD (document/Q-R) avec (ré)génération des
  embeddings à chaque écriture (fail-closed : rien n'est écrit sans son embedding).

### 5.8 Documentation légale
- Pages **Mentions légales** (hébergeur corrigé **OVH → Vercel**), **CGU**, **CGV**
  (modèle à faire valider par un juriste + médiateur à désigner), **Politique de
  confidentialité** (sous-traitants réels), **Politique de cookies** (pas de
  traceur → pas de bannière). Liens groupés dans le footer.

---

## 6. Modèle de données (Supabase)

### Table `devis`
| Colonne | Type | Contrainte |
|---|---|---|
| `id` | uuid | PK, `gen_random_uuid()` |
| `created_at` | timestamptz | `now()` |
| `nom` | text | NOT NULL |
| `telephone` | text | NOT NULL |
| `email` | text | nullable |
| `code_postal` | text | nullable (obligatoire côté formulaire) |
| `ville` | text | nullable (obligatoire côté formulaire) |
| `type_besoin` | text | NOT NULL |
| `message` | text | nullable |
| `urgence` | boolean | défaut `false` |
| `canal_prefere` | text | `telephone` / `whatsapp` / `email` |
| `statut` | text | défaut `nouveau` (→ `traité`) |

### Base de connaissances (chatbot)
- **`knowledge_base`** : `id, type (document|qa), title, question, content,
  created_at, updated_at` (trigger `updated_at`).
- **`knowledge_chunks`** : `id, source_id (FK → knowledge_base, ON DELETE
  CASCADE), chunk_text, embedding vector(1536), created_at` + index **HNSW**
  cosine + RPC `match_knowledge_chunks(query_embedding, match_count)`.

**RLS activée, sans policy** sur toutes les tables : aucun accès public direct ;
tout passe par les routes serveur (`service_role`). Fichiers : `supabase/*.sql`.

---

## 7. Variables d'environnement

Définies dans `.env.local` (local, **gitignoré**) et sur **Vercel** (Production).

| Variable | Rôle | Exposée client ? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | oui (publique) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon Supabase | oui (publique) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé admin Supabase (bypass RLS) | **non — serveur only** |
| `RESEND_API_KEY` | Clé API Resend | **non — serveur only** |
| `DEVIS_NOTIFICATION_EMAIL` | Destinataire principal des notifications | non |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Autorise l'indexation (défaut `false`) | oui |
| `ADMIN_PASSWORD` | Mot de passe de l'espace `/admin` | **non — serveur only** |
| `ADMIN_SESSION_SECRET` | Secret HMAC du cookie de session admin | **non — serveur only** |
| `OPENAI_API_KEY` | Embeddings (serveur) + génération d'images (script dev) | **non — serveur only** |
| `ANTHROPIC_API_KEY` | Chatbot « Aqua » (`claude-haiku-4-5`) | **non — serveur only** |

> ⚠️ Aucune clé commitée. `.env.local` et `public/photos/_originals/` sont
> gitignorés. `.env.local.example` (versionné, sans valeur) sert de référence.
> `ADMIN_SESSION_SECRET` : `openssl rand -hex 32`.
>
> La boîte `aquapureplomberie@gmail.com` (contact + copie devis) est une
> **constante** dans `app/lib/email.ts` (`AQUAPURE_INBOX`), pas une variable env.

---

## 8. Sécurité & garde-fous

- **Secrets** jamais commités (`.env*` gitignoré) ; `service_role` serveur only.
- **RLS** Supabase activée sur toutes les tables (aucun accès public direct).
- **Admin** : middleware + cookie HMAC ; les routes `/api/admin/*` revérifient la
  session (le middleware ne couvre que les pages).
- **Anti-indexation** : tant que `NEXT_PUBLIC_ALLOW_INDEXING` ≠ `true`,
  `robots.txt` = `Disallow: /` **et** toutes les pages portent
  `<meta name="robots" content="noindex, nofollow">`. Se lève d'un réglage au go-live.
- **Validation double** (client + serveur) sur devis et contact.
- **Anti-abus** : rate-limit en mémoire sur `/api/chat`, `/api/chat/lead`,
  `/api/contact` (best-effort, non partagé entre instances — cf. dette technique).
- **Chatbot** : anti-injection (rôle verrouillé), réponses uniquement depuis le
  contexte RAG, clés jamais exposées (streaming relayé côté serveur).

---

## 9. Scripts npm

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint |
| `npm run generate-images [noms…]` | Génère les images via OpenAI gpt-image-2 |
| `npm run optimize-images [noms…]` | Compresse/redimensionne via sharp |

---

## 10. Déploiement

- **Vercel**, projet `lereglo/aquapure`, connecté au dépôt GitHub.
- **Auto-deploy** : chaque `push` sur `main` déclenche un build + déploiement.
- Les variables d'environnement doivent être présentes sur Vercel (Production).
  Un changement de `NEXT_PUBLIC_*` nécessite un **redéploiement**.
- Les seeds SQL (`supabase/*.sql`) sont à exécuter manuellement dans le SQL
  Editor Supabase ; la base de connaissances se charge **via l'admin** (embeddings).

---

## 11. Checklist go-live & dette technique

Le suivi complet des points en attente est dans **[`DETTE_TECHNIQUE.md`](DETTE_TECHNIQUE.md)**.
Points bloquants principaux :

1. **Indexation** : `NEXT_PUBLIC_ALLOW_INDEXING=true` + domaine final `aquapureplomberie.fr`.
2. **Resend** : vérifier le domaine + changer `FROM` (sinon les envois vers
   `aquapureplomberie@gmail.com` et les accusés clients restent bloqués — mode test).
3. **CGV** : validation juriste + désignation du médiateur de la consommation.
4. **Tarifs** : confirmation des montants par Mehdi.
5. Soumettre le sitemap à **Google Search Console** ; nettoyer les lignes de test `devis`.
6. Remplacer la **photo du fondateur** (placeholder) ; affiner le **geo JSON-LD**.

✅ Déjà faits : hébergeur mentions légales (OVH → Vercel), tarifs réels,
réalisation piscine, base de connaissances chatbot chargée.

---

## 12. Historique (commits — étape 7)

| Étape | Commit | Description |
|---|---|---|
| — | `5e9cb45` | Crédit agence discret dans le footer |
| — | `9dec95e` | Registre de dette technique (`DETTE_TECHNIQUE.md`) |
| — | `2bc7d2b` | Formulaire de contact serveur + copie devis vers la boîte AQUAPURE |
| — | `dcc0baa` / `e35d0fd` | Aqua : nom fondateur (identité only) ; fix périmètre piscine |
| — | `f143c55` / `a3a30a8` | Base de connaissances Aqua (seed 8 entrées) + concision |
| — | `13603de` / `96e5e35` | Cartes services cliquables + lien avis ; scroll confirmation devis |
| 7h | `731cab4` | Pages légales (CGU/CGV/confidentialité/cookies) + hébergeur Vercel |
| 7g | `c4e3734` | Réalisation avant/après « local technique piscine » |
| 7f | `d9e538a` | Tarifs réels (remplacent les placeholders) |
| 7e | `db535a3` | Code postal → ville (geo.api.gouv.fr) sur le devis |
| 7c/7d | `a2d8d64` / `2e6d068` | Discours Côte d'Azur (06 & 83) + bande villes ; note 5,0/29 |
| 7b | `3d69a24` | Menu burger accessible + passe responsive mobile |
| 7a | `c90d3a9` | Hero immersif + fix mobile |

*(Étapes 5–6 : voir l'historique git avant `c90d3a9`.)*

---

## 13. Roadmap / à venir

- **Étape 7i** : landing pages locales `/plombier-[ville]` (slugs déjà prêts dans
  le footer et la home) + ajout au sitemap.
- **Go-live (étape 8)** : cf. §11 et [`DETTE_TECHNIQUE.md`](DETTE_TECHNIQUE.md).
- Enrichissements : image Open Graph dédiée 1200×630, vraies photos de chantier
  supplémentaires, contenu définitif.
