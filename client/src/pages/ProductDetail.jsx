import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/products';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [adding,  setAdding]  = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(setProduct)
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product?.inStock) return;
    setAdding(true);
    addToCart(product);
    toast.success(`"${product.name}" added to cart!`, { icon: '🛒' });
    setTimeout(() => setAdding(false), 700);
  };

  if (loading) return <div className="main-content"><LoadingSpinner text="Loading product..." /></div>;

  if (error || !product) {
    return (
      <main className="main-content">
        <div className="container" style={{ paddingTop: 48 }}>
          <div className="empty-state">
            <div className="empty-state-icon">🧣</div>
            <h3>Product not found</h3>
            <p>This saree may have been removed or is unavailable.</p>
            <Link to="/catalog" className="btn btn-primary">Back to Catalog</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/"        className="breadcrumb__link">Home</Link>
          <span className="breadcrumb__sep" aria-hidden="true"> ❯ </span>
          <Link to="/catalog" className="breadcrumb__link">Catalog</Link>
          <span className="breadcrumb__sep" aria-hidden="true"> ❯ </span>
          <span className="breadcrumb__current" aria-current="page">{product.name}</span>
        </nav>

        <div className="pd-layout">
          {/* Image */}
          <div className="pd-image-wrap">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="pd-image"
              />
            ) : (
              <div className="pd-no-image" aria-hidden="true">
                <span className="pd-no-image-icon">🧣</span>
                <span className="pd-no-image-text">No Photo Available</span>
              </div>
            )}
            {!product.inStock && (
              <div className="pd-sold-out-badge" role="status">Out of Stock</div>
            )}
          </div>

          {/* Details */}
          <div className="pd-details">
            <div className="pd-details__eyebrow">
              {product.category ? `Collection · ${product.category}` : 'Premium Collection'}
            </div>
            <h1 className="pd-details__name">{product.name}</h1>

            <div className="textile-divider pd-divider" aria-hidden="true">
              <span className="textile-divider-icon">✦</span>
            </div>

            {/* Price & Discount block */}
            <div className="pd-details__price-block">
              <div className="pd-details__price-row">
                <span className="pd-details__price">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="pd-details__original-price">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="pd-details__discount-pill">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="pd-details__savings">
                  🎉 You save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}!
                </div>
              )}
            </div>

            <div className="pd-details__stock" role="status" aria-live="polite">
              {product.inStock ? (
                <span className="badge badge-success">✓ In Stock</span>
              ) : (
                <span className="badge badge-danger">✗ Out of Stock</span>
              )}
            </div>

            <p className="pd-details__desc">
              {product.category === 'Dresses'
                ? 'An elegant dress designed with intricate detailing and premium fabric. Perfect for parties, festive occasions, and evening wear.'
                : product.category === 'Lehengas'
                ? 'A regal lehenga featuring elaborate embroidery and rich textures. Crafted to make every grand celebration memorable.'
                : product.category === 'Kurtis & Suits'
                ? 'A stylish and comfortable suit set combining modern aesthetic with traditional craftsmanship. Ideal for everyday elegance and festive gatherings.'
                : 'A beautiful handpicked saree known for its exquisite craftsmanship and timeless appeal. Perfect for weddings, festivals, and special occasions.'}
            </p>

            <div className="pd-details__features">
              {['Authentic weave & fabric', 'Premium quality guaranteed', 'Easy WhatsApp ordering'].map((f) => (
                <div key={f} className="pd-feature">
                  <span className="pd-feature__dot" aria-hidden="true">✦</span>
                  {f}
                </div>
              ))}
            </div>

            <button
              className={`btn btn-primary btn-lg pd-cta${adding ? ' pd-cta--added' : ''}`}
              onClick={handleAdd}
              disabled={!product.inStock}
              id="product-detail-add-to-cart"
              aria-label={`Add ${product.name} to cart`}
            >
              {adding ? '✓ Added to Cart!' : product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
            </button>

            <Link to="/cart" className="pd-view-cart-link">View Cart →</Link>
          </div>
        </div>
      </div>

      <style>{`
        .breadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
          padding: var(--space-lg) 0 var(--space-md);
          font-size: 0.875rem;
        }
        .breadcrumb__link { color: var(--clr-mid-gray); transition: color var(--transition-fast); }
        .breadcrumb__link:hover { color: var(--clr-maroon); }
        .breadcrumb__sep { color: var(--clr-border); font-size: 0.75rem; }
        .breadcrumb__current { color: var(--clr-charcoal); font-weight: 500; }

        .pd-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-2xl);
          padding-bottom: var(--space-2xl);
        }
        @media (min-width: 768px) {
          .pd-layout { grid-template-columns: 1fr 1fr; align-items: start; }
        }
        @media (min-width: 1024px) {
          .pd-layout { grid-template-columns: 5fr 4fr; }
        }

        .pd-image-wrap {
          position: relative;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          aspect-ratio: 3/4;
        }
        @media (min-width: 768px) {
          .pd-image-wrap { position: sticky; top: calc(var(--navbar-h) + 24px); }
        }
        .pd-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pd-no-image {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: linear-gradient(135deg, #fdf6ec 0%, #f5e8d6 100%);
          color: var(--clr-mid-gray);
        }
        .pd-no-image-icon {
          font-size: 4rem;
          opacity: 0.5;
        }
        .pd-no-image-text {
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.5;
        }
        .pd-sold-out-badge {
          position: absolute;
          top: 20px; left: 20px;
          background: rgba(185,28,28,0.9);
          color: #fff;
          font-size: 0.8125rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: var(--radius-full);
        }

        .pd-details { display: flex; flex-direction: column; gap: var(--space-lg); }
        .pd-details__eyebrow {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--clr-gold);
        }
        .pd-details__name {
          font-family: var(--font-serif);
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          color: var(--clr-maroon);
          line-height: 1.2;
        }
        .pd-details__price-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .pd-details__price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }
        .pd-details__price {
          font-family: var(--font-serif);
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--clr-maroon);
        }
        .pd-details__original-price {
          font-size: 1.25rem;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 500;
        }
        .pd-details__discount-pill {
          background: linear-gradient(135deg, #e11d48, #be123c);
          color: #ffffff;
          font-size: 0.8125rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          box-shadow: 0 2px 8px rgba(225, 29, 72, 0.3);
        }
        .pd-details__savings {
          font-size: 0.875rem;
          font-weight: 600;
          color: #059669;
          background: #ecfdf5;
          padding: 6px 14px;
          border-radius: var(--radius-md);
          display: inline-block;
          border: 1px solid #a7f3d0;
          align-self: flex-start;
        }
        .pd-details__desc {
          font-size: 0.9375rem;
          color: var(--clr-mid-gray);
          line-height: 1.75;
        }
        .pd-details__features { display: flex; flex-direction: column; gap: 8px; }
        .pd-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--clr-charcoal);
        }
        .pd-feature__dot { color: var(--clr-gold); font-size: 0.7rem; }
        .pd-cta {
          width: 100%;
          transition: all var(--transition-base) !important;
        }
        .pd-cta--added { background: var(--clr-emerald) !important; }
        .pd-view-cart-link {
          color: var(--clr-mid-gray);
          font-size: 0.875rem;
          text-align: center;
          transition: color var(--transition-fast);
        }
        .pd-view-cart-link:hover { color: var(--clr-maroon); }
      `}</style>
    </main>
  );
}
