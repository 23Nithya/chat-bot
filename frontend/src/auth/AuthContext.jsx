import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext(null)

// ✅ Tell axios to send cookies with every request
axios.defaults.withCredentials = true

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // const token = localStorage.getItem("token")
    // if (token) {
    //   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchUser()
    // } else {
    //   setLoading(false)
    // }
  }, [])

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/me`
      )
      setUser(res.data)
    } catch {
    //   localStorage.removeItem("token")
    //   delete axios.defaults.headers.common["Authorization"]
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/login`
  }

  const logout = async () => {
    // localStorage.removeItem("token")
    // delete axios.defaults.headers.common["Authorization"]
    // setUser(null)
    await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`)
    setUser(null)
  }

//   const setToken = (token) => {
//     localStorage.setItem("token", token)
//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
//     fetchUser()
//   }

  return (
    // <AuthContext.Provider value={{ user, loading, login, logout, setToken }}>
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)