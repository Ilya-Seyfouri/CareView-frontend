import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet, apiPut } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/CarerProfile.scss'

export default function CarerProfile() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const [carer, setCarer] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Inline editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet('carer/me')
        setCarer(data)
        setEditData({
          name: data.name || '',
          phone: data.phone || ''
        })
        setError(null)
      } catch (err) {
        setError('Failed to load profile')
        console.error('Profile fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Handle inline editing
  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      
      console.log('Updating profile with data:', editData)
      
      await apiPut('carer/me', editData)
      
      // Update local state
      setCarer({ ...carer, ...editData })
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (err) {
      console.error('Update error:', err)
      toast.error('Failed to update profile')
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
          <p className="loading-text">Loading profile...</p>
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
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-container">
          <div className="profile-header-content">
            <div className="profile-header-left">
              <button
                onClick={() => navigate('/carer/dashboard')}
                className="back-button"
              >
                ← Back to Dashboard
              </button>
              <div className="profile-header-info">
                <h1 className="profile-title">My Profile</h1>
                <p className="profile-subtitle">View and update your information</p>
              </div>
            </div>
            <div className="profile-header-actions">
              {isEditing ? (
                <div className="edit-actions">
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="btn btn-success"
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Profile
                </button>
              )}
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
      <div className="profile-container">
        <div className="profile-inner">
          
          {/* Profile information card */}
          <div className="profile-info-card">
            <div className="card-content">
              <h3 className="card-title">
                Profile Information
              </h3>
              
              <div className="profile-form-grid">
                <div className="form-field">
                  <label className="field-label">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="field-value">{carer?.name}</p>
                  )}
                </div>
                
                <div className="form-field">
                  <label className="field-label">Email Address</label>
                  <p className="field-value">{carer?.email}</p>
                  <p className="field-note">Email cannot be changed</p>
                </div>
                
                <div className="form-field">
                  <label className="field-label">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="field-value">{carer?.phone || 'Not provided'}</p>
                  )}
                </div>
                
                <div className="form-field">
                  <label className="field-label">Assigned Clients</label>
                  <p className="field-value">
                    {carer?.assigned_clients?.length || 0} clients assigned
                  </p>
                </div>
              </div>
              
              {/* Assigned clients list */}
              {carer?.assigned_clients && carer.assigned_clients.length > 0 && (
                <div className="clients-section">
                  <label className="field-label">
                    My Assigned Clients
                  </label>
                  <div className="clients-list">
                    {carer.assigned_clients.map((clientId) => (
                      <span
                        key={clientId}
                        onClick={() => navigate(`/carer/me/clients/${clientId}`)}
                        className="client-badge"
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
            <div className="profile-actions-grid">
              
              <button
                onClick={() => navigate('/carer/me/clients')}
                className="action-card"
              >
                <div className="action-card-content">
                  <div className="action-icon-container">
                    <div className="action-icon icon-primary">
                      <span className="action-icon-text">👥</span>
                    </div>
                  </div>
                  <div className="action-info">
                    <h4 className="action-title">My Clients</h4>
                    <p className="action-description">View assigned clients</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/carer/me/schedules')}
                className="action-card"
              >
                <div className="action-card-content">
                  <div className="action-icon-container">
                    <div className="action-icon icon-success">
                      <span className="action-icon-text">📅</span>
                    </div>
                  </div>
                  <div className="action-info">
                    <h4 className="action-title">My Schedule</h4>
                    <p className="action-description">View upcoming visits</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/carer/dashboard')}
                className="action-card"
              >
                <div className="action-card-content">
                  <div className="action-icon-container">
                    <div className="action-icon icon-accent">
                      <span className="action-icon-text">🏠</span>
                    </div>
                  </div>
                  <div className="action-info">
                    <h4 className="action-title">Dashboard</h4>
                    <p className="action-description">Back to main dashboard</p>
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