import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import './styles/FamilyDashboard.scss'

export default function FamilyDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [todayData, setTodayData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  
  useEffect(() => {
    const fetchTodayData = async () => {
      try {
        setIsLoading(true)
        //GET /family/me/today
        const data = await apiGet('family/me')
        setTodayData(data)
        setError(null)
      } catch (err) {
        setError('Failed to load today\'s care information')
        console.error('Family dashboard error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodayData()
  }, [])

  // Auto-refresh 
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        //fetchTodayData()
      }
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [isLoading])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅'
      case 'in_progress': return '🟢'
      case 'scheduled': return '⏰'
      case 'cancelled': return '❌'
      default: return '📋'
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed'
      case 'in_progress': return 'status-in-progress'
      case 'scheduled': return 'status-scheduled'
      case 'cancelled': return 'status-cancelled'
      default: return 'status-default'
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading today's care information...</p>
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
    <div className="family-dashboard-page">
      {/* Header */}
      <div className="family-dashboard-header">
        <div className="family-dashboard-header-container">
          <div className="family-dashboard-header-content">
            <div className="header-info">
              <h1 className="family-dashboard-title">Today's Care</h1>
              <p className="family-dashboard-subtitle">Welcome back, {user?.name || 'Family Member'}!</p>
              <p className="family-dashboard-meta">
                {todayData?.date} • Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="header-actions">
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

      {/* Dashboard content */}
      <div className="family-dashboard-container">
        <div className="family-dashboard-inner">
          
          {/* Today's Summary */}
          <div className="summary-card">
            <div className="card-content">
              <h3 className="card-title">
                Today's Care Summary
              </h3>
              
              <div className="summary-stats-grid">
                <div className="summary-stat">
                  <div className="summary-stat-value stat-value-primary">
                    {todayData?.summary?.total_today || 0}
                  </div>
                  <div className="summary-stat-label">Total Visits Today</div>
                </div>
                
                <div className="summary-stat">
                  <div className="summary-stat-value stat-value-success">
                    {todayData?.summary?.completed || 0}
                  </div>
                  <div className="summary-stat-label">Completed</div>
                </div>
                
                <div className="summary-stat">
                  <div className="summary-stat-value stat-value-warning">
                    {todayData?.summary?.happening_now || 0}
                  </div>
                  <div className="summary-stat-label">Happening Now</div>
                </div>
                
                <div className="summary-stat">
                  <div className="summary-stat-value stat-value-neutral">
                    {todayData?.summary?.upcoming || 0}
                  </div>
                  <div className="summary-stat-label">Upcoming</div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="schedule-card">
            <div className="card-content">
              <h3 className="card-title">
                Today's Care Schedule
              </h3>
              
              {todayData?.care_schedule && todayData.care_schedule.length > 0 ? (
                <div className="schedule-list">
                  {todayData.care_schedule.map((visit, index) => (
                    <div
                      key={index}
                      className={`visit-card ${getStatusClass(visit.status)}`}
                    >
                      <div className="visit-card-content">
                        <div className="visit-header">
                          <div className="visit-status-icon">
                            {getStatusIcon(visit.status)}
                          </div>
                          <div className="visit-title">
                            <h4 className="visit-client-name">
                              {visit.client_name} (Room {visit.client_room})
                            </h4>
                          </div>
                        </div>
                        
                        <div className="visit-details-grid">
                          <div className="visit-detail">
                            <span className="visit-detail-label">Carer:</span>
                            <span className="visit-detail-value">{visit.carer_name}</span>
                          </div>
                          <div className="visit-detail">
                            <span className="visit-detail-label">Time:</span>
                            <span className="visit-detail-value">{visit.time}</span>
                          </div>
                          <div className="visit-detail">
                            <span className="visit-detail-label">Type:</span>
                            <span className="visit-detail-value">{visit.shift_type}</span>
                          </div>
                        </div>
                        
                        <div className="visit-status">
                          <span className="visit-status-label">Status:</span>
                          <span className="visit-status-value">{visit.status_message}</span>
                        </div>
                        
                        {visit.notes && (
                          <div className="visit-notes">
                            <span className="visit-notes-label">Notes:</span>
                            <span className="visit-notes-text">{visit.notes}</span>
                          </div>
                        )}
                        
                        {visit.completed_at && (
                          <div className="visit-completion">
                            <span className="visit-completion-label">Completed at:</span>
                            <span className="visit-completion-time">{visit.completed_at}</span>
                          </div>
                        )}
                        
                        {visit.carer_phone && (
                          <div className="visit-contact">
                            <span className="visit-contact-label">Carer Contact:</span>
                            <span className="visit-contact-phone">{visit.carer_phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-schedule">
                  <div className="empty-schedule-icon">😴</div>
                  <h3 className="empty-schedule-title">No visits scheduled today</h3>
                  <p className="empty-schedule-description">Your loved ones have no scheduled care visits today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="quick-actions-grid">
              <button 
                onClick={() => navigate('/family/me/clients')}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-primary">👨‍👩‍👧‍👦</div>
                <div className="quick-action-title">My Loved Ones</div>
                <div className="quick-action-desc">View client information</div>
              </button>
              
              <button 
                onClick={() => navigate('/family/me/schedules')}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-success">📅</div>
                <div className="quick-action-title">Upcoming Visits</div>
                <div className="quick-action-desc">View future care schedule</div>
              </button>
              
              <button 
                onClick={() => navigate('/family/me')}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-warning">👤</div>
                <div className="quick-action-title">My Profile</div>
                <div className="quick-action-desc">Update contact information</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}