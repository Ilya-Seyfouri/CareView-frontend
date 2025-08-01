import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import './styles/CarerClientDetail.scss'

export default function CarerClientDetail() {
  const { logout } = useAuth()
  const { client_id } = useParams()
  const navigate = useNavigate()
  
  const [client, setClient] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch client data using exact backend route
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`carer/me/clients/${client_id}`)
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

  const goBack = () => navigate('/carer/me/clients')

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading client details...</p>
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
            Back to Clients
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="carer-client-detail-page">
      {/* Header */}
      <div className="carer-client-detail-header">
        <div className="carer-client-detail-header-container">
          <div className="carer-client-detail-header-content">
            <div className="header-left">
              <button
                onClick={goBack}
                className="back-button"
              >
                ← Back to My Clients
              </button>
              <div className="header-title-section">
                <h1 className="carer-client-detail-title">{client?.name}</h1>
                <p className="carer-client-detail-subtitle">Client Details & Care Logging</p>
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
      <div className="carer-client-detail-container">
        <div className="carer-client-detail-inner">
          
          {/* Client information card */}
          <div className="client-info-card">
            <div className="card-content">
              <h3 className="card-title">
                Client Information
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
                <label className="info-label">Support Needs</label>
                <div className="support-needs-content">
                  <p className="support-needs-text">{client?.support_needs}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="quick-actions-section">
            <h3 className="section-title">Care Actions</h3>
            <div className="action-cards-grid">
              
              {/* Create Visit Log - Primary Action */}
              <button
                onClick={() => navigate(`/carer/me/clients/${client_id}/visit-log/create`)}
                className="action-card action-card-primary"
              >
                <div className="action-card-content">
                  <div className="action-card-icon-container">
                    <div className="action-card-icon icon-primary">+</div>
                  </div>
                  <div className="action-card-text">
                    <h4 className="action-card-title">Log Visit</h4>
                    <p className="action-card-desc">Create new visit log</p>
                  </div>
                </div>
              </button>

              {/* View Visit Logs */}
              <button
                onClick={() => navigate(`/carer/me/clients/${client_id}/visit-logs`)}
                className="action-card action-card-white"
              >
                <div className="action-card-content">
                  <div className="action-card-icon-container">
                    <div className="action-card-icon icon-success">📝</div>
                  </div>
                  <div className="action-card-text">
                    <h4 className="action-card-title">Visit History</h4>
                    <p className="action-card-desc">View past visit logs</p>
                  </div>
                </div>
              </button>

              {/* View Schedule */}
              <button
                onClick={() => navigate('/carer/me/schedules')}
                className="action-card action-card-white"
              >
                <div className="action-card-content">
                  <div className="action-card-icon-container">
                    <div className="action-card-icon icon-warning">📅</div>
                  </div>
                  <div className="action-card-text">
                    <h4 className="action-card-title">My Schedule</h4>
                    <p className="action-card-desc">View upcoming visits</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}