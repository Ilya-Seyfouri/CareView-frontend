import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiPost } from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/ManagerCreateFamily.scss'

export default function ManagerCreateFamily() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    name: '',
    password: '',
    phone: ''
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
      
      const response = await apiPost('manager/create/family-member', formData)
      
      toast.success('Family member created successfully!')
      navigate('/manager/families')
      
    } catch (err) {
      toast.error(err.message || 'Failed to create family member')
      console.error('Create family error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => navigate('/manager/families')

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
                ← Back to Families
              </button>
              <div>
                <h1 className="dashboard-title">Create New Family Member</h1>
                <p className="dashboard-subtitle">Add a new family member to the system</p>
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
              
              {/* Name */}
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
                  placeholder="Enter family member's full name"
                />
              </div>

              {/* Family ID */}
              <div className="form-field">
                <label htmlFor="id" className="form-label form-label-required">
                  Family ID
                </label>
                <input
                  type="text"
                  name="id"
                  id="id"
                  required
                  value={formData.id}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. FAM001"
                />
              </div>

              {/* Email */}
              <div className="form-field">
                <label htmlFor="email" className="form-label form-label-required">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="family@example.com"
                />
              </div>

              {/* Password */}
              <div className="form-field">
                <label htmlFor="password" className="form-label form-label-required">
                  Password
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
              </div>

              {/* Phone */}
              <div className="form-field">
                <label htmlFor="phone" className="form-label form-label-required">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. +44 7123 456789"
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
                  {isSubmitting ? 'Creating...' : 'Create Family Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}