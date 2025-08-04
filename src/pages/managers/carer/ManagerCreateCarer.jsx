import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiPost } from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import { handleFormError, validateForm } from '../../../utils/errorUtils'
import toast from 'react-hot-toast'
import './styles/ManagerCreateCarer.scss'

export default function ManagerCreateCarer() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validationRules = {
    name: { 
      required: true, 
      minLength: 2, 
      label: 'Name' 
    },
    email: { 
      required: true, 
      type: 'email', 
      label: 'Email' 
    },
    password: { 
      required: true, 
      minLength: 8, 
      label: 'Password' 
    },
    phone: { 
      required: true, 
      type: 'phone', 
      label: 'Phone number' 
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const clientErrors = validateForm(formData, validationRules)
    if (Object.keys(clientErrors).length > 0) {
      const firstError = Object.values(clientErrors)[0]
      toast.error(firstError)
      return
    }
    
    try {
      setIsSubmitting(true)
      
      const response = await apiPost('manager/create/carer', formData)
      
      toast.success('Carer created successfully!')
      navigate('/manager/carers')
      
    } catch (err) {
      const errorMsg = handleFormError(err)
      toast.error(errorMsg)
      console.error('Create carer error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const goBack = () => navigate('/manager/carers')

  return (
    <div className="create-carer-page">
      <div className="create-carer-header">
        <div className="create-carer-header-container">
          <div className="create-carer-header-content">
            <div className="header-left">
              <button onClick={goBack} className="back-button">
                ← Back to Carers
              </button>
            </div>
            
            <div className="header-title-section">
              <h1 className="create-carer-title">Create New Carer</h1>
              <p className="create-carer-subtitle">Add a new carer to the team</p>
            </div>
            
            <div className="header-right">
              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="create-carer-container">
        <div className="create-carer-inner">
          <div className="form-card">
            <div className="form-card-header">
              <h2 className="form-card-title">Carer Information</h2>
              <p className="form-card-description">
                Enter the details for the new carer. All fields marked with * are required.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="carer-form">
              
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
                  placeholder="Enter carer's full name"
                />
              </div>

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
                  placeholder="carer@example.com"
                />
                <p className="form-help-text">
                  This will be used as the carer's login email
                </p>
              </div>

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

              <div className="form-field">
                <label htmlFor="phone" className="form-label">
                  Phone Number *
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
                <p className="form-help-text">
                  Include country code for international numbers
                </p>
              </div>

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
                    'Create Carer'
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