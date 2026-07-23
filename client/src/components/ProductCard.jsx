import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAdd = () => {
    if (!product.inStock) return;
    setAdding(true);
    addToCart(product);
    toast.success(`"${product.name}" added to cart!`, {
      icon: '🛒',
      style: {
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.875rem',
        border: '1px solid #C9A84C',
        borderRadius: '8px',
      },
    });
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card__image-link" aria-label={`View ${product.name}`}>
        <div className="product-card__image-wrap">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-card__image"
              loading="lazy"
            />
          ) : (
            <div className="product-card__no-image" aria-hidden="true">
              <span className="product-card__no-image-icon">🛍️</span>
              <span className="product-card__no-image-text">No Photo</span>
            </div>
          )}

          {/* Category Tag */}
          {product.category && (
            <span className="product-card__category-badge">
              {product.category}
            </span>
          )}

          {/* Discount Badge */}
          {discountPercent && (
            <span className="product-card__discount-badge">
              {discountPercent}% OFF
            </span>
          )}

          {!product.inStock && (
            <div className="product-card__sold-out" aria-label="Out of stock">
              Out of Stock
            </div>
          )}
          <div className="product-card__overlay" aria-hidden="true">
            <span>View Details</span>
          </div>
        </div>
      </Link>

      <div className="product-card__body">
        <Link to={`/product/${product.id}`} className="product-card__name">
          {product.name}
        </Link>

        {/* Price Row: Discounted price first, followed by original strikethrough price */}
        <div className="product-card__price-row">
          <span className="product-card__price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="product-card__original-price">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <button
          className={`btn btn-primary btn-sm product-card__btn${adding ? ' product-card__btn--adding' : ''}`}
          onClick={handleAdd}
          disabled={!product.inStock}
          id={`add-to-cart-${product.id}`}
          aria-label={`Add ${product.name} to cart`}
        >
          {adding ? '✓ Added!' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>

      <style>{`
        .product-card {
          background: #fff;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: box-shadow var(--transition-base), transform var(--transition-base);
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .product-card:hover {
          box-shadow: var(--shadow-lg), 0 0 0 1.5px var(--clr-gold-light);
          transform: translateY(-4px);
        }
        .product-card__image-link { display: block; }
        .product-card__image-wrap {
          position: relative;
          aspect-ratio: 3 / 4;
          overflow: hidden;
        }
        .product-card__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .product-card:hover .product-card__image {
          transform: scale(1.06);
        }
        .product-card__no-image {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #fdf6ec 0%, #f5e8d6 100%);
          color: var(--clr-mid-gray);
        }
        .product-card__no-image-icon {
          font-size: 2.5rem;
          opacity: 0.5;
        }
        .product-card__no-image-text {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.5;
        }
        .product-card__category-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(4px);
          color: var(--clr-maroon);
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
          z-index: 2;
        }
        .product-card__discount-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: linear-gradient(135deg, #e11d48, #be123c);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 4px 9px;
          border-radius: var(--radius-full);
          box-shadow: 0 2px 8px rgba(225, 29, 72, 0.4);
          z-index: 2;
        }
        .product-card__sold-out {
          position: absolute;
          bottom: 12px; left: 12px;
          background: rgba(185,28,28,0.9);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          z-index: 2;
        }
        .product-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(123,28,46,0.7) 0%, transparent 50%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 16px;
          opacity: 0;
          transition: opacity var(--transition-base);
        }
        .product-card__overlay span {
          color: #fff;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          border: 1px solid rgba(255,255,255,0.6);
          padding: 6px 18px;
          border-radius: var(--radius-full);
        }
        .product-card:hover .product-card__overlay { opacity: 1; }
        .product-card__body {
          padding: var(--space-md);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          flex: 1;
        }
        .product-card__name {
          font-family: var(--font-serif);
          font-size: 1rem;
          font-weight: 600;
          color: var(--clr-charcoal);
          line-height: 1.3;
          transition: color var(--transition-fast);
          margin-bottom: 2px;
        }
        .product-card__name:hover { color: var(--clr-maroon); }
        .product-card__price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: var(--space-xs);
        }
        .product-card__price {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--clr-maroon);
          font-family: var(--font-serif);
        }
        .product-card__original-price {
          font-size: 0.875rem;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 500;
        }
        .product-card__btn {
          margin-top: auto;
          width: 100%;
          transition: all var(--transition-base) !important;
        }
        .product-card__btn--adding {
          background: var(--clr-emerald) !important;
        }
      `}</style>
    </article>
  );
}
