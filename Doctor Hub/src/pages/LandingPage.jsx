import { Link } from 'react-router-dom';
import { Stethoscope, Search, Calendar, Shield, Star, ArrowRight, Heart, Activity, Users } from 'lucide-react';

const features = [
  { icon: Search, title: 'Smart Doctor Search', desc: 'Filter by specialization, treatment type — Allopathic, Homeopathic, or Herbal.', color: '#0ea5e9' },
  { icon: Calendar, title: 'Easy Appointment Booking', desc: 'Book slots instantly and track status in real-time through your dashboard.', color: '#8b5cf6' },
  { icon: Shield, title: 'Secure Medical Records', desc: 'Your history is encrypted and shared only with your authorized doctors.', color: '#10b981' },
  { icon: Heart, title: 'Prescription Management', desc: 'Doctors add digital prescriptions; view complete history anytime.', color: '#f59e0b' },
];

const stats = [
  { value: '1,200+', label: 'Verified Doctors', icon: Stethoscope },
  { value: '15,000+', label: 'Patients Served', icon: Users },
  { value: '98%', label: 'Satisfaction Rate', icon: Star },
  { value: '3', label: 'Treatment Types', icon: Activity },
];

const treatmentTypes = [
  { type: 'Allopathic', desc: 'Evidence-based modern medicine with certified specialists.', color: '#0ea5e9', icon: '💊' },
  { type: 'Homeopathic', desc: 'Natural remedies tailored to your individual health needs.', color: '#10b981', icon: '🌿' },
  { type: 'Herbal', desc: 'Traditional plant-based treatments from certified herbalists.', color: '#f59e0b', icon: '🍃' },
];

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(2,8,23,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 40px', height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(14,165,233,0.4)'
          }}>
            <Stethoscope size={22} color="white" />
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20, color: 'var(--text-primary)' }}>
            Doctor<span style={{ color: '#0ea5e9' }}>Hub</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link to="/login" className="btn btn-ghost">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-bg" style={{ padding: '100px 40px 80px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.12) 0%, transparent 60%)'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)',
            borderRadius: 20, padding: '6px 16px', marginBottom: 32
          }}>
            <span style={{ width: 6, height: 6, background: '#0ea5e9', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 13, color: '#38bdf8', fontWeight: 500 }}>Pakistan's #1 Healthcare Platform</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, fontFamily: 'Plus Jakarta Sans' }}>
            Find the Right Doctor,<br />
            <span className="gradient-text">Book Instantly.</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Search allopathic, homeopathic, or herbal doctors by disease. Book appointments, upload payments, and manage your complete medical history — all in one place.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Your Journey <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">
              Sign In to Dashboard
            </Link>
          </div>

          {/* Floating Cards */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 60, flexWrap: 'wrap' }}>
            {[
              { label: 'Available Today', value: '340+ Doctors', color: '#0ea5e9' },
              { label: 'Avg. Wait Time', value: '< 10 mins', color: '#8b5cf6' },
              { label: 'Patient Rating', value: '4.9 ★', color: '#f59e0b' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '16px 24px', backdropFilter: 'blur(10px)',
                minWidth: 140
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 40px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px'
                }}>
                  <Icon size={24} color="#0ea5e9" />
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans' }}>{value}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Types */}
      <section style={{ padding: '80px 40px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>Three Types of <span className="gradient-text">Treatment</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Choose the healing approach that suits you best</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {treatmentTypes.map(({ type, desc, color, icon }) => (
              <div key={type} className="card" style={{ textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = color + '60'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, color }}>{type}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
                <Link to="/patient/search" style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color, fontWeight: 600, textDecoration: 'none' }}>
                  Explore Doctors <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 40px', background: 'rgba(15,23,42,0.5)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>Everything You <span className="gradient-text">Need</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Powerful tools for patients and doctors</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card" style={{ transition: 'all 0.3s ease' }}>
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: `${color}18`, border: `1px solid ${color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18
                }}>
                  <Icon size={24} color={color} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '80px 40px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>How It <span className="gradient-text">Works</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, position: 'relative' }}>
            {[
              { step: '01', label: 'Search Doctor', desc: 'Filter by disease and treatment type', icon: '🔍' },
              { step: '02', label: 'Book Slot', desc: 'Choose your preferred time & date', icon: '📅' },
              { step: '03', label: 'Pay & Upload', desc: 'Upload payment screenshot', icon: '💳' },
              { step: '04', label: 'Get Confirmed', desc: 'Assistant verifies and confirms', icon: '✅' },
            ].map(({ step, label, desc, icon }) => (
              <div key={step} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 36, marginBottom: 12,
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(139,92,246,0.15))',
                  border: '1px solid rgba(14,165,233,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>{icon}</div>
                <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700, letterSpacing: '1px', marginBottom: 6 }}>STEP {step}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(139,92,246,0.15))',
            border: '1px solid rgba(14,165,233,0.25)',
            borderRadius: 24, padding: '64px 40px', textAlign: 'center',
            position: 'relative', overflow: 'hidden'
          }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>Ready to Take Control of Your Health?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32 }}>
              Join thousands of patients managing their healthcare smarter with DoctorHub.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">Create Free Account <ArrowRight size={18} /></Link>
              <Link to="/login" className="btn btn-ghost btn-lg">Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <Stethoscope size={18} color="#0ea5e9" />
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: 'var(--text-primary)' }}>DoctorHub</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>© 2024 DoctorHub. Final Semester Project — FA23-BSE-014</p>
      </footer>
    </div>
  );
}
