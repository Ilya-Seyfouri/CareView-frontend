import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet, apiPut } from '../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/CarerScheduleDetail.scss'

export default function CarerScheduleDetail() {
  const { logout } = useAuth()
  const { schedule_id } = useParams()
  const navigate = useNavigate()
  
  const [schedule, setSchedule] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`carer/me/schedules/${schedule_id}`)
        setSchedule(data)
        setError(null)
      } catch (err) {
        setError('Failed to load schedule details')
        console.error('Schedule fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchedule()
  }, [schedule_id])

  const updateScheduleStatus = async (newStatus) => {
    try {
      setUpdatingStatus(true)
      
      await apiPut(`carer/me/schedules/${schedule_id}/status?new_status=${newStatus}`)
      
      // Update local state
      setSchedule(prev => ({ ...prev, status: newStatus }))
      
      toast.success(`Schedule status updated to ${newStatus.replace('_', ' ')}`)
    } catch (err) {
      console.error('Status update error:', err)
      toast.error('Failed to update schedule status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const goBack = () => navigate('/carer/me/schedules')

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const canUpdateStatus = (currentStatus) => {
    // Do not allow updating if already completed or cancelled
    return !['completed', 'cancelled'].includes(currentStatus)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading schedule details...</p>
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
            Back to My Schedules
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="schedule-detail-page">
      {/* Header */}
      <div className="schedule-detail-header">
        <div className="schedule-detail-header-container">
          <div className="schedule-detail-header-content">
            <div className="schedule-detail-header-left">
              <button
                onClick={goBack}
                className="back-button"
              >
                ← Back to My Schedules
              </button>
              <div className="schedule-detail-header-info">
                <h1 className="schedule-detail-title">Schedule Details</h1>
                <p className="schedule-detail-subtitle">Schedule for {schedule?.client_name}</p>
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
      <div className="schedule-detail-container">
        <div className="schedule-detail-inner">
          
          {/* Schedule details */}
          <div className="schedule-details-card">
            <div className="card-content">
              
              {/* Header info */}
              <div className="schedule-header-section">
                <div className="schedule-header-info">
                  <h3 className="card-title">
                    Visit Information
                  </h3>
                  <span className={`status-badge status-${schedule?.status?.replace('_', '-')}`}>
                    {schedule?.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Schedule details */}
              <div className="schedule-details-section">
                
                <div className="schedule-details-grid">
                  <div className="detail-field">
                    <label className="detail-label">Client Name</label>
                    <p className="detail-value">{schedule?.client_name}</p>
                  </div>
                  
                  <div className="detail-field">
                    <label className="detail-label">Client Room</label>
                    <p className="detail-value">Room {schedule?.client_room}</p>
                  </div>
                  
                  <div className="detail-field">
                    <label className="detail-label">Date</label>
                    <p className="detail-value">{formatDate(schedule?.date)}</p>
                  </div>
                  
                  <div className="detail-field">
                    <label className="detail-label">Time</label>
                    <p className="detail-value">
                      {schedule?.start_time} - {schedule?.end_time}
                    </p>
                  </div>
                  
                  <div className="detail-field">
                    <label className="detail-label">Shift Type</label>
                    <p className="detail-value">{schedule?.shift_type}</p>
                  </div>
                  
                  <div className="detail-field">
                    <label className="detail-label">Schedule ID</label>
                    <p className="detail-value">{schedule?.id}</p>
                  </div>
                </div>

                {/* Support needs */}
                {schedule?.client_support_needs && (
                  <div className="support-needs-section">
                    <label className="detail-label">
                      Client Support Needs
                    </label>
                    <div className="support-needs-content">
                      <p className="support-needs-text">{schedule.client_support_needs}</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {schedule?.notes && (
                  <div className="notes-section">
                    <label className="detail-label">
                      Schedule Notes
                    </label>
                    <p className="notes-content">
                      {schedule.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

   <div className="schedule-actions">
  {canUpdateStatus(schedule?.status) && (
  <button
    onClick={() =>
      updateScheduleStatus(
        schedule?.status === 'scheduled' ? 'in_progress' : 'completed'
      )
    }
    disabled={updatingStatus}
    className={`quick-action-card ${schedule?.status === 'scheduled' ? 'quick-action-primary' : ''}`}
  >
    <div className="quick-action-title">
      {schedule?.status === 'scheduled' ? 'Start Visit' : 'Complete Visit'}
    </div>
    <div className="quick-action-desc">
      {schedule?.status === 'scheduled'
        ? 'Begin this scheduled appointment'
        : 'Mark this visit as complete'}
    </div>
  </button>
)}
  {/* Quick actions as sibling cards */}
 

  <button
  onClick={() => navigate(`/carer/me/clients/${schedule?.client_id}/visit-log/create`, {
    state: { 
      from: `/carer/me/schedules/${schedule_id}`,
      context: 'schedule'
    }
  })}
  className="quick-action-card quick-action-primary"
>
  <div className="quick-action-title">Log This Visit</div>
  <div className="quick-action-desc">Create visit log for this appointment</div>
</button>
</div>
</div>
</div>
</div>
  )
}