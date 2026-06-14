import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Activity, ShieldOff, Lock, FileText, AlertTriangle } from 'lucide-react';

export default function MedicalHistory() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase.from('medical_history').select('*, prescriptions(*)').eq('patient_id', user.id).order('created_at', { ascending: false });
      setRecords(data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Medical History</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Your complete, permanent health records</p>
      </div>

      {/* Immutability Notice */}
      <div className="alert alert-info" style={{ marginBottom: 24, gap: 12 }}>
        <Lock size={16} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong style={{ display: 'block', marginBottom: 2 }}>Immutable Records</strong>
          Medical history is permanent and cannot be edited or deleted — ensuring complete integrity of your health data.
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 130 }} />)}
        </div>
      ) : records.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <Activity size={52} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No records yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Medical records will appear here once a doctor adds them after your appointment.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {records.map((rec, idx) => (
            <div key={rec.id} className="card animate-fade" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={20} color="#10b981" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{rec.diagnosis}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      Dr. {rec.doctor_name || 'Doctor'} &nbsp;•&nbsp; {new Date(rec.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: '3px 10px' }}>
                  <ShieldOff size={11} color="#f87171" />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#f87171', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Immutable</span>
                </div>
              </div>

              {rec.symptoms && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Symptoms</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', background: 'var(--bg-card2)', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>{rec.symptoms}</div>
                </div>
              )}

              {rec.notes && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Doctor Notes</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', background: 'var(--bg-card2)', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>{rec.notes}</div>
                </div>
              )}

              {/* Prescriptions */}
              {rec.prescriptions?.length > 0 && (
                <div style={{ marginTop: 14, padding: '14px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Prescriptions ({rec.prescriptions.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {rec.prescriptions.map(p => (
                      <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--bg-card)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>💊</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{p.medicine_name}</div>
                          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                            {p.dosage && <span style={{ marginRight: 10 }}>Dose: {p.dosage}</span>}
                            {p.duration && <span style={{ marginRight: 10 }}>Duration: {p.duration}</span>}
                            {p.instructions && <span style={{ color: 'var(--text-muted)' }}>{p.instructions}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
