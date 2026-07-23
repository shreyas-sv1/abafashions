import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const TOKEN_KEY = 'abafashions_admin_token';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT on every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const INITIAL_MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Royal Kanjivaram Silk Saree',
    category: 'Sarees',
    price: 4500,
    originalPrice: 6000,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    id: 2,
    name: 'Banarasi Zari Silk Saree',
    category: 'Sarees',
    price: 3200,
    originalPrice: 4200,
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    id: 3,
    name: 'Floral Georgette Anarkali Dress',
    category: 'Dresses',
    price: 2250,
    originalPrice: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    id: 4,
    name: 'Embroidered Velvet Gown Dress',
    category: 'Dresses',
    price: 3500,
    originalPrice: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    id: 5,
    name: 'Designer Velvet Lehenga Choli',
    category: 'Lehengas',
    price: 6800,
    originalPrice: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    id: 6,
    name: 'Bridal Raw Silk Lehenga',
    category: 'Lehengas',
    price: 8900,
    originalPrice: 12000,
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    id: 7,
    name: 'Chikankari Cotton Kurti Set',
    category: 'Kurtis & Suits',
    price: 1350,
    originalPrice: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
  {
    id: 8,
    name: 'Silk Straight Suit with Dupatta',
    category: 'Kurtis & Suits',
    price: 2400,
    originalPrice: 3200,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
    inStock: true,
  },
];

const CUSTOM_PRODUCTS_KEY = 'abafashions_custom_products';

const getStoredCustomProducts = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredCustomProducts = (list) => {
  try {
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Failed to save products to localStorage:', err);
  }
};

export const getProducts = () =>
  api.get('/api/products')
    .then((r) => r.data)
    .catch((err) => {
      console.warn('API unreachable, using initial fallback products:', err.message);
      const custom = getStoredCustomProducts();
      return [...custom, ...INITIAL_MOCK_PRODUCTS];
    });

export const getProduct = (id) =>
  api.get(`/api/products/${id}`)
    .then((r) => r.data)
    .catch((err) => {
      console.warn(`API unreachable for product ${id}, checking mock fallback:`, err.message);
      const custom = getStoredCustomProducts();
      const all = [...custom, ...INITIAL_MOCK_PRODUCTS];
      const found = all.find((p) => p.id === parseInt(id));
      if (found) return found;
      throw err;
    });

export const createProduct = (formData) =>
  api.post('/api/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then((r) => r.data)
    .catch((err) => {
      console.warn('Backend API create failed, using client-side fallback:', err.message);
      const name = formData.get('name');
      const price = parseFloat(formData.get('price'));
      const originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice')) : null;
      const category = formData.get('category') || 'Sarees';
      const inStock = formData.get('inStock') !== 'false';
      let imageUrl = formData.get('imageUrl') || '';

      const file = formData.get('image');
      if (file && file instanceof File) {
        imageUrl = URL.createObjectURL(file);
      }
      if (!imageUrl) {
        imageUrl = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800';
      }

      const newProduct = {
        id: Date.now(),
        name,
        price,
        originalPrice,
        category,
        imageUrl,
        inStock,
        createdAt: new Date().toISOString(),
      };

      const custom = getStoredCustomProducts();
      saveStoredCustomProducts([newProduct, ...custom]);
      return newProduct;
    });

export const updateProduct = (id, formData) =>
  api.put(`/api/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then((r) => r.data)
    .catch((err) => {
      console.warn(`Backend API update failed for product ${id}, using client-side fallback:`, err.message);
      const numId = parseInt(id);
      const custom = getStoredCustomProducts();
      const idx = custom.findIndex((p) => p.id === numId);

      const name = formData.get('name');
      const price = formData.get('price') ? parseFloat(formData.get('price')) : undefined;
      const originalPrice = formData.get('originalPrice') !== null ? (formData.get('originalPrice') ? parseFloat(formData.get('originalPrice')) : null) : undefined;
      const category = formData.get('category');
      const inStock = formData.get('inStock') !== undefined ? formData.get('inStock') !== 'false' : undefined;

      let imageUrl = formData.get('imageUrl');
      const file = formData.get('image');
      if (file && file instanceof File) {
        imageUrl = URL.createObjectURL(file);
      }

      if (idx !== -1) {
        const updated = {
          ...custom[idx],
          ...(name ? { name } : {}),
          ...(price !== undefined ? { price } : {}),
          ...(originalPrice !== undefined ? { originalPrice } : {}),
          ...(category ? { category } : {}),
          ...(inStock !== undefined ? { inStock } : {}),
          ...(imageUrl ? { imageUrl } : {}),
        };
        custom[idx] = updated;
        saveStoredCustomProducts(custom);
        return updated;
      }

      return {
        id: numId,
        name,
        price,
        originalPrice,
        category,
        imageUrl: imageUrl || '',
        inStock: true,
      };
    });

export const deleteProduct = (id) =>
  api.delete(`/api/products/${id}`)
    .then((r) => r.data)
    .catch((err) => {
      console.warn(`Backend API delete failed for product ${id}, updating client fallback:`, err.message);
      const numId = parseInt(id);
      const custom = getStoredCustomProducts().filter((p) => p.id !== numId);
      saveStoredCustomProducts(custom);
      return { message: 'Product deleted successfully' };
    });

export default api;
