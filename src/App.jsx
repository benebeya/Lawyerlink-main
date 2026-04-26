import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import RegisterClient from './pages/auth/RegisterClient'
import RegisterAgent from './pages/auth/RegisterAgent'
import LandingPage from './pages/home/LandingPage'
import ClientDashboard from './pages/client/ClientDashboard'
import LawyerDashboard from './pages/lawyer/LawyerDashboard'
import LoadingScreen from './components/ui/LoadingScreen'

function ProtectedRoute({ children, requiredRole }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  
  if (!profile) {
    // If on a register page, let them through to finish setup
    if (window.location.pathname.startsWith('/register')) return children
    return <Navigate to="/register/client" replace />
  }

  if (requiredRole && profile.role !== requiredRole) {
    return <Navigate to={profile.role === 'lawyer' ? '/lawyer' : '/client'} replace />
  }
  return children
}

function PublicRoute({ children }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <LoadingScreen />
  
  if (user && profile) {
    return <Navigate to={profile.role === 'lawyer' ? '/lawyer' : '/client'} replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      <Route path="/register" element={<Navigate to="/register/client" replace />} />

      <Route path="/register/client" element={
        <PublicRoute>
          <RegisterClient />
        </PublicRoute>
      } />

      <Route path="/register/client" element={
        <PublicRoute>
          <RegisterClient />
        </PublicRoute>
      } />

      <Route path="/register/agent" element={
        <PublicRoute>
          <RegisterAgent />
        </PublicRoute>
      } />
      
      <Route path="/client" element={
        <ProtectedRoute requiredRole="client">
          <ClientDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/lawyer" element={
        <ProtectedRoute requiredRole="lawyer">
          <LawyerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
