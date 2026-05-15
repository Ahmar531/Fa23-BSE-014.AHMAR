import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute'

// Layouts
import DashboardLayout from './components/layout/DashboardLayout'

// Public Pages
import LandingPage from './pages/public/LandingPage'
import ElectionsList from './pages/public/ElectionsList'
import ElectionDetails from './pages/public/ElectionDetails'
import ResultsPage from './pages/public/ResultsPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

// Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminApprovals from './pages/admin/AdminApprovals'
import CreatorDashboard from './pages/creator/CreatorDashboard'
import CreateElectionPage from './pages/creator/CreateElectionPage'
import ManageCandidates from './pages/creator/ManageCandidates'
import VoterDashboard from './pages/voter/VoterDashboard'
import VotingPage from './pages/voter/VotingPage'

const router = createBrowserRouter([
  // Public Routes
  { path: '/', element: <LandingPage /> },
  { path: '/elections', element: <ElectionsList /> },
  { path: '/elections/:id', element: <ElectionDetails /> },
  { path: '/elections/:id/results', element: <ResultsPage /> },

  // Auth Routes
  {
    element: <PublicRoute><Outlet /></PublicRoute>,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ]
  },

  // Admin Routes
  {
    element: <ProtectedRoute roles={['admin']}><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: '/admin', element: <AdminDashboard /> },
      { path: '/admin/approvals', element: <AdminApprovals /> },
      // Other admin routes to be added
    ]
  },

  // Creator Routes
  {
    element: <ProtectedRoute roles={['election_creator', 'admin']}><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: '/creator', element: <CreatorDashboard /> },
      { path: '/creator/elections/new', element: <CreateElectionPage /> },
      { path: '/creator/elections/:id/candidates', element: <ManageCandidates /> },
    ]
  },

  // Voter Routes
  {
    element: <ProtectedRoute roles={['voter', 'election_creator', 'admin']}><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: '/voter', element: <VoterDashboard /> },
    ]
  },
  
  // Isolated Voting Interface (Needs Layout but distinct from Dashboard)
  {
    element: <ProtectedRoute roles={['voter', 'election_creator', 'admin']}><Outlet /></ProtectedRoute>,
    children: [
      { path: '/vote/:id', element: <VotingPage /> },
    ]
  },

  // Fallback
  { path: '*', element: <Navigate to="/" replace /> }
])

import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#1e293b', color: '#fff', borderRadius: '12px' } }} />
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
