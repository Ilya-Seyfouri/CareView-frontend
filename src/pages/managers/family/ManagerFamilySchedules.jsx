import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet } from '../../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import './styles/ManagerFamilySchedules.scss'

export default function ManagerFamilySchedules() {
  const { logout } = useAuth()
  const { email } = useParams()
  const navigate = useNavigate()
  
  const [schedules, setSchedules] = useState(null)
  const [family, setFamily] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFamilySchedules = async () => {
      try {
        setIsLoading(true)
        
        const familyData = await apiGet(`/manager/family/${email}`)
        setFamily(familyData)
        
        const schedulesData = await apiGet('/manager/schedules')
        const familySchedules = schedulesData.schedules.filter(schedule => 
          familyData.assigned_clients.includes(schedule.client_id)
        )
        setSchedules(familySchedules)
        setError(null)
      } catch (err) {
        setError('Failed to load family schedules')
        console.error('Family schedules fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFamilySchedules()
  }, [email])

  const handleScheduleClick = (scheduleId) => {
    navigate(`/manager/schedules/${scheduleId}`, {
      state: { from: `/manager/family/${email}/schedules` }
    })
  }

  const goBack = () => navigate(`/manager/family/${email}`)

  const getStatusClass = (status) => {
    const statusMap = {
      scheduled: 'status-scheduled',
      in_progress: 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    }
    return statusMap[status] || 'status-scheduled'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading family schedules...</p>
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
            Back to Family Member
          </button>
        </div>
      </div>
    )
  }

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
                ← Back to Family Member
              </button>
              </div>
              <div>
                <h1 className="dashboard-title">Family Member Schedules</h1>
                <p className="dashboard-subtitle">All schedules for {family?.name} ({email})</p>
            </div>
            <div className="header-right">
              <button
                onClick={() => navigate('/manager/schedules/create', {
                  state: { from: `/manager/family/${email}/schedules` }
                })}
                className="btn btn-primary"
              >
                Create Schedule
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
          
          {/* Family info summary */}
          <div className="summary-card">
            <div className="card-content">
              <h3 className="card-title">Family Member Information</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Name:</span> {family?.name}
                </div>
                <div className="summary-item">
                  <span className="summary-label">Email:</span> {family?.email}
                </div>
                <div className="summary-item">
                  <span className="summary-label">Family ID:</span> {family?.id}
                </div>
                <div className="summary-item">
                  <span className="summary-label">Related Schedules:</span> {schedules?.length || 0}
                </div>
              </div>
            </div>
          </div>
          
          {/* Schedules list */}
          {schedules && schedules.length > 0 ? (
            <div className="list-container">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  onClick={() => handleScheduleClick(schedule.id)}
                  className="list-item"
                >
                  <div className="list-item-header">
                    <div className="list-item-content">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h3 className="list-item-title">
                          Client: {schedule.client_id} | Carer: {schedule.carer_email}
                        </h3>
                        <span className={`status-badge ${getStatusClass(schedule.status)}`}>
                          {schedule.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="list-item-meta">
                        <div className="schedule-detail-item">
                          <span className="detail-label">Date:</span> {formatDate(schedule.date)}
                        </div>
                        <div className="schedule-detail-item">
                          <span className="detail-label">Time:</span> {schedule.start_time} - {schedule.end_time}
                        </div>
                        <div className="schedule-detail-item">
                          <span className="detail-label">Type:</span> {schedule.shift_type}
                        </div>
                      </div>
                      
                      {schedule.notes && (
                        <p className="list-item-description">
                          Notes: {schedule.notes}
                        </p>
                      )}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a4 4 0 118 0v4m-4 0v9a1 1 0 01-1 1H6a1 1 0 01-1-1V7a1 1 0 011-1h8a1 1 0 011 1z" />
                </svg>
                <h3 className="empty-state-title">No schedules for this family member's clients</h3>
                <p className="empty-state-description">
                  No care schedules found for the clients assigned to {family?.name}.
                </p>
                <div className="empty-state-action">
                  <button
                    onClick={() => navigate('/manager/schedules/create', {
                      state: { from: `/manager/family/${email}/schedules` }
                    })}
                    className="empty-state-btn"
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