import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import './styles/FamilyClients.scss'

export default function FamilyClients() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const [clients, setClients] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet('family/me/clients')
        setClients(data.clients)
        setError(null)
      } catch (err) {
        setError('Failed to load client information')
        console.error('Clients fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [])

  const handleClientClick = (clientId) => {
    // Navigate to client detail
    navigate(`/family/me/clients/${clientId}`)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading client information...</p>
        </div>
      </div>
    )
  }

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
    <div className="family-clients-page">
      {/* Header */}
      <div className="family-clients-header">
        <div className="family-clients-header-container">
          <div className="family-clients-header-content">
            <div className="header-left">
              <button
                onClick={() => navigate('/family/dashboard')}
                className="back-button"
              >
                ← Back to Dashboard
              </button>
              <div className="header-title-section">
                <h1 className="family-clients-title">My Loved Ones</h1>
                <p className="family-clients-subtitle">Information about clients</p>
              </div>
            </div>
            <div className="header-right">
              <button
                onClick={logout}
                className="btn btn-danger"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="family-clients-container">
        <div className="family-clients-inner">
          
          {/* Clients grid */}
          {clients && clients.length > 0 ? (
            <div className="clients-grid">
              {clients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => handleClientClick(client.id)}
                  className="client-card"
                >
                  <div className="client-card-content">
                    <div className="client-card-header">
                      <div className="client-card-body">
                        <div className="client-avatar">
                          <span className="client-avatar-text">
                            {client.name?.charAt(0)?.toUpperCase() || 'C'}
                          </span>
                        </div>
                        <div className="client-info">
                          <h3 className="client-name">
                            {client.name}
                          </h3>
                          <p className="client-details">
                            Room {client.room} • Age {client.age}
                          </p>
                          <p className="client-id">
                            ID: {client.id}
                          </p>
                        </div>
                      </div>
                      <div className="client-card-icon">
                        <svg className="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Support needs preview */}
                    
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
                <h3 className="empty-state-title">
                  No clients assigned
                </h3>
                <p className="empty-state-description">
                  You don't have any clients assigned to you yet. Contact the care manager.
                </p>
                <div className="empty-state-action">
                  <button
                    onClick={() => navigate('/family/dashboard')}
                    className="btn btn-primary btn-large"
                  >
                    Back to Dashboard
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