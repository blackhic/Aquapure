import Navbar from "./Navbar";
import Footer from "./Footer";
import StickyBar from "./StickyBar";

export type ServiceSection = {
  id?: string;
  h2: string;
  text?: string;
  image?: string;
  imageAlt?: string;
};

type ServicePageProps = {
  eyebrow: string;
  h1: string;
  subtitle: string;
  introH2: string;
  introText?: string;
  image?: string;
  imageAlt?: string;
  sections: ServiceSection[];
};

export default function ServicePage({
  eyebrow,
  h1,
  subtitle,
  introH2,
  introText,
  image,
  imageAlt,
  sections,
}: ServicePageProps) {
  return (
    <>
      {/* Précharge l'image LCP du hero (background CSS). */}
      <link
        rel="preload"
        as="image"
        href="/photos/hero-plombier-nice.webp"
        fetchPriority="high"
      />
      <Navbar />

      <section className="hero">
        <div className="hero-bg-img"></div>
        <div className="hero-inner" style={{ gridTemplateColumns: "1fr" }}>
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              Disponible 24h/24 – 7j/7
            </div>
            <h1>{h1}</h1>
            <p className="hero-sub">{subtitle}</p>
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
          <div className="section-eyebrow">{eyebrow}</div>
          <h2 className="section-title">{introH2}</h2>
          {introText ? <p className="section-lead">{introText}</p> : null}

          {image ? (
            <div className="photo-block service-hero-photo">
              <img
                src={image}
                alt={imageAlt}
                width={900}
                height={900}
                loading="lazy"
              />
            </div>
          ) : null}

          {sections.map((s) => (
            <div key={s.h2} id={s.id} className="service-block">
              <h2 className="section-title">{s.h2}</h2>
              {s.text ? <p className="section-lead">{s.text}</p> : null}
              {s.image ? (
                <div className="photo-block section-photo-block">
                  <img
                    src={s.image}
                    alt={s.imageAlt}
                    width={900}
                    height={900}
                    loading="lazy"
                  />
                </div>
              ) : null}
            </div>
          ))}

          <div className="inline-cta">
            <p>
              Un projet ou une urgence de plomberie à Nice ?{" "}
              <strong>Parlons-en — devis gratuit, sans engagement.</strong>
            </p>
            <a href="tel:0484350486" className="btn-cta-inline">
              <svg viewBox="0 0 24 24">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
              </svg>
              04 84 35 04 86
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <StickyBar />
    </>
  );
}
