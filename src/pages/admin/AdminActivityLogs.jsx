import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import './styles/AdminActivityLogs.scss'

export default function AdminActivityLogs() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await apiGet('/admin/activity-logs')
        setLogs(data.logs || [])
      } catch (err) {
        console.error('Failed to load logs:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [])

  if (isLoading) {
    return <div className="admin-activity-page">Loading...</div>
  }

  return (
    <div className="admin-activity-page">
      <div className="admin-activity-header">
        <div className="admin-activity-nav">
          <button onClick={() => navigate('/admin/dashboard')}>
            ← Back to Dashboard
          </button>
          <h1>System Activity</h1>
        </div>
        <button onClick={logout} className="admin-activity-logout">
          Logout
        </button>
      </div>

      <div className="admin-activity-card">
        <h3>Recent Activity</h3>
        {logs.length > 0 ? (
          <div>
            {logs.map((log, index) => (
              <div key={index} className="admin-activity-item">
                <div className="admin-activity-info">
                  <strong>{log.action}</strong> {log.target} by {log.user}
                </div>
                <div className="admin-activity-time">
                  {log.time}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-activity-empty">
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  )
}
