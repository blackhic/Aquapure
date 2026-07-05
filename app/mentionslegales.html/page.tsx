import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyBar from "@/app/components/StickyBar";
import Link from "next/link";
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
            <h2>Article 1 — Éditeur du site</h2>
            <p>
              Le site aquapureplomberie.fr est édité par M. Mehdi Van Ardenne,
              artisan plombier exerçant en entreprise individuelle sous
              l&apos;enseigne AQUAPURE Plomberie&nbsp;:
            </p>
            <ul>
              <li>Siège&nbsp;: 29 Boulevard Victor Hugo, 06000 Nice&nbsp;;</li>
              <li>SIRET&nbsp;: 934 336 637 00012&nbsp;;</li>
              <li>
                Téléphone&nbsp;: <a href="tel:0484350486">04 84 35 04 86</a>&nbsp;;
              </li>
              <li>
                E-mail&nbsp;:{" "}
                <a href="mailto:contact@aquapureplomberie.fr">
                  contact@aquapureplomberie.fr
                </a>
                &nbsp;;
              </li>
              <li>
                Zone d&apos;intervention&nbsp;: Côte d&apos;Azur — Alpes-Maritimes
                (06) et Var (83)&nbsp;;
              </li>
              <li>
                Assurances&nbsp;: garantie décennale et responsabilité civile
                professionnelle.
              </li>
            </ul>

            <h2>Article 2 — Directeur de la publication</h2>
            <p>
              Le directeur de la publication est M. Mehdi Van Ardenne, en qualité
              d&apos;éditeur du site.
            </p>

            <h2>Article 3 — Hébergement</h2>
            <p>
              Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133,
              Covina, CA 91723, États-Unis (
              <a href="https://vercel.com" rel="noopener noreferrer" target="_blank">
                vercel.com
              </a>
              ).
            </p>

            <h2>Article 4 — Conception et réalisation</h2>
            <p>
              Conception initiale&nbsp;: Créasite (entreprise en nom propre, SIRET
              429 827 009 00052, NAF 6201Z), 23 Quai de la Banquière — Bâtiment B,
              06730 Saint-André-de-la-Roche, Tél.{" "}
              <a href="tel:0493622432">04 93 62 24 32</a>,{" "}
              <a href="mailto:contact@creasite.fr">contact@creasite.fr</a>,{" "}
              <a href="https://creasite.fr" rel="nofollow">
                creasite.fr
              </a>{" "}
              (représentée par M. Michel Ruscito).
            </p>

            <h2>Article 5 — Nom de domaine</h2>
            <p>
              Le nom de domaine aquapureplomberie.fr est enregistré auprès de
              l&apos;AFNIC (Association Française pour le Nommage Internet en
              Coopération).
            </p>

            <h2>Article 6 — Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus du site (textes, photographies,
              illustrations, logo, charte graphique, structure) est protégé par
              le droit de la propriété intellectuelle. Toute reproduction ou
              exploitation, totale ou partielle, sans autorisation écrite
              préalable d&apos;AQUAPURE Plomberie est interdite.
            </p>

            <h2>Article 7 — Données personnelles (RGPD)</h2>
            <p>
              Les données personnelles sont collectées uniquement via les
              formulaires du site (devis, contact, assistant de discussion), aux
              seules fins d&apos;entrée en relation commerciale avec M. Mehdi Van
              Ardenne. Le site n&apos;utilise aucun cookie publicitaire ni outil
              de mesure d&apos;audience ou de traçage.
            </p>
            <p>
              Conformément au Règlement (UE) 2016/679 (RGPD) et à la Loi n°78-17
              du 6 janvier 1978 modifiée, vous disposez d&apos;un droit
              d&apos;accès, de rectification, de suppression, d&apos;opposition,
              de limitation et de portabilité de vos données, exerçable auprès de
              M. Mehdi Van Ardenne à{" "}
              <a href="mailto:contact@aquapureplomberie.fr">
                contact@aquapureplomberie.fr
              </a>
              . Le détail du traitement est décrit dans notre{" "}
              <Link href="/politique-de-confidentialite.html">
                politique de confidentialité
              </Link>
              . Vous pouvez également introduire une réclamation auprès de la
              CNIL (
              <a href="https://www.cnil.fr" rel="noopener noreferrer" target="_blank">
                www.cnil.fr
              </a>
              ).
            </p>

            <h2>Article 8 — Conservation des données</h2>
            <p>
              Les données sont conservées le temps nécessaire au traitement de
              votre demande et à la relation commerciale. À défaut de relation
              commerciale établie, les données issues d&apos;un simple contact
              sont conservées au maximum 3 ans à compter du dernier échange,
              conformément aux recommandations de la CNIL.
            </p>

            <p>
              Voir aussi&nbsp;:{" "}
              <Link href="/politique-de-confidentialite.html">
                Politique de confidentialité
              </Link>{" "}
              ·{" "}
              <Link href="/politique-de-cookies.html">Politique de cookies</Link>{" "}
              · <Link href="/cgu.html">CGU</Link> ·{" "}
              <Link href="/cgv.html">CGV</Link>.
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
