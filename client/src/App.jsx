import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
            maxWidth: '400px',
          },
        }}
      />

      <Routes>
        {/* Admin routes — no Navbar/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Customer routes — with Navbar/Footer */}
        <Route
          path="/*"
          element={
            <div className="page-wrapper">
              <Navbar />
              <div className="main-content-area">
                <Routes>
                  <Route path="/"           element={<Home />} />
                  <Route path="/catalog"    element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart"       element={<Cart />} />
                  <Route path="*"           element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </div>
          }
        />
      </Routes>

      <style>{`
        .main-content-area {
          flex: 1;
        }
      `}</style>
    </>
  );
}

function NotFound() {
  return (
    <main className="main-content">
      <div className="container">
        <div className="empty-state" style={{ paddingTop: 64 }}>
          <div className="empty-state-icon" aria-hidden="true">🧵</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--clr-maroon)', fontSize: '2rem', marginBottom: 8 }}>
            Page Not Found
          </h1>
          <p>This page doesn't exist. Let's take you back to the collection.</p>
          <a href="/" className="btn btn-primary" style={{ marginTop: 16 }}>Go Home</a>
        </div>
      </div>
    </main>
  );
}
