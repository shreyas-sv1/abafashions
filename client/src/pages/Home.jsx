import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: '✦',
    title: 'Handpicked Collection',
    desc: 'Every saree is individually curated for quality, craftsmanship, and timeless beauty.',
  },
  {
    icon: '🪡',
    title: 'Authentic Weaves',
    desc: 'From Kanjivaram silk to Banarasi brocade — genuine regional weaves, every time.',
  },
  {
    icon: '💬',
    title: 'Order via WhatsApp',
    desc: 'No complicated checkout. Add to cart and order directly through WhatsApp in seconds.',
  },
];

export default function Home() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="hero" aria-label="Hero section">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__overlay" aria-hidden="true" />
        <div className="hero__content container">
          <p className="hero__eyebrow">Est. 2024 · Sarees, Dresses & Lehengas</p>
          <h1 className="hero__title">
            Where Tradition<br />
            <em className="hero__title-em">Meets Elegance</em>
          </h1>
          <p className="hero__tagline">
            Timeless fashion & luxury apparel, handpicked for you.
          </p>
          <div className="hero__cta-group">
            <Link
              to="/catalog"
              className="btn-gold-shimmer"
              id="hero-browse-btn"
              aria-label="Browse our fashion catalog"
            >
              Browse Catalog ✦
            </Link>
            <Link to="/catalog" className="hero__secondary-link">
              Explore Collections →
            </Link>
          </div>
        </div>
        <div className="hero__scroll-hint" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* ── Textile divider ── */}
      <div className="textile-divider container" aria-hidden="true">
        <span className="textile-divider-icon">✦</span>
      </div>

      {/* ── Features ── */}
      <section className="section features" aria-labelledby="features-heading">
        <div className="container">
          <h2 id="features-heading" className="section-title">Why ABAfashions?</h2>
          <p className="section-subtitle">
            We believe every woman deserves to drape herself in excellence.
          </p>
          <div className="features__grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card fade-in-up" style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="feature-card__icon" aria-hidden="true">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner" aria-labelledby="cta-heading">
        <div className="container cta-banner__inner">
          <div>
            <h2 id="cta-heading" className="cta-banner__title">
              Ready to find your perfect saree?
            </h2>
            <p className="cta-banner__sub">
              Browse our curated catalog and order effortlessly via WhatsApp.
            </p>
          </div>
          <Link to="/catalog" className="btn btn-gold btn-lg" id="cta-catalog-btn">
            Shop Now
          </Link>
        </div>
      </section>

      <style>{`
        /* ── Hero ── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero__bg {
          position: absolute;
          inset: 0;
          background-image: url('/hero-bg.png');
          background-size: cover;
          background-position: center 30%;
          transform: scale(1.05);
          transition: transform 8s ease;
        }
        .hero:hover .hero__bg { transform: scale(1.0); }
        .hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(90,18,32,0.82) 0%,
            rgba(123,28,46,0.65) 40%,
            rgba(14,75,90,0.50) 100%
          );
        }
        .hero__content {
          position: relative;
          z-index: 1;
          padding-top: calc(var(--navbar-h) + var(--space-xl));
          padding-bottom: var(--space-3xl);
          max-width: 640px;
        }
        .hero__eyebrow {
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--clr-gold-light);
          margin-bottom: var(--space-md);
        }
        .hero__title {
          font-family: var(--font-serif);
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
          margin-bottom: var(--space-lg);
        }
        .hero__title-em {
          color: var(--clr-gold-light);
          font-style: italic;
        }
        .hero__tagline {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: rgba(255,255,255,0.85);
          margin-bottom: var(--space-xl);
          font-style: italic;
          letter-spacing: 0.02em;
        }
        .hero__cta-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          align-items: flex-start;
        }
        @media (min-width: 480px) {
          .hero__cta-group { flex-direction: row; align-items: center; }
        }
        .hero__secondary-link {
          color: rgba(255,255,255,0.75);
          font-size: 0.9375rem;
          font-weight: 500;
          transition: color var(--transition-fast);
          letter-spacing: 0.01em;
        }
        .hero__secondary-link:hover { color: var(--clr-gold-light); }
        .hero__scroll-hint {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
        }
        .hero__scroll-hint span {
          display: block;
          width: 24px;
          height: 36px;
          border: 2px solid rgba(255,255,255,0.4);
          border-radius: 12px;
          position: relative;
        }
        .hero__scroll-hint span::after {
          content: '';
          position: absolute;
          top: 6px; left: 50%;
          transform: translateX(-50%);
          width: 4px; height: 8px;
          background: var(--clr-gold-light);
          border-radius: 2px;
          animation: scroll-dot 1.5s ease infinite;
        }
        @keyframes scroll-dot {
          0%, 100% { opacity: 1; top: 6px; }
          50% { opacity: 0; top: 18px; }
        }

        /* ── Features ── */
        .features__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-lg);
        }
        @media (min-width: 640px) {
          .features__grid { grid-template-columns: repeat(3, 1fr); }
        }
        .feature-card {
          text-align: center;
          padding: var(--space-xl) var(--space-lg);
          background: #fff;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--clr-light-gray);
          transition: box-shadow var(--transition-base), transform var(--transition-base);
        }
        .feature-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-4px);
        }
        .feature-card__icon {
          font-size: 2rem;
          color: var(--clr-gold);
          margin-bottom: var(--space-md);
          display: block;
        }
        .feature-card__title {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: var(--clr-maroon);
          margin-bottom: var(--space-sm);
        }
        .feature-card__desc {
          font-size: 0.9375rem;
          color: var(--clr-mid-gray);
          line-height: 1.6;
        }

        /* ── CTA Banner ── */
        .cta-banner {
          background: linear-gradient(135deg, var(--clr-maroon) 0%, var(--clr-teal) 100%);
          padding: var(--space-2xl) 0;
          margin: var(--space-xl) 0 0;
        }
        .cta-banner__inner {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
          align-items: flex-start;
        }
        @media (min-width: 768px) {
          .cta-banner__inner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .cta-banner__title {
          font-family: var(--font-serif);
          font-size: clamp(1.4rem, 3vw, 2rem);
          color: #fff;
          margin-bottom: var(--space-sm);
        }
        .cta-banner__sub {
          color: rgba(255,255,255,0.75);
          font-size: 0.9375rem;
        }
      `}</style>
    </main>
  );
}
