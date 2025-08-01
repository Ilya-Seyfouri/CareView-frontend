import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import './styles/CarerSchedules.scss'

export default function CarerSchedules() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const [schedules, setSchedules] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet('/carer/me/schedules')
        setSchedules(data.schedules)
        setError(null)
      } catch (err) {
        setError('Failed to load schedules')
        console.error('Schedules fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchedules()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your schedules...</p>
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
    <div className="schedules-page">
      {/* Header */}
      <div className="schedules-header">
        <div className="schedules-header-container">
          <div className="schedules-header-content">
            <div className="schedules-header-left">
              <button
                onClick={() => navigate('/carer/dashboard')}
                className="back-button"
              >
                ← Back to Dashboard
              </button>
              <div className="schedules-header-info">
                <h1 className="schedules-title">My Schedule</h1>
                <p className="schedules-subtitle">View and update your care visits</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="btn btn-danger"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="schedules-container">
        <div className="schedules-inner">
          
          {/* Schedules list */}
          {schedules && schedules.length > 0 ? (
            <div className="schedules-list">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="schedule-card"
                  onClick={() => navigate(`/carer/me/schedules/${schedule.id}`)}
                >
                  <div className="schedule-card-content">
                    <div className="schedule-card-main">
                      <div className="schedule-card-header">
                        <h3 className="schedule-card-title">
                          {schedule.client_name} 
                          <span className="schedule-card-room">
                            (Room {schedule.client_room})
                          </span>
                        </h3>
                        <span className={`status-badge status-${schedule.status.replace('_', '-')}`}>
                          {schedule.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="schedule-card-details">
                        <div className="schedule-detail">
                          <span className="detail-label">Date:</span> {formatDate(schedule.date)}
                        </div>
                        <div className="schedule-detail">
                          <span className="detail-label">Time:</span> {schedule.start_time} - {schedule.end_time}
                        </div>
                        <div className="schedule-detail">
                          <span className="detail-label">Type:</span> {schedule.shift_type}
                        </div>
                      </div>
                      

                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="empty-state-card">
              <div className="empty-state-content">
                <div className="empty-state-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a4 4 0 118 0v4m-4 0v9a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011-1h8a1 1 0 011 1z" />
                  </svg>
                </div>
                <h3 className="empty-state-title">No schedules yet</h3>
                <p className="empty-state-description">
                  You don't have any care visits scheduled. Contact your manager.
                </p>
                <div className="empty-state-actions">
                  <button
                    onClick={() => navigate('/carer/me/clients')}
                    className="btn btn-primary"
                  >
                    View My Clients
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