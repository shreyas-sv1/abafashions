import { useCart } from '../context/CartContext';

export default function CartItem({ item }) {
  const { removeFromCart, updateQty } = useCart();

  return (
    <div className="cart-item">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="cart-item__image"
        loading="lazy"
      />

      <div className="cart-item__details">
        {item.category && (
          <span className="cart-item__category">{item.category}</span>
        )}
        <h4 className="cart-item__name">{item.name}</h4>
        <div className="cart-item__price-row">
          <span className="cart-item__price-each">₹{item.price.toLocaleString('en-IN')}</span>
          {item.originalPrice && item.originalPrice > item.price && (
            <span className="cart-item__orig-price"><s>₹{item.originalPrice.toLocaleString('en-IN')}</s></span>
          )}
        </div>

        <div className="cart-item__actions">
          <div className="qty-stepper" aria-label={`Quantity for ${item.name}`}>
            <button
              onClick={() => updateQty(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              id={`qty-dec-${item.id}`}
            >−</button>
            <span aria-live="polite">{item.quantity}</span>
            <button
              onClick={() => updateQty(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
              id={`qty-inc-${item.id}`}
            >+</button>
          </div>

          <button
            className="cart-item__remove"
            onClick={() => removeFromCart(item.id)}
            aria-label={`Remove ${item.name} from cart`}
            id={`remove-item-${item.id}`}
          >
            🗑 Remove
          </button>
        </div>
      </div>

      <div className="cart-item__subtotal">
        <p className="cart-item__total-label">Subtotal</p>
        <p className="cart-item__total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
        {item.originalPrice && item.originalPrice > item.price && (
          <p className="cart-item__savings">
            Saved ₹{((item.originalPrice - item.price) * item.quantity).toLocaleString('en-IN')}
          </p>
        )}
      </div>

      <style>{`
        .cart-item {
          display: flex;
          gap: var(--space-md);
          padding: var(--space-md);
          background: #fff;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          align-items: flex-start;
        }
        .cart-item__image {
          width: 88px;
          height: 112px;
          object-fit: cover;
          border-radius: var(--radius-md);
          flex-shrink: 0;
        }
        @media (min-width: 480px) {
          .cart-item__image { width: 100px; height: 130px; }
        }
        .cart-item__details {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }
        .cart-item__category {
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--clr-gold);
        }
        .cart-item__name {
          font-family: var(--font-serif);
          font-size: 1rem;
          font-weight: 600;
          color: var(--clr-charcoal);
          line-height: 1.3;
          white-space: normal;
        }
        .cart-item__price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .cart-item__price-each {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--clr-maroon);
        }
        .cart-item__orig-price {
          font-size: 0.75rem;
          color: #94a3b8;
        }
        .cart-item__savings {
          font-size: 0.7rem;
          color: #059669;
          font-weight: 600;
          margin-top: 2px;
        }
        .cart-item__actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          flex-wrap: wrap;
        }
        .cart-item__remove {
          font-size: 0.8125rem;
          color: var(--clr-danger);
          font-weight: 500;
          transition: opacity var(--transition-fast);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
        }
        .cart-item__remove:hover { opacity: 0.7; background: #fee2e2; }
        .cart-item__subtotal {
          text-align: right;
          flex-shrink: 0;
          min-width: 80px;
        }
        .cart-item__total-label {
          font-size: 0.75rem;
          color: var(--clr-mid-gray);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .cart-item__total {
          font-family: var(--font-serif);
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--clr-maroon);
        }
      `}</style>
    </div>
  );
}
