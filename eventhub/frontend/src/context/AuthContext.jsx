import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/endpoints'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const { data } = await authAPI.getProfile()
      setUser(data)
    } catch {
      setUser(null)
      localStorage.removeItem('tokens')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem('tokens') || '{}')
    if (tokens.access) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const { data } = await authAPI.login({ username, password })
    localStorage.setItem('tokens', JSON.stringify(data))
    await fetchProfile()
  }

  const logout = () => {
    localStorage.removeItem('tokens')
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
