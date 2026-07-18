import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./auth/AuthContext"
import Login from "./pages/Login"
import AuthSuccess from "./pages/AuthSuccess"
import ChatWindow from "./components/ChatWindow"
import UploadModal from "./components/UploadModal"
import { useState } from "react"

function ProtectedApp() {
  const { user, loading, logout } = useAuth()
  const [showUpload, setShowUpload] = useState(false)
  const [toast, setToast] = useState(null)

  if (loading) return <div className="loading">Loading...</div>
  if (!user) return <Navigate to="/login" />

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="app">
      <header>
        <div className="header-left">
          <h1>📚 Study chatbot</h1>
          <p>Ask questions from your study materials</p>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <img src={user.picture} width="28"
              style={{borderRadius:"50%"}} />
            <span>{user.name}</span>
          </div>
          <button className="btn" onClick={() => setShowUpload(true)}>
            ↑ Upload
          </button>
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <ChatWindow />

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={(msg) => { setShowUpload(false); showToast(msg) }}
        />
      )}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/*" element={<ProtectedApp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}