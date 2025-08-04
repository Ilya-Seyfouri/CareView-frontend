export const handleFormError = (error) => {
  console.error('Form error:', error)
  
  if (error.status === 401) {
    return "Incorrect email or password. Please try again."
  }
  
  if (error.status === 400) {
    if (error.data && error.data.errors) {
      const errors = error.data.errors
      for (const err of errors) {
        switch(err.field) {
          case 'email':
            if (err.code === 'invalid_email') {
              return "Please enter a valid email address"
            } else if (err.code === 'required') {
              return "Email is required"
            } else if (err.code === 'already_exists') {
              return "This email is already registered"
            }
            break
          case 'phone':
            if (err.code === 'too_short') {
              return "Phone number is too short (minimum 10 digits)"
            } else if (err.code === 'invalid_format') {
              return "Please enter a valid phone number (e.g. +44 7123 456789)"
            } else if (err.code === 'required') {
              return "Phone number is required"
            }
            break
          case 'password':
            if (err.code === 'too_short') {
              return "Password must be at least 8 characters long"
            } else if (err.code === 'weak_password') {
              return "Password must contain letters and numbers"
            } else if (err.code === 'required') {
              return "Password is required"
            }
            break
          case 'name':
            if (err.code === 'required') {
              return "Name is required"
            } else if (err.code === 'too_short') {
              return "Name must be at least 2 characters long"
            }
            break
          case 'id':
            if (err.code === 'required') {
              return "ID is required"
            } else if (err.code === 'already_exists') {
              return "This ID is already in use"
            } else if (err.code === 'invalid_format') {
              return "ID format is invalid"
            }
            break
          case 'age':
            if (err.code === 'invalid_range') {
              return "Age must be between 18 and 120"
            } else if (err.code === 'required') {
              return "Age is required"
            }
            break
          case 'room':
            if (err.code === 'required') {
              return "Room number is required"
            } else if (err.code === 'already_exists') {
              return "This room is already assigned"
            }
            break
          case 'date_of_birth':
            if (err.code === 'invalid_date') {
              return "Please enter a valid date of birth"
            } else if (err.code === 'required') {
              return "Date of birth is required"
            }
            break
          case 'support_needs':
            if (err.code === 'required') {
              return "Support needs are required"
            } else if (err.code === 'too_short') {
              return "Please provide more details about support needs"
            }
            break
          default:
            return err.message || "Please check your information"
        }
      }
    }
    return "Please check your information and try again"
  }
  
  if (error.status === 422) {
    return "Please check all required fields"
  }
  
  if (error.status === 409) {
    return "This record already exists or conflicts with existing data"
  }
  
  if (error.status === 500) {
    return "Server error. Please try again later"
  }
  
  if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
    return "Unable to connect. Please check your internet connection"
  }
  
  return error.message || "Something went wrong. Please try again"
}

export const validateForm = (formData, validationRules) => {
  const errors = {}
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field]
    
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${rules.label || field} is required`
      continue
    }
    
    if (value && rules.minLength && value.length < rules.minLength) {
      errors[field] = `${rules.label || field} must be at least ${rules.minLength} characters`
      continue
    }
    
    if (value && rules.min && parseInt(value) < rules.min) {
      errors[field] = `${rules.label || field} must be at least ${rules.min}`
      continue
    }
    
    if (value && rules.max && parseInt(value) > rules.max) {
      errors[field] = `${rules.label || field} must not exceed ${rules.max}`
      continue
    }
    
    if (rules.type === 'phone' && value) {
      if (value.length < 10) {
        errors[field] = "Phone number is too short (minimum 10 digits)"
        continue
      }
      if (value.length > 20) {
        errors[field] = "Phone number is too long (maximum 20 digits)"
        continue
      }
    }
    
    if (rules.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        errors[field] = "Please enter a valid email address"
        continue
      }
    }
  }
  
  return errors
}