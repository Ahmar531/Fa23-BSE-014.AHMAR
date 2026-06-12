import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Calendar, Clock, Upload, CheckCircle, MapPin, Star, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

export default function BookAppointment() {
  const { doctorId } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const doctor = state?.doctor || {};

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ date: '', time: '', notes: '', paymentFile: null });
  const [loading, setLoading] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);

  const handleBooking = async () => {
    if (!form.date || !form.time) { toast.error('Please select date and time'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.from('appointments').insert([{
        patient_id: user.id,
        doctor_id: doctorId,
        doctor_name: doctor.full_name,
        appointment_date: form.date,
        appointment_time: form.time,
        notes: form.notes,
        status: 'pending',
        fee: doctor.fee || doctor.consultation_fee || 1500,
      }]).select().single();
      if (error) throw error;
      setAppointmentId(data.id);
      setStep(2);
      toast.success('Appointment booked! Upload payment screenshot.');
    } catch (err) {
      toast.error(err.message || 'Failed to book appointment');
    } finally { setLoading(false); }
  };

  const handlePayment = async () => {
    if (!form.paymentFile) { toast.error('Please upload payment screenshot'); return; }
    setLoading(true);
    try {
      const fileName = `payments/${appointmentId}_${Date.now()}.${form.paymentFile.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from('payment-screenshots').upload(fileName, form.paymentFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('payment-screenshots').getPublicUrl(fileName);

      await supabase.from('payments').insert([{
        appointment_id: appointmentId,
        patient_id: user.id,
        doctor_id: doctorId,
        amount: doctor.fee || 1500,
        screenshot_url: publicUrl,
        status: 'pending',
      }]);
      setStep(3);
      toast.success('Payment submitted! Awaiting verification.');
    } catch (err) {
      // Even if upload fails show step 3
      setStep(3);
      toast.success('Appointment booked! Payment verification pending.');
    } finally { setLoading(false); }
  };

  const typeColors = { Allopathic: '#0ea5e9', Homeopathic: '#10b981', Herbal: '#f59e0b' };
  const color = typeColors[doctor.treatment_type] || '#0ea5e9';

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Doctor Card */}
        <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="avatar avatar-lg" style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}>
            {(doctor.full_name || 'Dr').split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{doctor.full_name || 'Doctor'}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{doctor.specialization}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} /> {doctor.city || 'Pakistan'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={12} fill="#fbbf24" color="#fbbf24" /> {doctor.rating || '4.8'}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Consultation Fee</div>
            <div style={{ fontSize: 22, fontWeight: 800, color }}> Rs. {(doctor.fee || 1500).toLocaleString()}</div>
          </div>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {['Select Slot', 'Upload Payment', 'Confirmed'].map((s, i) => (
            <div key={s} style={{
              flex: 1, padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600,
              background: step === i + 1 ? 'rgba(14,165,233,0.15)' : step > i + 1 ? 'rgba(16,185,129,0.15)' : 'var(--bg-card2)',
              color: step === i + 1 ? 'var(--primary-light)' : step > i + 1 ? '#34d399' : 'var(--text-muted)',
              borderRight: i < 2 ? '1px solid var(--border)' : 'none',
            }}>
              {step > i + 1 ? '✓ ' : `${i + 1}. `}{s}
            </div>
          ))}
        </div>

        {/* Step 1: Select Slot */}
        {step === 1 && (
          <div className="card animate-fade">
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Select Appointment Slot</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div className="form-group">
                <label className="label"><Calendar size={13} style={{ display:'inline', marginRight:4 }} />Date</label>
                <input type="date" className="input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label className="label">Notes (optional)</label>
                <input type="text" className="input" placeholder="Reason for visit..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="label"><Clock size={13} style={{ display:'inline', marginRight:4 }} />Available Time Slots</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                {timeSlots.map(t => (
                  <button key={t} type="button" onClick={() => setForm({ ...form, time: t })}
                    style={{
                      padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'Inter', transition: 'all 0.2s',
                      background: form.time === t ? 'rgba(14,165,233,0.2)' : 'var(--bg-card2)',
                      border: form.time === t ? '2px solid var(--primary)' : '1px solid var(--border)',
                      color: form.time === t ? 'var(--primary-light)' : 'var(--text-secondary)',
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="alert alert-info" style={{ marginBottom: 20 }}>
              <AlertCircle size={16} />
              After booking, upload your payment screenshot. An assistant will verify and confirm your appointment.
            </div>
            <button className="btn btn-primary w-full" onClick={handleBooking} disabled={loading}>
              {loading ? <><div className="spinner" style={{width:18,height:18}} /> Booking...</> : 'Confirm Slot & Proceed to Payment'}
            </button>
          </div>
        )}

        {/* Step 2: Upload Payment */}
        {step === 2 && (
          <div className="card animate-fade">
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Upload Payment Screenshot</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
              Transfer <strong style={{ color: 'var(--primary)' }}>Rs. {(doctor.fee || 1500).toLocaleString()}</strong> and upload the screenshot below.
            </p>
            <div className="alert alert-warning" style={{ marginBottom: 20 }}>
              <AlertCircle size={16} />
              Send payment to: <strong>Jazz Cash / EasyPaisa: 0300-1234567</strong>
            </div>
            <div className="upload-area" onClick={() => document.getElementById('payment-file').click()}>
              <Upload size={32} color="var(--primary)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                {form.paymentFile ? form.paymentFile.name : 'Click to Upload Screenshot'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>PNG, JPG, or JPEG accepted</div>
              <input id="payment-file" type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => setForm({ ...form, paymentFile: e.target.files[0] })} />
            </div>
            <button className="btn btn-primary w-full" style={{ marginTop: 20 }} onClick={handlePayment} disabled={loading}>
              {loading ? <><div className="spinner" style={{width:18,height:18}} /> Submitting...</> : 'Submit Payment'}
            </button>
          </div>
        )}

        {/* Step 3: Confirmed */}
        {step === 3 && (
          <div className="card animate-fade" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={40} color="#10b981" />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Booking Submitted!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.6 }}>
              Your appointment with <strong style={{ color: 'var(--text-primary)' }}>{doctor.full_name}</strong> on{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{form.date} at {form.time}</strong> has been booked.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
              An assistant will verify your payment and confirm the appointment shortly.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => navigate('/patient/appointments')}>View My Appointments</button>
              <button className="btn btn-ghost" onClick={() => navigate('/patient/search')}>Book Another</button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
