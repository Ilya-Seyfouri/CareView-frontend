import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import './styles/CarerDashboard.scss'

export default function CarerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet('carer/dashboard')
        setDashboardData(data)
        setError(null)
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Carer dashboard error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state
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
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-container">
          <div className="dashboard-header-content">
            <div classname="title">
              <h1 className="dashboard-title">Carer Dashboard</h1>
              <p className="dashboard-subtitle">Welcome back, {user?.name || 'Carer'}!</p>
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

      {/* Dashboard content */}
      <div className="dashboard-container">
        <div className="dashboard-inner">
          
          <div className="stats-grid">
            <div className="stat-card fade-in">
              <div className="stat-content">
                <div className="stat-icon-container">
                  <div className="stat-icon">
                    <div className="stat-icon-circle icon-primary">
                      <span className="stat-icon-text">👥</span>
                    </div>
                  </div>
                  <div className="stat-details">
                    <dl>
                      <dt className="stat-label">Assigned Clients</dt>
                      <dd className="stat-value">
                        {dashboardData?.stats?.assigned_clients || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card fade-in" style={{animationDelay: '0.1s'}}>
              <div className="stat-content">
                <div className="stat-icon-container">
                  <div className="stat-icon">
                    <div className="stat-icon-circle icon-success">
                      <span className="stat-icon-text">📅</span>
                    </div>
                  </div>
                  <div className="stat-details">
                    <dl>
                      <dt className="stat-label">Today's Visits</dt>
                      <dd className="stat-value">
                        {dashboardData?.stats?.total_visits_today || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card fade-in" style={{animationDelay: '0.2s'}}>
              <div className="stat-content">
                <div className="stat-icon-container">
                  <div className="stat-icon">
                    <div className="stat-icon-circle icon-accent">
                      <span className="stat-icon-text">✅</span>
                    </div>
                  </div>
                  <div className="stat-details">
                    <dl>
                      <dt className="stat-label">Completed</dt>
                      <dd className="stat-value">
                        {dashboardData?.stats?.completed_visits || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card fade-in" style={{animationDelay: '0.3s'}}>
              <div className="stat-content">
                <div className="stat-icon-container">
                  <div className="stat-icon">
                    <div className="stat-icon-circle icon-warning">
                      <span className="stat-icon-text">⏰</span>
                    </div>
                  </div>
                  <div className="stat-details">
                    <dl>
                      <dt className="stat-label">Remaining</dt>
                      <dd className="stat-value">
                        {dashboardData?.stats?.remaining_visits || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="schedule-card">
            <div className="card-content">
              <h3 className="schedule-title">
                Today's Schedule
              </h3>
              
              {dashboardData?.today_schedules && dashboardData.today_schedules.length > 0 ? (
                <div className="schedule-list">
                  {dashboardData.today_schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      onClick={() => navigate(`/carer/me/schedules/${schedule.id}`)}
                      className="schedule-item"
                    >
                      <div className="schedule-item-content">
                        <div className="schedule-item-info">
                          <h4 className="schedule-item-title">
                            {schedule.client_name} (Room {schedule.client_id})
                          </h4>
                          <p className="schedule-item-time">
                            {schedule.start_time} - {schedule.end_time}
                          </p>
                        </div>
                        <span className={`status-badge ${
                          schedule.status === 'completed' 
                            ? 'status-completed'
                            : schedule.status === 'in_progress'
                            ? 'status-in-progress' 
                            : 'status-scheduled'
                        }`}>
                          {schedule.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="schedule-empty">No visits scheduled for today</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="quick-actions-grid">
              <button 
                onClick={() => navigate('/carer/me/clients')}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-primary">👥</div>
                <div className="quick-action-title">My Clients</div>
                <div className="quick-action-desc">View assigned clients</div>
              </button>
              
              <button 
                onClick={() => navigate('/carer/me/schedules')}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-success">📅</div>
                <div className="quick-action-title">My Schedule</div>
                <div className="quick-action-desc">View all upcoming visits</div>
              </button>
              
              <button 
                onClick={() => navigate('/carer/me')}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-accent">👤</div>
                <div className="quick-action-title">My Profile</div>
                <div className="quick-action-desc">View and update profile</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}