import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Stethoscope, Mail, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-dark)', padding:24 }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ width:60, height:60, borderRadius:18, background:'linear-gradient(135deg,#0ea5e9,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:'0 8px 32px rgba(14,165,233,0.4)' }}>
            <Stethoscope size={30} color="white" />
          </div>
          <h1 style={{ fontSize:28, fontWeight:800, marginBottom:6 }}>Reset Password</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:14 }}>We'll send you a link to reset your password</p>
        </div>

        <div className="card" style={{ padding:32 }}>
          {sent ? (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>📧</div>
              <h3 style={{ fontSize:20, fontWeight:700, marginBottom:8 }}>Email Sent!</h3>
              <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.6 }}>Check <strong style={{ color:'var(--text-primary)' }}>{email}</strong> for a password reset link.</p>
              <Link to="/login" className="btn btn-primary" style={{ marginTop:20, display:'inline-flex' }}>Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div className="form-group">
                <label className="label">Email Address</label>
                <div className="search-bar">
                  <Mail size={16} color="var(--text-muted)" />
                  <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? <><div className="spinner" style={{width:18,height:18}} /> Sending...</> : <>Send Reset Link <ArrowRight size={16} /></>}
              </button>
            </form>
          )}
          {!sent && (
            <>
              <div className="divider" />
              <p style={{ textAlign:'center', fontSize:14, color:'var(--text-secondary)' }}>
                Remembered it? <Link to="/login" style={{ color:'var(--primary)', fontWeight:600, textDecoration:'none' }}>Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
