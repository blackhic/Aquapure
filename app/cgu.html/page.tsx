import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyBar from "@/app/components/StickyBar";
import Link from "next/link";
import { pageMetadata } from "@/app/lib/metadata";

export const metadata = pageMetadata({
  title: "Conditions Générales d'Utilisation | AQUAPURE Plomberie",
  description:
    "Conditions générales d'utilisation du site AQUAPURE Plomberie (plombier Nice, 06 & 83) : accès au site, propriété intellectuelle, responsabilité, liens et données personnelles.",
  path: "/cgu.html",
});

export default function CguPage() {
  return (
    <>
      <Navbar />

      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Informations légales</div>
          <h1 className="section-title">
            Conditions Générales d&apos;Utilisation
          </h1>

          <div className="legal">
            <p className="legal-lead">
              Les présentes Conditions Générales d&apos;Utilisation (ci-après
              «&nbsp;CGU&nbsp;») régissent l&apos;accès et l&apos;utilisation du
              site aquapureplomberie.fr (ci-après le «&nbsp;Site&nbsp;»), édité
              par M. Mehdi Van Ardenne, artisan plombier (AQUAPURE Plomberie).
              Toute utilisation du Site implique l&apos;acceptation pleine et
              entière des présentes CGU.
            </p>

            <h2>Article 1 — Objet</h2>
            <p>
              Le Site a pour objet de présenter l&apos;activité de plomberie
              d&apos;AQUAPURE Plomberie (dépannage, installation, rénovation,
              chauffe-eau, plomberie générale) sur la Côte d&apos;Azur —
              Alpes-Maritimes (06) et Var (83) — et de permettre aux visiteurs de
              demander un devis ou de prendre contact.
            </p>

            <h2>Article 2 — Accès au Site</h2>
            <p>
              Le Site est accessible gratuitement à tout utilisateur disposant
              d&apos;un accès à Internet. Les frais d&apos;accès (matériel,
              connexion) restent à la charge de l&apos;utilisateur. AQUAPURE
              Plomberie s&apos;efforce de maintenir le Site accessible 7j/7 mais
              ne saurait être tenu responsable d&apos;une indisponibilité, quelle
              qu&apos;en soit la cause (maintenance, panne, force majeure). Des
              interruptions peuvent survenir sans préavis.
            </p>

            <h2>Article 3 — Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des éléments du Site (textes, structure,
              photographies, illustrations, logo, charte graphique) est protégé
              par le droit de la propriété intellectuelle. Toute reproduction,
              représentation, modification ou exploitation, totale ou partielle,
              sans l&apos;autorisation écrite préalable d&apos;AQUAPURE Plomberie
              est interdite et constituerait une contrefaçon sanctionnée par le
              Code de la propriété intellectuelle.
            </p>

            <h2>Article 4 — Responsabilité</h2>
            <p>
              Les informations diffusées sur le Site sont fournies à titre
              indicatif et peuvent évoluer. Les tarifs affichés sont indicatifs,
              «&nbsp;à partir de&nbsp;», et ne constituent pas un engagement
              contractuel&nbsp;: seul un devis personnalisé fait foi. AQUAPURE
              Plomberie ne saurait être tenu responsable d&apos;éventuelles
              erreurs ou omissions, ni de l&apos;usage fait de ces informations.
            </p>

            <h2>Article 5 — Liens hypertextes</h2>
            <p>
              Le Site peut contenir des liens vers des sites tiers. AQUAPURE
              Plomberie n&apos;exerce aucun contrôle sur ces sites et décline
              toute responsabilité quant à leur contenu ou à leur politique de
              confidentialité.
            </p>

            <h2>Article 6 — Données personnelles</h2>
            <p>
              Les données transmises via les formulaires (devis, contact,
              assistant de discussion) sont traitées conformément à notre{" "}
              <Link href="/politique-de-confidentialite.html">
                politique de confidentialité
              </Link>{" "}
              et à la réglementation applicable (RGPD, Loi n°78-17 du 6 janvier
              1978 modifiée).
            </p>

            <h2>Article 7 — Droit applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français. En cas de
              litige, et à défaut de résolution amiable, compétence est attribuée
              aux tribunaux français compétents.
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
