import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyBar from "@/app/components/StickyBar";
import { pageMetadata } from "@/app/lib/metadata";

export const metadata = pageMetadata({
  title: "Politique de confidentialité (RGPD) | AQUAPURE Plomberie",
  description:
    "Politique de confidentialité d'AQUAPURE Plomberie : données collectées via les formulaires, finalités, sous-traitants, durée de conservation et vos droits (RGPD).",
  path: "/politique-de-confidentialite.html",
});

export default function ConfidentialitePage() {
  return (
    <>
      <Navbar />

      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Protection des données</div>
          <h1 className="section-title">Politique de confidentialité</h1>

          <div className="legal">
            <p className="legal-lead">
              La présente politique décrit la manière dont AQUAPURE Plomberie
              collecte et traite vos données personnelles, conformément au
              Règlement (UE) 2016/679 (RGPD) et à la Loi n°78-17 du 6 janvier
              1978 modifiée («&nbsp;Informatique et Libertés&nbsp;»).
            </p>

            <h2>Article 1 — Responsable de traitement</h2>
            <p>
              Le responsable de traitement est M. Mehdi Van Ardenne (AQUAPURE
              Plomberie, entreprise individuelle — SIRET 934 336 637 00012), 29
              Boulevard Victor Hugo, 06000 Nice. Contact&nbsp;:{" "}
              <a href="mailto:contact@aquapureplomberie.fr">
                contact@aquapureplomberie.fr
              </a>{" "}
              — <a href="tel:0484350486">04 84 35 04 86</a>.
            </p>

            <h2>Article 2 — Données collectées</h2>
            <p>
              Les données sont collectées uniquement lorsque vous remplissez un
              formulaire du site (demande de devis, formulaire de contact,
              assistant de discussion). Selon le formulaire, il peut s&apos;agir
              de&nbsp;:
            </p>
            <ul>
              <li>votre nom&nbsp;;</li>
              <li>votre numéro de téléphone&nbsp;;</li>
              <li>votre adresse e-mail (facultative)&nbsp;;</li>
              <li>votre code postal et votre ville&nbsp;;</li>
              <li>
                le contenu de votre message (nature du besoin, précisions).
              </li>
            </ul>
            <p>
              Aucune donnée n&apos;est collectée à votre insu&nbsp;: le site
              n&apos;utilise ni cookie publicitaire, ni outil de mesure
              d&apos;audience ou de traçage.
            </p>

            <h2>Article 3 — Finalités</h2>
            <p>Vos données sont utilisées exclusivement pour&nbsp;:</p>
            <ul>
              <li>traiter et répondre à votre demande de devis ou de contact&nbsp;;</li>
              <li>vous recontacter afin d&apos;organiser l&apos;intervention&nbsp;;</li>
              <li>assurer le suivi de la relation commerciale.</li>
            </ul>
            <p>
              Vos données ne sont jamais vendues, louées ni cédées à des fins
              commerciales ou publicitaires.
            </p>

            <h2>Article 4 — Base légale</h2>
            <p>
              Le traitement repose sur l&apos;exécution de mesures
              précontractuelles prises à votre demande (article 6.1.b du RGPD),
              ainsi que sur votre consentement lorsque vous transmettez
              volontairement vos coordonnées via un formulaire (article 6.1.a du
              RGPD).
            </p>

            <h2>Article 5 — Destinataires et sous-traitants</h2>
            <p>
              Vos données sont destinées à M. Mehdi Van Ardenne. Pour le
              fonctionnement technique du site, elles peuvent être traitées par
              les sous-traitants suivants, chacun présentant des garanties de
              conformité au RGPD&nbsp;:
            </p>
            <ul>
              <li>
                <strong>Supabase</strong> — hébergement de la base de données des
                demandes de devis&nbsp;;
              </li>
              <li>
                <strong>Resend</strong> — envoi des e-mails de notification et
                d&apos;accusé de réception&nbsp;;
              </li>
              <li>
                <strong>Anthropic</strong> — traitement des messages échangés avec
                l&apos;assistant de discussion&nbsp;;
              </li>
              <li>
                <strong>Vercel</strong> — hébergement du site&nbsp;;
              </li>
              <li>
                <strong>geo.api.gouv.fr</strong> (API officielle de l&apos;État
                français) — conversion de votre code postal en ville, sans
                enregistrement de donnée personnelle.
              </li>
            </ul>
            <p>
              Certains prestataires peuvent être situés hors de l&apos;Union
              européenne&nbsp;; les transferts éventuels sont alors encadrés par
              les garanties appropriées prévues par le RGPD (clauses
              contractuelles types notamment).
            </p>

            <h2>Article 6 — Durée de conservation</h2>
            <p>
              Vos données sont conservées le temps nécessaire au traitement de
              votre demande et à la relation commerciale, puis archivées ou
              supprimées. À défaut de relation commerciale établie, les données
              issues d&apos;un simple contact sont conservées au maximum 3 ans à
              compter du dernier échange, conformément aux recommandations de la
              CNIL.
            </p>

            <h2>Article 7 — Vos droits</h2>
            <p>
              Conformément au RGPD et à la Loi Informatique et Libertés, vous
              disposez d&apos;un droit d&apos;accès, de rectification, de
              suppression, d&apos;opposition, de limitation du traitement et de
              portabilité de vos données. Vous pouvez exercer ces droits à tout
              moment en écrivant à{" "}
              <a href="mailto:contact@aquapureplomberie.fr">
                contact@aquapureplomberie.fr
              </a>{" "}
              ou par courrier à l&apos;adresse indiquée ci-dessus. Une réponse
              vous sera apportée dans un délai d&apos;un mois.
            </p>

            <h2>Article 8 — Réclamation</h2>
            <p>
              Si vous estimez, après nous avoir contactés, que vos droits ne sont
              pas respectés, vous pouvez adresser une réclamation à la
              Commission Nationale de l&apos;Informatique et des Libertés
              (CNIL)&nbsp;:{" "}
              <a href="https://www.cnil.fr" rel="noopener noreferrer" target="_blank">
                www.cnil.fr
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
