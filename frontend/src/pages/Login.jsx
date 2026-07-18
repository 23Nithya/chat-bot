import { useAuth } from "../auth/AuthContext"
import "../App.css"

export default function Login() {
  const { login } = useAuth()

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>📚 Study Chatbot</h1>
        <p>Your personal AI study assistant</p>
        <button className="btn-google" onClick={login}>
          <img src="https://www.google.com/favicon.ico" width="18" />
          Continue with Google
        </button>
      </div>
    </div>
  )
}