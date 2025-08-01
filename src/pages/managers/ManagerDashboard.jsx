import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import './ManagerDashboard.scss' 

export default function ManagerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet('manager/dashboard')
        setDashboardData(data)
        setError(null)
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Dashboard error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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
      {/* Header with animated title */}
      <div className="dashboard-header">
        <div className="dashboard-header-container">
         <div className="dashboard-header-content">
          <div className="dashboard-header-text">
            <h1 className="dashboard-title">Manager Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back, {user?.name || 'Manager'}!</p>
            </div>
            <button onClick={logout} className="btn btn-danger">Logout</button>
            </div>
            </div>
            </div>

      {/* Dashboard content - keeping your existing layout but with container class */}
      <div className="dashboard-container">
        <div className="dashboard-inner">
          
          {/* Basic Stats */}
          <div className="stats-grid">
            <div className="stat-card fade-in">
              <div className="stat-content">
                <div className="stat-icon-container">
                  <div className="stat-icon">
                    <div className="stat-icon-circle icon-1">
                      <span className="stat-icon-text">C</span>
                    </div>
                  </div>
                  <div className="stat-details">
                    <dl>
                      <dt className="stat-label">Total Clients</dt>
                      <dd className="stat-value">
                        {dashboardData?.basic_stats?.clients || 0}
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
                    <div className="stat-icon-circle icon-2">
                      <span className="stat-icon-text">👨‍⚕️</span>
                    </div>
                  </div>
                  <div className="stat-details">
                    <dl>
                      <dt className="stat-label">Active Carers</dt>
                      <dd className="stat-value">
                        {dashboardData?.basic_stats?.carers || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* This Week Stats */}
          <div className="performance-card">
            <div className="card-content">
              <h3 className="performance-title">
                This Week's Performance
              </h3>
              
              <div className="performance-grid">
                <div className="performance-item">
                  <div className="performance-value performance-value-primary">
                    {dashboardData?.this_week?.completion_rate || '0%'}
                  </div>
                  <div className="performance-label">Completion Rate</div>
                </div>
                
                <div className="performance-item">
                  <div className="performance-value performance-value-success">
                    {dashboardData?.this_week?.completed_visits || 0}
                  </div>
                  <div className="performance-label">Completed Visits</div>
                </div>
                
                <div className="performance-item">
                  <div className="performance-value performance-value-neutral">
                    {dashboardData?.this_week?.total_visits || 0}
                  </div>
                  <div className="performance-label">Total Visits</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions with flat-button style */}
          <div className="quick-actions-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="quick-actions-grid">
              <button 
                onClick={() => navigate('manager/clients')}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-primary">👥</div>
                <div className="quick-action-title">Manage Clients</div>
                <div className="quick-action-desc">View and edit client information</div>
              </button>
              
              <button 
                onClick={() => navigate('manager/carers')}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-success">👨‍⚕️</div>
                <div className="quick-action-title">Manage Carers</div>
                <div className="quick-action-desc">Add and assign carers</div>
              </button>
              
              <button 
                onClick={() => navigate('manager/families')}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-warning">👨‍👩‍👧‍👦</div>
                <div className="quick-action-title">Manage Families</div>
                <div className="quick-action-desc">Add and assign family members</div>
              </button>
              
              <button 
                onClick={() => navigate('manager/schedules')}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-accent">📅</div>
                <div className="quick-action-title">Schedules</div>
                <div className="quick-action-desc">Create and manage schedules</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}