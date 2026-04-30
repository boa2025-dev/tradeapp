import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AlbumPage from './pages/AlbumPage'
import MissingPage from './pages/MissingPage'
import FriendsPage from './pages/FriendsPage'
import TradesPage from './pages/TradesPage'
import SetupPage from './pages/SetupPage'
import LandingPage from './pages/LandingPage'
import { FIREBASE_CONFIGURED } from './lib/firebase'

export default function App() {
  if (!FIREBASE_CONFIGURED) {
    return <SetupPage />
  }

  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/album" element={<AlbumPage />} />
                    <Route path="/missing" element={<MissingPage />} />
                    <Route path="/friends" element={<FriendsPage />} />
                    <Route path="/trades/:friendId" element={<TradesPage />} />
                    <Route path="*" element={<Navigate to="/album" replace />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </HashRouter>
  )
}
