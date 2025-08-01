import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet, apiDelete } from '../../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/ManagerVisitLogDetail.scss'

export default function ManagerVisitLogDetail() {
  const { user, logout } = useAuth()
  const { client_id, visit_log_id } = useParams()
  const navigate = useNavigate()
  
  const [visitLog, setVisitLog] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchVisitLog = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`manager/client/${client_id}/visit-logs/${visit_log_id}`)
        setVisitLog(data)
        setError(null)
      } catch (err) {
        setError('Failed to load visit log details')
        console.error('Visit log fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVisitLog()
  }, [client_id, visit_log_id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this visit log? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      await apiDelete(`manager/client/${client_id}/visit-log/${visit_log_id}`)
      toast.success('Visit log deleted successfully')
      navigate(`/manager/client/${client_id}/visit-logs`)
    } catch (err) {
      toast.error('Failed to delete visit log')
      console.error('Delete error:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const goBack = () => navigate(`/manager/client/${client_id}/visit-logs`)
  const goToEdit = () => navigate(`/manager/client/${client_id}/visit-logs/${visit_log_id}/edit`)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading visit log...</p>
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
            Back to Visit Logs
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
                ← Back to Visit Logs
              </button>
              <div>
                <h1 className="dashboard-title">Visit Log Details</h1>
                <p className="dashboard-subtitle">Client {client_id} • {visitLog?.carer_name}</p>
              </div>
            </div>
            <div className="header-right">
              <button
                onClick={goToEdit}
                className="btn btn-primary"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`btn btn-danger ${isDeleting ? 'btn-disabled' : ''}`}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
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
          
          {/* Visit log details */}
          <div className="detail-card">
            <div className="card-content">
              
              {/* Header info */}
              <div className="detail-header-section">
                <div className="detail-header-top">
                  <h3 className="detail-id">
                    Visit Log ID: {visitLog?.id}
                  </h3>
                  <span className={`status-badge ${
                    visitLog?.personal_care_completed 
                      ? 'status-success'
                      : 'status-incomplete'
                  }`}>
                    {visitLog?.personal_care_completed ? 'Care Completed' : 'Care Incomplete'}
                  </span>
                </div>
                
                <div className="detail-basic-info">
                  <div className="info-item">
                    <span className="info-label">Date & Time:</span>
                    <p className="info-value">{formatDate(visitLog?.date)}</p>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Carer:</span>
                    <p className="info-value">{visitLog?.carer_name}</p>
                  </div>
                </div>
              </div>

              {/* Care details */}
              <div className="detail-sections">
                
                {/* Care reminders */}
                <div className="detail-section">
                  <label className="detail-label">
                    Care Reminders Provided
                  </label>
                  <p className="detail-content">
                    {visitLog?.care_reminders_provided}
                  </p>
                </div>

                {/* Care activities */}
                <div className="care-activities-grid">
                  <div className="activity-item">
                    <label className="activity-label">
                      Toilet Assistance
                    </label>
                    <span className={`activity-badge ${
                      visitLog?.toilet 
                        ? 'activity-provided'
                        : 'activity-not-provided'
                    }`}>
                      {visitLog?.toilet ? 'Provided' : 'Not provided'}
                    </span>
                  </div>

                  <div className="activity-item">
                    <label className="activity-label">
                      Changed Clothes
                    </label>
                    <span className={`activity-badge ${
                      visitLog?.changed_clothes 
                        ? 'activity-provided'
                        : 'activity-not-provided'
                    }`}>
                      {visitLog?.changed_clothes ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {/* Food intake */}
                <div className="detail-section">
                  <label className="detail-label">
                    Food Intake
                  </label>
                  <p className="detail-content">
                    {visitLog?.ate_food}
                  </p>
                </div>

                {/* Mood */}
                {visitLog?.mood && visitLog.mood.length > 0 && (
                  <div className="mood-section">
                    <label className="detail-label">
                      Mood
                    </label>
                    <div className="mood-tags">
                      {visitLog.mood.map((moodItem, index) => (
                        <span
                          key={index}
                          className="mood-tag"
                        >
                          {moodItem}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="detail-section">
                  <label className="detail-label">
                    Additional Notes
                  </label>
                  <p className="detail-content detail-content-preformatted">
                    {visitLog?.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}