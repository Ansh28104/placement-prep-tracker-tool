"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Applications from "./pages/Applications"
import Coding from "./pages/Coding"
import Aptitude from "./pages/Aptitude"
import Resume from "./pages/Resume"
import Interviews from "./pages/Interviews"
import Goals from "./pages/Goals"
import Resources from "./pages/Resources"
import Rewards from "./pages/Rewards"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"
import LoadingSpinner from "./components/LoadingSpinner"

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" replace />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            user ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/applications" element={<Applications />} />
                  <Route path="/coding" element={<Coding />} />
                  <Route path="/aptitude" element={<Aptitude />} />
                  <Route path="/resume" element={<Resume />} />
                  <Route path="/interviews" element={<Interviews />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  )
}

export default App
