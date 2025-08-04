import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiPost } from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import { showApiError } from '../../../utils/errorUtils'
import toast from 'react-hot-toast'
import './styles/ManagerCreateClient.scss'

export default function ManagerCreateClient() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    room: '',
    date_of_birth: '',
    support_needs: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      
      const clientData = {
        ...formData,
        age: parseInt(formData.age)
      }
      
      const response = await apiPost('manager/create/client', clientData)
      
      toast.success('Client created successfully!')
      navigate(`/manager/client/${response.id}`)
      
    } catch (err) {
      showApiError(err, toast)
      console.error('Create client error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => navigate('/manager/clients')

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-header-container">
          <div className="dashboard-header-content">
            <div className="header-left">
              <button
                onClick={goBack}
                className="btn btn-back"
              >
                ← Back to Clients
              </button>
              <div>
                <h1 className="dashboard-title">Create New Client</h1>
                <p className="dashboard-subtitle">Add a new client to the care home</p>
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

      <div className="form-container">
        <div className="form-inner">
          <div className="form-card">
            <form onSubmit={handleSubmit} className="form-content">
              
              <div className="form-field">
                <label htmlFor="name" className="form-label form-label-required">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter client's full name"
                />
              </div>

              <div className="form-group">
                <div className="form-field">
                  <label htmlFor="age" className="form-label form-label-required">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    required
                    min="18"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Age"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="room" className="form-label form-label-required">
                    Room Number
                  </label>
                  <input
                    type="text"
                    name="room"
                    id="room"
                    required
                    value={formData.room}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g. 101A"
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="date_of_birth" className="form-label form-label-required">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  id="date_of_birth"
                  required
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-field">
                <label htmlFor="support_needs" className="form-label form-label-required">
                  Support Needs
                </label>
                <textarea
                  name="support_needs"
                  id="support_needs"
                  required
                  rows={4}
                  value={formData.support_needs}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe the client's care needs, medical conditions, preferences, etc."
                />
              </div>

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
                  {isSubmitting ? 'Creating...' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}