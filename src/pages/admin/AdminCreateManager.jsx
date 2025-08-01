import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { apiPost } from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/AdminCreateManager.scss'


export default function AdminCreateManager() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    department: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      
      const response = await apiPost('/admin/create/manager', formData)
      
      toast.success('Manager created successfully!')
      
      // Navigate to managers list
      navigate('/admin/managers')
      
    } catch (err) {
      toast.error(err.message || 'Failed to create manager')
      console.error('Create manager error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => navigate('/admin/managers')

  return (
    <div className="create-manager-page">
      {/* Header */}
      <div className="create-manager-header">
        <div className="create-manager-header-container">
          <div className="create-manager-header-content">
            <div className="header-left">
              <button onClick={goBack} className="back-button">
                ← Back to Managers
              </button>
            </div>
            
            <div className="header-title-section">
              <h1 className="create-manager-title">Create New Manager</h1>
              <p className="create-manager-subtitle">Add a new manager to the system</p>
            </div>
            
            <div className="header-right">
              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="create-manager-container">
        <div className="create-manager-inner">
          <div className="form-card">
            <div className="form-card-header">
              <h2 className="form-card-title">Manager Information</h2>
              <p className="form-card-description">
                Enter the details for the new manager. All fields marked with * are required.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="manager-form">
              
              {/* Name */}
              <div className="form-field">
                <label htmlFor="name" className="form-label">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter manager's full name"
                />
              </div>

              {/* Email */}
              <div className="form-field">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="manager@example.com"
                />
                <p className="form-help-text">
                  This will be used as the manager's login email
                </p>
              </div>

              {/* Department */}
              <div className="form-field">
                <label htmlFor="department" className="form-label">
                  Department *
                </label>
                <input
                  type="text"
                  name="department"
                  id="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Operations, Care Services"
                />
                <p className="form-help-text">
                  The department this manager will oversee
                </p>
              </div>

              {/* Password */}
              <div className="form-field">
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  minLength="8"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Minimum 8 characters"
                />
                <p className="form-help-text">
                  Password must be at least 8 characters long
                </p>
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
                      Creating...
                    </>
                  ) : (
                    'Create Manager'
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