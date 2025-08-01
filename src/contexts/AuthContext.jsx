import { createContext, useContext, useState, useEffect } from 'react'

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

  // Login function - connects to our existing FastAPI /login endpoint
  const login = async (email, password) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        let errorMessage = 'Login failed'
        
        if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.error) {
          if (typeof errorData.error === 'string') {
            errorMessage = errorData.error
          } else if (errorData.details && Array.isArray(errorData.details)) {
            errorMessage = errorData.details.join('; ')
          }
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
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
      const response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        
        setUser(data.user)
        setRole(data.role)
        setIsAuthenticated(true)
        localStorage.setItem('role', data.role)
      } else {
        // Token expired or invalid
        logout()
      }
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