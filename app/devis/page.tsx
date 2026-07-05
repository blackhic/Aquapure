import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyBar from "@/app/components/StickyBar";
import DevisForm from "@/app/components/DevisForm";
import { pageMetadata } from "@/app/lib/metadata";

// Pas de `robots` ici : la page suit le réglage global du layout
// (garde-fou NEXT_PUBLIC_ALLOW_INDEXING), non modifié.
export const metadata = pageMetadata({
  title: "Devis gratuit plombier Nice | AQUAPURE Plomberie",
  description:
    "Demandez votre devis plomberie gratuit à Nice et dans le 06/83 : réponse rapide, sans engagement, 24h/24. Dépannage, rénovation, chauffe-eau, recherche de fuite.",
  path: "/devis",
});

export default function DevisPage() {
  return (
    <>
      <Navbar />

      <section className="section">
        <div className="section-inner devis-inner">
          <div className="section-eyebrow">Devis gratuit</div>
          <h1 className="section-title">Demandez votre devis gratuit</h1>
          <p className="section-lead">
            Sans engagement, réponse rapide. Nous intervenons 24h/24, 7j/7 à Nice,
            dans tout le 06 et l&apos;est du Var. Remplissez le formulaire, Mehdi
            vous rappelle.
          </p>

          <div className="devis-badges">
            <span className="devis-badge">
              <svg viewBox="0 0 24 24">
                <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
              </svg>
              Devis gratuit
            </span>
            <span className="devis-badge">
              <svg viewBox="0 0 24 24">
                <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
              </svg>
              Réponse rapide
            </span>
            <span className="devis-badge">
              <svg viewBox="0 0 24 24">
                <path d="M9 16.2l-4.2-4.2-1.4 1.4 5.6 5.6 12-12-1.4-1.4z" />
              </svg>
              Garantie décennale
            </span>
          </div>

          <div className="devis-card">
            <DevisForm />
          </div>
        </div>
      </section>

      <Footer />

      <StickyBar />
    </>
  );
}
