import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import PatientDashboard from './pages/patient/PatientDashboard';
import SearchDoctors from './pages/patient/SearchDoctors';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MedicalHistory from './pages/patient/MedicalHistory';
import Messages from './pages/shared/Messages';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import Prescriptions from './pages/doctor/Prescriptions';
import DoctorClinics from './pages/doctor/DoctorClinics';
import AssistantDashboard from './pages/assistant/AssistantDashboard';
import PaymentVerification from './pages/assistant/PaymentVerification';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageUsers from './pages/admin/ManageUsers';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();

  // Always wait for auth to finish loading before making any redirect decisions
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-dark)' }}>
      <div className="spinner spinner-lg" />
    </div>
  );
  if (!user)    return <Navigate to="/login" replace />;
  if (!profile) return <ProfileRequired />;
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

const CenteredState = ({ title, message, action }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-dark)',
    padding: 24,
  }}>
    <div className="card" style={{ maxWidth: 520, textAlign: 'center', padding: 34 }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: 'rgba(14,165,233,0.12)',
        border: '1px solid rgba(14,165,233,0.25)',
        margin: '0 auto 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        color: 'var(--primary-light)',
        fontSize: 22,
      }}>
        !
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>{title}</h1>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 22 }}>{message}</p>
      {action}
    </div>
  </div>
);

const ProfileRequired = () => {
  const { logout, authError } = useAuth();
  return (
    <CenteredState
      title="Profile Setup Needed"
      message={authError || 'Your login is valid, but the app could not find your role profile. Please run the latest Supabase schema and make sure this user exists in public.users.'}
      action={<button className="btn btn-primary" onClick={logout}>Sign out and try again</button>}
    />
  );
};

const Unauthorized = () => (
  <CenteredState
    title="Unauthorized"
    message="Your account does not have permission to open this dashboard."
    action={<Link className="btn btn-primary" to="/">Go Home</Link>}
  />
);

const LoadingScreen = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-dark)' }}>
    <div className="spinner spinner-lg" />
  </div>
);

const AppRoutes = () => {
  const { user, profile, loading } = useAuth();

  const getDashboardPath = () => {
    if (!profile) return '/profile-required';
    const map = { patient: '/patient', doctor: '/doctor', assistant: '/assistant', admin: '/admin', super_admin: '/superadmin' };
    return map[profile.role] || '/login';
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        loading ? <LoadingScreen /> :
        user && !profile ? <ProfileRequired /> :
        user ? <Navigate to={getDashboardPath()} /> :
        <LoginPage />
      } />
      <Route path="/register" element={
        loading ? <LoadingScreen /> :
        user && !profile ? <ProfileRequired /> :
        user ? <Navigate to={getDashboardPath()} /> :
        <RegisterPage />
      } />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/profile-required" element={<ProfileRequired />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Patient */}
      <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/search" element={<ProtectedRoute allowedRoles={['patient']}><SearchDoctors /></ProtectedRoute>} />
      <Route path="/patient/book/:doctorId" element={<ProtectedRoute allowedRoles={['patient']}><BookAppointment /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['patient']}><MyAppointments /></ProtectedRoute>} />
      <Route path="/patient/history" element={<ProtectedRoute allowedRoles={['patient']}><MedicalHistory /></ProtectedRoute>} />
      <Route path="/patient/messages" element={<ProtectedRoute allowedRoles={['patient']}><Messages /></ProtectedRoute>} />

      {/* Doctor */}
      <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAppointments /></ProtectedRoute>} />
      <Route path="/doctor/prescriptions" element={<ProtectedRoute allowedRoles={['doctor']}><Prescriptions /></ProtectedRoute>} />
      <Route path="/doctor/clinics" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorClinics /></ProtectedRoute>} />
      <Route path="/doctor/messages" element={<ProtectedRoute allowedRoles={['doctor']}><Messages /></ProtectedRoute>} />

      {/* Assistant */}
      <Route path="/assistant" element={<ProtectedRoute allowedRoles={['assistant']}><AssistantDashboard /></ProtectedRoute>} />
      <Route path="/assistant/payments" element={<ProtectedRoute allowedRoles={['assistant']}><PaymentVerification /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin','super_admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={['admin','super_admin']}><ManageDoctors /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin','super_admin']}><ManageUsers /></ProtectedRoute>} />

      {/* Super Admin */}
      <Route path="/superadmin" element={<ProtectedRoute allowedRoles={['super_admin']}><SuperAdminDashboard /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: '10px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
            error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
