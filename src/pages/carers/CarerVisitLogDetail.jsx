import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import './styles/CarerVisitLogDetails.scss'

export default function CarerVisitLogDetail() {
  const { logout } = useAuth()
  const { client_id, visit_log_id } = useParams()
  const navigate = useNavigate()
  
  // State setup
  const [visitLog, setVisitLog] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch visit log data using carer endpoint
  useEffect(() => {
    const fetchVisitLog = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`/carer/me/clients/${client_id}/visit-logs/${visit_log_id}`)
        setVisitLog(data)
        setError(null)
      } catch (err) {
        setError('Failed to load visit log details')
        console.error('Visit log fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVisitLog()
  }, [client_id, visit_log_id])

  const goBack = () => navigate(`/carer/me/clients/${client_id}/visit-logs`)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading visit log details...</p>
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
            Back to Visit Logs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="visit-log-detail-page">
      {/* Header */}
      <div className="visit-log-detail-header">
        <div className="visit-log-detail-header-container">
          <div className="visit-log-detail-header-content">
            <div className="visit-log-detail-header-left">
              <button
                onClick={goBack}
                className="back-button"
              >
                ← Back to Visit Logs
              </button>
              <div className="visit-log-detail-header-info">
                <h1 className="visit-log-detail-title">Visit Log Details</h1>
                <p className="visit-log-detail-subtitle">Visit Log ID: {visitLog?.id}</p>
              </div>
            </div>
            <div className="visit-log-detail-header-actions">
              <button
                onClick={() => navigate(`/carer/me/clients/${client_id}`)}
                className="btn btn-primary"
              >
                View Client
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
      <div className="visit-log-detail-container">
        <div className="visit-log-detail-inner">
          
          {/* Visit log details */}
          <div className="visit-log-details-card">
            <div className="card-content">
              
              {/* Header info */}
              <div className="visit-log-header-section">
                <h3 className="card-title">
                  Visit Information
                </h3>
                <p className="visit-log-header-subtitle">
                  Logged by {visitLog?.carer_name} on {formatDate(visitLog?.date)}
                </p>
              </div>

              {/* Visit details */}
              <div className="visit-log-details-section">
                
                <div className="visit-log-basic-info">
                  <div className="detail-field">
                    <label className="detail-label">Carer Name</label>
                    <p className="detail-value">{visitLog?.carer_name}</p>
                  </div>
                  
                  <div className="detail-field">
                    <label className="detail-label">Carer Number</label>
                    <p className="detail-value">{visitLog?.carer_number}</p>
                  </div>
                  
                  <div className="detail-field">
                    <label className="detail-label">Visit Date</label>
                    <p className="detail-value">{formatDate(visitLog?.date)}</p>
                  </div>
                  
                  <div className="detail-field">
                    <label className="detail-label">Client ID</label>
                    <p className="detail-value">{visitLog?.client_id}</p>
                  </div>
                </div>

                {/* Care activities */}
                <div className="care-activities-section">
                  <h4 className="section-subtitle">Care Activities</h4>
                  <div className="care-activities-grid">
                    <div className="activity-field">
                      <label className="activity-label">Personal Care Completed</label>
                      <p className={`activity-value ${visitLog?.personal_care_completed ? 'activity-yes' : 'activity-no'}`}>
                        {visitLog?.personal_care_completed ? '✅ Yes' : '❌ No'}
                      </p>
                    </div>
                    
                    <div className="activity-field">
                      <label className="activity-label">Care Reminders Provided</label>
                      <p className={`activity-value ${visitLog?.care_reminders_provided ? 'activity-yes' : 'activity-no'}`}>
                        {visitLog?.care_reminders_provided ? '✅ Yes' : '❌ No'}
                      </p>
                    </div>
                    
                    <div className="activity-field">
                      <label className="activity-label">Toilet Assistance</label>
                      <p className={`activity-value ${visitLog?.toilet ? 'activity-yes' : 'activity-no'}`}>
                        {visitLog?.toilet ? '✅ Yes' : '❌ No'}
                      </p>
                    </div>
                    
                    <div className="activity-field">
                      <label className="activity-label">Changed Clothes</label>
                      <p className={`activity-value ${visitLog?.changed_clothes ? 'activity-yes' : 'activity-no'}`}>
                        {visitLog?.changed_clothes ? '✅ Yes' : '❌ No'}
                      </p>
                    </div>
                    
                    <div className="activity-field">
                      <label className="activity-label">Ate Food</label>
                      <p className={`activity-value ${visitLog?.ate_food ? 'activity-yes' : 'activity-no'}`}>
                        {visitLog?.ate_food ? '✅ Yes' : '❌ No'}
                      </p>
                    </div>
                    
                    <div className="activity-field">
                      <label className="activity-label">Mood</label>
                      <p className="activity-value activity-neutral">
                        {visitLog?.mood && visitLog.mood.length > 0 
                          ? visitLog.mood.join(', ') 
                          : 'Not recorded'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="notes-section">
                  <label className="detail-label">
                    Visit Notes
                  </label>
                  <div className="notes-content">
                    <p className="notes-text">
                      {visitLog?.notes || 'No notes recorded for this visit.'}
                    </p>
                  </div>
                </div>

                {/* Timestamps */}
                {(visitLog?.last_updated_at || visitLog?.last_updated_by) && (
                  <div className="timestamps-section">
                    <h4 className="timestamps-title">Last Updated</h4>
                    <div className="timestamps-grid">
                      {visitLog?.last_updated_at && (
                        <div className="timestamp-field">
                          <span className="timestamp-label">When:</span> {new Date(visitLog.last_updated_at).toLocaleString()}
                        </div>
                      )}
                      {visitLog?.last_updated_by && (
                        <div className="timestamp-field">
                          <span className="timestamp-label">By:</span> {visitLog.last_updated_by}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="quick-actions-grid">
            <button
              onClick={() => navigate(`/carer/me/clients/${client_id}/visit-log/create`)}
              className="quick-action-card"
            >
              <div className="quick-action-content">
                <div className="quick-action-title">Log New Visit</div>
                <div className="quick-action-desc">Create another visit log for this client</div>
              </div>
            </button>
            
            <button
              onClick={() => navigate(`/carer/me/clients/${client_id}`)}
              className="quick-action-card"
            >
              <div className="quick-action-content">
                <div className="quick-action-title">View Client Details</div>
                <div className="quick-action-desc">See client information and care needs</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}