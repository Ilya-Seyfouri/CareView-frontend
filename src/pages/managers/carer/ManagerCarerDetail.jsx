import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet, apiDelete, apiPut } from '../../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/ManagerCarerDetail.scss'

export default function ManagerCarerDetail() {
  const { user, logout } = useAuth()
  const { email } = useParams()
  const navigate = useNavigate()
  
  // State setup
  const [carer, setCarer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch carer data
  useEffect(() => {
    const fetchCarer = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`/manager/carer/${email}`)
        setCarer(data)
        setEditData({
          name: data.name || '',
          phone: data.phone || ''
        })
        setError(null)
      } catch (err) {
        setError('Failed to load carer details')
        console.error('Carer fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCarer()
  }, [email])

  // Navigation handlers
  const goBack = () => navigate('/manager/carers')
  const handleViewSchedules = () => navigate(`/manager/carer/${email}/schedules`)
  const handleManageAssignments = () => navigate(`/manager/carer/${email}/assignments`)
  const handleClientClick = (clientId) => navigate(`/manager/client/${clientId}`)

  // Delete handler
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete carer ${carer?.name}? This action cannot be undone.`)) {
      return
    }

    try {
      setIsDeleting(true)
      await apiDelete(`/manager/carer/${email}`)
      toast.success('Carer deleted successfully')
      navigate('/manager/carers')
    } catch (err) {
      toast.error('Failed to delete carer')
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
      await apiPut(`/manager/carer/${email}`, editData)
      
      setCarer({ ...carer, ...editData })
      setIsEditing(false)
      toast.success('Carer updated successfully!')
    } catch (err) {
      toast.error('Failed to update carer')
      console.error('Update error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      name: carer.name || '',
      phone: carer.phone || ''
    })
    setIsEditing(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading carer details...</p>
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
            Back to Carers
          </button>
        </div>
      </div>
    )
  }
return (
  <div className="carer-detail-page">
    {/* Header */}
    <div className="carer-detail-header">
      <div className="carer-detail-header-container">
        <div className="carer-detail-header-content">
          <div className="header-left">
            <button onClick={goBack} className="back-button">
              ← Back to Carers
            </button>
          </div>
          
          <div className="header-title-section">
            <h1 className="carer-detail-title">{carer?.name}</h1>
            <p className="carer-detail-subtitle">Carer Details</p>
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
                  Edit Carer
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn btn-danger"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Carer'}
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
      <div className="carer-detail-container">
        <div className="carer-detail-inner">
          
          {/* Carer information card */}
          <div className="carer-info-card">
            <div className="card-content">
              <h3 className="card-title">Carer Information</h3>
              
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
                    <p className="info-value">{carer?.name}</p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Email Address</label>
                  <p className="info-value">{carer?.email}</p>
                </div>
                
                <div className="info-field">
                  <label className="info-label">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">{carer?.phone}</p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Assigned Clients</label>
                  <p className="info-value">
                    {carer?.assigned_clients?.length || 0} clients assigned
                  </p>
                </div>
              </div>
              
              {/* Assigned clients list */}
              {carer?.assigned_clients && carer.assigned_clients.length > 0 && (
                <div className="client-tags-container">
                  <label className="client-tags-label">
                    Assigned Client IDs
                  </label>
                  <div className="client-tags-list">
                    {carer.assigned_clients.map((clientId) => (
                      <span
                        key={clientId}
                        onClick={() => handleClientClick(clientId)}
                        className="client-tag"
                      >
                        {clientId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="quick-actions-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="action-buttons-grid">
              <button onClick={handleViewSchedules} className="action-button">
                <div className="action-button-content">
                  <div className="action-button-icon-container">
                    <div className="action-button-icon icon-primary">📅</div>
                  </div>
                  <div className="action-button-text">
                    <h4 className="action-button-title">View Schedules</h4>
                    <p className="action-button-desc">See carer's schedule</p>
                  </div>
                </div>
              </button>

              <button onClick={handleManageAssignments} className="action-button">
                <div className="action-button-content">
                  <div className="action-button-icon-container">
                    <div className="action-button-icon icon-success">👥</div>
                  </div>
                  <div className="action-button-text">
                    <h4 className="action-button-title">Manage Assignments</h4>
                    <p className="action-button-desc">Assign/unassign clients</p>
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