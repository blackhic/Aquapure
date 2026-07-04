import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyBar from "@/app/components/StickyBar";
import { pageMetadata } from "@/app/lib/metadata";

export const metadata = pageMetadata({
  title: "Mentions Légales & RGPD | AQUAPURE Plomberie Nice",
  description:
    "Mentions légales, politique de confidentialité et RGPD d'AQUAPURE Plomberie, artisan plombier à Nice (06). Informations sur la collecte et le traitement des données personnelles.",
  path: "/mentionslegales.html",
});

export default function MentionsLegalesPage() {
  return (
    <>
      <Navbar />

      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Informations légales</div>
          <h1 className="section-title">Mentions légales &amp; RGPD</h1>

          <div className="legal">
            <h2>Article 1 — Éditeur</h2>
            <p>
              Le site appartient à M. Mehdi Van Ardenne (SIRET 934 336 637
              00012), domicilié 29 Boulevard Victor Hugo, 06000 Nice.
            </p>

            <h2>Article 2 — Contacter le site</h2>
            <p>
              <a href="mailto:contact@aquapureplomberie.fr">
                contact@aquapureplomberie.fr
              </a>
              .
            </p>

            <h2>Article 3 — Création et mise à jour</h2>
            <p>
              Créasite (entreprise en nom propre, SIRET 429 827 009 00052, NAF
              6201Z), 23 Quai de la Banquière - Bâtiment B - 06730
              Saint-André-de-la-Roche, Tél.{" "}
              <a href="tel:0493622432">04 93 62 24 32</a>,{" "}
              <a href="mailto:contact@creasite.fr">contact@creasite.fr</a>, site{" "}
              <a href="https://creasite.fr" rel="nofollow">
                creasite.fr
              </a>
              . M. Michel Ruscito représente Créasite.
            </p>

            <h2>Article 4 — Hébergement</h2>
            <p>
              OVH, 2 rue Kellermann, 59100 Roubaix, Tél.{" "}
              <a href="tel:0820320363">08 20 32 03 63</a>.
            </p>

            <h2>Article 5 — Enregistrement, copyright</h2>
            <p>
              Nom de domaine aquapureplomberie.fr enregistré auprès de l&apos;AFNIC.
            </p>

            <h2>Article 6 — Conformité RGPD / Cookies</h2>
            <p>
              Pas de cookies publicitaires ; les données collectées via
              formulaires sont uniquement destinées à l&apos;entrée en relation
              commerciale avec M. Mehdi Van Ardenne. Vous disposez d&apos;un droit
              d&apos;accès, de modification, de rectification, de suppression et
              d&apos;opposition (Loi n°78-17 du 6 janvier 1978), exerçable auprès
              de M. Mehdi Van Ardenne.
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
