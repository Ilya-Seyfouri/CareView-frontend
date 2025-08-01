import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiPost } from '../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/CarerCreateVisitLog.scss'

export default function CarerCreateVisitLog() {
  const { user, logout } = useAuth()
  const { client_id } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    carer_name: user?.name || '',
    carer_number: user?.phone || '',
    date: new Date().toISOString().slice(0, 16), // Current datetime
    personal_care_completed: false,
    care_reminders_provided: '',
    toilet: false,
    changed_clothes: false,
    ate_food: '',
    notes: '',
    mood: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simple form handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Simple mood handler
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
      
      console.log('Creating visit log with data:', formData)
      
      await apiPost(`/carer/me/clients/${client_id}/visit-log`, formData)
      
      toast.success('Visit log created successfully!')
      navigate(`/carer/me/clients/${client_id}`)
      
    } catch (err) {
      console.error('Create visit log error:', err)
      toast.error(err.message || 'Failed to create visit log')
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => navigate(`/carer/me/clients/${client_id}`)

  const moodOptions = ['Happy', 'Content', 'Anxious', 'Confused', 'Agitated', 'Sad', 'Calm', 'Cooperative']

  return (
    <div className="create-visit-log-page">
      {/* Header */}
      <div className="create-visit-log-header">
        <div className="create-visit-log-header-container">
          <div className="create-visit-log-header-content">
            <div className="header-left">
              <button
                onClick={goBack}
                className="back-button"
              >
                ← Back to Client
              </button>
              <div className="header-title-section">
                <h1 className="create-visit-log-title">Log Visit</h1>
                <p className="create-visit-log-subtitle">Record care visit for Client {client_id}</p>
              </div>
            </div>
            <div className="header-right">
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

      {/* Form */}
      <div className="create-visit-log-container">
        <div className="create-visit-log-inner">
          <div className="visit-log-form-card">
            <form onSubmit={handleSubmit} className="visit-log-form">
              
              {/* Auto-filled Carer Details */}
              <div className="carer-info-section">
                <h3 className="carer-info-title">Carer Information (Auto-filled)</h3>
                <div className="carer-info-grid">
                  <div className="carer-info-item">
                    <label className="carer-info-label">Your Name</label>
                    <p className="carer-info-value">{formData.carer_name}</p>
                  </div>
                  <div className="carer-info-item">
                    <label className="carer-info-label">Your Phone</label>
                    <p className="carer-info-value">{formData.carer_number || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Visit Date & Time */}
              <div className="form-field">
                <label htmlFor="date" className="form-label">
                  Visit Date & Time *
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
              <div className="form-section">
                <h3 className="form-section-title">Care Activities</h3>
                
                <div className="care-activities-grid">
                  <div className="checkbox-field">
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

                  <div className="checkbox-field">
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

                  <div className="checkbox-field">
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
                <label htmlFor="care_reminders_provided" className="form-label">
                  Care Reminders Provided *
                </label>
                <textarea
                  name="care_reminders_provided"
                  id="care_reminders_provided"
                  required
                  rows={3}
                  value={formData.care_reminders_provided}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="What reminders did you provide to the client?"
                />
              </div>

              {/* Food Intake */}
              <div className="form-field">
                <label htmlFor="ate_food" className="form-label">
                  Food & Drink Intake *
                </label>
                <textarea
                  name="ate_food"
                  id="ate_food"
                  required
                  rows={2}
                  value={formData.ate_food}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="What did the client eat and drink during your visit?"
                />
              </div>

              {/* Client Mood */}
              <div className="form-section">
                <label className="form-section-title">
                  Client Mood (Select all that apply)
                </label>
                <div className="mood-options-grid">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => handleMoodChange(mood)}
                      className={`mood-option ${
                        formData.mood.includes(mood) ? 'mood-option-selected' : 'mood-option-default'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="form-field">
                <label htmlFor="notes" className="form-label">
                  Additional Notes *
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
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-large"
                >
                  {isSubmitting ? (
                    <>
                      <span className="btn-spinner"></span>
                      Saving Visit...
                    </>
                  ) : (
                    'Save Visit Log'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}