import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__motif" aria-hidden="true">
        <span>✦</span>
        <span className="footer__motif-line" />
        <span>✦</span>
        <span className="footer__motif-line" />
        <span>✦</span>
      </div>

      <div className="footer__inner container">
        <div className="footer__brand">
          <div className="footer__logo-wrap">
            <img src="/logo.png" alt="ABA Fashions Logo" className="footer__logo-img" />
          </div>
          <p className="footer__tagline">Timeless elegance, handpicked for you.</p>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <Link to="/"        className="footer__link">Home</Link>
          <Link to="/catalog" className="footer__link">Catalog</Link>
          <Link to="/cart"    className="footer__link">Cart</Link>
        </nav>

        <p className="footer__copy">
          © {year} ABAfashions. All rights reserved.
        </p>
      </div>

      <style>{`
        .footer {
          background: var(--clr-maroon-dark);
          color: rgba(255,255,255,0.8);
          padding-bottom: var(--space-xl);
          margin-top: auto;
        }
        .footer__motif {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-sm);
          padding: var(--space-md) 0;
          color: var(--clr-gold);
          font-size: 0.7rem;
        }
        .footer__motif-line {
          flex: 1;
          max-width: 80px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--clr-gold), transparent);
        }
        .footer__inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-lg);
        }
        .footer__logo-wrap {
          background: #fff;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          display: inline-block;
          margin-bottom: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }
        .footer__logo-img {
          height: 44px;
          width: auto;
          display: block;
          object-fit: contain;
        }
        .footer__tagline {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.6);
          font-style: italic;
        }
        .footer__nav {
          display: flex;
          gap: var(--space-lg);
        }
        .footer__link {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.7);
          transition: color var(--transition-fast);
        }
        .footer__link:hover { color: var(--clr-gold); }
        .footer__copy {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.4);
        }
      `}</style>
    </footer>
  );
}
