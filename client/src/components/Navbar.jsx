import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  // Detect scroll for backdrop
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" aria-label="ABAfashions Home">
          <img src="/logo.png" alt="ABA Fashions Logo" className="navbar__logo-img" />
        </Link>

        {/* Desktop nav */}
        <ul className="navbar__links" role="list">
          <li><NavLink to="/"        className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'} end>Home</NavLink></li>
          <li><NavLink to="/catalog" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>Catalog</NavLink></li>
          <li>
            <NavLink to="/cart" className={({ isActive }) => isActive ? 'navbar__link navbar__link--active navbar__cart-link' : 'navbar__link navbar__cart-link'} id="nav-cart-link">
              🛒 Cart
              {itemCount > 0 && (
                <span className="navbar__cart-badge" aria-label={`${itemCount} items in cart`}>{itemCount}</span>
              )}
            </NavLink>
          </li>
        </ul>

        {/* Mobile: Cart icon + hamburger */}
        <div className="navbar__mobile-actions">
          <Link to="/cart" className="navbar__cart-mobile" id="mobile-cart-link" aria-label="Cart">
            🛒
            {itemCount > 0 && (
              <span className="navbar__cart-badge">{itemCount}</span>
            )}
          </Link>
          <button
            className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            id="mobile-menu-toggle"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="navbar__drawer" role="dialog" aria-label="Mobile menu">
          <NavLink to="/"        className="navbar__drawer-link" end>Home</NavLink>
          <NavLink to="/catalog" className="navbar__drawer-link">Catalog</NavLink>
          <NavLink to="/cart"    className="navbar__drawer-link">🛒 Cart {itemCount > 0 && `(${itemCount})`}</NavLink>
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 500;
          height: var(--navbar-h);
          background: rgba(250,247,242,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid transparent;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .navbar--scrolled {
          border-bottom-color: var(--clr-border);
          box-shadow: 0 2px 16px rgba(123,28,46,0.08);
        }
        .navbar__inner {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar__logo {
          display: flex;
          align-items: center;
          user-select: none;
        }
        .navbar__logo-img {
          height: 54px;
          width: auto;
          object-fit: contain;
          display: block;
          border-radius: var(--radius-sm);
        }
        .navbar__links {
          display: none;
          list-style: none;
          gap: var(--space-xs);
          align-items: center;
        }
        @media (min-width: 640px) {
          .navbar__links { display: flex; }
        }
        .navbar__link {
          padding: 8px 14px;
          border-radius: var(--radius-md);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--clr-charcoal);
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          gap: 6px;
          position: relative;
        }
        .navbar__link:hover { color: var(--clr-maroon); background: rgba(123,28,46,0.06); }
        .navbar__link--active { color: var(--clr-maroon); font-weight: 600; }
        .navbar__cart-link { position: relative; }
        .navbar__cart-badge {
          background: var(--clr-gold);
          color: var(--clr-maroon-dark);
          font-size: 0.7rem;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }
        .navbar__mobile-actions {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        @media (min-width: 640px) {
          .navbar__mobile-actions { display: none; }
        }
        .navbar__cart-mobile {
          font-size: 1.3rem;
          position: relative;
          display: flex;
          align-items: center;
        }
        .navbar__cart-mobile .navbar__cart-badge {
          position: absolute;
          top: -6px; right: -8px;
        }
        .navbar__hamburger {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 6px;
          border-radius: var(--radius-sm);
        }
        .navbar__hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--clr-maroon);
          border-radius: 2px;
          transition: all 0.3s;
        }
        .navbar__hamburger--open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .navbar__hamburger--open span:nth-child(2) { opacity: 0; }
        .navbar__hamburger--open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        .navbar__drawer {
          background: var(--clr-warm-white);
          border-top: 1px solid var(--clr-border);
          display: flex;
          flex-direction: column;
          padding: var(--space-md) 0;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .navbar__drawer-link {
          padding: 14px var(--space-lg);
          font-size: 1rem;
          font-weight: 500;
          color: var(--clr-charcoal);
          border-bottom: 1px solid var(--clr-light-gray);
          transition: background var(--transition-fast), color var(--transition-fast);
        }
        .navbar__drawer-link:hover,
        .navbar__drawer-link.active { background: var(--clr-gold-pale); color: var(--clr-maroon); }
      `}</style>
    </nav>
  );
}
