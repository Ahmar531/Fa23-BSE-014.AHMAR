import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Calendar, Users, CheckCircle, Clock, ArrowRight, FileText, Building2 } from 'lucide-react';

export default function DoctorDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const { data } = await supabase.from('appointments').select('*').eq('doctor_id', user.id).order('created_at', { ascending: false });
      const apts = data || [];
      setStats({
        total: apts.length,
        pending: apts.filter(a => a.status === 'pending').length,
        confirmed: apts.filter(a => a.status === 'confirmed').length,
        completed: apts.filter(a => a.status === 'completed').length,
      });
      setRecent(apts.slice(0, 5));
      setLoading(false);
    };
    fetchData();
  }, [user]);

  return (
    <DashboardLayout>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(139,92,246,0.4)' }}>
            <span style={{ fontSize: 24 }}>🩺</span>
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>Welcome, {profile?.full_name || 'Doctor'}!</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Manage your patients and appointments</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Patients', value: stats.total, color: '#8b5cf6' },
          { label: 'Pending', value: stats.pending, color: '#f59e0b' },
          { label: 'Confirmed', value: stats.confirmed, color: '#0ea5e9' },
          { label: 'Completed', value: stats.completed, color: '#10b981' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card" style={{ '--gradient': `linear-gradient(90deg, ${color}, ${color}60)` }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
            <div style={{ fontSize: 34, fontWeight: 900, color, fontFamily: 'Plus Jakarta Sans' }}>{loading ? '—' : value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { icon: Calendar, label: 'Appointments', desc: 'View & manage all bookings', path: '/doctor/appointments', color: '#0ea5e9' },
          { icon: FileText, label: 'Prescriptions', desc: 'Add & view patient prescriptions', path: '/doctor/prescriptions', color: '#8b5cf6' },
          { icon: Building2, label: 'My Clinics', desc: 'Manage clinic locations', path: '/doctor/clinics', color: '#10b981' },
        ].map(({ icon: Icon, label, desc, path, color }) => (
          <Link key={path} to={path} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', gap: 14, cursor: 'pointer', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color + '40'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: `${color}18`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={19} color={color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{desc}</div>
              </div>
              <ArrowRight size={16} color={color} style={{ marginTop: 2 }} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>Today's Patients</h2>
          <Link to="/doctor/appointments" className="btn btn-ghost btn-sm">All Appointments <ArrowRight size={13} /></Link>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 56 }} />)}
          </div>
        ) : recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 0' }}>
            <Users size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No appointments yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recent.map(apt => (
              <div key={apt.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--bg-card2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                  {(apt.patient_name || 'P').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{apt.patient_name || 'Patient'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{apt.appointment_date} {apt.appointment_time && `• ${apt.appointment_time}`}</div>
                </div>
                <span className={`badge ${apt.status === 'confirmed' ? 'badge-primary' : apt.status === 'completed' ? 'badge-success' : apt.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>{apt.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
