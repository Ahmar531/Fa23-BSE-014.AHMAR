import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Calendar, Clock, CheckCircle, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DoctorAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [historyForm, setHistoryForm] = useState({ diagnosis: '', symptoms: '', notes: '' });

  const fetch = async () => {
    if (!user) return;
    const { data } = await supabase.from('appointments').select('*').eq('doctor_id', user.id).order('appointment_date', { ascending: false });
    setAppointments(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [user]);

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) { toast.error('Failed to update'); return; }
    toast.success(`Appointment ${status}`);
    fetch();
  };

  const addMedicalRecord = async () => {
    if (!historyForm.diagnosis) { toast.error('Diagnosis is required'); return; }
    const { error } = await supabase.from('medical_history').insert([{
      patient_id: selectedAppt.patient_id,
      doctor_id: user.id,
      doctor_name: selectedAppt.doctor_name,
      appointment_id: selectedAppt.id,
      ...historyForm,
    }]);
    if (error) { toast.error('Failed to add record'); return; }
    await updateStatus(selectedAppt.id, 'completed');
    setSelectedAppt(null);
    setHistoryForm({ diagnosis: '', symptoms: '', notes: '' });
    toast.success('Medical record added!');
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Appointments</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage and update your patient appointments</p>
      </div>

      <div className="tabs" style={{ marginBottom: 20, maxWidth: 560 }}>
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button key={s} className={`tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Calendar size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No appointments found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(apt => (
            <div key={apt.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div className="avatar avatar-md" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', fontSize: 16 }}>
                  {(apt.patient_name || 'P').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{apt.patient_name || 'Patient'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 12, marginTop: 3 }}>
                    <span><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />{apt.appointment_date || '—'}</span>
                    {apt.appointment_time && <span><Clock size={12} style={{ display: 'inline', marginRight: 4 }} />{apt.appointment_time}</span>}
                  </div>
                  {apt.notes && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{apt.notes}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`badge ${apt.status === 'pending' ? 'badge-warning' : apt.status === 'confirmed' ? 'badge-success' : apt.status === 'completed' ? 'badge-primary' : 'badge-danger'}`}>{apt.status}</span>
                {apt.status === 'confirmed' && (
                  <button className="btn btn-success btn-sm" onClick={() => setSelectedAppt(apt)}>
                    <Plus size={14} /> Add Record
                  </button>
                )}
                {apt.status === 'pending' && (
                  <button className="btn btn-primary btn-sm" onClick={() => updateStatus(apt.id, 'confirmed')}>
                    <CheckCircle size={14} /> Confirm
                  </button>
                )}
                {(apt.status === 'pending' || apt.status === 'confirmed') && (
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(apt.id, 'cancelled')}>
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Medical Record Modal */}
      {selectedAppt && (
        <div className="modal-overlay" onClick={() => setSelectedAppt(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Add Medical Record</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
              Patient: <strong style={{ color: 'var(--text-primary)' }}>{selectedAppt.patient_name || 'Patient'}</strong>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="label">Diagnosis *</label>
                <input className="input" placeholder="e.g., Hypertension, Type 2 Diabetes" value={historyForm.diagnosis} onChange={e => setHistoryForm({ ...historyForm, diagnosis: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Symptoms</label>
                <textarea className="textarea" placeholder="Describe patient symptoms..." value={historyForm.symptoms} onChange={e => setHistoryForm({ ...historyForm, symptoms: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Doctor Notes</label>
                <textarea className="textarea" placeholder="Additional notes..." value={historyForm.notes} onChange={e => setHistoryForm({ ...historyForm, notes: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary flex-1" onClick={addMedicalRecord}>Save & Complete</button>
                <button className="btn btn-ghost" onClick={() => setSelectedAppt(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
