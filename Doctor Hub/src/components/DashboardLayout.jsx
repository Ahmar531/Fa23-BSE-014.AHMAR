import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Calendar, FileText, CreditCard,
  Building2, Search, History, LogOut, Menu, Bell, ChevronDown,
  Stethoscope, Shield, MessageSquare
} from 'lucide-react';
import { useState } from 'react';

const navConfig = {
  patient: [
    { label: 'Dashboard', path: '/patient', icon: LayoutDashboard },
    { label: 'Find Doctors', path: '/patient/search', icon: Search },
    { label: 'My Appointments', path: '/patient/appointments', icon: Calendar },
    { label: 'Medical History', path: '/patient/history', icon: History },
    { label: 'Messages', path: '/patient/messages', icon: MessageSquare },
  ],
  doctor: [
    { label: 'Dashboard', path: '/doctor', icon: LayoutDashboard },
    { label: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { label: 'Prescriptions', path: '/doctor/prescriptions', icon: FileText },
    { label: 'My Clinics', path: '/doctor/clinics', icon: Building2 },
    { label: 'Messages', path: '/doctor/messages', icon: MessageSquare },
  ],
  assistant: [
    { label: 'Dashboard', path: '/assistant', icon: LayoutDashboard },
    { label: 'Payment Verification', path: '/assistant/payments', icon: CreditCard },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Doctors', path: '/admin/doctors', icon: Stethoscope },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
  ],
  super_admin: [
    { label: 'Overview', path: '/superadmin', icon: Shield },
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Doctors', path: '/admin/doctors', icon: Stethoscope },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
  ],
};

const roleColors = {
  patient: '#0ea5e9', doctor: '#8b5cf6', assistant: '#10b981',
  admin: '#f59e0b', super_admin: '#ef4444'
};
const roleLabels = {
  patient: 'Patient', doctor: 'Doctor', assistant: 'Assistant',
  admin: 'Admin', super_admin: 'Super Admin'
};

export default function DashboardLayout({ children }) {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const role = profile?.role || 'patient';
  const navItems = navConfig[role] || navConfig.patient;
  const color = roleColors[role];
  const initials = (profile?.full_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="main-layout">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: `linear-gradient(135deg, ${color}, ${color}99)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 16px ${color}40`
            }}>
              <Stethoscope size={20} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>
                Doctor Hub
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {roleLabels[role]}
              </div>
            </div>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {navItems.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-item ${location.pathname === path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="nav-icon" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10,
            background: 'var(--glass-light)', border: '1px solid var(--border)'
          }}>
            <div className="avatar avatar-sm" style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile?.full_name || 'User'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{profile?.email}</div>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost btn-icon btn-sm" title="Logout">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none' }}
              id="sidebar-toggle"
            >
              <Menu size={18} />
            </button>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>
                {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-ghost btn-icon" style={{ position: 'relative' }}>
              <Bell size={18} />
              <span className="notif-dot" />
            </button>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--glass-light)' }}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="avatar avatar-sm" style={{ background: `linear-gradient(135deg, ${color}, ${color}80)`, width: 30, height: 30, fontSize: 12 }}>
                {initials}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{profile?.full_name?.split(' ')[0]}</span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '28px 32px' }} className="animate-fade">
          {children}
        </div>
      </div>
    </div>
  );
}
