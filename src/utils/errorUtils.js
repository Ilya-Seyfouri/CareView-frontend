export const handleApiError = (error) => {
  if (!error.message) {
    return 'An unexpected error occurred. Please try again.'
  }

  if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
    return 'Unable to connect. Please check your internet connection.'
  }

  if (error.message.includes('Session expired') || error.message.includes('Unauthorized')) {
    return 'Your session has expired. Please log in again.'
  }

  if (error.message.includes('Schedule conflict:')) {
    return error.message + '\nPlease choose a different time slot.'
  }

  if (error.message.includes('already exists')) {
    return error.message
  }

  if (error.message.includes('not found')) {
    return error.message
  }

  if (error.message.includes('Already assigned')) {
    return error.message
  }

  if (error.message.includes('isn\'t assigned') || error.message.includes('isnt assigned')) {
    return error.message
  }

  return error.message || 'Something went wrong. Please try again.'
}

export const showApiError = (error, toast) => {
  const message = handleApiError(error)
  
  if (error.message && error.message.includes('Already assigned')) {
    toast.success(message)
  } else {
    toast.error(message)
  }
  
  return message
}