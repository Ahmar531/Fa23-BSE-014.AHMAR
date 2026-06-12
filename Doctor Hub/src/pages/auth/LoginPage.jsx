import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await login(form);
      // Profile fetch happens in context; redirect based on role happens in App.jsx
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-dark)', padding: 24, position: 'relative', overflow: 'hidden'
    }}>
      {/* BG Glow */}
      <div style={{ position:'absolute', top:'-20%', left:'50%', transform:'translateX(-50%)', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18,
            background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(14,165,233,0.4)'
          }}>
            <Stethoscope size={30} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Sign in to your DoctorHub account</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="label">Email Address</label>
              <div className="search-bar">
                <Mail size={16} color="var(--text-muted)" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <div className="search-bar">
                <Lock size={16} color="var(--text-muted)" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display:'flex', alignItems:'center' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <><div className="spinner" style={{width:18,height:18}} /> Signing in...</> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
