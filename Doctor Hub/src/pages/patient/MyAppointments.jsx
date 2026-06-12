import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Calendar, Clock, Filter, Search } from 'lucide-react';

const statusMap = { pending: 'badge-warning', confirmed: 'badge-success', cancelled: 'badge-danger', completed: 'badge-primary' };

export default function MyAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
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
        <p style={{ color: 'var(--text-secondary)' }}>Track and manage all your booked appointments</p>
      </div>

      {/* Filter Tabs */}
      <div className="tabs" style={{ marginBottom: 20, maxWidth: 500 }}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button key={s} className={`tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 96 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Calendar size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No appointments found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {filter === 'all' ? 'You have not booked any appointments yet.' : `No ${filter} appointments.`}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(apt => (
            <div key={apt.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} color="#0ea5e9" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{apt.doctor_name || 'Doctor'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 12, marginTop: 3 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString('en-PK', { weekday:'short', day:'numeric', month:'short', year:'numeric' }) : '—'}</span>
                    {apt.appointment_time && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {apt.appointment_time}</span>}
                  </div>
                  {apt.notes && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{apt.notes}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <span className={`badge ${statusMap[apt.status] || 'badge-muted'}`}>{apt.status}</span>
                {apt.fee && <span style={{ fontSize: 13, fontWeight: 700, color: '#0ea5e9' }}>Rs. {apt.fee.toLocaleString()}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
