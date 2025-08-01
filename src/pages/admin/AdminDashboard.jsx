import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import './styles/AdminDashboard.scss'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // State variables
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet('/admin/dashboard')
        setDashboardData(data)
        setError(null)
      } catch (err) {
        setError('Failed to load admin dashboard')
        console.error('Dashboard error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading system dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="admin-error">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-retry"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-container">
          <div className="admin-header-content">
            <div>
              <h1 className="admin-title">System Administration</h1>
              <p className="admin-subtitle">CareView System Overview</p>
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
      <div className="admin-container">
        
        {/* System Statistics Grid */}
        <div className="admin-stats-grid">
          
          {/* Managers */}
          <div className="admin-stat-card">
            <div className="stat-icon-wrapper">
              <div className="stat-icon-circle icon-blue">
                <span className="text-white text-sm font-bold">👨‍💼</span>
              </div>
              <div className="stat-details">
                <dt className="stat-label">Managers</dt>
                <dd className="stat-value">
                  {dashboardData?.system_stats?.managers || 0}
                </dd>
              </div>
            </div>
          </div>

          {/* Carers */}
          <div className="admin-stat-card">
            <div className="stat-icon-wrapper">
              <div className="stat-icon-circle icon-green">
                <span className="text-white text-sm font-bold">👩‍⚕️</span>
              </div>
              <div className="stat-details">
                <dt className="stat-label">Carers</dt>
                <dd className="stat-value">
                  {dashboardData?.system_stats?.carers || 0}
                </dd>
              </div>
            </div>
          </div>

          {/* Families */}
          <div className="admin-stat-card">
            <div className="stat-icon-wrapper">
              <div className="stat-icon-circle icon-purple">
                <span className="text-white text-sm font-bold">👨‍👩‍👧‍👦</span>
              </div>
              <div className="stat-details">
                <dt className="stat-label">Families</dt>
                <dd className="stat-value">
                  {dashboardData?.system_stats?.families || 0}
                </dd>
              </div>
            </div>
          </div>

          {/* Clients */}
          <div className="admin-stat-card">
            <div className="stat-icon-wrapper">
              <div className="stat-icon-circle icon-orange">
                <span className="text-white text-sm font-bold">🏠</span>
              </div>
              <div className="stat-details">
                <dt className="stat-label">Clients</dt>
                <dd className="stat-value">
                  {dashboardData?.system_stats?.clients || 0}
                </dd>
              </div>
            </div>
          </div>

          {/* Schedules */}
          <div className="admin-stat-card">
            <div className="stat-icon-wrapper">
              <div className="stat-icon-circle icon-indigo">
                <span className="text-white text-sm font-bold">📅</span>
              </div>
              <div className="stat-details">
                <dt className="stat-label">Schedules</dt>
                <dd className="stat-value">
                  {dashboardData?.system_stats?.schedules || 0}
                </dd>
              </div>
            </div>
          </div>

          {/* Visit Logs */}
          <div className="admin-stat-card">
            <div className="stat-icon-wrapper">
              <div className="stat-icon-circle icon-red">
                <span className="text-white text-sm font-bold">📝</span>
              </div>
              <div className="stat-details">
                <dt className="stat-label">Visit Logs</dt>
                <dd className="stat-value">
                  {dashboardData?.system_stats?.visit_logs || 0}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="system-health-card">
          <h3 className="system-health-title">System Health</h3>
          
          <div className="health-grid">
            <div className="health-status health-operational">
              <div className="health-icon">
                <span>✓</span>
              </div>
              <div className="health-details">
                <h4>System Status</h4>
                <p>All systems operational</p>
              </div>
            </div>
            
            <div className="health-status health-sync">
              <div className="health-icon">
                <span>🔄</span>
              </div>
              <div className="health-details">
                <h4>Data Sync</h4>
                <p>Last updated: Just now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Administrative Actions */}
        <div className="admin-actions-section">
          <h3 className="admin-actions-title">Administrative Actions</h3>
          <div className="admin-actions-grid">
            
            {/* Manager Management */}
            <button 
              onClick={() => navigate('/admin/managers')}
              className="admin-action-card admin-action-primary"
            >
              <div className="action-card-title">Manager Management</div>
              <div className="action-card-description">
                Create, edit, delete, and manage all system managers.
              </div>
            </button>

            {/* System Activity */}
            <button 
              onClick={() => navigate('/admin/activity-logs')}
              className="admin-action-card admin-action-secondary"
            >
              <div className="action-card-title">System Activity</div>
              <div className="action-card-description">
                View recent user actions and system logs.
              </div>
            </button>
            
          </div>
        </div>
      </div>
    </div>
  )
}