import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import './styles/CarerVisitLogs.scss'

export default function CarerVisitLogs() {
  const { logout } = useAuth()
  const { client_id } = useParams()
  const navigate = useNavigate()
  
  const [visitLogs, setVisitLogs] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVisitLogs = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`carer/me/clients/${client_id}/visit-logs`)
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

  const goBack = () => navigate(`/carer/me/clients/${client_id}`)

  // Handle click on visit log
  const handleVisitLogClick = (visitLogId) => {
    navigate(`/carer/me/clients/${client_id}/visit-logs/${visitLogId}`)
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

  // Loading state
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

  return (
    <div className="visit-logs-page">
      {/* Header */}
      <div className="visit-logs-header">
        <div className="visit-logs-header-container">
          <div className="visit-logs-header-content">
            <div className="visit-logs-header-left">
              <button
                onClick={goBack}
                className="back-button"
              >
                ← Back to Client
              </button>
              <div className="visit-logs-header-info">
                <h1 className="visit-logs-title">Visit History</h1>
                <p className="visit-logs-subtitle">Visit logs for Client {client_id}</p>
              </div>
            </div>
            <div className="visit-logs-header-actions">
              <button
                onClick={() => navigate(`/carer/me/clients/${client_id}/visit-log/create`)}
                className="btn btn-primary"
              >
                Log New Visit
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
      <div className="visit-logs-container">
        <div className="visit-logs-inner">
          
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
                    <div className="visit-log-main">
                      <div className="visit-log-header">
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
                    
                    {/* Arrow to indicate it's clickable */}
                   
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="empty-state-card">
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
                <div className="empty-state-actions">
                  <button
                    onClick={() => navigate(`/carer/me/clients/${client_id}/visit-log/create`)}
                    className="btn btn-primary"
                  >
                    Log First Visit
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