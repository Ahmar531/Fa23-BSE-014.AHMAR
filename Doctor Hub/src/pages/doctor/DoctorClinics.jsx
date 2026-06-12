import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Building2, Plus, MapPin, Clock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorClinics() {
  const { user } = useAuth();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', city: '', schedule: '', fee: '' });

  const fetchClinics = async () => {
    const { data } = await supabase.from('clinics').select('*').eq('doctor_id', user.id);
    setClinics(data || []);
    setLoading(false);
  };

  useEffect(() => { if (user) fetchClinics(); }, [user]);

  const addClinic = async () => {
    if (!form.name || !form.city) { toast.error('Name and city are required'); return; }
    const { error } = await supabase.from('clinics').insert([{ ...form, doctor_id: user.id, fee: parseFloat(form.fee) || 0 }]);
    if (error) { toast.error('Failed to add clinic'); return; }
    toast.success('Clinic added!');
    setShowModal(false);
    setForm({ name: '', address: '', city: '', schedule: '', fee: '' });
    fetchClinics();
  };

  const deleteClinic = async (id) => {
    await supabase.from('clinics').delete().eq('id', id);
    toast.success('Clinic removed');
    fetchClinics();
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>My Clinics</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your clinic locations and schedules</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Clinic
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {[1,2].map(i => <div key={i} className="skeleton" style={{ height: 160 }} />)}
        </div>
      ) : clinics.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Building2 size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>No clinics added yet</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Your Clinic</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {clinics.map(c => (
            <div key={c.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Building2 size={20} color="#10b981" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                      <MapPin size={12} /> {c.city}
                    </div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => deleteClinic(c.id)} title="Remove clinic">
                  <Trash2 size={14} color="var(--danger)" />
                </button>
              </div>
              {c.address && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>{c.address}</div>}
              {c.schedule && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
                  <Clock size={13} /> {c.schedule}
                </div>
              )}
              {c.fee > 0 && (
                <div style={{ fontWeight: 700, color: '#0ea5e9', fontSize: 16 }}>Rs. {c.fee.toLocaleString()}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Add Clinic</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="label">Clinic Name *</label>
                <input className="input" placeholder="e.g., City Care Clinic" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="label">City *</label>
                  <input className="input" placeholder="e.g., Lahore" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="label">Fee (Rs.)</label>
                  <input type="number" className="input" placeholder="1500" value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Address</label>
                <input className="input" placeholder="Street, Block, Area..." value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Schedule</label>
                <input className="input" placeholder="e.g., Mon-Fri 9AM-5PM" value={form.schedule} onChange={e => setForm({ ...form, schedule: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary flex-1" onClick={addClinic}>Add Clinic</button>
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
