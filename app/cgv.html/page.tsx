import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyBar from "@/app/components/StickyBar";
import { pageMetadata } from "@/app/lib/metadata";

export const metadata = pageMetadata({
  title: "Conditions Générales de Vente | AQUAPURE Plomberie",
  description:
    "Conditions générales de vente d'AQUAPURE Plomberie : devis, prix, paiement, délais, droit de rétractation, garanties (décennale, RC pro), médiation et litiges.",
  path: "/cgv.html",
});

export default function CgvPage() {
  return (
    <>
      <Navbar />

      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Informations légales</div>
          <h1 className="section-title">Conditions Générales de Vente</h1>

          <div className="legal">
            <div className="legal-notice" role="note">
              <strong>Modèle à faire valider par un professionnel du droit.</strong>{" "}
              Les présentes conditions générales de vente constituent un modèle
              adapté à l&apos;activité, fourni à titre indicatif. Elles doivent
              être vérifiées et complétées par un juriste (notamment la
              désignation du médiateur de la consommation) avant leur mise en
              ligne définitive.
            </div>

            <p className="legal-lead">
              Les présentes Conditions Générales de Vente (ci-après
              «&nbsp;CGV&nbsp;») régissent les prestations de plomberie réalisées
              par M. Mehdi Van Ardenne (AQUAPURE Plomberie, entreprise
              individuelle — SIRET 934 336 637 00012), 29 Boulevard Victor Hugo,
              06000 Nice, auprès de ses clients particuliers et professionnels.
            </p>

            <h2>Article 1 — Objet</h2>
            <p>
              Les CGV définissent les conditions dans lesquelles AQUAPURE
              Plomberie réalise ses prestations de dépannage, d&apos;installation,
              de rénovation et de plomberie générale. Toute commande implique
              l&apos;acceptation sans réserve des présentes CGV.
            </p>

            <h2>Article 2 — Devis et commande</h2>
            <p>
              Chaque prestation fait l&apos;objet d&apos;un devis gratuit,
              détaillé et sans engagement, établi préalablement à
              l&apos;intervention (sauf urgence ne permettant pas
              l&apos;établissement d&apos;un devis écrit préalable). La commande
              est réputée ferme après acceptation du devis par le client (signature
              ou accord écrit, y compris par voie électronique).
            </p>

            <h2>Article 3 — Prix</h2>
            <p>
              Les prix sont exprimés en euros toutes taxes comprises (TTC). Les
              tarifs affichés sur le site sont indicatifs, «&nbsp;à partir
              de&nbsp;», hors pièces et fournitures&nbsp;; seul le devis
              personnalisé fait foi. Une majoration peut s&apos;appliquer en cas
              d&apos;intervention d&apos;urgence (nuit, week-end, jours fériés),
              indiquée au client avant l&apos;intervention.
            </p>

            <h2>Article 4 — Modalités de paiement</h2>
            <p>
              Le paiement s&apos;effectue à réception de la facture, à
              l&apos;issue de l&apos;intervention, selon les moyens acceptés
              (espèces, virement, chèque). Pour les chantiers importants, un
              acompte peut être demandé à la commande, selon les modalités
              précisées au devis.
            </p>

            <h2>Article 5 — Délais d&apos;intervention</h2>
            <p>
              Pour les urgences, AQUAPURE Plomberie s&apos;efforce d&apos;intervenir
              dans les meilleurs délais sur sa zone (Alpes-Maritimes 06 et Var
              83). Les délais annoncés sont donnés à titre indicatif et peuvent
              varier selon la nature de l&apos;intervention, la disponibilité des
              pièces et les conditions d&apos;accès.
            </p>

            <h2>Article 6 — Droit de rétractation</h2>
            <p>
              Conformément aux articles L221-18 et suivants du Code de la
              consommation, le client particulier dispose d&apos;un délai de
              quatorze (14) jours pour se rétracter d&apos;un contrat conclu à
              distance ou hors établissement, sans avoir à motiver sa décision.
            </p>
            <p>
              Toutefois, lorsque le client sollicite expressément une
              intervention en urgence à son domicile (dépannage), il peut
              demander l&apos;exécution de la prestation avant la fin du délai de
              rétractation. Conformément à l&apos;article L221-25 du Code de la
              consommation, le client renonce alors expressément à son droit de
              rétractation pour la prestation pleinement exécutée&nbsp;; il reste
              redevable du montant correspondant au service déjà fourni.
            </p>

            <h2>Article 7 — Garanties</h2>
            <p>
              Le client bénéficie de la garantie légale de conformité et de la
              garantie légale contre les vices cachés. Les travaux relevant du
              gros œuvre ou des éléments d&apos;équipement indissociables sont
              couverts par la <strong>garantie décennale</strong>. AQUAPURE
              Plomberie est en outre couvert par une assurance de{" "}
              <strong>responsabilité civile professionnelle</strong>. Les
              attestations d&apos;assurance sont communicables sur simple demande.
            </p>

            <h2>Article 8 — Réclamations</h2>
            <p>
              Toute réclamation relative à une prestation doit être adressée à
              AQUAPURE Plomberie&nbsp;:{" "}
              <a href="mailto:contact@aquapureplomberie.fr">
                contact@aquapureplomberie.fr
              </a>{" "}
              ou <a href="tel:0484350486">04 84 35 04 86</a>. Nous nous
              engageons à en accuser réception et à rechercher une solution
              amiable dans les meilleurs délais.
            </p>

            <h2>Article 9 — Médiation de la consommation</h2>
            <p>
              Conformément aux articles L611-1 et suivants et R612-1 et suivants
              du Code de la consommation, le client consommateur a le droit de
              recourir gratuitement à un médiateur de la consommation en vue de
              la résolution amiable d&apos;un litige, après avoir tenté au
              préalable de le résoudre directement auprès d&apos;AQUAPURE
              Plomberie par une réclamation écrite.
            </p>
            <p>
              Le médiateur de la consommation compétent est&nbsp;:{" "}
              <strong>[Médiateur à désigner — nom et coordonnées à compléter]</strong>.
              Le client peut également recourir à la plateforme européenne de
              règlement en ligne des litiges&nbsp;:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                rel="noopener noreferrer"
                target="_blank"
              >
                ec.europa.eu/consumers/odr
              </a>
              .
            </p>

            <h2>Article 10 — Droit applicable et litiges</h2>
            <p>
              Les présentes CGV sont soumises au droit français. À défaut de
              résolution amiable ou par voie de médiation, tout litige sera porté
              devant les tribunaux français compétents.
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
