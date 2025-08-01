// API utility functions with JWT token handling 

// Base API function
export const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem('token')

    // Use Railway URL in production, local proxy in development
    const baseURL = process.env.NODE_ENV === 'production' 
        ? 'https://web-production-c61c3.up.railway.app' 
        : '/api'

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        ...options,
    }

    try {
        const response = await fetch(`${baseURL}/${url}`, config)

        // Handle authentication errors
        if (response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            window.location.href = '/login'
            throw new Error('Session expired')
        }

        // Handle other HTTP errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            
            let errorMessage = 'An error occurred'
            
            if (errorData.detail) {
                errorMessage = errorData.detail
            } else if (errorData.error) {
                if (typeof errorData.error === 'string') {
                    errorMessage = errorData.error
                } else if (errorData.details && Array.isArray(errorData.details)) {
                    errorMessage = errorData.details.join('; ')
                }
            } else {
                // Fallback for unexpected error formats
                errorMessage = `HTTP ${response.status}`
            }
            
            throw new Error(errorMessage)
        }

        return response.json()
    } catch (error) {
        console.error('API error:', error)
        throw error
    }
}

// Convenience functions for different HTTP methods
export const apiGet = async (url) => {
    return apiCall(url, { method: 'GET' })
}

export const apiPost = async (url, data) => {
    return apiCall(url, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export const apiPut = async (url, data) => {
    return apiCall(url, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

export const apiDelete = async (url) => {
    return apiCall(url, { method: 'DELETE' })
}

export const apiSafe = async (url, options = {}) => {
    try {
        const data = await apiCall(url, options)
        return { data, error: null }
    } catch (error) {
        return { data: null, error: error.message }
    }
}