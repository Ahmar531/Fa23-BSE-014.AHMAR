import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { CreditCard, CheckCircle, Clock, ArrowRight } from 'lucide-react';

export default function AssistantDashboard() {
  const [stats, setStats] = useState({ pending: 0, verified: 0, total: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
      const all = data || [];
      setStats({ pending: all.filter(p => p.status === 'pending').length, verified: all.filter(p => p.status === 'verified').length, total: all.length });
      setRecent(all.slice(0, 5));
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Assistant Dashboard 🧑‍💼</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Verify payments and manage appointment confirmations</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Pending Payments', value: stats.pending, icon: Clock, color: '#f59e0b' },
          { label: 'Verified', value: stats.verified, icon: CheckCircle, color: '#10b981' },
          { label: 'Total Payments', value: stats.total, icon: CreditCard, color: '#0ea5e9' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card" style={{ '--gradient': `linear-gradient(90deg, ${color}, ${color}80)` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</div>
              <Icon size={16} color={color} />
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color }}>{loading ? '—' : value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Payments</h2>
          <Link to="/assistant/payments" className="btn btn-primary btn-sm">Verify Payments <ArrowRight size={14} /></Link>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 44 }} />)}
          </div>
        ) : recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-secondary)' }}>No payments yet</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Patient</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recent.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.patient_id?.slice(0, 8)}…</td>
                    <td style={{ color: '#0ea5e9', fontWeight: 700 }}>Rs. {(p.amount || 0).toLocaleString()}</td>
                    <td><span className={`badge ${p.status === 'verified' ? 'badge-success' : p.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>{p.status}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
