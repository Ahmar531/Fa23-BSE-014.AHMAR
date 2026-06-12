import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Calendar, FileText, Building2, Users, Clock, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react';

export default function DoctorDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ total: 0, today: 0, pending: 0, patients: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      const { data: appts } = await supabase.from('appointments').select('*').eq('doctor_id', user.id).order('created_at', { ascending: false });
      const all = appts || [];
      const uniquePatients = new Set(all.map(a => a.patient_id)).size;
      setStats({
        total: all.length,
        today: all.filter(a => a.appointment_date === today).length,
        pending: all.filter(a => a.status === 'pending').length,
        patients: uniquePatients,
      });
      setRecent(all.slice(0, 5));
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const statusBadge = (s) => {
    const m = { pending: 'badge-warning', confirmed: 'badge-success', cancelled: 'badge-danger', completed: 'badge-primary' };
    return <span className={`badge ${m[s] || 'badge-muted'}`}>{s}</span>;
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Welcome, Dr. {profile?.full_name?.split(' ').slice(1).join(' ') || profile?.full_name} 🩺</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your appointments and patient care.</p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Appointments', path: '/doctor/appointments', icon: Calendar, color: '#0ea5e9' },
          { label: 'Prescriptions', path: '/doctor/prescriptions', icon: FileText, color: '#8b5cf6' },
          { label: 'My Clinics', path: '/doctor/clinics', icon: Building2, color: '#10b981' },
        ].map(({ label, path, icon: Icon, color }) => (
          <Link key={path} to={path} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: 12 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color + '50'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{ fontWeight: 700 }}>{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Appointments', value: stats.total, icon: Calendar, color: '#0ea5e9' },
          { label: 'Today', value: stats.today, icon: Clock, color: '#f59e0b' },
          { label: 'Pending Verify', value: stats.pending, icon: TrendingUp, color: '#ef4444' },
          { label: 'Unique Patients', value: stats.patients, icon: Users, color: '#8b5cf6' },
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

      {/* Recent */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Appointments</h2>
          <Link to="/doctor/appointments" className="btn btn-ghost btn-sm">View All <ArrowRight size={14} /></Link>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 44 }} />)}
          </div>
        ) : recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>No appointments yet</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
              <tbody>
                {recent.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500 }}>{a.patient_name || 'Patient'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{a.appointment_date ? new Date(a.appointment_date).toLocaleDateString() : '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{a.appointment_time || '—'}</td>
                    <td>{statusBadge(a.status)}</td>
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
