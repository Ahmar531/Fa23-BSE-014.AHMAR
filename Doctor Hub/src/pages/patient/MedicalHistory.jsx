import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { History, Lock, FileText, Calendar, Stethoscope, AlertCircle } from 'lucide-react';

export default function MedicalHistory() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const { data } = await supabase.from('medical_history').select(`*, prescriptions(*)`).eq('patient_id', user.id).order('created_at', { ascending: false });
      setRecords(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Medical History</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Your complete and permanent medical records</p>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 24 }}>
        <Lock size={16} />
        <div>
          <strong>Protected Records:</strong> Medical history cannot be deleted or edited. All records are permanently stored for your safety.
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}
        </div>
      ) : records.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <History size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No Medical Records Yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Your doctor will add records after your appointment.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {records.map(rec => (
            <div key={rec.id} className="card animate-fade">
              <div style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Stethoscope size={20} color="#8b5cf6" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{rec.diagnosis || 'Consultation'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Stethoscope size={12} /> {rec.doctor_name || 'Doctor'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} /> {new Date(rec.created_at).toLocaleDateString('en-PK', { day:'numeric', month:'long', year:'numeric' })}</span>
                  </div>
                </div>
                <span className="badge badge-accent">Record</span>
              </div>

              {rec.symptoms && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Symptoms</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{rec.symptoms}</div>
                </div>
              )}

              {rec.notes && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Doctor Notes</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{rec.notes}</div>
                </div>
              )}

              {/* Prescriptions */}
              {rec.prescriptions?.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                    <FileText size={12} style={{ display: 'inline', marginRight: 4 }} />
                    Prescriptions
                  </div>
                  {rec.prescriptions.map(p => (
                    <div key={p.id} style={{ background: 'var(--bg-card2)', borderRadius: 10, padding: '10px 14px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{p.medicine_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.dosage} — {p.duration}</div>
                      </div>
                      {p.instructions && <div style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 200, textAlign: 'right' }}>{p.instructions}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
