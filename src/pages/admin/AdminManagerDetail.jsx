import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet, apiDelete, apiPut } from '../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/AdminManagerDetail.scss'


export default function AdminManagerDetail() {
  const { user, logout } = useAuth()
  const { email } = useParams()
  const navigate = useNavigate()
  
  // State setup
  const [manager, setManager] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch manager data
  useEffect(() => {
    const fetchManager = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`/admin/managers/${email}`)
        setManager(data)
        setEditData({
          name: data.name || '',
          department: data.department || ''
        })
        setError(null)
      } catch (err) {
        setError('Failed to load manager details')
        console.error('Manager fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchManager()
  }, [email])

  // Navigation handlers
  const goBack = () => navigate('/admin/managers')

  // Delete handler
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete manager ${manager?.name}? This action cannot be undone.`)) {
      return
    }

    try {
      setIsDeleting(true)
      await apiDelete(`/admin/managers/${email}`)
      toast.success('Manager deleted successfully')
      navigate('/admin/managers')
    } catch (err) {
      toast.error('Failed to delete manager')
      console.error('Delete error:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  // Edit handlers
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      await apiPut(`/admin/managers/${email}`, editData)
      
      setManager({ ...manager, ...editData })
      setIsEditing(false)
      toast.success('Manager updated successfully!')
    } catch (err) {
      toast.error('Failed to update manager')
      console.error('Update error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      name: manager.name || '',
      department: manager.department || ''
    })
    setIsEditing(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading manager details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button onClick={goBack} className="btn btn-primary">
            Back to Managers
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="manager-detail-page">
      {/* Header */}
      <div className="manager-detail-header">
        <div className="manager-detail-header-container">
          <div className="manager-detail-header-content">
            <div className="header-left">
              <button onClick={goBack} className="back-button">
                ← Back to Managers
              </button>
            </div>
            
            <div className="header-title-section">
              <h1 className="manager-detail-title">{manager?.name}</h1>
              <p className="manager-detail-subtitle">Manager Details</p>
            </div>
            
            <div className="header-right">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="btn btn-success"
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={handleCancel} className="btn btn-secondary">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                  >
                    Edit Manager
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="btn btn-danger"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Manager'}
                  </button>
                </>
              )}
              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="manager-detail-container">
        <div className="manager-detail-inner">
          
          {/* Manager information card */}
          <div className="manager-info-card">
            <div className="card-content">
              <h3 className="card-title">Manager Information</h3>
              
              <div className="info-grid">
                <div className="info-field">
                  <label className="info-label">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">{manager?.name}</p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Email Address</label>
                  <p className="info-value">{manager?.email}</p>
                </div>
                
                <div className="info-field">
                  <label className="info-label">Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={editData.department}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">{manager?.department}</p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Role</label>
                  <p className="info-value">
                    <span className="role-badge">Manager</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="quick-actions-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="action-buttons-grid">
              <button 
                onClick={() => navigate('/admin/carers')} 
                className="action-button"
              >
                <div className="action-button-content">
                  <div className="action-button-icon-container">
                    <div className="action-button-icon icon-primary">👥</div>
                  </div>
                  <div className="action-button-text">
                    <h4 className="action-button-title">View All Carers</h4>
                    <p className="action-button-desc">Manage system carers</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => navigate('/admin/dashboard')} 
                className="action-button"
              >
                <div className="action-button-content">
                  <div className="action-button-icon-container">
                    <div className="action-button-icon icon-success">📊</div>
                  </div>
                  <div className="action-button-text">
                    <h4 className="action-button-title">Admin Dashboard</h4>
                    <p className="action-button-desc">View system overview</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => navigate('/admin/stats')} 
                className="action-button"
              >
                <div className="action-button-content">
                  <div className="action-button-icon-container">
                    <div className="action-button-icon icon-warning">📈</div>
                  </div>
                  <div className="action-button-text">
                    <h4 className="action-button-title">System Stats</h4>
                    <p className="action-button-desc">View detailed statistics</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}