import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { isMocked } from '../../lib/supabase';

const roles = [
  { value: 'patient', label: '🧑‍⚕️ Patient', desc: 'Book appointments & manage history' },
  { value: 'doctor', label: '👨‍⚕️ Doctor', desc: 'Manage clinic, prescriptions & schedule' },
  { value: 'assistant', label: '🧑‍💼 Assistant', desc: 'Verify payments & appointments' },
];

const rolePaths = { patient: '/patient', doctor: '/doctor', assistant: '/assistant' };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '', role: 'patient' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) { toast.error('Full name is required'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      if (isMocked) {
        // Auto-navigated by AuthContext, but navigate as fallback
        navigate(rolePaths[form.role] || '/patient');
      } else {
        setDone(true);
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>✉️</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Check Your Email</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
          We've sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{form.email}</strong>. Please verify to activate your account.
        </p>
        <Link to="/login" className="btn btn-primary">Go to Login</Link>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-dark)', padding: 24, position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position:'absolute', top:'-10%', right:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width:60, height:60, borderRadius:18, background:'linear-gradient(135deg,#0ea5e9,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 8px 32px rgba(14,165,233,0.4)' }}>
            <Stethoscope size={30} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Create Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Join DoctorHub and take control of your health</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Role Selection */}
            <div className="form-group">
              <label className="label">I am a...</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {roles.map(({ value, label }) => (
                  <button key={value} type="button"
                    onClick={() => setForm({ ...form, role: value })}
                    style={{
                      flex: 1, padding: '10px 6px', borderRadius: 10, cursor: 'pointer', fontFamily: 'Inter', fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                      background: form.role === value ? 'rgba(14,165,233,0.15)' : 'var(--bg-card2)',
                      border: form.role === value ? '2px solid rgba(14,165,233,0.5)' : '1px solid var(--border)',
                      color: form.role === value ? 'var(--primary-light)' : 'var(--text-secondary)',
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="label">Full Name</label>
              <div className="search-bar">
                <User size={16} color="var(--text-muted)" />
                <input type="text" placeholder="Your full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Email Address</label>
              <div className="search-bar">
                <Mail size={16} color="var(--text-muted)" />
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Phone (optional)</label>
              <div className="search-bar">
                <Phone size={16} color="var(--text-muted)" />
                <input type="tel" placeholder="+92 300 1234567" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <div className="search-bar">
                <Lock size={16} color="var(--text-muted)" />
                <input type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? <><div className="spinner" style={{width:18,height:18}} /> Creating...</> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
