import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import toast from 'react-hot-toast';

// ── Sub-components ───────────────────────────────────────────
function ImagePreview({ src, alt = 'Preview' }) {
  if (!src) return (
    <div className="img-preview img-preview--empty" aria-label="No image selected">
      <span aria-hidden="true">🖼</span>
      <small>No image</small>
    </div>
  );
  return <img src={src} alt={alt} className="img-preview" />;
}

function ConfirmModal({ product, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Confirm delete">
      <div className="modal-box">
        <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--clr-maroon)', marginBottom: 12 }}>
          Delete Product?
        </h3>
        <p style={{ color: 'var(--clr-mid-gray)', marginBottom: 24, fontSize: '0.9375rem' }}>
          Are you sure you want to delete <strong>"{product.name}"</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={onCancel} id="modal-cancel-btn">Cancel</button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm} id="modal-confirm-delete">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Upload / Edit form ────────────────────────────────────────
function ProductForm({ initial, onSave, onCancel, loading }) {
  const [name,          setName]          = useState(initial?.name          || '');
  const [category,      setCategory]      = useState(initial?.category      || 'Sarees');
  const [price,         setPrice]         = useState(initial?.price         || '');
  const [originalPrice, setOriginalPrice] = useState(initial?.originalPrice || '');
  const [inStock,       setInStock]       = useState(initial?.inStock !== false);
  const [imageUrl,      setImageUrl]      = useState(initial?.imageUrl       || '');
  const [file,          setFile]          = useState(null);
  const [preview,       setPreview]       = useState(initial?.imageUrl       || '');
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setImageUrl(val);
    if (val.trim()) {
      setPreview(val.trim());
    } else if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name',          name.trim());
    fd.append('category',      category);
    fd.append('price',         price);
    if (originalPrice) fd.append('originalPrice', originalPrice);
    if (imageUrl) fd.append('imageUrl', imageUrl.trim());
    fd.append('inStock', inStock ? 'true' : 'false');
    if (file) fd.append('image', file);
    onSave(fd);
  };

  const isEdit = Boolean(initial);

  // Live discount % preview calculation
  const numPrice = parseFloat(price);
  const numOrig = parseFloat(originalPrice);
  const calculatedDiscount = numOrig && numPrice && numOrig > numPrice
    ? Math.round(((numOrig - numPrice) / numOrig) * 100)
    : null;

  return (
    <form onSubmit={handleSubmit} className="product-form" aria-label={isEdit ? 'Edit product form' : 'Upload new product form'}>
      <div className="product-form__row">
        {/* Image upload & URL */}
        <div className="product-form__image-col">
          <ImagePreview src={preview} alt={name || 'Product image'} />
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleFile}
            style={{ display: 'none' }}
            id={isEdit ? 'edit-image-upload' : 'new-image-upload'}
            aria-label="Upload product image"
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => fileRef.current.click()}
            id={isEdit ? 'edit-pick-image-btn' : 'new-pick-image-btn'}
          >
            {file ? 'File Selected' : preview ? 'Change File' : 'Choose File'}
          </button>
          <div style={{ width: '100%', textDecoration: 'none', margin: '4px 0' }}>
            <input
              type="url"
              className="form-input"
              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
              value={imageUrl}
              onChange={handleUrlChange}
              placeholder="Or paste Image URL..."
              id={isEdit ? 'edit-image-url' : 'new-image-url'}
            />
          </div>
          {!file && !preview && (
            <small className="product-form__img-note">Upload file or paste image URL</small>
          )}
        </div>

        {/* Fields */}
        <div className="product-form__fields">
          <div className="form-group">
            <label htmlFor={isEdit ? 'edit-name' : 'new-name'} className="form-label">Product Name</label>
            <input
              id={isEdit ? 'edit-name' : 'new-name'}
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kanjivaram Silk Saree / Georgette Dress"
              required
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label htmlFor={isEdit ? 'edit-category' : 'new-category'} className="form-label">Category / Section</label>
            <select
              id={isEdit ? 'edit-category' : 'new-category'}
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="Sarees">🥻 Sarees</option>
              <option value="Dresses">👗 Dresses</option>
              <option value="Lehengas">👑 Lehengas</option>
              <option value="Kurtis & Suits">👘 Kurtis & Suits</option>
              <option value="Accessories">✨ Accessories</option>
            </select>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor={isEdit ? 'edit-price' : 'new-price'} className="form-label">
                Selling Price (Discounted ₹)
              </label>
              <input
                id={isEdit ? 'edit-price' : 'new-price'}
                type="number"
                min="1"
                step="0.01"
                className="form-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 75 or 4500"
                required
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor={isEdit ? 'edit-orig-price' : 'new-orig-price'} className="form-label">
                Original MRP Price (₹)
              </label>
              <input
                id={isEdit ? 'edit-orig-price' : 'new-orig-price'}
                type="number"
                min="1"
                step="0.01"
                className="form-input"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="e.g. 100 or 6000"
              />
            </div>
          </div>

          {/* Discount calculation badge */}
          {calculatedDiscount !== null && (
            <div className="discount-preview-badge">
              🔥 Calculated Discount: <strong>{calculatedDiscount}% OFF</strong> (Save ₹{(numOrig - numPrice).toLocaleString('en-IN')})
            </div>
          )}

          <div className="form-group product-form__stock-row">
            <input
              type="checkbox"
              id={isEdit ? 'edit-instock' : 'new-instock'}
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="product-form__checkbox"
              aria-label="Product is in stock"
            />
            <label htmlFor={isEdit ? 'edit-instock' : 'new-instock'} className="product-form__stock-label">
              In Stock
            </label>
          </div>

          <div className="product-form__actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id={isEdit ? 'edit-save-btn' : 'new-save-btn'}
            >
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Upload Product'}
            </button>
            {onCancel && (
              <button type="button" className="btn btn-ghost" onClick={onCancel} id="form-cancel-btn">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

// ── Main Dashboard ────────────────────────────────────────────
export default function AdminDashboard() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const [products,      setProducts]      = useState([]);
  const [loadingList,   setLoadingList]   = useState(true);
  const [formLoading,   setFormLoading]   = useState(false);
  const [editingId,     setEditingId]     = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);

  const fetchProducts = () => {
    setLoadingList(true);
    getProducts()
      .then(setProducts)
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoadingList(false));
  };

  useEffect(fetchProducts, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleCreate = async (fd) => {
    setFormLoading(true);
    try {
      await createProduct(fd);
      toast.success('Saree uploaded successfully!');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (fd) => {
    setFormLoading(true);
    try {
      await updateProduct(editingId, fd);
      toast.success('Product updated!');
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    }
  };

  const editingProduct = editingId ? products.find((p) => p.id === editingId) : null;

  return (
    <div className="admin-dashboard">
      {/* Sidebar / Top header */}
      <header className="admin-header" role="banner">
        <div className="admin-header__brand">
          <div className="admin-header__logo-wrap">
            <img src="/logo.png" alt="ABA Fashions Logo" className="admin-header__logo-img" />
          </div>
          <span className="admin-header__panel-label">Admin Panel</span>
        </div>
        <div className="admin-header__user">
          <span className="admin-header__username">👤 {username}</span>
          <button
            className="btn btn-ghost admin-header__logout"
            onClick={handleLogout}
            id="admin-logout-btn"
            aria-label="Logout from admin panel"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="admin-main container">
        {/* Upload new */}
        <section className="admin-section" aria-labelledby="upload-heading">
          <h2 id="upload-heading" className="admin-section__title">
            <span className="admin-section__icon" aria-hidden="true">➕</span>
            Upload New Item
          </h2>
          <div className="admin-section__card">
            <ProductForm
              initial={null}
              onSave={handleCreate}
              loading={formLoading && !editingId}
            />
          </div>
        </section>

        {/* Product table */}
        <section className="admin-section" aria-labelledby="inventory-heading">
          <h2 id="inventory-heading" className="admin-section__title">
            <span className="admin-section__icon" aria-hidden="true">🗂</span>
            Inventory ({products.length})
          </h2>

          {loadingList ? (
            <div className="admin-section__card" style={{ textAlign: 'center', padding: 40 }}>
              <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto' }} aria-label="Loading products" />
            </div>
          ) : products.length === 0 ? (
            <div className="admin-section__card" style={{ textAlign: 'center', padding: 40, color: 'var(--clr-mid-gray)' }}>
              No products yet. Upload your first product above!
            </div>
          ) : (
            <div className="admin-section__card admin-table-wrap">
              <table className="admin-table" aria-label="Product inventory table">
                <thead>
                  <tr>
                    <th scope="col">Image</th>
                    <th scope="col">Name</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price / MRP</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const discount = p.originalPrice && p.originalPrice > p.price
                      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                      : null;
                    return (
                      <tr key={p.id}>
                        <td>
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="admin-table__thumb"
                              loading="lazy"
                            />
                          ) : (
                            <div className="admin-table__thumb-placeholder" aria-hidden="true">
                              🛍️
                            </div>
                          )}
                        </td>
                        <td>
                          <span className="admin-table__name">{p.name}</span>
                        </td>
                        <td>
                          <span className="badge badge-outline">
                            {p.category || 'Sarees'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span className="admin-table__price">₹{p.price.toLocaleString('en-IN')}</span>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
                                <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>
                                  ₹{p.originalPrice.toLocaleString('en-IN')}
                                </span>
                                <span style={{ color: '#e11d48', fontWeight: 700 }}>
                                  {discount}% OFF
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${p.inStock ? 'badge-success' : 'badge-danger'}`}>
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <div className="admin-table__btns">
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setEditingId(p.id)}
                              id={`edit-btn-${p.id}`}
                              aria-label={`Edit ${p.name}`}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => setDeleteTarget(p)}
                              id={`delete-btn-${p.id}`}
                              aria-label={`Delete ${p.name}`}
                            >
                              🗑 Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Edit modal */}
      {editingProduct && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Edit product">
          <div className="modal-box" style={{ maxWidth: 680 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--clr-maroon)', marginBottom: 20 }}>
              Edit Saree
            </h3>
            <ProductForm
              initial={editingProduct}
              onSave={handleUpdate}
              onCancel={() => setEditingId(null)}
              loading={formLoading}
            />
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <ConfirmModal
          product={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <style>{`
        .admin-dashboard { min-height: 100vh; background: var(--clr-cream); }

        /* Header */
        .admin-header {
          background: linear-gradient(135deg, var(--clr-maroon-dark), var(--clr-teal));
          padding: 16px 0;
          position: sticky;
          top: 0;
          z-index: 400;
          box-shadow: 0 2px 12px rgba(0,0,0,0.2);
        }
        .admin-header > * { 
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 var(--space-md);
        }
        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px var(--space-xl);
        }
        .admin-header__brand { display: flex; align-items: center; gap: 12px; }
        .admin-header__logo-wrap {
          background: #fff;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
        }
        .admin-header__logo-img {
          height: 32px;
          width: auto;
          display: block;
          object-fit: contain;
        }
        .admin-header__panel-label {
          color: rgba(255,255,255,0.55);
          font-size: 0.8125rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border-left: 1px solid rgba(255,255,255,0.25);
          padding-left: 12px;
        }
        .admin-header__user { display: flex; align-items: center; gap: 12px; }
        .admin-header__username { color: rgba(255,255,255,0.8); font-size: 0.875rem; }
        .admin-header__logout { color: rgba(255,255,255,0.7) !important; font-size: 0.875rem !important; }
        .admin-header__logout:hover { color: #fff !important; }

        /* Main */
        .admin-main { padding: var(--space-xl) 0 var(--space-3xl); }
        .admin-section { margin-bottom: var(--space-2xl); }
        .admin-section__title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--clr-charcoal);
          margin-bottom: var(--space-lg);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin-section__icon { font-size: 1.1rem; }
        .admin-section__card {
          background: #fff;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--clr-light-gray);
          overflow: hidden;
        }

        /* Product form */
        .product-form { padding: var(--space-xl); }
        .product-form__row {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-xl);
        }
        @media (min-width: 640px) {
          .product-form__row { grid-template-columns: 180px 1fr; }
        }
        .product-form__image-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
        }
        .img-preview {
          width: 160px;
          height: 200px;
          object-fit: cover;
          border-radius: var(--radius-md);
          border: 1.5px solid var(--clr-border);
        }
        .img-preview--empty {
          width: 160px;
          height: 200px;
          border-radius: var(--radius-md);
          border: 1.5px dashed var(--clr-border);
          background: var(--clr-cream);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--clr-mid-gray);
          font-size: 2rem;
        }
        .product-form__img-note { font-size: 0.75rem; color: var(--clr-mid-gray); text-align: center; }
        .product-form__fields { display: flex; flex-direction: column; gap: var(--space-md); }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-md);
        }
        @media (min-width: 540px) {
          .form-grid-2 { grid-template-columns: 1fr 1fr; }
        }
        .discount-preview-badge {
          background: #fef2f2;
          color: #be123c;
          border: 1px solid #fecdd3;
          padding: 8px 14px;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
        }
        .product-form__stock-row { flex-direction: row; align-items: center; gap: 10px; }
        .product-form__checkbox { width: 18px; height: 18px; accent-color: var(--clr-maroon); cursor: pointer; }
        .product-form__stock-label { font-size: 0.9375rem; font-weight: 500; cursor: pointer; }
        .product-form__actions { display: flex; gap: var(--space-md); flex-wrap: wrap; margin-top: var(--space-sm); }

        /* Table */
        .admin-table-wrap { overflow-x: auto; }
        .admin-table__thumb {
          width: 52px;
          height: 68px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 1px solid var(--clr-border);
        }
        .admin-table__thumb-placeholder {
          width: 52px;
          height: 68px;
          background: linear-gradient(135deg, #fdf6ec 0%, #f5e8d6 100%);
          border-radius: var(--radius-sm);
          border: 1px solid var(--clr-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: var(--clr-mid-gray);
        }
        .admin-table__name { font-weight: 500; font-size: 0.9375rem; }
        .admin-table__price { color: var(--clr-maroon); font-weight: 600; }
        .admin-table__btns { display: flex; gap: 8px; }

        /* Spinner for table loading */
        .spinner {
          border: 3px solid var(--clr-light-gray);
          border-top-color: var(--clr-gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>
    </div>
  );
}
