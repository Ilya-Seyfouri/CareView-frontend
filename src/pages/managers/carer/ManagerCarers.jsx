import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet } from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import './styles/ManagerCarers.scss'

export default function ManagerCarers() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // State setup
  const [carers, setCarers] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch carers
  useEffect(() => {
    const fetchCarers = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet('manager/carers')
        setCarers(data.carers)
        setError(null)
      } catch (err) {
        setError('Failed to load carers')
        console.error('Carers fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCarers()
  }, [])

  const handleCarerClick = (carerEmail) => {
    navigate(`/manager/carer/${carerEmail}`)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading carers...</p>
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
  <div className="carers-page">
    {/* Header */}
    <div className="carers-header">
      <div className="carers-header-container">
        <div className="carers-header-content">
          <div className="header-left">
            <button
              onClick={() => navigate('/manager/dashboard')}
              className="back-button"
            >
              ← Back to Dashboard
            </button>
          </div>
          
          <div className="title">
            <h1 className="carers-title">Carer Management</h1>
            <p className="carers-subtitle">Manage all carers in the care home</p>
          </div>
          
          <div className="header-right">
            <button 
              onClick={() => navigate('/manager/create/carer')}
              className="btn btn-primary"
            >
              Add New Carer
            </button>
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Main content */}
      <div className="carers-container">
        <div className="carers-inner">
          
          {/* Carers grid */}
          {carers && carers.length > 0 ? (
            <div className="carers-grid">
              {carers.map((carer) => (
                <div
                  key={carer.email}
                  onClick={() => handleCarerClick(carer.email)}
                  className="carer-card"
                >
                  <div className="carer-card-content">
                    <div className="carer-card-header">
                      <div className="carer-card-body">
                        <div className="carer-avatar">
                          <span className="carer-avatar-text">
                            {carer.name?.charAt(0)?.toUpperCase() || 'C'}
                          </span>
                        </div>
                        <div className="carer-info">
                          <h3 className="carer-name">
                            {carer.name}
                          </h3>
                          <p className="carer-email">
                            {carer.email}
                          </p>
                          <p className="carer-phone">
                            {carer.phone}
                          </p>
                        </div>
                      </div>
                      
                    </div>
                    
                    {/* Assigned clients count */}
                    <div className="carer-card-footer">
                      <div className="carer-stats">
                        
                        <span className="carer-stats-text">
                          {carer.assigned_clients?.length || 0} clients assigned
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="empty-state-title">No carers yet</h3>
                <p className="empty-state-description">
                  Get started by creating your first carer.
                </p>
                <div className="empty-state-action">
                  <button
                    onClick={() => navigate('/manager/create/carer')}
                    className="btn btn-accent btn-large"
                  >
                    Add your first carer
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