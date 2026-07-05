import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyBar from "@/app/components/StickyBar";
import { pageMetadata } from "@/app/lib/metadata";

export const metadata = pageMetadata({
  title: "Politique de cookies | AQUAPURE Plomberie",
  description:
    "Politique de cookies d'AQUAPURE Plomberie : aucun cookie publicitaire ni outil de traçage. Seuls des cookies strictement nécessaires sont utilisés, sans consentement requis.",
  path: "/politique-de-cookies.html",
});

export default function CookiesPage() {
  return (
    <>
      <Navbar />

      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Protection des données</div>
          <h1 className="section-title">Politique de cookies</h1>

          <div className="legal">
            <p className="legal-lead">
              Cette page décrit l&apos;usage des cookies et technologies de
              stockage sur le site aquapureplomberie.fr.
            </p>

            <h2>Article 1 — Pas de cookies publicitaires ni de traçage</h2>
            <p>
              Le site n&apos;utilise <strong>aucun cookie publicitaire</strong>,{" "}
              <strong>aucun outil de mesure d&apos;audience</strong> (analytics)
              et <strong>aucun dispositif de traçage</strong> ou de profilage.
              Votre navigation n&apos;est ni suivie, ni analysée, ni partagée
              avec des régies publicitaires ou des réseaux sociaux.
            </p>

            <h2>Article 2 — Cookies strictement nécessaires</h2>
            <p>
              Seuls des cookies ou éléments de stockage{" "}
              <strong>strictement nécessaires</strong> au fonctionnement du site
              peuvent être déposés. Il s&apos;agit notamment du cookie de session
              d&apos;administration (<code>admin_session</code>), utilisé
              uniquement pour sécuriser l&apos;accès à l&apos;espace privé réservé
              à la gestion des demandes. Ce cookie n&apos;est jamais déposé lors
              d&apos;une navigation publique classique sur le site.
            </p>

            <h2>Article 3 — Absence de bannière de consentement</h2>
            <p>
              Les cookies strictement nécessaires sont exemptés de consentement
              en application de l&apos;article 82 de la Loi Informatique et
              Libertés et des recommandations de la CNIL. Le site ne déposant
              aucun traceur non essentiel, <strong>aucun consentement
              n&apos;est requis</strong> et aucune bannière de consentement
              n&apos;est affichée. La présente page a une valeur purement
              informative.
            </p>

            <h2>Article 4 — Gestion des cookies</h2>
            <p>
              Vous pouvez à tout moment configurer votre navigateur pour refuser
              ou supprimer les cookies. Le blocage des cookies strictement
              nécessaires n&apos;affecte pas la consultation publique du site
              mais peut empêcher l&apos;accès à l&apos;espace
              d&apos;administration.
            </p>

            <h2>Article 5 — Données personnelles</h2>
            <p>
              Le traitement des données que vous transmettez volontairement via
              les formulaires est décrit dans notre{" "}
              <a href="/politique-de-confidentialite.html">
                politique de confidentialité
              </a>
              .
            </p>

            <p className="legal-copy">AQUAPURE Plomberie © 2026.</p>
          </div>
        </div>
      </section>

      <Footer />

      <StickyBar />
    </>
  );
}
