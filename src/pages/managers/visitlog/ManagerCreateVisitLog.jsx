import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiPost } from '../../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/ManagerCreateVisitLog.scss'

export default function ManagerCreateVisitLog() {
  const { logout } = useAuth()
  const { client_id } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    carer_name: '',
    carer_number: '',
    date: new Date().toISOString().slice(0, 16), // datetime-local format
    personal_care_completed: false,
    care_reminders_provided: '',
    toilet: false,
    changed_clothes: false,
    ate_food: '',
    notes: '',
    mood: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        carer_name: formData.carer_name,
        carer_number: formData.carer_number || null,
        date: formData.date,
        personal_care_completed: formData.personal_care_completed,
        care_reminders_provided: formData.care_reminders_provided,
        toilet: formData.toilet,
        changed_clothes: formData.changed_clothes,
        ate_food: formData.ate_food,
        notes: formData.notes,
        mood: formData.mood
      }
      
      console.log('Sending visit log data:', visitLogData)
      
      await apiPost(`manager/client/${client_id}/visit-log`, visitLogData)
      
      toast.success('Visit log created successfully!')
      navigate(`/manager/client/${client_id}`)
      
    } catch (err) {
      console.error('Full API Error:', err)
      console.error('Error message:', err.message)
      toast.error(err.message || 'Failed to create visit log')
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => navigate(`/manager/client/${client_id}`)

  const moodOptions = ['Happy', 'Content', 'Anxious', 'Confused', 'Agitated', 'Sad', 'Calm', 'Cooperative']

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
                ← Back to Client
              </button>
              <div>
                <h1 className="dashboard-title">Create Visit Log</h1>
                <p className="dashboard-subtitle">Add new visit log for Client {client_id}</p>
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
                    placeholder="Enter carer's name"
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
                    placeholder="e.g. +44 7123 456789"
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

              {/* Care Activities Checkboxes */}
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
                  placeholder="Describe care reminders given to the client..."
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
                  placeholder="What did the client eat and drink..."
                />
              </div>

              {/* Mood Selection */}
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
                  placeholder="Any additional observations or notes about the visit..."
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
                  {isSubmitting ? 'Creating...' : 'Create Visit Log'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}