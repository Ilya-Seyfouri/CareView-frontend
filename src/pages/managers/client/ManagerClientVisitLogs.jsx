import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet } from '../../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import './styles/ManagerClientVisitLogs.scss'

export default function ManagerClientVisitLogs() {
  // Get auth and routing
  const { user, logout } = useAuth()
  const { client_id } = useParams()
  const navigate = useNavigate()
  
  // State setup
  const [visitLogs, setVisitLogs] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch visit logs
  useEffect(() => {
    const fetchVisitLogs = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`/manager/client/${client_id}/visit-logs`)
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

  // Navigation helpers
  const goBack = () => navigate(`/manager/client/${client_id}`)
  const goToVisitLog = (visitLogId) => navigate(`/manager/client/${client_id}/visit-logs/${visitLogId}`)

  //Handle loading state
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

  // Handle error state
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

  // Display visit logs
  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-container">
          <div className="dashboard-header-content">
            <div className="header-left">
              <button
                onClick={goBack}
                className="btn btn-back"
              >
                ← Back to Client
              </button>
              <div>
                <h1 className="dashboard-title">Visit Logs</h1>
                <p className="dashboard-subtitle">Client ID: {client_id}</p>
              </div>
            </div>
            <div className="header-right">
              <button
                onClick={() => navigate(`/manager/client/${client_id}/visit-log/create`)}
                className="btn btn-primary"
              >
                Create Visit Log
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
          
          {/* Visit logs list */}
          {visitLogs && visitLogs.length > 0 ? (
            <div className="list-container">
              {visitLogs.map((log) => (
                <div
                  key={log.id}
                  onClick={() => goToVisitLog(log.id)}
                  className="list-item"
                >
                  <div className="list-item-header">
                    <div className="list-item-content">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h3 className="list-item-title">
                          Visit by {log.carer_name}
                        </h3>
                        <span className="date-text">
                          {new Date(log.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="list-item-meta">
                        <span className={`status-badge ${log.personal_care_completed ? 'status-care-completed' : 'status-care-incomplete'}`}>
                          {log.personal_care_completed ? 'Care Completed' : 'Care Incomplete'}
                        </span>
                      </div>
                      
                      <p className="list-item-description">
                        {log.notes}
                      </p>
                    </div>
                    
                    <div className="list-item-arrow">
                      <svg className="user-card-arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="empty-state-title">No visit logs yet</h3>
                <p className="empty-state-description">
                  Get started by creating the first visit log for this client.
                </p>
                <div className="empty-state-action">
                  <button
                    onClick={() => navigate(`/manager/client/${client_id}/visit-log/create`)}
                    className="empty-state-btn"
                  >
                    Create first visit log
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