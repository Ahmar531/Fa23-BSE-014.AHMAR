import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { FileText, Plus, Pill, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Prescriptions() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ history_id: '', medicine_name: '', dosage: '', duration: '', instructions: '' });

  const fetchData = async () => {
    if (!user) return;
    const [pRes, hRes] = await Promise.all([
      supabase.from('prescriptions').select('*, medical_history(diagnosis, patient_id)').eq('doctor_id', user.id).order('created_at', { ascending: false }),
      supabase.from('medical_history').select('id, diagnosis, patient_id').eq('doctor_id', user.id),
    ]);
    setPrescriptions(pRes.data || []);
    setHistories(hRes.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user]);

  const addPrescription = async () => {
    if (!form.history_id || !form.medicine_name) { toast.error('Please fill required fields'); return; }
    const { error } = await supabase.from('prescriptions').insert([{ ...form, doctor_id: user.id }]);
    if (error) { toast.error('Failed to add prescription'); return; }
    toast.success('Prescription added!');
    setShowModal(false);
    setForm({ history_id: '', medicine_name: '', dosage: '', duration: '', instructions: '' });
    fetchData();
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Prescriptions</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Add prescriptions to patient medical records</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Prescription
        </button>
      </div>

      <div className="alert alert-warning" style={{ marginBottom: 20 }}>
        <Lock size={16} />
        Previous prescriptions cannot be edited once added. They are permanently linked to the patient's medical history.
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80 }} />)}
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>No prescriptions added yet</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add First Prescription</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {prescriptions.map(p => (
            <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Pill size={20} color="#8b5cf6" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{p.medicine_name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {p.dosage && <span style={{ marginRight: 12 }}>Dose: {p.dosage}</span>}
                  {p.duration && <span>Duration: {p.duration}</span>}
                </div>
                {p.instructions && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{p.instructions}</div>}
                {p.medical_history?.diagnosis && <div style={{ fontSize: 12, marginTop: 4 }}><span className="badge badge-accent">For: {p.medical_history.diagnosis}</span></div>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {new Date(p.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Add Prescription</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="label">Medical Record *</label>
                <select className="select" value={form.history_id} onChange={e => setForm({ ...form, history_id: e.target.value })}>
                  <option value="">Select patient record...</option>
                  {histories.map(h => <option key={h.id} value={h.id}>{h.diagnosis} — Patient {h.patient_id?.slice(0, 8)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Medicine Name *</label>
                <input className="input" placeholder="e.g., Paracetamol 500mg" value={form.medicine_name} onChange={e => setForm({ ...form, medicine_name: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="label">Dosage</label>
                  <input className="input" placeholder="e.g., 1 tab 3x/day" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="label">Duration</label>
                  <input className="input" placeholder="e.g., 7 days" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Instructions</label>
                <textarea className="textarea" style={{ minHeight: 70 }} placeholder="After meals, avoid with dairy..." value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary flex-1" onClick={addPrescription}>Add Prescription</button>
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
