import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet, apiDelete, apiPut } from '../../../utils/api'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/ManagerScheduleDetail.scss'

export default function ManagerScheduleDetail() {
  const { logout } = useAuth()
  const { schedule_id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [schedule, setSchedule] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`manager/schedules/${schedule_id}`)
        setSchedule(data)
        setEditData({
          carer_email: data.carer_email || '',
          client_id: data.client_id || '',
          date: data.date || '',
          start_time: data.start_time || '',
          end_time: data.end_time || '',
          shift_type: data.shift_type || '',
          status: data.status || '',
          notes: data.notes || ''
        })
        setError(null)
      } catch (err) {
        setError('Failed to load schedule details')
        console.error('Schedule fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchedule()
  }, [schedule_id])

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      
      console.log('Updating schedule with data:', editData)
      
      await apiPut(`manager/schedules/${schedule_id}`, editData)
      
      setSchedule({ ...schedule, ...editData })
      setIsEditing(false)
      toast.success('Schedule updated successfully!')
    } catch (err) {
      console.error('Update error:', err)
      toast.error('Failed to update schedule')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setEditData({
      carer_email: schedule.carer_email || '',
      client_id: schedule.client_id || '',
      date: schedule.date || '',
      start_time: schedule.start_time || '',
      end_time: schedule.end_time || '',
      shift_type: schedule.shift_type || '',
      status: schedule.status || '',
      notes: schedule.notes || ''
    })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this schedule? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)
      await apiDelete(`manager/schedules/${schedule_id}`)
      toast.success('Schedule deleted successfully')
      
      goBack()
    } catch (err) {
      toast.error('Failed to delete schedule')
      console.error('Delete error:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const goBack = () => {
  if (location.state?.from) {
    navigate(location.state.from)
  } else {
    if (schedule?.client_id) {
      navigate('/manager/schedules')
    } else {
      navigate('/manager/schedules')
    }
  }
}

  const getStatusClass = (status) => {
    const statusMap = {
      scheduled: 'status-scheduled',
      in_progress: 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    }
    return statusMap[status] || 'status-scheduled'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading schedule details...</p>
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
            Back to Schedules
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
                ← Back to Schedules
              </button>
              <div>
                <h1 className="dashboard-title">Schedule Details</h1>
                <p className="dashboard-subtitle">Schedule ID: {schedule?.id}</p>
              </div>
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
                    Edit Schedule
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className={`btn btn-danger ${isDeleting ? 'btn-disabled' : ''}`}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
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
          
          {/* Schedule details */}
          <div className="detail-card">
            <div className="card-content">
              
              {/* Header info */}
              <div className="detail-header-section">
                <div className="detail-header-top">
                  <h3 className="card-title">
                    Schedule Information
                  </h3>
                  <span className={`status-badge ${getStatusClass(schedule?.status)}`}>
                    {schedule?.status?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Schedule details */}
              <div className="info-grid">
                
                <div className="info-field">
                  <label className="info-label">Carer Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="carer_email"
                      value={editData.carer_email}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">{schedule?.carer_email}</p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Client ID</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="client_id"
                      value={editData.client_id}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">
                      <button
                        onClick={() => navigate(`/manager/client/${schedule?.client_id}`)}
                        className="client-link"
                      >
                        {schedule?.client_id}
                      </button>
                    </p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="date"
                      value={editData.date}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="info-value">{formatDate(schedule?.date)}</p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Time Range</label>
                  {isEditing ? (
                    <div className="time-range-inputs">
                      <input
                        type="time"
                        name="start_time"
                        value={editData.start_time}
                        onChange={handleEditChange}
                        className="form-input"
                      />
                      <input
                        type="time"
                        name="end_time"
                        value={editData.end_time}
                        onChange={handleEditChange}
                        className="form-input"
                      />
                    </div>
                  ) : (
                    <p className="info-value">
                      {schedule?.start_time} - {schedule?.end_time}
                    </p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Shift Type</label>
                  {isEditing ? (
                    <select
                      name="shift_type"
                      value={editData.shift_type}
                      onChange={handleEditChange}
                      className="form-select"
                    >
                      <option value="Morning Care">Morning Care</option>
                      <option value="Afternoon Care">Afternoon Care</option>
                      <option value="Evening Care">Evening Care</option>
                      <option value="Overnight Care">Overnight Care</option>
                      <option value="Medication Assistance">Medication Assistance</option>
                      <option value="Personal Care">Personal Care</option>
                      <option value="Companionship">Companionship</option>
                    </select>
                  ) : (
                    <p className="info-value">{schedule?.shift_type}</p>
                  )}
                </div>
                
                <div className="info-field">
                  <label className="info-label">Status</label>
                  {isEditing ? (
                    <select
                      name="status"
                      value={editData.status}
                      onChange={handleEditChange}
                      className="form-select"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <p className="info-value">{schedule?.status?.replace('_', ' ')}</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="notes-section">
                <label className="info-label">
                  Notes
                </label>
                {isEditing ? (
                  <textarea
                    name="notes"
                    value={editData.notes}
                    onChange={handleEditChange}
                    rows={3}
                    className="form-textarea"
                  />
                ) : (
                  <p className="info-value-multiline">
                    {schedule?.notes || 'No notes'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}