import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { CheckCircle, X, Eye, CreditCard, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentVerification() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [preview, setPreview] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    const q = supabase.from('payments').select('*, appointments(appointment_date, appointment_time, doctor_name)').order('created_at', { ascending: false });
    const { data } = filter === 'all' ? await q : await q.eq('status', filter);
    setPayments(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, [filter]);

  const updatePayment = async (id, appointmentId, status) => {
    await supabase.from('payments').update({ status, verified_at: new Date().toISOString() }).eq('id', id);
    if (status === 'verified') {
      await supabase.from('appointments').update({ status: 'confirmed' }).eq('id', appointmentId);
      toast.success('Payment verified! Appointment confirmed.');
    } else {
      await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appointmentId);
      toast.error('Payment rejected. Appointment cancelled.');
    }
    fetchPayments();
  };

  const filtered = payments;

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Payment Verification</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Review and verify patient payment screenshots</p>
      </div>

      <div className="tabs" style={{ marginBottom: 20, maxWidth: 400 }}>
        {['pending', 'verified', 'rejected', 'all'].map(s => (
          <button key={s} className={`tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
        </div>
      ) : payments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <CreditCard size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No {filter === 'all' ? '' : filter} payments found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {payments.map(p => (
            <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={20} color="#0ea5e9" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    Rs. {(p.amount || 0).toLocaleString()}
                    {' '}
                    <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)' }}>— Patient ID: {p.patient_id?.slice(0, 8)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
                    {p.appointments?.doctor_name && <span style={{ marginRight: 12 }}>Dr. {p.appointments.doctor_name}</span>}
                    {p.appointments?.appointment_date && <span>{p.appointments.appointment_date} {p.appointments?.appointment_time || ''}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Submitted: {new Date(p.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`badge ${p.status === 'verified' ? 'badge-success' : p.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>{p.status}</span>
                {p.screenshot_url && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setPreview(p.screenshot_url)}>
                    <Eye size={14} /> View
                  </button>
                )}
                {p.status === 'pending' && (
                  <>
                    <button className="btn btn-success btn-sm" onClick={() => updatePayment(p.id, p.appointment_id, 'verified')}>
                      <CheckCircle size={14} /> Verify
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => updatePayment(p.id, p.appointment_id, 'rejected')}>
                      <X size={14} /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Screenshot Preview Modal */}
      {preview && (
        <div className="modal-overlay" onClick={() => setPreview(null)}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 20, maxWidth: 500, width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontWeight: 700 }}>Payment Screenshot</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={preview} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><ExternalLink size={14} /></a>
                <button className="btn btn-ghost btn-sm" onClick={() => setPreview(null)}><X size={14} /></button>
              </div>
            </div>
            <img src={preview} alt="Payment" style={{ width: '100%', borderRadius: 10, objectFit: 'contain', maxHeight: 400 }} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
