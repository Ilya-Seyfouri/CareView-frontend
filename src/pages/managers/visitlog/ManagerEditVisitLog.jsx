import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet, apiPut } from '../../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/ManagerEditVisitLog.scss'

export default function ManagerEditVisitLog() {
  const { user, logout } = useAuth()
  const { client_id, visit_log_id } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    carer_name: '',
    carer_number: '',
    date: '',
    personal_care_completed: false,
    care_reminders_provided: '',
    toilet: false,
    changed_clothes: false,
    ate_food: '',
    notes: '',
    mood: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVisitLog = async () => {
      try {
        setIsLoading(true)
        const data = await apiGet(`/manager/client/${client_id}/visit-logs/${visit_log_id}`)
        
        const dateForInput = new Date(data.date).toISOString().slice(0, 16)
        
        setFormData({
          carer_name: data.carer_name || '',
          carer_number: data.carer_number || '',
          date: dateForInput,
          personal_care_completed: data.personal_care_completed || false,
          care_reminders_provided: data.care_reminders_provided || '',
          toilet: data.toilet || false,
          changed_clothes: data.changed_clothes || false,
          ate_food: data.ate_food || '',
          notes: data.notes || '',
          mood: data.mood || []
        })
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleMoodChange = (moodItem) => {
    setFormData(prev => ({
      ...prev,
      mood: prev.mood.includes(moodItem)
        ? prev.mood.filter(m => m !== moodItem)
        : [...prev.mood, moodItem]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      
      const visitLogData = {
        ...formData,
        date: new Date(formData.date)
      }
      
      await apiPut(`/manager/client/${client_id}/visit-log/${visit_log_id}`, visitLogData)
      
      toast.success('Visit log updated successfully!')
      navigate(`/manager/client/${client_id}/visit-logs/${visit_log_id}`)
      
    } catch (err) {
      toast.error(err.message || 'Failed to update visit log')
      console.error('Update visit log error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => navigate(`/manager/client/${client_id}/visit-logs/${visit_log_id}`)

  const moodOptions = ['Happy', 'Content', 'Anxious', 'Confused', 'Agitated', 'Sad', 'Calm', 'Cooperative']

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
            Back to Visit Log
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
                ← Back to Visit Log
              </button>
              <div>
                <h1 className="dashboard-title">Edit Visit Log</h1>
                <p className="dashboard-subtitle">Update visit log for Client {client_id}</p>
              </div>
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

      {/* Form */}
      <div className="form-container">
        <div className="form-inner">
          <div className="form-card">
            <form onSubmit={handleSubmit} className="form-content">
              
              {/* Carer Details */}
              <div className="form-group">
                <div className="form-field">
                  <label htmlFor="carer_name" className="form-label form-label-required">
                    Carer Name
                  </label>
                  <input
                    type="text"
                    name="carer_name"
                    id="carer_name"
                    required
                    value={formData.carer_name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="carer_number" className="form-label">
                    Carer Phone Number
                  </label>
                  <input
                    type="tel"
                    name="carer_number"
                    id="carer_number"
                    value={formData.carer_number}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="form-field">
                <label htmlFor="date" className="form-label form-label-required">
                  Visit Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Care Activities */}
              <div className="care-activities-section">
                <h3 className="section-title">Care Activities</h3>
                
                <div className="care-activities-grid">
                  <div className="checkbox-group">
                    <input
                      id="personal_care_completed"
                      name="personal_care_completed"
                      type="checkbox"
                      checked={formData.personal_care_completed}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="personal_care_completed" className="checkbox-label">
                      Personal care completed
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <input
                      id="toilet"
                      name="toilet"
                      type="checkbox"
                      checked={formData.toilet}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="toilet" className="checkbox-label">
                      Toilet assistance
                    </label>
                  </div>

                  <div className="checkbox-group">
                    <input
                      id="changed_clothes"
                      name="changed_clothes"
                      type="checkbox"
                      checked={formData.changed_clothes}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <label htmlFor="changed_clothes" className="checkbox-label">
                      Changed clothes
                    </label>
                  </div>
                </div>
              </div>

              {/* Care Reminders */}
              <div className="form-field">
                <label htmlFor="care_reminders_provided" className="form-label form-label-required">
                  Care Reminders Provided
                </label>
                <textarea
                  name="care_reminders_provided"
                  id="care_reminders_provided"
                  required
                  rows={3}
                  value={formData.care_reminders_provided}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>

              {/* Food Intake */}
              <div className="form-field">
                <label htmlFor="ate_food" className="form-label form-label-required">
                  Food Intake
                </label>
                <textarea
                  name="ate_food"
                  id="ate_food"
                  required
                  rows={2}
                  value={formData.ate_food}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>

              {/* Mood */}
              <div className="mood-section">
                <label className="form-label">
                  Client Mood
                </label>
                <div className="mood-grid">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => handleMoodChange(mood)}
                      className={`mood-button ${
                        formData.mood.includes(mood) ? 'mood-selected' : ''
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="form-field">
                <label htmlFor="notes" className="form-label form-label-required">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  required
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={goBack}
                  className="form-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`form-submit-btn ${isSubmitting ? 'btn-disabled' : ''}`}
                >
                  {isSubmitting ? 'Updating...' : 'Update Visit Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}