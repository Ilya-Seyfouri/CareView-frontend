import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiGet, apiPut } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/FamilyProfile.scss'

export default function FamilyProfile() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const [family, setFamily] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet('family/me')
        setFamily(data)
        setEditData({
          id: data.id || '',
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
      
      await apiPut('family/me', editData)
      
      // Update local state
      setFamily({ ...family, ...editData })
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
      id: family.id || '',
      name: family.name || '',
      phone: family.phone || ''
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
    <div className="family-profile-page">
      {/* Header */}
      <div className="family-profile-header">
        <div className="family-profile-header-container">
          <div className="family-profile-header-content">
            <div className="header-left">
              <button
                onClick={() => navigate('/family/dashboard')}
                className="back-button"
              >
                ← Back to Dashboard
              </button>
              <div className="header-title-section">
                <h1 className="family-profile-title">My Profile</h1>
                <p className="family-profile-subtitle">View and update your information</p>
              </div>
            </div>
            <div className="header-right">
              {isEditing ? (
                <div className="edit-button-group">
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="btn btn-success"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="btn-spinner"></span>
                        Saving...
                      </>
                    ) : (
                      'Save'
                    )}
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
      <div className="family-profile-container">
        <div className="family-profile-inner">
          
          {/* Profile information card */}
          <div className="profile-info-card">
            <div className="card-content">
              <h3 className="card-title">
                Family Member Information
              </h3>
              
              <div className="profile-info-grid">
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
                  <p className="info-value">{family?.id}</p>
                  <p className="info-help-text">Family ID cannot be changed</p>
                </div>
                                
                <div className="info-field">
                  <label className="info-label">Email Address</label>
                  <p className="info-value">{family?.email}</p>
                  <p className="info-help-text">Email cannot be changed</p>
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
                    <p className="info-value">{family?.phone || 'Not provided'}</p>
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
                <div className="client-tags-container">
                  <label className="client-tags-label">
                    My Assigned Clients
                  </label>
                  <div className="client-tags-list">
                    {family.assigned_clients.map((clientId) => (
                      <span
                        key={clientId}
                        onClick={() => navigate(`/family/me/clients/${clientId}`)}
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
            <div className="action-cards-grid">
              
              <button
                onClick={() => navigate('/family/me/clients')}
                className="action-card"
              >
                <div className="action-card-content">
                  <div className="action-card-icon-container">
                    <div className="action-card-icon icon-primary">👥</div>
                  </div>
                  <div className="action-card-text">
                    <h4 className="action-card-title">My Loved Ones</h4>
                    <p className="action-card-desc">View client information</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/family/me/schedules')}
                className="action-card"
              >
                <div className="action-card-content">
                  <div className="action-card-icon-container">
                    <div className="action-card-icon icon-success">📅</div>
                  </div>
                  <div className="action-card-text">
                    <h4 className="action-card-title">Care Schedule</h4>
                    <p className="action-card-desc">View upcoming visits</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/family/dashboard')}
                className="action-card"
              >
                <div className="action-card-content">
                  <div className="action-card-icon-container">
                    <div className="action-card-icon icon-warning">🏠</div>
                  </div>
                  <div className="action-card-text">
                    <h4 className="action-card-title">Today's Care</h4>
                    <p className="action-card-desc">Back to main dashboard</p>
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