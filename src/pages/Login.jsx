import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Login.scss'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showDemo, setShowDemo] = useState(false)

    const { login, isLoading, isAuthenticated, role} = useAuth()
    const navigate = useNavigate()

    // Demo user credentials 
    const demoUsers = {
        manager: {
            email: 'manager@demo.com',
            password: 'password123',
            name: 'Demo Manager'
        },
        carer: {
            email: 'carer@demo.com', 
            password: 'password123',
            name: 'Demo Carer'
        },
        family: {
            email: 'family@demo.com',
            password: 'password123', 
            name: 'Demo Family Member'
        }
    }

    useEffect(() => {
        if (isAuthenticated && role) {
            navigate(`/${role}/dashboard`)
        }
    }, [isAuthenticated, role, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password){
            setError("Please fill in all fields")
            return
        }

        const result = await login(email, password)

        if (result.success) {
            // authcontext will handle navigation/redirect automatically
        } else {
            setError(result.error)
        }
    }

    const handleDemoLogin = async (userType) => {
        setError('')
        const demoUser = demoUsers[userType]
        
        if (!demoUser) {
            setError(`Demo user for ${userType} not configured`)
            return
        }

        setEmail(demoUser.email)
        setPassword(demoUser.password)
        
        const result = await login(demoUser.email, demoUser.password)
        if (!result.success) {
            setError(`Demo login failed: ${result.error}`)
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    {/* Header */}
                    <div className="login-header">
                        <div className="login-logo">
                            <div className="logo-icon">🏥</div>
                            <h2 className="login-title">CareView</h2>
                        </div>
                        <p className="login-subtitle">Sign in to your care management account</p>
                    </div>
                    
                    <div className="demo-toggle-container">
                        <button
                            type="button"
                            onClick={() => setShowDemo(!showDemo)}
                            className="demo-toggle-button"
                        >
                            {showDemo ? 'Hide Demo Options' : 'Try Demo Users'}
                        </button>
                    </div>

                    {showDemo && (
                        <div className="demo-section">
                            <h3 className="demo-section-title">Quick Demo Login</h3>
                            <div className="demo-buttons-grid">
                                <button
                                    onClick={() => handleDemoLogin('manager')}
                                    disabled={isLoading}
                                    className="demo-button demo-button-manager"
                                >
                                    <span className="demo-button-icon">🏢</span>
                                    <span className="demo-button-text">Login as Manager</span>
                                </button>
                                <button
                                    onClick={() => handleDemoLogin('carer')}
                                    disabled={isLoading}
                                    className="demo-button demo-button-carer"
                                >
                                    <span className="demo-button-icon">👩‍⚕️</span>
                                    <span className="demo-button-text">Login as Carer</span>
                                </button>
                                <button
                                    onClick={() => handleDemoLogin('family')}
                                    disabled={isLoading}
                                    className="demo-button demo-button-family"
                                >
                                    <span className="demo-button-icon">👨‍👩‍👧‍👦</span>
                                    <span className="demo-button-text">Login as Family Member</span>
                                </button>
                            </div>
                            <p className="demo-description">
                                Demo accounts showcase different user experiences
                            </p>
                        </div>
                    )}
                    
                    {/* Login Form */}
                    <form className="login-form" onSubmit={handleSubmit}>
                        {/* Error Message Display */}
                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                <span className="error-text">{error}</span>
                            </div>
                        )}
                        
                        <div className="form-fields">
                            {/* Email Input */}
                            <div className="form-field">
                                <label htmlFor="email" className="form-label">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="form-input"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            
                            {/* Password Input */}
                            <div className="form-field">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="submit-button-container">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="submit-button"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Demo Credentials Display */}
                    {showDemo && (
                        <div className="demo-credentials">
                            <h4 className="demo-credentials-title">Demo Credentials:</h4>
                            <div className="demo-credentials-list">
                                <div className="demo-credential-item">
                                    <span className="credential-label">Manager:</span>
                                    <span className="credential-value">{demoUsers.manager.email}</span>
                                </div>
                                <div className="demo-credential-item">
                                    <span className="credential-label">Carer:</span>
                                    <span className="credential-value">{demoUsers.carer.email}</span>
                                </div>
                                <div className="demo-credential-item">
                                    <span className="credential-label">Family:</span>
                                    <span className="credential-value">{demoUsers.family.email}</span>
                                </div>
                                <div className="demo-credential-item">
                                    <span className="credential-label">Password (all):</span>
                                    <span className="credential-value credential-password">{demoUsers.manager.password}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}