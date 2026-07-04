# Go-live — checklist SEO / mise en production

## Anti-indexation (garde-fou actuel)

Tant que le site est servi sur **vercel.app** et que l'ancien site
**aquapureplomberie.fr** est encore en ligne, on **bloque toute indexation**
pour éviter le duplicate content.

État par défaut (variable absente ou différente de `true`) :
- `app/robots.ts` → renvoie `Disallow: /` (blocage total, pas de sitemap annoncé).
- `app/layout.tsx` → balise meta `noindex, nofollow` sur toutes les pages.

Piloté par la variable d'environnement **`NEXT_PUBLIC_ALLOW_INDEXING`**
(défaut : `false`).

## Au go-live : lever le blocage

Une fois le **domaine `aquapureplomberie.fr` basculé sur ce site** et
**l'ancien site éteint** :

1. Dans **Vercel → Project `aquapure` → Settings → Environment Variables**,
   ajouter/mettre à jour (environnement **Production**) :

   ```
   NEXT_PUBLIC_ALLOW_INDEXING = true
   ```

2. **Redéployer** la production (la variable `NEXT_PUBLIC_*` est injectée au
   **build** : un simple changement de variable ne s'applique qu'après un
   nouveau déploiement — « Redeploy » depuis le dashboard, ou un push).

3. Vérifier après déploiement :
   - `https://aquapureplomberie.fr/robots.txt` → `Allow: /` + `Sitemap:` présent.
   - Absence de la balise `<meta name="robots" content="noindex">` dans le HTML.
   - Soumettre le sitemap dans **Google Search Console** (propriété
     `aquapureplomberie.fr`).

## Autres corrections à faire au go-live

- **Mentions légales — hébergeur** : `app/mentionslegales.html/page.tsx` reprend
  l'ancien doc (OVH). L'hébergeur réel devient **Vercel Inc.** — corriger
  l'Article 4 avant/juste après le go-live (obligation légale).
  Adresse Vercel : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
- **Redirections 301** : si des URLs changent, mettre en place les 301 depuis
  les anciennes URLs `.html` (ici on a conservé les URLs à l'identique).
- **Image Open Graph dédiée 1200×630** (actuellement photos carrées).
- **Coordonnées geo JSON-LD** : affiner au géocodage exact de l'adresse
  (actuellement niveau ville Nice).
