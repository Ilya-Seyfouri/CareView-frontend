import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import './styles/FamilyVisitLogDetail.scss'

export default function FamilyVisitLogDetail() {
  const { logout } = useAuth()
  const { client_id, visit_log_id } = useParams()
  const navigate = useNavigate()
  
  // State setup
  const [visitLog, setVisitLog] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVisitLog = async () => {
      try {
        setIsLoading(true)
        //GET family visit logs
        const data = await apiGet(`family/me/visit-logs/${visit_log_id}`)
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
  }, [visit_log_id])

  const goBack = () => navigate(`/family/me/clients/${client_id}/visit-logs`)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading care visit details...</p>
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
            Back to Care History
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="family-visit-log-detail-page">
      {/* Header */}
      <div className="family-visit-log-detail-header">
        <div className="family-visit-log-detail-header-container">
          <div className="family-visit-log-detail-header-content">
            <div className="header-left">
              <button
                onClick={goBack}
                className="back-button"
              >
                ← Back to Care History
              </button>
              <div className="header-title-section">
                <h1 className="family-visit-log-detail-title">Care Visit Details</h1>
                <p className="family-visit-log-detail-subtitle">
                  Visit by {visitLog?.carer_name} on {formatDate(visitLog?.date)}
                </p>
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
      <div className="family-visit-log-detail-container">
        <div className="family-visit-log-detail-inner">
          
          {/* Visit overview */}
          <div className="visit-overview-card">
            <div className="card-content">
              <div className="visit-overview-header">
                <h3 className="card-title">
                  Care Visit Summary
                </h3>
                <span className={`status-badge ${
                  visitLog?.personal_care_completed 
                    ? 'status-completed'
                    : 'status-incomplete'
                }`}>
                  {visitLog?.personal_care_completed ? '✅ Care Completed' : '❌ Care Incomplete'}
                </span>
              </div>
              
              <div className="visit-overview-grid">
                <div className="overview-item">
                  <span className="overview-label">Carer:</span>
                  <p className="overview-value">{visitLog?.carer_name}</p>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Contact:</span>
                  <p className="overview-value overview-phone">{visitLog?.carer_number}</p>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Date:</span>
                  <p className="overview-value">{formatDate(visitLog?.date)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Care activities */}
          <div className="care-activities-card">
            <div className="card-content">
              <h3 className="card-title">
                Care Activities Completed
              </h3>
              
              <div className="care-activities-grid">
                <div className="activities-column">
                  <div className="activity-item">
                    <span className={`activity-indicator ${
                      visitLog?.personal_care_completed ? 'activity-completed' : 'activity-not-completed'
                    }`}></span>
                    <span className={`activity-text ${
                      visitLog?.personal_care_completed ? 'text-completed' : 'text-not-completed'
                    }`}>
                      Personal care completed
                    </span>
                  </div>
                  
                  <div className="activity-item">
                    <span className={`activity-indicator ${
                      visitLog?.toilet ? 'activity-completed' : 'activity-not-completed'
                    }`}></span>
                    <span className={`activity-text ${
                      visitLog?.toilet ? 'text-completed' : 'text-not-completed'
                    }`}>
                      Toilet assistance provided
                    </span>
                  </div>
                  
                  <div className="activity-item">
                    <span className={`activity-indicator ${
                      visitLog?.changed_clothes ? 'activity-completed' : 'activity-not-completed'
                    }`}></span>
                    <span className={`activity-text ${
                      visitLog?.changed_clothes ? 'text-completed' : 'text-not-completed'
                    }`}>
                      Clothes changed
                    </span>
                  </div>
                </div>
                
                <div className="activities-column">
                  <div className="activity-item">
                    <span className={`activity-indicator ${
                      visitLog?.care_reminders_provided ? 'activity-completed' : 'activity-not-completed'
                    }`}></span>
                    <span className={`activity-text ${
                      visitLog?.care_reminders_provided ? 'text-completed' : 'text-not-completed'
                    }`}>
                      Care reminders provided
                    </span>
                  </div>
                  
                  <div className="activity-item">
                    <span className={`activity-indicator ${
                      visitLog?.ate_food ? 'activity-completed' : 'activity-not-completed'
                    }`}></span>
                    <span className={`activity-text ${
                      visitLog?.ate_food ? 'text-completed' : 'text-not-completed'
                    }`}>
                      Food and drink provided
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional details */}
          <div className="visit-details-section">
            
            {/* Mood */}
            {visitLog?.mood && visitLog.mood.length > 0 && (
              <div className="detail-card">
                <div className="card-content">
                  <h3 className="card-title">
                    Mood During Visit
                  </h3>
                  <div className="mood-tags">
                    {visitLog.mood.map((moodItem, index) => (
                      <span
                        key={index}
                        className="mood-tag"
                      >
                        {moodItem}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Care notes */}
            <div className="detail-card">
              <div className="card-content">
                <h3 className="card-title">
                  Care Notes
                </h3>
                <div className="notes-content">
                  <p className="notes-text">
                    {visitLog?.notes || 'No additional notes were recorded for this visit.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Care reminders detail */}
            {visitLog?.care_reminders_provided && (
              <div className="detail-card">
                <div className="card-content">
                  <h3 className="card-title">
                    Care Reminders Given
                  </h3>
                  <div className="notes-content">
                    <p className="notes-text">
                      {visitLog.care_reminders_provided}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Food and drink detail */}
            {visitLog?.ate_food && (
              <div className="detail-card">
                <div className="card-content">
                  <h3 className="card-title">
                    Food & Drink
                  </h3>
                  <div className="notes-content">
                    <p className="notes-text">
                      {visitLog.ate_food}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="quick-action-section">
            <button
              onClick={() => navigate(`/family/me/clients/${client_id}`)}
              className="quick-action-button"
            >
              <div className="quick-action-content">
                <div className="quick-action-title">View {visitLog?.client_name} Details</div>
                <div className="quick-action-desc">Go to client information and care history</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}