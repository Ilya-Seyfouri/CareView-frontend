import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet } from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import './styles/ManagerClientComponents.scss'

export default function ManagerClients() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // State setup
  const [clients, setClients] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet('/manager/clients')
        setClients(data.clients)
        setError(null)
      } catch (err) {
        setError('Failed to load clients')
        console.error('Clients fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [])

  // Navigation handler
  const handleClientClick = (clientId) => {
    navigate(`/manager/client/${clientId}`)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading clients...</p>
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
    <div className="dashboard-page">
      {/* Header - Clean and organized */}
      <div className="dashboard-header">
        <div className="dashboard-header-container">
          <div className="dashboard-header-content">
            <div className="header-left">
              <button
                onClick={() => navigate('/manager/dashboard')}
                className="btn btn-back"
              >
                ← Back to Dashboard
              </button>
            </div>
            
            <div className="header-title-section">
              <h2 className="dashboard-title">Client&nbsp;Management</h2>
              <p className="dashboard-subtitle">Manage all clients in the care home</p>
            </div>
            
            <div className="header-right">
              <button 
                onClick={() => navigate('/manager/create/client')}
                className="btn btn-primary"
              >
                Add New Client
              </button>
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
      <div className="dashboard-container">
        <div className="dashboard-inner">
          
          {/* Clients grid */}
          {clients && clients.length > 0 ? (
            <div className="card-grid">
              {clients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => handleClientClick(client.id)}
                  className="card-clickable"
                >
                  <div className="card-clickable-content">
                    <div className="user-card-header">
                      <div className="user-card-info">
                        <h3 className="user-card-name">
                          {client.name}
                        </h3>
                        <p className="user-card-details">
                          Room {client.room} • Age {client.age}
                        </p>
                        <p className="user-card-meta">
                          ID: {client.id}
                        </p>
                      </div>
                      <div className="user-card-arrow">
                        <svg className="user-card-arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Support needs preview */}
                    <div className="user-card-description">
                      <p>
                        {client.support_needs.length > 100 
                          ? `${client.support_needs.substring(0, 100)}...`
                          : client.support_needs
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="empty-state">
              <div className="empty-state-content">
                <svg className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="empty-state-title">No clients yet</h3>
                <p className="empty-state-description">
                  Get started by creating your first client.
                </p>
                <div className="empty-state-action">
                  <button
                    onClick={() => navigate('/manager/create/client')}
                    className="empty-state-btn"
                  >
                    Add your first client
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