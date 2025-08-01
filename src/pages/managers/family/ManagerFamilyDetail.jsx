import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet, apiDelete, apiPut } from '../../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/ManagerFamilyDetail.scss'

export default function ManagerFamilyDetail() {
  const { user, logout } = useAuth()
  const { email } = useParams()
  const navigate = useNavigate()
  
  const [family, setFamily] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchFamily = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`/manager/family/${email}`)
        setFamily(data)
        setEditData({
          id: data.id || '',
          name: data.name || '',
          phone: data.phone || ''
        })
        setError(null)
      } catch (err) {
        setError('Failed to load family member details')
        console.error('Family fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFamily()
  }, [email])

  const goBack = () => navigate('/manager/families')

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete family member ${family?.name}? This action cannot be undone.`)) {
      return
    }

    try {
      setIsDeleting(true)
      await apiDelete(`/manager/family/${email}`)
      toast.success('Family member deleted successfully')
      navigate('/manager/families')
    } catch (err) {
      toast.error('Failed to delete family member')
      console.error('Delete error:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      await apiPut(`/manager/family/${email}`, editData)
      
      setFamily({ ...family, ...editData })
      setIsEditing(false)
      toast.success('Family member updated successfully!')
    } catch (err) {
      toast.error('Failed to update family member')
      console.error('Update error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      id: family.id || '',
      name: family.name || '',
      phone: family.phone || ''
    })
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading family member details...</p>
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
            Back to Families
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
                ← Back to Families
              </button>
              </div>
              <div>
                <h1 className="dashboard-title">{family?.name}</h1>
                <p className="dashboard-subtitle">Family Member Details</p>
            </div>
            <div className="header-right">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className={`btn btn-success ${isSubmitting ? 'btn-disabled' : ''}`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                  >
                    Edit Family Member
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`btn btn-danger ${isDeleting ? 'btn-disabled' : ''}`}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Family Member'}
                  </button>
                </>
              )}
              <button
                onClick={logout}
                className="btn btn-secondary"
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
          
          {/* Family information card */}
          <div className="info-card">
            <div className="card-content">
              <h3 className="card-title">
                Family Member Information
              </h3>
              
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
                    <p className="info-value">{family?.name}</p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Family ID</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="id"
                      value={editData.id}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">{family?.id}</p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Email Address</label>
                  <p className="info-value">{family?.email}</p>
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
                    <p className="info-value">{family?.phone}</p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Assigned Clients</label>
                  <p className="info-value">
                    {family?.assigned_clients?.length || 0} clients assigned
                  </p>
                </div>
              </div>
              
              {/* Assigned clients list */}
              {family?.assigned_clients && family.assigned_clients.length > 0 && (
                <div className="client-tags-section">
                  <label className="info-label">Assigned Client IDs</label>
                  <div className="client-tags">
                    {family.assigned_clients.map((clientId) => (
                      <button
                        key={clientId}
                        onClick={() => navigate(`/manager/client/${clientId}`)}
                        className="client-tag"
                      >
                        {clientId}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="quick-actions-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="quick-actions-grid">

              <button
                onClick={() => navigate(`/manager/family/${email}/schedules`)}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-accent">
                  <span className="quick-action-icon-text">📅</span>
                </div>
                <div className="quick-action-title">View Schedules</div>
                <div className="quick-action-desc">See family schedules</div>
              </button>

              <button
                onClick={() => navigate(`/manager/family/${email}/assignments`)}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-warning">
                  <span className="quick-action-icon-text">👥</span>
                </div>
                <div className="quick-action-title">Manage Assignments</div>
                <div className="quick-action-desc">Assign/unassign clients</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}