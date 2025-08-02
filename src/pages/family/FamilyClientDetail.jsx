import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import './styles/FamilyClientDetail.scss'

export default function FamilyClientDetail() {
  const { logout } = useAuth()
  const { client_id } = useParams()
  const navigate = useNavigate()
  
  const [client, setClient] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`family/me/clients/${client_id}`)
        setClient(data)
        setError(null)
      } catch (err) {
        setError('Failed to load client details')
        console.error('Client fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClient()
  }, [client_id])

  const goBack = () => navigate('/family/me/clients')

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
            onClick={goBack}
            className="btn btn-primary"
          >
            Back to My Loved Ones
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="family-client-detail-page">
      {/* Header */}
      <div className="family-client-detail-header">
        <div className="family-client-detail-header-container">
          <div className="family-client-detail-header-content">
            <div className="header-left">
              <button
                onClick={goBack}
                className="back-button"
              >
                ← Back to My Loved Ones
              </button>
              <div className="header-title-section">
                <h1 className="family-client-detail-title">{client?.name}</h1>
                <p className="family-client-detail-subtitle">Client Information</p>
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
      <div className="family-client-detail-container">
        <div className="family-client-detail-inner">
          
          {/* Client information card */}
          <div className="client-info-card">
            <div className="card-content">
              <h3 className="card-title">
                About {client?.name}
              </h3>
              
              <div className="client-info-grid">
                <div className="info-field">
                  <label className="info-label">Full Name</label>
                  <p className="info-value">{client?.name}</p>
                </div>
                
                <div className="info-field">
                  <label className="info-label">Client ID</label>
                  <p className="info-value">{client?.id}</p>
                </div>
                
                <div className="info-field">
                  <label className="info-label">Age</label>
                  <p className="info-value">{client?.age} years old</p>
                </div>
                
                <div className="info-field">
                  <label className="info-label">Room</label>
                  <p className="info-value">Room {client?.room}</p>
                </div>
                
                <div className="info-field">
                  <label className="info-label">Date of Birth</label>
                  <p className="info-value">{client?.date_of_birth}</p>
                </div>
              </div>
              
              <div className="support-needs-section">
                <label className="info-label">Care Needs & Support</label>
                <div className="support-needs-content">
                  <p className="support-needs-text">{client?.support_needs}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions for families */}
          <div className="quick-actions-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="action-cards-grid">
              
              

              {/* Visit History */}
              <button
                onClick={() => navigate(`/family/me/clients/${client_id}/visit-logs`)}
                className="action-card action-card-white"
              >
                <div className="action-card-content">
                  <div className="action-card-icon-container">
                    <div className="action-card-icon icon-success">📝</div>
                  </div>
                  <div className="action-card-text">
                    <h4 className="action-card-title">Care History</h4>
                    <p className="action-card-desc">View recent care visits</p>
                  </div>
                </div>
              </button>

              {/* Care Schedule */}
              <button
                onClick={() => navigate('/family/me/schedules')}
                className="action-card action-card-white"
              >
                <div className="action-card-content">
                  <div className="action-card-icon-container">
                    <div className="action-card-icon icon-warning">📅</div>
                  </div>
                  <div className="action-card-text">
                    <h4 className="action-card-title">Care Schedule</h4>
                    <p className="action-card-desc">View upcoming visits</p>
                  </div>
                </div>
              </button>

              {/* Contact Information */}
             
            </div>
          </div>

          <div className="info-notice">
            <div className="info-notice-content">
              <div className="info-notice-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="info-notice-text">
                <h3 className="info-notice-title">
                  About Care Information
                </h3>
                <div className="info-notice-description">
                  <p>
                    This information is maintained by the care team. For any questions about care needs, 
                    medications, or specific requirements, please contact the care manager directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}