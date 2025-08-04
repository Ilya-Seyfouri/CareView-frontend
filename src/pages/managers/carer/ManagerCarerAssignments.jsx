import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet, apiPost, apiDelete } from '../../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/ManagerCarerAssignments.scss'

export default function ManagerCarerAssignments() {
  const { logout } = useAuth()
  const { email } = useParams()
  const navigate = useNavigate()
  
  // State setup
  const [carer, setCarer] = useState(null)
  const [allClients, setAllClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch carer data and all clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [carerResponse, clientsResponse] = await Promise.all([
          apiGet(`manager/carer/${email}`),
          apiGet('manager/clients')
        ])
        
        setCarer(carerResponse)
        setAllClients(clientsResponse.clients)
        setError(null)
      } catch (err) {
        setError('Failed to load carer and client data')
        console.error('Assignment fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [email])

  // Assignment handlers
  const assignClient = async (clientId) => {
    try {
      setIsUpdating(true)
      await apiPost(`manager/client/${clientId}/assign-carer/${email}`)
      toast.success('Client assigned successfully')
      
      const updatedCarer = await apiGet(`manager/carer/${email}`)
      setCarer(updatedCarer)
    } catch (err) {
      toast.error('Failed to assign client', err)
      console.error('Assignment error:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const unassignClient = async (clientId) => {
    try {
      setIsUpdating(true)
      await apiDelete(`manager/client/${clientId}/unassign-carer/${email}`)
      toast.success('Client unassigned successfully')
      
      const updatedCarer = await apiGet(`manager/carer/${email}`)
      setCarer(updatedCarer)
    } catch (err) {
      toast.error('Failed to unassign client', err)
      console.error('Unassignment error:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  // Helper functions
  const isClientAssigned = (clientId) => {
    return carer?.assigned_clients?.includes(clientId)
  }

  const goBack = () => navigate(`/manager/carer/${email}`)

  // Navigation handlers
  const handleViewSchedules = () => navigate(`/manager/carer/${email}/schedules`)
  const handleViewCarerDetails = () => navigate(`/manager/carer/${email}`)
  const handleCreateSchedule = () => navigate('/manager/schedules/create', {
    state: { 
      from: `/manager/carer/${email}/assignments`,
      prefill: { carer_email: email }
    }
  })

  // Data processing
  const assignedClients = allClients.filter(client => isClientAssigned(client.id))
  const availableClients = allClients.filter(client => !isClientAssigned(client.id))

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading carer assignments...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button onClick={goBack} className="btn btn-primary">
            Back to Carer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="assignments-page">
      {/* Header */}
      <div className="assignments-header">
        <div className="assignments-header-container">
          <div className="assignments-header-content">
            <div className="header-left">
              <button onClick={goBack} className="back-button">
                ← Back to Carer
              </button>
              <div className="header-title-section">
                <h1 className="assignments-title">Manage Client Assignments</h1>
                <p className="assignments-subtitle">
                  {carer?.name} ({email}) - {assignedClients.length} clients assigned
                </p>
              </div>
            </div>
            <div className="header-right">
              <button onClick={logout} className="btn btn-danger">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="assignments-container">
        
        {/* Carer Summary */}
        <div className="carer-summary-card">
          <div className="card-content">
            <h3 className="card-title">Carer Information</h3>
            <div className="carer-info-grid">
              <div className="info-item">
                <span className="info-label">Name:</span> {carer?.name}
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span> {carer?.email}
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span> {carer?.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Management */}
        <div className="assignment-sections">
          
          {/* Currently Assigned Clients */}
          <div className="assignment-section">
            <div className="assignment-section-content">
              <h3 className="assignment-section-title">
                Assigned Clients ({assignedClients.length})
              </h3>
              
              {assignedClients.length > 0 ? (
                <div className="client-list">
                  {assignedClients.map((client) => (
                    <div key={client.id} className="client-item assigned">
                      <div className="client-info">
                        <p className="client-name">{client.name}</p>
                        <p className="client-detail">Room {client.room}</p>
                        <p className="client-detail">ID: {client.id}</p>
                      </div>
                      <button
                        onClick={() => unassignClient(client.id)}
                        disabled={isUpdating}
                        className="btn btn-link"
                      >
                        Unassign
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">
                  No clients assigned to this carer
                </p>
              )}
            </div>
          </div>

          {/* Available Clients */}
          <div className="assignment-section">
            <div className="assignment-section-content">
              <h3 className="assignment-section-title">
                Available Clients ({availableClients.length})
              </h3>
              
              {availableClients.length > 0 ? (
                <div className="client-list">
                  {availableClients.map((client) => (
                    <div key={client.id} className="client-item available">
                      <div className="client-info">
                        <p className="client-name">{client.name}</p>
                        <p className="client-detail">Room {client.room}</p>
                        <p className="client-detail">ID: {client.id}</p>
                        <p className="client-detail">Age: {client.age}</p>
                      </div>
                      <button
                        onClick={() => assignClient(client.id)}
                        disabled={isUpdating}
                        className="btn btn-primary btn-small"
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">
                  All clients are assigned to this carer
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h3 className="section-title">Quick Actions</h3>
          <div className="quick-actions-grid">
            
            <button onClick={handleViewSchedules} className="quick-action-card">
              <div className="quick-action-icon icon-primary">📅</div>
              <div className="quick-action-title">View Schedules</div>
              <div className="quick-action-desc">See this carer's schedule</div>
            </button>
            
            <button onClick={handleViewCarerDetails} className="quick-action-card">
              <div className="quick-action-icon icon-success">👨‍⚕️</div>
              <div className="quick-action-title">Carer Details</div>
              <div className="quick-action-desc">View carer information</div>
            </button>
            
            <button onClick={handleCreateSchedule} className="quick-action-card">
              <div className="quick-action-icon icon-warning">+</div>
              <div className="quick-action-title">Create Schedule</div>
              <div className="quick-action-desc">Schedule for this carer</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}