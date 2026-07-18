import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

export default function AuthSuccess() {
//   const [params] = useSearchParams()
//   const { setToken } = useAuth()
  const { fetchUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      // Cookie already set by backend
      // Just fetch user info to confirm login worked
      await fetchUser()
      navigate("/")
    }
    init()
  }, [])
  
//   useEffect(() => {
//     const token = params.get("token")
//     if (token) {
//       setToken(token)
//       navigate("/")
//     } else {
//       navigate("/login")
//     }
//   }
//   , [])

  return <p>Logging you in...</p>
}