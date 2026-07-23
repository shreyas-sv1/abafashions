import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminLogin } from '../../api/admin';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    try {
      const data = await adminLogin(username.trim(), password);
      login(data.token, data.username);
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page" aria-label="Admin login">
      <div className="admin-login-card">
        {/* Brand header */}
        <div className="admin-login__brand" aria-hidden="true">
          <span className="admin-login__brand-text">ABA</span>
          <span className="admin-login__brand-sub">fashions</span>
        </div>

        <h1 className="admin-login__title">Admin Panel</h1>
        <p className="admin-login__subtitle">Sign in to manage your inventory</p>

        <div className="textile-divider admin-divider" aria-hidden="true">
          <span className="textile-divider-icon">✦</span>
        </div>

        <form onSubmit={handleSubmit} noValidate aria-label="Login form">
          <div className="admin-login__fields">
            <div className="form-group">
              <label htmlFor="admin-username" className="form-label">Username</label>
              <input
                id="admin-username"
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                required
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-password" className="form-label">Password</label>
              <div className="admin-login__pass-wrap">
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input admin-login__pass-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  className="admin-login__toggle-pass"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  id="toggle-password-visibility"
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary admin-login__submit"
            disabled={loading}
            id="admin-login-submit"
            aria-label="Sign in to admin panel"
          >
            {loading ? (
              <>
                <span className="admin-login__spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>

      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
          background: linear-gradient(135deg, var(--clr-maroon-dark) 0%, var(--clr-teal) 100%);
        }
        .admin-login-card {
          width: 100%;
          max-width: 420px;
          background: #fff;
          border-radius: var(--radius-xl);
          padding: var(--space-2xl);
          box-shadow: 0 24px 64px rgba(0,0,0,0.25);
          animation: fadeInUp 0.4s ease;
        }
        .admin-login__brand {
          text-align: center;
          font-family: var(--font-serif);
          font-size: 2rem;
          margin-bottom: var(--space-lg);
        }
        .admin-login__brand-text { color: var(--clr-maroon); font-weight: 700; }
        .admin-login__brand-sub  { color: var(--clr-gold); font-style: italic; }
        .admin-login__title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--clr-charcoal);
          text-align: center;
          margin-bottom: 6px;
        }
        .admin-login__subtitle {
          text-align: center;
          font-size: 0.875rem;
          color: var(--clr-mid-gray);
          margin-bottom: var(--space-sm);
        }
        .admin-divider { margin: var(--space-md) 0; }
        .admin-login__fields { display: flex; flex-direction: column; gap: var(--space-md); margin-bottom: var(--space-xl); }
        .admin-login__pass-wrap { position: relative; }
        .admin-login__pass-input { padding-right: 44px; }
        .admin-login__toggle-pass {
          position: absolute;
          top: 50%; right: 12px;
          transform: translateY(-50%);
          font-size: 1rem;
          color: var(--clr-mid-gray);
          transition: opacity var(--transition-fast);
        }
        .admin-login__toggle-pass:hover { opacity: 0.7; }
        .admin-login__submit {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .admin-login__spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
      `}</style>
    </main>
  );
}
