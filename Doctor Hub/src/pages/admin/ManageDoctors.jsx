import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Stethoscope, CheckCircle, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const fetch = async () => {
    const { data } = await supabase.from('doctors').select(`*, users(full_name, email, phone)`).order('created_at', { ascending: false });
    setDoctors(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id, status) => {
    await supabase.from('doctors').update({ is_approved: status === 'approved' }).eq('id', id);
    toast.success(`Doctor ${status}`);
    fetch();
  };

  const filtered = doctors.filter(d =>
    !query || (d.users?.full_name || '').toLowerCase().includes(query.toLowerCase()) ||
    (d.specialization || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Manage Doctors</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Approve and manage doctor accounts</p>
      </div>

      <div className="search-bar" style={{ marginBottom: 20, maxWidth: 400 }}>
        <Search size={16} color="var(--text-muted)" />
        <input placeholder="Search by name or specialization..." value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Stethoscope size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No doctors found</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Doctor</th><th>Specialization</th><th>Treatment</th><th>City</th><th>Fee</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)' }}>
                        {(d.users?.full_name || 'D').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{d.users?.full_name || 'Doctor'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.users?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{d.specialization || '—'}</td>
                  <td>{d.treatment_type && <span className="badge badge-primary">{d.treatment_type}</span>}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{d.city || '—'}</td>
                  <td style={{ color: '#0ea5e9', fontWeight: 600 }}>{d.consultation_fee ? `Rs. ${d.consultation_fee}` : '—'}</td>
                  <td>
                    <span className={`badge ${d.is_approved ? 'badge-success' : 'badge-warning'}`}>
                      {d.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {!d.is_approved && (
                        <button className="btn btn-success btn-sm" onClick={() => updateStatus(d.id, 'approved')}>
                          <CheckCircle size={13} /> Approve
                        </button>
                      )}
                      {d.is_approved && (
                        <button className="btn btn-danger btn-sm" onClick={() => updateStatus(d.id, 'revoke')}>
                          <X size={13} /> Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
