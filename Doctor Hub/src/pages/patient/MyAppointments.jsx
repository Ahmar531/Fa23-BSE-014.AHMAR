import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Calendar, Clock, CheckCircle, XCircle, Search, TrendingUp } from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { badge: 'badge-warning', icon: Clock, color: '#f59e0b' },
  confirmed: { badge: 'badge-primary', icon: CheckCircle, color: '#0ea5e9' },
  completed: { badge: 'badge-success', icon: TrendingUp, color: '#10b981' },
  cancelled: { badge: 'badge-danger',  icon: XCircle, color: '#ef4444' },
};

export default function MyAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase.from('appointments').select('*').eq('patient_id', user.id).order('created_at', { ascending: false });
      setAppointments(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>My Appointments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track and manage all your bookings</p>
      </div>

      <div className="tabs" style={{ marginBottom: 20, maxWidth: 540 }}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button key={s} className={`tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 90 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Search size={44} color="var(--text-muted)" style={{ margin: '0 auto 14px', display: 'block' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No {filter === 'all' ? '' : filter} appointments found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((apt, idx) => {
            const cfg = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            return (
              <div key={apt.id} className="card animate-fade" style={{ animationDelay: `${idx * 0.04}s`, display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: `${cfg.color}15`, border: `1px solid ${cfg.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} color={cfg.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>
                    {apt.doctor_name ? `Dr. ${apt.doctor_name}` : 'Doctor'}
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 13, color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                    {apt.appointment_date && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} /> {apt.appointment_date}
                      </span>
                    )}
                    {apt.appointment_time && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={12} /> {apt.appointment_time}
                      </span>
                    )}
                    {apt.fee > 0 && (
                      <span style={{ color: '#0ea5e9', fontWeight: 600 }}>
                        Rs. {apt.fee.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {apt.notes && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{apt.notes}</div>}
                </div>
                <div style={{ flexShrink: 0 }}>
                  <span className={`badge ${cfg.badge}`}>{apt.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
