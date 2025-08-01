import { createContext, useContext, useState, useEffect } from 'react'
import { apiPost, apiGet } from '../utils/api.js'

const AuthContext = createContext()

// Custom hook to easily access auth data in any component
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Main AuthProvider component that wraps our entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState(localStorage.getItem('role'))
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Login function - uses your existing API utility
  const login = async (email, password) => {
    setIsLoading(true)
    
    try {
      // apiPost expects just the endpoint, not /api/login
      const data = await apiPost('login', { email, password })
      const newToken = data.access_token

      // Save token
      localStorage.setItem('token', newToken)
      setToken(newToken)

      // Get user profile and role using the new /me endpoint
      await fetchUserProfile(newToken)
      
      setIsLoading(false)
      return { success: true }

    } catch (error) {
      setIsLoading(false)
      return { success: false, error: error.message }
    }
  }

  const fetchUserProfile = async (authToken = token) => {
    if (!authToken) return

    try {
      // apiGet expects just the endpoint, not /api/me
      const data = await apiGet('me')
      
      setUser(data.user)
      setRole(data.role)
      setIsAuthenticated(true)
      localStorage.setItem('role', data.role)
    } catch (error) {
      console.error('Error fetching profile:', error)
      logout()
    }
  }

  // Logout - clear everything
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setToken(null)
    setUser(null)
    setRole(null)
    setIsAuthenticated(false)
  }

  // Check if user is already logged in when app starts
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token')
      
      if (savedToken) {
        setToken(savedToken)
        await fetchUserProfile(savedToken)
      }
    }

    initializeAuth()
  }, [])

  // All the values that any component can read
  const value = {
    user,
    token,
    role,
    isLoading,
    isAuthenticated,
    login,
    logout,
  }

  // Provide these values to all child components
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}