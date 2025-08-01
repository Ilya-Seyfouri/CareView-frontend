import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet, apiPut, apiDelete } from '../../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/ManagerClientDetail.scss'

export default function ManagerClientDetail() {
  const { user, logout } = useAuth()
  const { client_id } = useParams()
  const navigate = useNavigate()
  
  // State setup
  const [client, setClient] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch client data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`/manager/client/${client_id}`)
        setClient(data)
        setEditData({
          name: data.name || '',
          age: data.age || '',
          room: data.room || '',
          date_of_birth: data.date_of_birth || '',
          support_needs: data.support_needs || ''
        })
        setError(null)
      } catch (err) {
        setError('Failed to load client details')
        console.error('Client fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClient()
  }, [client_id])

  // Navigation helpers
  const goBack = () => navigate('/manager/clients')
  const goToVisitLogs = () => navigate(`/manager/client/${client_id}/visit-logs`)
  const goToTeam = () => navigate(`/manager/client/${client_id}/team`)

  // Handle inline editing
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      const updatePayload = {
        ...editData,
        age: parseInt(editData.age)
      }
      await apiPut(`/manager/client/${client_id}`, updatePayload)
      
      setClient({ ...client, ...updatePayload })
      setIsEditing(false)
      toast.success('Client updated successfully!')
    } catch (err) {
      toast.error('Failed to update client')
      console.error('Update error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      name: client.name || '',
      age: client.age || '',
      room: client.room || '',
      date_of_birth: client.date_of_birth || '',
      support_needs: client.support_needs || ''
    })
    setIsEditing(false)
  }

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete client ${client?.name}? This action cannot be undone.`)) {
      return
    }

    try {
      setIsDeleting(true)
      await apiDelete(`/manager/client/${client_id}`)
      toast.success('Client deleted successfully')
      navigate('/manager/clients')
    } catch (err) {
      toast.error('Failed to delete client')
      console.error('Delete error:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading client details...</p>
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
            Back to Clients
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
        <button onClick={goBack} className="btn btn-back">
          ← Back to Clients
        </button>
      </div>
      
      <div className="header-title-section">
        <h2 className="dashboard-title">{client?.name}</h2>
        <p className="dashboard-subtitle">Client Details</p>
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
              Edit Client
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`btn btn-danger ${isDeleting ? 'btn-disabled' : ''}`}
            >
              {isDeleting ? 'Deleting...' : 'Delete Client'}
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
      <div className="dashboard-container">
        <div className="dashboard-inner">
          
          {/* Client information card */}
          <div className="info-card">
            <div className="card-content">
              <h3 className="card-title">Client Information</h3>
              
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
                    <p className="info-value">{client?.name}</p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Client ID</label>
                  <p className="info-value">{client?.id}</p>
                </div>
                
                <div className="info-field">
                  <label className="info-label">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={editData.age}
                      onChange={handleEditChange}
                      min="18"
                      max="120"
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">{client?.age} years old</p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Room</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="room"
                      value={editData.room}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">Room {client?.room}</p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="date_of_birth"
                      value={editData.date_of_birth}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">{client?.date_of_birth}</p>
                  )}
                </div>
              </div>
              
              <div className="support-needs-section">
                <label className="info-label">Support Needs</label>
                {isEditing ? (
                  <textarea
                    name="support_needs"
                    value={editData.support_needs}
                    onChange={handleEditChange}
                    rows={4}
                    className="form-textarea"
                  />
                ) : (
                  <p className="info-value-multiline">{client?.support_needs}</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="quick-actions-section">
            <h3 className="section-title">Quick Actions</h3>
            <div className="quick-actions-grid">
              
              <button onClick={goToVisitLogs} className="quick-action-card">
                <div className="quick-action-icon icon-primary">
                  <span className="quick-action-icon-text">📝</span>
                </div>
                <div className="quick-action-title">Visit Logs</div>
                <div className="quick-action-desc">View care visit history</div>
              </button>

              <button
                onClick={() => navigate(`/manager/client/${client_id}/visit-log/create`)}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-success">
                  <span className="quick-action-icon-text">+</span>
                </div>
                <div className="quick-action-title">Create Visit Log</div>
                <div className="quick-action-desc">Add new visit log</div>
              </button>

              <button onClick={goToTeam} className="quick-action-card">
                <div className="quick-action-icon icon-warning">
                  <span className="quick-action-icon-text">👥</span>
                </div>
                <div className="quick-action-title">Care Team</div>
                <div className="quick-action-desc">Manage assigned carers & family</div>
              </button>

              <button
                onClick={() => navigate(`/manager/client/${client_id}/schedules`)}
                className="quick-action-card"
              >
                <div className="quick-action-icon icon-accent">
                  <span className="quick-action-icon-text">📅</span>
                </div>
                <div className="quick-action-title">View Schedules</div>
                <div className="quick-action-desc">See client's schedules</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}