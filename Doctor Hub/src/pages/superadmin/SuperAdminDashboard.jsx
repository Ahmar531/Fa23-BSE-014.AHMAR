import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Shield, Users, Stethoscope, Calendar, CreditCard, TrendingUp, Activity } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({ users: 0, doctors: 0, patients: 0, appointments: 0, payments: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const [u, d, p, a, pay] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('users').select('id', { count: 'exact' }).eq('role', 'doctor'),
        supabase.from('users').select('id', { count: 'exact' }).eq('role', 'patient'),
        supabase.from('appointments').select('id', { count: 'exact' }),
        supabase.from('payments').select('amount, status'),
      ]);
      const payments = pay.data || [];
      const revenue = payments.filter(p => p.status === 'verified').reduce((s, p) => s + (p.amount || 0), 0);
      setStats({ users: u.count || 0, doctors: d.count || 0, patients: p.count || 0, appointments: a.count || 0, payments: payments.length, revenue });
      const { data: ru } = await supabase.from('users').select('*').order('created_at', { ascending: false }).limit(8);
      setRecentUsers(ru || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const roleColor = { patient: '#0ea5e9', doctor: '#8b5cf6', assistant: '#10b981', admin: '#f59e0b', super_admin: '#ef4444' };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(239,68,68,0.4)' }}>
            <Shield size={24} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Super Admin Control Panel</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Full system access and oversight</p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Users', value: stats.users, icon: Users, color: '#0ea5e9' },
          { label: 'Doctors', value: stats.doctors, icon: Stethoscope, color: '#8b5cf6' },
          { label: 'Patients', value: stats.patients, icon: Activity, color: '#10b981' },
          { label: 'Appointments', value: stats.appointments, icon: Calendar, color: '#f59e0b' },
          { label: 'Total Payments', value: stats.payments, icon: CreditCard, color: '#0ea5e9' },
          { label: 'Revenue (Rs.)', value: stats.revenue.toLocaleString(), icon: TrendingUp, color: '#10b981' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card" style={{ '--gradient': `linear-gradient(90deg, ${color}, ${color}80)` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</div>
              <Icon size={16} color={color} />
            </div>
            <div style={{ fontSize: loading ? 16 : 28, fontWeight: 800, color }}>{loading ? 'Loading…' : value}</div>
          </div>
        ))}
      </div>

      {/* Recent Users */}
      <div className="card">
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Recently Registered Users</h2>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody>
              {loading
                ? [1,2,3].map(i => <tr key={i}><td colSpan={4}><div className="skeleton" style={{ height: 32 }} /></td></tr>)
                : recentUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar avatar-sm" style={{ background: `linear-gradient(135deg, ${roleColor[u.role] || '#64748b'}, ${roleColor[u.role] || '#64748b'}80)` }}>
                          {(u.full_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600 }}>{u.full_name || '—'}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td><span className="badge" style={{ background: `${roleColor[u.role] || '#64748b'}18`, color: roleColor[u.role] || '#94a3b8', border: `1px solid ${roleColor[u.role] || '#64748b'}30` }}>{u.role}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(u.created_at).toLocaleDateString('en-PK', { day:'numeric', month:'short', year:'numeric' })}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
