import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import StickyBar from "@/app/components/StickyBar";
import { pageMetadata } from "@/app/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact & Devis Gratuit | Plombier Nice - AQUAPURE Plomberie",
  description:
    "Contactez AQUAPURE Plomberie à Nice pour un devis gratuit. Intervention rapide dans le 06 et 83. Disponible 24h/24, 7j/7. ☎ 04 84 35 04 86 ou par formulaire",
  path: "/contacter-aquapure-plomberie.html",
});

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-bg-img"></div>
        <div className="hero-inner" style={{ gridTemplateColumns: "1fr" }}>
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              Disponible 24h/24 – 7j/7
            </div>
            <h1>Contact &amp; devis gratuit — Plombier à Nice</h1>
            <p className="hero-sub">
              Contactez AQUAPURE Plomberie à Nice pour un devis gratuit.
              Intervention rapide dans le 06 et 83. Disponible 24h/24, 7j/7.
            </p>
            <div className="hero-ctas">
              <a href="tel:0484350486" className="cta-call">
                <svg viewBox="0 0 24 24">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                </svg>
                <div className="cta-call-inner">
                  <span>Appeler maintenant — 04 84 35 04 86</span>
                  <span className="cta-call-sub">
                    Réponse en quelques minutes · Devis gratuit
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-eyebrow">Contact</div>
          <h2 className="section-title">Parlons de votre projet</h2>
          <p className="section-lead">
            Par téléphone, par mail ou via le formulaire — nous vous répondons
            rapidement.
          </p>

          <div className="contact-grid">
            {/* Coordonnées */}
            <div className="contact-methods">
              <div className="why-card">
                <div className="why-check">
                  <svg viewBox="0 0 24 24">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                  </svg>
                </div>
                <div>
                  <div className="why-title">Appelez-nous</div>
                  <div className="why-detail">
                    <a href="tel:0484350486">04 84 35 04 86</a> — 7j/7, 24h/24
                  </div>
                </div>
              </div>

              <div className="why-card">
                <div className="why-check">
                  <svg viewBox="0 0 24 24">
                    <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2-8 5-8-5h16zm0 12H4V8.82l8 5 8-5V18z" />
                  </svg>
                </div>
                <div>
                  <div className="why-title">Envoyez-nous un mail</div>
                  <div className="why-detail">
                    <a href="mailto:contact@aquapureplomberie.fr">
                      contact@aquapureplomberie.fr
                    </a>
                  </div>
                </div>
              </div>

              <div className="why-card">
                <div className="why-check">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                  </svg>
                </div>
                <div>
                  <div className="why-title">Nous localiser</div>
                  <div className="why-detail">
                    Entreprise installée à Nice ; intervention dans tout le 06 et
                    le Var ; permanence urgences 7j/7, 24h/24.
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <form
              className="contact-form"
              action="mailto:contact@aquapureplomberie.fr"
              method="post"
              encType="text/plain"
            >
              <h2 className="section-title" style={{ fontSize: "20px" }}>
                Envoyez-nous un message
              </h2>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="nom">Nom</label>
                  <input id="nom" name="Nom" type="text" required />
                </div>
                <div className="form-field">
                  <label htmlFor="prenom">Prénom</label>
                  <input id="prenom" name="Prénom" type="text" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="Email" type="email" required />
                </div>
                <div className="form-field">
                  <label htmlFor="telephone">Téléphone</label>
                  <input id="telephone" name="Téléphone" type="tel" />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="sujet">Sujet</label>
                <input id="sujet" name="Sujet" type="text" />
              </div>
              <div className="form-field">
                <label htmlFor="message">Votre demande</label>
                <textarea id="message" name="Message" rows={5} required />
              </div>
              <button type="submit" className="btn-cta-inline">
                <svg viewBox="0 0 24 24">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />

      <StickyBar />
    </>
  );
}
