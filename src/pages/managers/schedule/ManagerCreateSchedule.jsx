import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiPost, apiGet } from '../../../utils/api'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/ManagerCreateSchedule.scss'

export default function ManagerCreateSchedule() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [formData, setFormData] = useState({
    carer_email: '',
    client_id: '',
    date: '',
    start_time: '',
    end_time: '',
    shift_type: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [carers, setCarers] = useState([])
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carersResponse, clientsResponse] = await Promise.all([
          apiGet('/manager/carers'),
          apiGet('/manager/clients')
        ])
        setCarers(carersResponse.carers)
        setClients(clientsResponse.clients)
      } catch (err) {
        console.error('Error fetching data:', err)
        toast.error('Failed to load carers and clients')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const goBack = () => {
    if (location.state?.from) {
      navigate(location.state.from)
    } else {
      navigate('/manager/schedules')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      
      console.log('Creating schedule with data:', formData)
      
      const response = await apiPost('/manager/schedules', formData)
      
      toast.success('Schedule created successfully!')
      goBack()
      
    } catch (err) {
      console.error('Create schedule error:', err)
      toast.error(err.message || 'Failed to create schedule')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading...</p>
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
                <h1 className="dashboard-title">Create Schedule</h1>
                <p className="dashboard-subtitle">Add a new care schedule</p>
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
      <div className="form-container">
        <div className="form-inner">
          <div className="form-card">
            <form onSubmit={handleSubmit} className="form-content">
              
              {/* Carer Selection */}
              <div className="form-field">
                <label htmlFor="carer_email" className="form-label form-label-required">
                  Select Carer
                </label>
                <select
                  name="carer_email"
                  id="carer_email"
                  required
                  value={formData.carer_email}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Choose a carer...</option>
                  {carers.map((carer) => (
                    <option key={carer.email} value={carer.email}>
                      {carer.name} ({carer.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Client Selection */}
              <div className="form-field">
                <label htmlFor="client_id" className="form-label form-label-required">
                  Select Client
                </label>
                <select
                  name="client_id"
                  id="client_id"
                  required
                  value={formData.client_id}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Choose a client...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} (Room {client.room})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="form-field">
                <label htmlFor="date" className="form-label form-label-required">
                  Schedule Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              {/* Time Range */}
              <div className="form-group">
                <div className="form-field">
                  <label htmlFor="start_time" className="form-label form-label-required">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    id="start_time"
                    required
                    value={formData.start_time}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="end_time" className="form-label form-label-required">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    id="end_time"
                    required
                    value={formData.end_time}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Shift Type */}
              <div className="form-field">
                <label htmlFor="shift_type" className="form-label form-label-required">
                  Shift Type
                </label>
                <select
                  name="shift_type"
                  id="shift_type"
                  required
                  value={formData.shift_type}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Choose shift type...</option>
                  <option value="Morning Care">Morning Care</option>
                  <option value="Afternoon Care">Afternoon Care</option>
                  <option value="Evening Care">Evening Care</option>
                  <option value="Overnight Care">Overnight Care</option>
                  <option value="Medication Assistance">Medication Assistance</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Companionship">Companionship</option>
                </select>
              </div>

              {/* Notes */}
              <div className="form-field">
                <label htmlFor="notes" className="form-label">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Any additional notes about this schedule..."
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
                  {isSubmitting ? 'Creating...' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}