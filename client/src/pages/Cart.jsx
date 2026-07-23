import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999';

function buildWhatsAppMessage(cart, subtotal) {
  const lines = cart.map(
    (item) =>
      `• ${item.name} x${item.quantity} — ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
  );
  const message = [
    '🛍️ *ABAfashions Order*',
    '',
    "Hi! I'd like to place an order:",
    '',
    ...lines,
    '',
    `*Total: ₹${subtotal.toLocaleString('en-IN')}*`,
    '',
    'Please confirm availability and share payment details. Thank you! 🙏',
  ].join('\n');

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function Cart() {
  const { cart, subtotal, itemCount, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <main className="main-content">
        <div className="container">
          <div className="empty-state" style={{ paddingTop: 64 }}>
            <div className="empty-state-icon" aria-hidden="true">🛒</div>
            <h1 className="empty-state-title">Your cart is empty</h1>
            <p>Looks like you haven't added any sarees yet. Explore our collection!</p>
            <Link to="/catalog" className="btn btn-primary btn-lg" id="cart-browse-btn">
              Browse Collection
            </Link>
          </div>
        </div>

        <style>{`
          .empty-state-title {
            font-family: var(--font-serif);
            font-size: 2rem;
            color: var(--clr-maroon);
            margin-bottom: 8px;
          }
        `}</style>
      </main>
    );
  }

  const waLink = buildWhatsAppMessage(cart, subtotal);

  return (
    <main className="main-content">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Your Cart</h1>
          <p className="cart-meta">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="cart-layout">
          {/* Items list */}
          <section aria-label="Cart items">
            <div className="cart-items-list">
              {cart.map((item) => <CartItem key={item.id} item={item} />)}
            </div>

            <div className="cart-bottom-actions">
              <Link to="/catalog" className="btn btn-ghost" id="continue-shopping-btn">
                ← Continue Shopping
              </Link>
              <button
                className="btn btn-ghost"
                onClick={clearCart}
                id="clear-cart-btn"
                aria-label="Clear all items from cart"
              >
                🗑 Clear Cart
              </button>
            </div>
          </section>

          {/* Order summary */}
          <aside className="cart-summary" aria-label="Order summary">
            <div className="cart-summary__card">
              <h2 className="cart-summary__title">Order Summary</h2>

              <div className="cart-summary__rows">
                {cart.map((item) => (
                  <div key={item.id} className="cart-summary__row">
                    <span className="cart-summary__item-name">
                      {item.name} <span className="cart-summary__qty">×{item.quantity}</span>
                    </span>
                    <span className="cart-summary__item-price">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="textile-divider cart-divider" aria-hidden="true">
                <span className="textile-divider-icon">✦</span>
              </div>

              <div className="cart-summary__total-row">
                <span className="cart-summary__total-label">Total</span>
                <span className="cart-summary__total-price">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-shimmer cart-wa-btn"
                id="checkout-whatsapp-btn"
                aria-label="Checkout via WhatsApp"
              >
                <span aria-hidden="true">💬</span>
                Checkout via WhatsApp
              </a>

              <p className="cart-summary__note">
                You'll be redirected to WhatsApp with your order summary pre-filled.
              </p>
            </div>

            <div className="cart-trust-badges">
              {['🔒 Secure', '✅ Easy ordering', '💬 Quick response'].map((b) => (
                <span key={b} className="cart-trust-badge">{b}</span>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .cart-header {
          padding: var(--space-xl) 0 var(--space-lg);
          display: flex;
          align-items: baseline;
          gap: var(--space-md);
        }
        .cart-title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 4vw, 3rem);
          color: var(--clr-maroon);
        }
        .cart-meta {
          font-size: 0.9375rem;
          color: var(--clr-mid-gray);
        }
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-2xl);
          padding-bottom: var(--space-2xl);
          align-items: start;
        }
        @media (min-width: 900px) {
          .cart-layout { grid-template-columns: 1fr 380px; }
        }
        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .cart-bottom-actions {
          display: flex;
          justify-content: space-between;
          margin-top: var(--space-lg);
          flex-wrap: wrap;
          gap: var(--space-sm);
        }
        /* Summary card */
        .cart-summary {}
        .cart-summary__card {
          background: #fff;
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--clr-light-gray);
        }
        @media (min-width: 900px) {
          .cart-summary__card { position: sticky; top: calc(var(--navbar-h) + 16px); }
        }
        .cart-summary__title {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          color: var(--clr-maroon);
          margin-bottom: var(--space-lg);
        }
        .cart-summary__rows {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: var(--space-md);
        }
        .cart-summary__row {
          display: flex;
          justify-content: space-between;
          gap: var(--space-sm);
          font-size: 0.875rem;
        }
        .cart-summary__item-name {
          color: var(--clr-charcoal);
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cart-summary__qty { color: var(--clr-mid-gray); }
        .cart-summary__item-price {
          font-weight: 600;
          color: var(--clr-charcoal);
          flex-shrink: 0;
        }
        .cart-divider { margin: var(--space-md) 0; }
        .cart-summary__total-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: var(--space-xl);
        }
        .cart-summary__total-label {
          font-size: 1rem;
          font-weight: 600;
          color: var(--clr-charcoal);
        }
        .cart-summary__total-price {
          font-family: var(--font-serif);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--clr-maroon);
        }
        .cart-wa-btn {
          display: flex !important;
          width: 100%;
          justify-content: center;
          text-align: center;
        }
        .cart-summary__note {
          font-size: 0.75rem;
          color: var(--clr-mid-gray);
          text-align: center;
          margin-top: var(--space-sm);
          line-height: 1.5;
        }
        .cart-trust-badges {
          display: flex;
          gap: var(--space-sm);
          justify-content: center;
          flex-wrap: wrap;
          margin-top: var(--space-md);
        }
        .cart-trust-badge {
          font-size: 0.75rem;
          color: var(--clr-mid-gray);
          background: var(--clr-cream);
          border: 1px solid var(--clr-border);
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }
      `}</style>
    </main>
  );
}
