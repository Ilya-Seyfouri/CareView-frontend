import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import './styles/AdminManagers.scss'


export default function AdminManagers() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // State setup
  const [managers, setManagers] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch managers
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet('admin/managers')
        setManagers(data.managers)
        setError(null)
      } catch (err) {
        setError('Failed to load managers')
        console.error('Managers fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchManagers()
  }, [])

  const handleManagerClick = (managerEmail) => {
    navigate(`/admin/managers/${managerEmail}`)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading managers...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="managers-page">
      {/* Header */}
      <div className="managers-header">
        <div className="managers-header-container">
          <div className="managers-header-content">
            <div className="header-left">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="back-button"
              >
                ← Back to Dashboard
              </button>
            </div>
            
            <div className="title">
              <h1 className="managers-title">Manager Management</h1>
              <p className="managers-subtitle">Manage all managers in the system</p>
            </div>
            
            <div className="header-right">
              <button 
                onClick={() => navigate('/admin/create/manager')}
                className="btn btn-primary"
              >
                Add New Manager
              </button>
              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="managers-container">
        <div className="managers-inner">
          
          {/* Managers grid */}
          {managers && managers.length > 0 ? (
            <div className="managers-grid">
              {managers.map((manager) => (
                <div
                  key={manager.email}
                  onClick={() => handleManagerClick(manager.email)}
                  className="manager-card"
                >
                  <div className="manager-card-content">
                    <div className="manager-card-header">
                      <div className="manager-card-body">
                        <div className="manager-avatar">
                          <span className="manager-avatar-text">
                            {manager.name?.charAt(0)?.toUpperCase() || 'M'}
                          </span>
                        </div>
                        <div className="manager-info">
                          <h3 className="manager-name">
                            {manager.name}
                          </h3>
                          <p className="manager-email">
                            {manager.email}
                          </p>
                          <p className="manager-department">
                            {manager.department}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Manager role badge */}
                    <div className="manager-card-footer">
                      <div className="manager-stats">
                        <span className="manager-role-badge">
                          Manager
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="empty-state">
              <div className="empty-state-content">
                <div className="empty-state-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="empty-state-title">No managers yet</h3>
                <p className="empty-state-description">
                  Get started by creating your first manager.
                </p>
                <div className="empty-state-action">
                  <button
                    onClick={() => navigate('/admin/create/manager')}
                    className="btn btn-accent btn-large"
                  >
                    Add your first manager
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}