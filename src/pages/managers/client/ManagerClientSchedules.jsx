import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet } from '../../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import './styles/ManagerClientSchedules.scss'

export default function ManagerClientSchedules() {
  const { logout } = useAuth()
  const { client_id } = useParams()
  const navigate = useNavigate()
  
  const [schedules, setSchedules] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClientSchedules = async () => {
      try {
        setIsLoading(true)
        // Get all schedules and filter for this client
        const data = await apiGet('manager/schedules')
        const clientSchedules = data.schedules.filter(schedule => schedule.client_id === client_id)
        setSchedules(clientSchedules)
        setError(null)
      } catch (err) {
        setError('Failed to load client schedules')
        console.error('Client schedules fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClientSchedules()
  }, [client_id])

  const handleScheduleClick = (scheduleId) => {
  navigate(`/manager/schedules/${scheduleId}`, {
    state: { 
      from: `/manager/client/${client_id}/schedules`,
      context: 'client',
      clientId: client_id
    }
  })
}

  const goBack = () => navigate(`/manager/client/${client_id}`)

  const getStatusBadge = (status) => {
    const statusClasses = {
      scheduled: 'status-scheduled',
      in_progress: 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    }
    return statusClasses[status] || 'status-scheduled'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading client schedules...</p>
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
                <h1 className="dashboard-title">Client Schedules</h1>
                <p className="dashboard-subtitle">All schedules for Client {client_id}</p>
              </div>
            </div>
            <div className="header-right">
              <button
                onClick={() => navigate('/manager/schedules/create')}
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
                          Carer: {schedule.carer_email}
                        </h3>
                        <span className={`status-badge ${getStatusBadge(schedule.status)}`}>
                          {schedule.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="list-item-meta">
                        <div>
                          <span style={{ fontWeight: '500' }}>Date:</span> {formatDate(schedule.date)}
                        </div>
                        <div>
                          <span style={{ fontWeight: '500' }}>Time:</span> {schedule.start_time} - {schedule.end_time}
                        </div>
                        <div>
                          <span style={{ fontWeight: '500' }}>Type:</span> {schedule.shift_type}
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
                <h3 className="empty-state-title">No schedules for this client</h3>
                <p className="empty-state-description">
                  Get started by creating a schedule for this client.
                </p>
                <div className="empty-state-action">
                  <button
                    onClick={() => navigate('/manager/schedules/create')}
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