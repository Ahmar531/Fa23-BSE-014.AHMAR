import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Calendar, Search, History, FileText, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function PatientDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, history: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [apptRes, histRes] = await Promise.all([
          supabase.from('appointments').select('*').eq('patient_id', user.id).order('created_at', { ascending: false }),
          supabase.from('medical_history').select('id').eq('patient_id', user.id),
        ]);
        const appts = apptRes.data || [];
        setStats({
          total: appts.length,
          pending: appts.filter(a => a.status === 'pending').length,
          confirmed: appts.filter(a => a.status === 'confirmed').length,
          history: histRes.data?.length || 0,
        });
        setRecent(appts.slice(0, 5));
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [user]);

  const statusBadge = (status) => {
    const map = { pending: 'badge-warning', confirmed: 'badge-success', cancelled: 'badge-danger', completed: 'badge-primary' };
    return <span className={`badge ${map[status] || 'badge-muted'}`}>{status}</span>;
  };

  return (
    <DashboardLayout>
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {profile?.full_name?.split(' ')[0] || 'Patient'} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Here's an overview of your healthcare journey.</p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Find a Doctor', path: '/patient/search', icon: Search, color: '#0ea5e9', desc: 'Search by disease or specialty' },
          { label: 'My Appointments', path: '/patient/appointments', icon: Calendar, color: '#8b5cf6', desc: 'View & track appointments' },
          { label: 'Medical History', path: '/patient/history', icon: History, color: '#10b981', desc: 'View complete records' },
        ].map(({ label, path, icon: Icon, color, desc }) => (
          <Link key={path} to={path} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color + '50'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Icon size={22} color={color} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'Total Appointments', value: stats.total, icon: Calendar, color: '#0ea5e9' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: '#f59e0b' },
          { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: '#10b981' },
          { label: 'Medical Records', value: stats.history, icon: FileText, color: '#8b5cf6' },
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

      {/* Recent Appointments */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Appointments</h2>
          <Link to="/patient/appointments" className="btn btn-ghost btn-sm">View All <ArrowRight size={14} /></Link>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 48 }} />)}
          </div>
        ) : recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Calendar size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>No appointments yet</p>
            <Link to="/patient/search" className="btn btn-primary btn-sm">Book Your First Appointment</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Doctor</th><th>Date</th><th>Status</th></tr></thead>
              <tbody>
                {recent.map(a => (
                  <tr key={a.id}>
                    <td style={{ fontWeight: 500 }}>{a.doctor_name || 'Doctor'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{a.appointment_date ? new Date(a.appointment_date).toLocaleDateString() : '—'}</td>
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
