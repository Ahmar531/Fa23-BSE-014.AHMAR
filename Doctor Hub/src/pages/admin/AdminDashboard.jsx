import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Users, Stethoscope, Calendar, CreditCard, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, payments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [d, p, a, pay] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }).eq('role', 'doctor'),
        supabase.from('users').select('id', { count: 'exact' }).eq('role', 'patient'),
        supabase.from('appointments').select('id', { count: 'exact' }),
        supabase.from('payments').select('id', { count: 'exact' }),
      ]);
      setStats({ doctors: d.count || 0, patients: p.count || 0, appointments: a.count || 0, payments: pay.count || 0 });
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Admin Dashboard 🛡️</h1>
        <p style={{ color: 'var(--text-secondary)' }}>System overview and management controls</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Doctors', value: stats.doctors, icon: Stethoscope, color: '#0ea5e9' },
          { label: 'Total Patients', value: stats.patients, icon: Users, color: '#8b5cf6' },
          { label: 'Appointments', value: stats.appointments, icon: Calendar, color: '#10b981' },
          { label: 'Payments', value: stats.payments, icon: CreditCard, color: '#f59e0b' },
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Link to="/admin/doctors" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0ea5e950'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
            <Stethoscope size={28} color="#0ea5e9" style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Manage Doctors</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Approve, view and manage doctor accounts</div>
            <div style={{ color: '#0ea5e9', fontSize: 13, fontWeight: 600, marginTop: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              Go to Doctors <ArrowRight size={14} />
            </div>
          </div>
        </Link>
        <Link to="/admin/users" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf650'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
            <Users size={28} color="#8b5cf6" style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Manage Users</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>View and manage all user accounts</div>
            <div style={{ color: '#8b5cf6', fontSize: 13, fontWeight: 600, marginTop: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
              Go to Users <ArrowRight size={14} />
            </div>
          </div>
        </Link>
      </div>
    </DashboardLayout>
  );
}
