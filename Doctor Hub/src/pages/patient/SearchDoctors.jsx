import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMocked, supabase } from '../../lib/supabase';
import DashboardLayout from '../../components/DashboardLayout';
import { Search, MapPin, Star, Clock, Stethoscope } from 'lucide-react';

const specializations = ['All', 'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic', 'Pediatrician', 'ENT', 'Ophthalmologist', 'Gynecologist', 'Psychiatrist'];
const treatmentTypes = ['All', 'Allopathic', 'Homeopathic', 'Herbal'];

const mockDoctors = [
  { id: '1', full_name: 'Dr. Ayesha Khan', specialization: 'Cardiologist', treatment_type: 'Allopathic', city: 'Lahore', fee: 2000, rating: 4.9, experience: 12, available: true },
  { id: '2', full_name: 'Dr. Hamid Ali', specialization: 'General Physician', treatment_type: 'Homeopathic', city: 'Karachi', fee: 1200, rating: 4.7, experience: 8, available: true },
  { id: '3', full_name: 'Dr. Sadia Noor', specialization: 'Dermatologist', treatment_type: 'Herbal', city: 'Islamabad', fee: 2500, rating: 4.8, experience: 10, available: false },
  { id: '4', full_name: 'Dr. Bilal Ahmed', specialization: 'Neurologist', treatment_type: 'Allopathic', city: 'Lahore', fee: 3000, rating: 4.6, experience: 15, available: true },
  { id: '5', full_name: 'Dr. Fatima Malik', specialization: 'Pediatrician', treatment_type: 'Allopathic', city: 'Karachi', fee: 1800, rating: 4.9, experience: 9, available: true },
  { id: '6', full_name: 'Dr. Usman Iqbal', specialization: 'Orthopedic', treatment_type: 'Homeopathic', city: 'Lahore', fee: 2200, rating: 4.5, experience: 11, available: true },
];

const typeColors = { Allopathic: '#0ea5e9', Homeopathic: '#10b981', Herbal: '#f59e0b' };

export default function SearchDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [spec, setSpec] = useState('All');
  const [type, setType] = useState('All');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('doctors').select(`*, users(full_name, email)`);
        if (error) {
          setDoctors(isMocked ? mockDoctors : []);
        } else if (!data?.length) {
          setDoctors(isMocked ? mockDoctors : []);
        } else {
          setDoctors(data.map(d => ({
            ...d,
            full_name: d.users?.full_name || d.full_name,
            fee: d.consultation_fee || d.fee,
            experience: d.experience_years || d.experience,
            available: d.is_available ?? d.available,
          })));
        }
      } catch { setDoctors(isMocked ? mockDoctors : []); }
      finally { setLoading(false); }
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter(d => {
    const matchQuery = !query || (d.full_name || '').toLowerCase().includes(query.toLowerCase()) || (d.specialization || '').toLowerCase().includes(query.toLowerCase());
    const matchSpec = spec === 'All' || d.specialization === spec;
    const matchType = type === 'All' || d.treatment_type === type;
    return matchQuery && matchSpec && matchType;
  });

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Find a Doctor</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Search across {doctors.length} verified doctors by specialization and treatment type</p>
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ marginBottom: 24, padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, alignItems: 'center' }}>
          <div className="search-bar">
            <Search size={16} color="var(--text-muted)" />
            <input placeholder="Search by name, disease, or specialization..." value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <select className="select" style={{ width: 200 }} value={spec} onChange={e => setSpec(e.target.value)}>
            {specializations.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="select" style={{ width: 160 }} value={type} onChange={e => setType(e.target.value)}>
            {treatmentTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Treatment Tags */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          {treatmentTypes.map(t => (
            <button key={t} className={`tag ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>
              {t === 'Allopathic' ? '💊' : t === 'Homeopathic' ? '🌿' : t === 'Herbal' ? '🍃' : '🏥'} {t}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: 16, color: 'var(--text-secondary)', fontSize: 14 }}>
        Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> doctors
      </div>

      {/* Doctor Cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 200 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Stethoscope size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No doctors found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your search filters</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(doc => {
            const color = typeColors[doc.treatment_type] || '#0ea5e9';
            return (
              <div key={doc.id} className="card" style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = color + '50'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3)`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                  <div className="avatar avatar-lg" style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}>
                    {(doc.full_name || 'D').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{doc.full_name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{doc.specialization}</div>
                    <div style={{ marginTop: 6 }}>
                      <span className="badge" style={{ background: `${color}18`, color, border: `1px solid ${color}30`, fontSize: 10 }}>
                        {doc.treatment_type}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24', fontSize: 13, fontWeight: 600, justifyContent: 'flex-end' }}>
                      <Star size={13} fill="#fbbf24" /> {doc.rating || '4.8'}
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: doc.available ? '#10b981' : '#64748b', margin: '8px auto 0' }} title={doc.available ? 'Available' : 'Unavailable'} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {doc.city || 'Pakistan'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {doc.experience || 8}yr exp</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Consultation Fee</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color }}> Rs. {(doc.fee || doc.consultation_fee || 1500).toLocaleString()}</div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate(`/patient/book/${doc.id}`, { state: { doctor: doc } })}>
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
