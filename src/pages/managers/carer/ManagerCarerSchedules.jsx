import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet } from '../../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import './styles/ManagerCarerSchedules.scss'

export default function ManagerCarerSchedules() {
  const { logout } = useAuth()
  const { email } = useParams()
  const navigate = useNavigate()
  
  const [schedules, setSchedules] = useState(null)
  const [carer, setCarer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCarerSchedules = async () => {
      try {
        setIsLoading(true)
        
        // Get carer info first
        const carerData = await apiGet(`manager/carer/${email}`)
        setCarer(carerData)
        
        // Get all schedules and filter for this carer
        const schedulesData = await apiGet('manager/schedules')
        const carerSchedules = schedulesData.schedules.filter(schedule => schedule.carer_email === email)
        setSchedules(carerSchedules)
        setError(null)
      } catch (err) {
        setError('Failed to load carer schedules')
        console.error('Carer schedules fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCarerSchedules()
  }, [email])

  const handleScheduleClick = (scheduleId) => {
    navigate(`/manager/schedules/${scheduleId}`, {
      state: { from: `/manager/carer/${email}/schedules` }
    })
  }

  const goBack = () => navigate(`/manager/carer/${email}`)

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      scheduled: 'status-scheduled',
      in_progress: 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    }
    return `status-badge ${statusClasses[status] || 'status-scheduled'}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading carer schedules...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button onClick={goBack} className="btn btn-primary">
            Back to Carer
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
          <div className="header-left">
            <button onClick={goBack} className="back-button">
              ← Back to Carer
            </button>
          </div>
          
          <div className="header-title-section">
            <h1 className="schedules-title">Carer Schedules</h1>
            <p className="schedules-subtitle">All schedules for {carer?.name} ({email})</p>
          </div>
          
          <div className="header-right">
            <button
              onClick={() => navigate('/manager/schedules/create', {
                state: { 
                  from: `/manager/carer/${email}/schedules`,
                  prefill: { carer_email: email }
                }
              })}
              className="btn btn-primary"
            >
              Create Schedule
            </button>
            <button onClick={logout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
      {/* Main content */}
      <div className="schedules-container">
        <div className="schedules-inner">
          
          {/* Carer info summary */}
          <div className="carer-summary-card">
            <div className="card-content">
              <h3 className="card-title">Carer Information</h3>
              <div className="carer-info-grid">
                <div className="info-item">
                  <span className="info-label">Name:</span> 
                  <span className="info-value">{carer?.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span> 
                  <span className="info-value">{carer?.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Total Schedules:</span> 
                  <span className="info-value">{schedules?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Schedules list */}
          {schedules && schedules.length > 0 ? (
            <div className="schedules-list">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  onClick={() => handleScheduleClick(schedule.id)}
                  className="schedule-card"
                >
                  <div className="schedule-card-content">
                    <div className="schedule-card-header">
                      <div className="schedule-info">
                        <div className="schedule-title-row">
                          <h3 className="schedule-title">
                            Client: {schedule.client_id}
                          </h3>
                          <span className={getStatusBadgeClass(schedule.status)}>
                            {schedule.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <div className="schedule-details-grid">
                          <div className="schedule-detail">
                            <span className="schedule-detail-icon"></span>
                            <div className="schedule-detail-content">
                              <span className="schedule-detail-label">Date</span>
                              <span className="schedule-detail-value">{formatDate(schedule.date)}</span>
                            </div>
                          </div>
                          
                          <div className="schedule-detail">
                            <span className="schedule-detail-icon"></span>
                            <div className="schedule-detail-content">
                              <span className="schedule-detail-label">Time</span>
                              <span className="schedule-detail-value">
                                {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="schedule-detail">
                            <span className="schedule-detail-icon"></span>
                            <div className="schedule-detail-content">
                              <span className="schedule-detail-label">Type</span>
                              <span className="schedule-detail-value">{schedule.shift_type}</span>
                            </div>
                          </div>
                        </div>
                        
                        
                      </div>
                      
                      <div className="schedule-card-arrow">
                        <svg className="arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a4 4 0 118 0v4m-4 0v9a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011 1z" />
                  </svg>
                </div>
                <h3 className="empty-state-title">No schedules for this carer</h3>
                <p className="empty-state-description">
                  Get started by creating a schedule for {carer?.name}.
                </p>
                <div className="empty-state-action">
                  <button
                    onClick={() => navigate('/manager/schedules/create', {
                      state: { 
                        from: `/manager/carer/${email}/schedules`,
                        prefill: { carer_email: email }
                      }
                    })}
                    className="btn btn-accent btn-large"
                  >
                    Create first schedule
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