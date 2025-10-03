import type React from "react"
import { useState } from "react"
import { useAuth } from "./AuthProvider"
import { Navigate, useLocation, useNavigate } from "react-router"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from?.pathname || '/'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status !== 200) {
        setError((await response.json()).errors.join(', '))
        return
      }

      localStorage.setItem('jwt', (await response.json()).data.token)
      login()
      navigate(from, { replace: true })
      return <Navigate to="/login" replace />
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined
      setError(message || 'UnexpectedError')
    }
  }

  return (<>
    <form onSubmit={handleLogin}>
      <p>E-mail</p>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <p>Password</p>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      {error && <p style={{color: "red"}}>{error}</p>}
    </form>
  </>)
}