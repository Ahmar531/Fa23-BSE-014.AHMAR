import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', textAlign: 'center', padding: 24 }}>
      <div>
        <div style={{ fontSize: 96, marginBottom: 16 }}>🏥</div>
        <h1 style={{ fontSize: 72, fontWeight: 900, marginBottom: 8, background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>404</h1>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 16 }}>
          This page seems to have gone on medical leave.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <Home size={18} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
