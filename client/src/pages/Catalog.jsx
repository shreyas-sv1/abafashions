import { useEffect, useState, useMemo } from 'react';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';

function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-line" style={{ width: '75%' }} />
        <div className="skeleton skeleton-line" style={{ width: '40%' }} />
        <div className="skeleton skeleton-btn" />
      </div>
      <style>{`
        .skeleton-card { background:#fff; border-radius: var(--radius-lg); overflow:hidden; }
        .skeleton-img { height: 280px; }
        .skeleton-body { padding: 16px; display:flex; flex-direction:column; gap:10px; }
        .skeleton-line { height: 16px; border-radius: 4px; }
        .skeleton-btn { height: 38px; border-radius: 8px; width: 100%; margin-top: 6px; }
      `}</style>
    </div>
  );
}

const CATEGORIES = [
  { id: 'All', label: 'All Collections', icon: '✨' },
  { id: 'Sarees', label: 'Sarees', icon: '🥻' },
  { id: 'Dresses', label: 'Dresses', icon: '👗' },
  { id: 'Lehengas', label: 'Lehengas', icon: '👑' },
  { id: 'Kurtis & Suits', label: 'Kurtis & Suits', icon: '👘' },
];

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('sections'); // 'sections' or 'grid'

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((data) => setProducts(data))
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    products.forEach((p) => {
      const cat = p.category || 'Sarees';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by active category tab (if not 'All')
    if (activeCategory !== 'All') {
      result = result.filter((p) => (p.category || 'Sarees') === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.category && p.category.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      const getDiscount = (p) =>
        p.originalPrice && p.originalPrice > p.price
          ? (p.originalPrice - p.price) / p.originalPrice
          : 0;
      result.sort((a, b) => getDiscount(b) - getDiscount(a));
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  // Group products by category for section view
  const groupedSections = useMemo(() => {
    const sections = {};
    filteredProducts.forEach((p) => {
      const cat = p.category || 'Sarees';
      if (!sections[cat]) sections[cat] = [];
      sections[cat].push(p);
    });
    return sections;
  }, [filteredProducts]);

  return (
    <main className="main-content">
      <section className="section catalog-section">
        <div className="container">
          {/* Header */}
          <div className="catalog-header">
            <p className="catalog-header__eyebrow">Exquisite Collections</p>
            <h1 className="catalog-header__title">Our Fashion Catalog</h1>
            <div className="textile-divider" aria-hidden="true">
              <span className="textile-divider-icon">✦</span>
            </div>
            <p className="catalog-header__sub">
              Explore handpicked Sarees, Designer Dresses, Royal Lehengas, and Stylish Kurtis — featuring exclusive limited-time prices and original price savings.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="catalog-tabs-container">
            <div className="catalog-tabs" role="tablist" aria-label="Product categories">
              {CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    aria-selected={isActive}
                    className={`catalog-tab ${isActive ? 'catalog-tab--active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                    id={`category-tab-${cat.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <span className="catalog-tab__icon" aria-hidden="true">{cat.icon}</span>
                    <span className="catalog-tab__label">{cat.label}</span>
                    <span className="catalog-tab__count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="catalog-toolbar">
            <div className="catalog-search-wrap">
              <span className="catalog-search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                className="catalog-search-input"
                placeholder="Search by product name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="catalog-search-input"
                aria-label="Search catalog"
              />
              {searchQuery && (
                <button
                  className="catalog-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="catalog-toolbar-controls">
              {/* Sort selector */}
              <div className="catalog-sort-wrap">
                <label htmlFor="catalog-sort-select" className="catalog-sort-label">Sort by:</label>
                <select
                  id="catalog-sort-select"
                  className="catalog-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Biggest Savings (% OFF)</option>
                </select>
              </div>

              {/* View mode toggle */}
              {activeCategory === 'All' && (
                <div className="catalog-view-toggle" role="group" aria-label="Catalog view layout">
                  <button
                    className={`catalog-view-btn ${viewMode === 'sections' ? 'active' : ''}`}
                    onClick={() => setViewMode('sections')}
                    title="Section View by Category"
                    aria-label="Grouped sections view"
                  >
                    📚 Sections
                  </button>
                  <button
                    className={`catalog-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="All Grid View"
                    aria-label="Single grid view"
                  >
                    ⣿ Grid
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="catalog-error" role="alert">
              <p>⚠️ {error}</p>
              <button className="btn btn-outline btn-sm" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="product-grid" aria-label="Loading products" aria-busy="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredProducts.length === 0 && !error ? (
            <div className="empty-state">
              <div className="empty-state-icon" aria-hidden="true">🛍️</div>
              <h3>No items found</h3>
              <p>Try clearing your search or switching category filters.</p>
              {searchQuery && (
                <button className="btn btn-outline btn-sm" onClick={() => setSearchQuery('')}>
                  Clear Search
                </button>
              )}
            </div>
          ) : activeCategory === 'All' && viewMode === 'sections' && !searchQuery ? (
            /* Category Section Breakdown View */
            <div className="catalog-sections-layout">
              {Object.entries(groupedSections).map(([categoryName, catProducts]) => {
                const categoryObj = CATEGORIES.find((c) => c.id === categoryName) || {
                  label: categoryName,
                  icon: '✨',
                };
                return (
                  <section key={categoryName} className="category-block" aria-labelledby={`sec-${categoryName}`}>
                    <div className="category-block__header">
                      <h2 id={`sec-${categoryName}`} className="category-block__title">
                        <span className="category-block__icon" aria-hidden="true">{categoryObj.icon}</span>
                        {categoryObj.label}
                        <span className="category-block__count">({catProducts.length})</span>
                      </h2>
                      <button
                        className="category-block__view-all-btn"
                        onClick={() => setActiveCategory(categoryName)}
                      >
                        View All {categoryObj.label} →
                      </button>
                    </div>

                    <div className="product-grid" aria-label={`${categoryObj.label} section`}>
                      {catProducts.map((p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            /* Standard Grid View (Filtered by Category or Search) */
            <div className="product-grid" aria-label="Product catalog">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {!loading && filteredProducts.length > 0 && (
            <p className="catalog-count" role="status" aria-live="polite">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
              {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
            </p>
          )}
        </div>
      </section>

      <style>{`
        .catalog-section { padding-top: var(--space-xl); }
        .catalog-header { text-align: center; margin-bottom: var(--space-xl); }
        .catalog-header__eyebrow {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--clr-gold);
          margin-bottom: 8px;
        }
        .catalog-header__title {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 4vw, 3rem);
          color: var(--clr-maroon);
          margin-bottom: 16px;
        }
        .catalog-header__sub {
          color: var(--clr-mid-gray);
          font-size: 1rem;
          max-width: 580px;
          margin: 0 auto;
          line-height: 1.7;
        }

        /* Category Filter Tabs */
        .catalog-tabs-container {
          display: flex;
          justify-content: center;
          margin-bottom: var(--space-xl);
          overflow-x: auto;
          padding-bottom: 6px;
        }
        .catalog-tabs {
          display: flex;
          gap: 8px;
          background: #fff;
          padding: 6px;
          border-radius: var(--radius-full);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--clr-light-gray);
        }
        .catalog-tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: var(--radius-full);
          border: none;
          background: transparent;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--clr-charcoal);
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }
        .catalog-tab:hover {
          color: var(--clr-maroon);
          background: rgba(123, 28, 46, 0.05);
        }
        .catalog-tab--active {
          background: linear-gradient(135deg, var(--clr-maroon), var(--clr-maroon-dark)) !important;
          color: #fff !important;
          box-shadow: 0 4px 12px rgba(123, 28, 46, 0.25);
        }
        .catalog-tab__icon { font-size: 1rem; }
        .catalog-tab__count {
          font-size: 0.75rem;
          background: rgba(0,0,0,0.08);
          padding: 2px 7px;
          border-radius: var(--radius-full);
        }
        .catalog-tab--active .catalog-tab__count {
          background: rgba(255,255,255,0.25);
          color: #fff;
        }

        /* Search & Toolbar */
        .catalog-toolbar {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
          background: #fff;
          padding: var(--space-md) var(--space-lg);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--clr-light-gray);
        }
        @media (min-width: 768px) {
          .catalog-toolbar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .catalog-search-wrap {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 440px;
        }
        .catalog-search-icon {
          position: absolute;
          left: 14px;
          font-size: 0.9rem;
          color: var(--clr-mid-gray);
        }
        .catalog-search-input {
          width: 100%;
          padding: 10px 36px 10px 38px;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--clr-border);
          font-size: 0.875rem;
          transition: border-color var(--transition-fast);
        }
        .catalog-search-input:focus {
          outline: none;
          border-color: var(--clr-gold);
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15);
        }
        .catalog-search-clear {
          position: absolute;
          right: 12px;
          border: none;
          background: transparent;
          font-size: 0.8rem;
          color: var(--clr-mid-gray);
          cursor: pointer;
        }
        .catalog-toolbar-controls {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          flex-wrap: wrap;
        }
        .catalog-sort-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .catalog-sort-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--clr-mid-gray);
          white-space: nowrap;
        }
        .catalog-sort-select {
          padding: 8px 14px;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--clr-border);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--clr-charcoal);
          background: #fff;
          cursor: pointer;
        }
        .catalog-sort-select:focus {
          outline: none;
          border-color: var(--clr-gold);
        }

        .catalog-view-toggle {
          display: flex;
          background: var(--clr-cream);
          padding: 3px;
          border-radius: var(--radius-md);
          border: 1px solid var(--clr-border);
        }
        .catalog-view-btn {
          border: none;
          background: transparent;
          padding: 5px 12px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--clr-mid-gray);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .catalog-view-btn.active {
          background: #fff;
          color: var(--clr-maroon);
          box-shadow: var(--shadow-sm);
        }

        /* Section Layout */
        .catalog-sections-layout {
          display: flex;
          flex-direction: column;
          gap: var(--space-3xl);
        }
        .category-block {
          background: rgba(255,255,255,0.4);
          padding: var(--space-lg);
          border-radius: var(--radius-2xl);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .category-block__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-xs);
          border-bottom: 2px solid var(--clr-gold-light);
        }
        .category-block__title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--clr-maroon);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .category-block__icon { font-size: 1.4rem; }
        .category-block__count {
          font-size: 0.875rem;
          color: var(--clr-mid-gray);
          font-family: var(--font-sans);
          font-weight: 400;
        }
        .category-block__view-all-btn {
          border: none;
          background: transparent;
          color: var(--clr-gold);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: color var(--transition-fast);
        }
        .category-block__view-all-btn:hover {
          color: var(--clr-maroon);
          text-decoration: underline;
        }

        .catalog-error {
          text-align: center;
          padding: var(--space-xl);
          color: var(--clr-danger);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
        }
        .catalog-count {
          text-align: center;
          margin-top: var(--space-xl);
          color: var(--clr-mid-gray);
          font-size: 0.875rem;
        }
      `}</style>
    </main>
  );
}
