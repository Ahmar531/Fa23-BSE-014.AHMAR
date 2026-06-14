import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { FileText, Plus, Lock, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Prescriptions() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState('');
  const [form, setForm] = useState({ medicine_name: '', dosage: '', duration: '', instructions: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    const { data } = await supabase.from('medical_history').select('*, prescriptions(*)').eq('doctor_id', user.id).order('created_at', { ascending: false });
    setRecords(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const addPrescription = async () => {
    if (!form.medicine_name) { toast.error('Medicine name is required'); return; }
    if (!selectedHistory) { toast.error('Select a medical record first'); return; }
    setSaving(true);
    const { error } = await supabase.from('prescriptions').insert([{
      history_id: selectedHistory,
      doctor_id: user.id,
      ...form,
    }]);
    if (error) { toast.error('Failed to add prescription'); setSaving(false); return; }
    toast.success('Prescription added!');
    setShowModal(false);
    setForm({ medicine_name: '', dosage: '', duration: '', instructions: '' });
    setSaving(false);
    fetchData();
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Prescriptions</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage patient prescriptions linked to medical records</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={15} /> Add Prescription
        </button>
      </div>

      <div className="alert alert-warning" style={{ marginBottom: 22 }}>
        <Lock size={15} style={{ flexShrink: 0 }} />
        Prescriptions are permanent records and cannot be edited or deleted once saved.
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 140 }} />)}
        </div>
      ) : records.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px 20px' }}>
          <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 14px', display: 'block' }} />
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>No medical records with prescriptions yet</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Add medical records from the Appointments page first.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {records.map(rec => (
            <div key={rec.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{rec.diagnosis}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {new Date(rec.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <span className="badge badge-accent">{rec.prescriptions?.length || 0} Rx</span>
              </div>

              {rec.prescriptions?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {rec.prescriptions.map(p => (
                    <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--bg-card2)', borderRadius: 10, padding: '11px 14px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 18, lineHeight: 1 }}>💊</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{p.medicine_name}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 3 }}>
                          {p.dosage && <span style={{ marginRight: 12 }}>💉 {p.dosage}</span>}
                          {p.duration && <span style={{ marginRight: 12 }}>📅 {p.duration}</span>}
                          {p.instructions && <span style={{ color: 'var(--text-muted)' }}>📝 {p.instructions}</span>}
                        </div>
                      </div>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={12} color="#10b981" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '18px', color: 'var(--text-muted)', fontSize: 13, background: 'var(--bg-card2)', borderRadius: 8, border: '1px dashed var(--border)' }}>
                  No prescriptions for this record
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Prescription Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Add Prescription</h2>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="label">Medical Record *</label>
                <select className="select" value={selectedHistory} onChange={e => setSelectedHistory(e.target.value)}>
                  <option value="">Select medical record...</option>
                  {records.map(r => <option key={r.id} value={r.id}>{r.diagnosis} — {new Date(r.created_at).toLocaleDateString()}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Medicine Name *</label>
                <input className="input" placeholder="e.g., Panadol 500mg" value={form.medicine_name} onChange={e => setForm({ ...form, medicine_name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="label">Dosage</label>
                  <input className="input" placeholder="e.g., 1 tablet twice daily" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="label">Duration</label>
                  <input className="input" placeholder="e.g., 7 days" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Special Instructions</label>
                <input className="input" placeholder="e.g., Take after meals" value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary flex-1" onClick={addPrescription} disabled={saving}>
                  {saving ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Saving...</> : 'Save Prescription'}
                </button>
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
