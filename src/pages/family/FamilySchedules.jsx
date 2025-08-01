import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import './styles/FamilySchedules.scss'

export default function FamilySchedules() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const [schedules, setSchedules] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet('family/me/schedules')
        setSchedules(data.schedules)
        setError(null)
      } catch (err) {
        setError('Failed to load care schedules')
        console.error('Schedules fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchedules()
  }, [])

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      scheduled: 'status-scheduled',
      in_progress: 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    }
    return `status-badge ${statusClasses[status] || 'status-scheduled'}`
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅'
      case 'in_progress': return '🟢'
      case 'scheduled': return '⏰'
      case 'cancelled': return '❌'
      default: return '📋'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const isToday = (dateString) => {
    const today = new Date().toDateString()
    const scheduleDate = new Date(dateString).toDateString()
    return today === scheduleDate
  }

  const isFuture = (dateString) => {
    const today = new Date().setHours(0, 0, 0, 0)
    const scheduleDate = new Date(dateString).setHours(0, 0, 0, 0)
    return scheduleDate >= today
  }

  // Filter and group schedules
  const upcomingSchedules = schedules ? schedules.filter(schedule => isFuture(schedule.date)) : []
  const pastSchedules = schedules ? schedules.filter(schedule => !isFuture(schedule.date)) : []

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading care schedules...</p>
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

  const ScheduleCard = ({ schedule }) => (
    <div className="schedule-card">
      <div className="schedule-card-content">
        <div className="schedule-header">
          <div className="schedule-status-icon">
            {getStatusIcon(schedule.status)}
          </div>
          <div className="schedule-title-section">
            <h3 className="schedule-client-name">
              {schedule.client_name}
              <span className="schedule-room-info">(Room {schedule.client_room})</span> &nbsp;&nbsp;{isToday(schedule.date)}
            </h3>
           
          </div>
        </div>
        
        <div className="schedule-details-grid">
          <div className="schedule-detail">
            <span className="schedule-detail-label">Date:</span>
            <span className="schedule-detail-value">{formatDate(schedule.date)}</span>
          </div>
          <div className="schedule-detail">
            <span className="schedule-detail-label">Time:</span>
            <span className="schedule-detail-value">
              {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
            </span>
          </div>
          <div className="schedule-detail">
            <span className="schedule-detail-label">Carer:</span>
            <span className="schedule-detail-value">{schedule.carer_name}</span>
          </div>
          <div className="schedule-detail">
            <span className="schedule-detail-label">Contact:</span>
            <span className="schedule-detail-value schedule-phone">{schedule.carer_phone}</span>
          </div>
          <div className="schedule-detail">
            <span className="schedule-detail-label">Type:</span>
            <span className="schedule-detail-value">{schedule.shift_type}</span>
          </div>
          <div className="schedule-detail">
            <span className="schedule-detail-label">Status:</span>
            <span className={getStatusBadgeClass(schedule.status)}>
              {schedule.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        {schedule.notes && (
          <div className="schedule-notes">
            <span className="schedule-notes-label">Notes: &nbsp;{schedule.notes} </span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="family-schedules-page">
      {/* Header */}
      <div className="family-schedules-header">
        <div className="family-schedules-header-container">
          <div className="family-schedules-header-content">
            <div className="header-left">
              <button
                onClick={() => navigate('/family/dashboard')}
                className="back-button"
              >
                ← Back to Dashboard
              </button>
              <div className="header-title-section">
                <h1 className="family-schedules-title">Care Schedule</h1>
                <p className="family-schedules-subtitle">All upcoming and past care visits</p>
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
      <div className="family-schedules-container">
        <div className="family-schedules-inner">
          
          {/* Upcoming Visits */}
          <div className="schedules-section">
            <h2 className="section-title">
              Upcoming Visits ({upcomingSchedules.length})
            </h2>
            
            {upcomingSchedules.length > 0 ? (
              <div className="schedules-list">
                {upcomingSchedules.map((schedule) => (
                  <ScheduleCard key={schedule.id} schedule={schedule} />
                ))}
              </div>
            ) : (
              <div className="empty-state-card">
                <div className="empty-state-content">
                  <h3 className="empty-state-title">&nbsp;  &nbsp;📅No upcoming visits</h3>
                  <p className="empty-state-description">&nbsp;There are no scheduled care visits coming up.</p>
                </div>
              </div>
            )}
          </div>

          {/* Past Visits */}
          {pastSchedules.length > 0 && (
            <div className="schedules-section">
              <h2 className="section-title">
                Recent Visits ({pastSchedules.length})
              </h2>
              
              <div className="schedules-list" >
                {pastSchedules.slice(0, 10).map((schedule) => (
                  <ScheduleCard key={schedule.id} schedule={schedule} />
                ))}
              </div>
              
              {pastSchedules.length > 10 && (
                <div className="pagination-info">
                  <p className="pagination-text">
                    Showing 10 most recent visits of {pastSchedules.length} total
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Empty state for all schedules */}
          {(!schedules || schedules.length === 0) && (
            <div className="empty-state-card">
              <div className="empty-state-content">
                <div className="empty-state-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a4 4 0 118 0v4m-4 0v9a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011-1h8a1 1 0 011 1z" />
                  </svg>
                </div>
                <h3 className="empty-state-title">No care visits scheduled</h3>
                <p className="empty-state-description">
                  There are no care visits scheduled yet. Contact your care manager.
                </p>
                <div className="empty-state-action">
                  <button
                    onClick={() => navigate('/family/dashboard')}
                    className="btn btn-primary btn-large"
                  >
                    Back to Dashboard
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