import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import './styles/FamilyVisitLogs.scss'

export default function FamilyVisitLogs() {
  //Get auth and routing
  const { logout } = useAuth()
  const { client_id } = useParams()
  const navigate = useNavigate()
  
  // State setup
  const [visitLogs, setVisitLogs] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  //Fetch visit logs
  useEffect(() => {
    const fetchVisitLogs = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`family/me/clients/${client_id}/visit-logs`)
        setVisitLogs(data.visit_logs)
        setError(null)
      } catch (err) {
        setError('Failed to load visit logs')
        console.error('Visit logs fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVisitLogs()
  }, [client_id])

  const goBack = () => navigate(`/family/me/clients/${client_id}`)

  const handleVisitLogClick = (visitLogId) => {
    navigate(`/family/me/clients/${client_id}/visit-logs/${visitLogId}`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  //  Handle loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading visit logs...</p>
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
            Back to Client
          </button>
        </div>
      </div>
    )
  }

  //  Display visit logs
  return (
    <div className="family-visit-logs-page">
      {/* Header */}
      <div className="family-visit-logs-header">
        <div className="family-visit-logs-header-container">
          <div className="family-visit-logs-header-content">
            <div className="header-left">
              <button
                onClick={goBack}
                className="back-button"
              >
                ← Back to Client
              </button>
              <div className="header-title-section">
                <h1 className="family-visit-logs-title">Care History</h1>
                <p className="family-visit-logs-subtitle">Visit logs for Client {client_id}</p>
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
      <div className="family-visit-logs-container">
        <div className="family-visit-logs-inner">
          
          {/* Visit logs list */}
          {visitLogs && visitLogs.length > 0 ? (
            <div className="visit-logs-list">
              {visitLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => handleVisitLogClick(log.id)}
                  className="visit-log-card"
                >
                  <div className="visit-log-content">
                    <div className="visit-log-header">
                      <div className="visit-log-title-section">
                        <h3 className="visit-log-title">
                          Visit by {log.carer_name}
                        </h3>
                        <span className="visit-log-date">
                          {formatDate(log.date)}
                        </span>
                      </div>
                      
                      <div className="visit-log-status">
                        <span className={`status-badge ${
                          log.personal_care_completed 
                            ? 'status-completed'
                            : 'status-incomplete'
                        }`}>
                          {log.personal_care_completed ? 'Care Completed' : 'Care Incomplete'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="visit-log-details">
                      <div className="visit-log-notes">
                        <span className="visit-log-notes-label">Notes:</span>
                        <span className="visit-log-notes-text">{log.notes}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="visit-log-arrow">
                    <svg className="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="empty-state-title">No visit logs yet</h3>
                <p className="empty-state-description">
                  No visits have been logged for this client yet.
                </p>
                <div className="empty-state-action">
                  <button
                    onClick={goBack}
                    className="btn btn-primary btn-large"
                  >
                    Back to Client
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