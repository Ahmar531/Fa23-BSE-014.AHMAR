import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg-dark)' }}>
      <div className="spinner spinner-lg" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { user, profile } = useAuth();

  const getDashboardPath = () => {
    if (!profile) return '/login';
    const map = { patient: '/patient', doctor: '/doctor', assistant: '/assistant', admin: '/admin', super_admin: '/superadmin' };
    return map[profile.role] || '/login';
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={getDashboardPath()} /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={getDashboardPath()} /> : <RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Patient */}
      <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
      <Route path="/patient/search" element={<ProtectedRoute allowedRoles={['patient']}><SearchDoctors /></ProtectedRoute>} />
      <Route path="/patient/book/:doctorId" element={<ProtectedRoute allowedRoles={['patient']}><BookAppointment /></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['patient']}><MyAppointments /></ProtectedRoute>} />
      <Route path="/patient/history" element={<ProtectedRoute allowedRoles={['patient']}><MedicalHistory /></ProtectedRoute>} />

      {/* Doctor */}
      <Route path="/doctor" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorAppointments /></ProtectedRoute>} />
      <Route path="/doctor/prescriptions" element={<ProtectedRoute allowedRoles={['doctor']}><Prescriptions /></ProtectedRoute>} />
      <Route path="/doctor/clinics" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorClinics /></ProtectedRoute>} />

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
