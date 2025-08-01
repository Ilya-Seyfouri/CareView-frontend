import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { apiGet, apiPost, apiDelete } from '../../../utils/api'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './styles/ManagerClientTeam.scss'

export default function ManagerClientTeam() {
  //Get auth and routing
  const { user, logout } = useAuth()
  const { client_id } = useParams()
  const navigate = useNavigate()
  
  // State setup
  const [teamData, setTeamData] = useState(null)
  const [allCarers, setAllCarers] = useState([])
  const [allFamilies, setAllFamilies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch team data and available users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [teamResponse, carersResponse, familiesResponse] = await Promise.all([
          apiGet(`manager/client/${client_id}/team`),
          apiGet('manager/carers'),
          apiGet('manager/families')
        ])
        
        setTeamData(teamResponse)
        setAllCarers(carersResponse.carers)
        setAllFamilies(familiesResponse.families)
        setError(null)
      } catch (err) {
        setError('Failed to load team data')
        console.error('Team fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [client_id])

  // Assignment handlers
  const assignCarer = async (carerEmail) => {
    try {
      await apiPost(`manager/client/${client_id}/assign-carer/${carerEmail}`)
      toast.success('Carer assigned successfully')
      
      // Refresh team data after assignment
      const updatedTeam = await apiGet(`manager/client/${client_id}/team`)
      setTeamData(updatedTeam)
    } catch (err) {
      toast.error('Failed to assign carer')
      console.error('Assignment error:', err)
    }
  }

  const unassignCarer = async (carerEmail) => {
    try {
      await apiDelete(`manager/client/${client_id}/unassign-carer/${carerEmail}`)
      toast.success('Carer unassigned successfully')
      
      // Refresh team data
      const updatedTeam = await apiGet(`manager/client/${client_id}/team`)
      setTeamData(updatedTeam)
    } catch (err) {
      toast.error('Failed to unassign carer')
      console.error('Unassignment error:', err)
    }
  }

  const assignFamily = async (familyEmail) => {
    try {
      await apiPost(`manager/client/${client_id}/assign-family/${familyEmail}`)
      toast.success('Family member assigned successfully')
      
      const updatedTeam = await apiGet(`manager/client/${client_id}/team`)
      setTeamData(updatedTeam)
    } catch (err) {
      toast.error('Failed to assign family member')
      console.error('Assignment error:', err)
    }
  }

  const unassignFamily = async (familyEmail) => {
    try {
      await apiDelete(`manager/client/${client_id}/unassign-family/${familyEmail}`)
      toast.success('Family member unassigned successfully')
      
      const updatedTeam = await apiGet(`manager/client/${client_id}/team`)
      setTeamData(updatedTeam)
    } catch (err) {
      toast.error('Failed to unassign family member')
      console.error('Unassignment error:', err)
    }
  }

  // Helpers to check if carer / family is already assigned
  const isCarerAssigned = (carerEmail) => {
    return teamData?.care_team?.carers?.some(carer => carer.email === carerEmail)
  }

  const isFamilyAssigned = (familyEmail) => {
    return teamData?.care_team?.family_members?.some(family => family.email === familyEmail)
  }

  const goBack = () => navigate(`/manager/client/${client_id}`)

  // Handle loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading care team...</p>
        </div>
      </div>
    )
  }

  // Handle error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <button 
            onClick={goBack}
            className="btn btn-primary"
          >
            Back to Client
          </button>
        </div>
      </div>
    )
  }

  // Display team management
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
                ← Back to Client
              </button>
              <div>
                <h1 className="dashboard-title">Care Team</h1>
                <p className="dashboard-subtitle">{teamData?.client_name} - Team Size: {teamData?.care_team?.total_team_size || 0}</p>
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

      {/* Main content */}
      <div className="dashboard-container">
        <div className="dashboard-inner">
          
          {/* Current Team Members */}
          <div className="team-section-grid">
            
            {/* Assigned Carers */}
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">
                  Assigned Carers ({teamData?.care_team?.carers?.length || 0})
                </h3>
                
                {teamData?.care_team?.carers?.length > 0 ? (
                  <div className="team-list">
                    {teamData.care_team.carers.map((carer) => (
                      <div key={carer.email} className="team-member-item">
                        <div className="team-member-info">
                          <p className="team-member-name">{carer.name}</p>
                          <p className="team-member-email">{carer.email}</p>
                          <p className="team-member-phone">{carer.phone}</p>
                        </div>
                        <button
                          onClick={() => unassignCarer(carer.email)}
                          className="team-remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="team-count-text">No carers assigned</p>
                )}
              </div>
            </div>

            {/* Assigned Family Members */}
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">
                  Assigned Family ({teamData?.care_team?.family_members?.length || 0})
                </h3>
                
                {teamData?.care_team?.family_members?.length > 0 ? (
                  <div className="team-list">
                    {teamData.care_team.family_members.map((family) => (
                      <div key={family.email} className="team-member-item">
                        <div className="team-member-info">
                          <p className="team-member-name">{family.name}</p>
                          <p className="team-member-email">{family.email}</p>
                          <p className="team-member-phone">{family.phone}</p>
                          <p className="team-member-id">ID: {family.family_id}</p>
                        </div>
                        <button
                          onClick={() => unassignFamily(family.email)}
                          className="team-remove-btn"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="team-count-text">No family members assigned</p>
                )}
              </div>
            </div>
          </div>

          {/* Available to Assign */}
          <div className="team-section-grid">
            
            {/* Available Carers */}
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">
                  Available Carers
                </h3>
                
                <div className="team-scroll-container">
                  {allCarers.map((carer) => (
                    <div key={carer.email} className="team-member-item">
                      <div className="team-member-info">
                        <p className="team-member-name">{carer.name}</p>
                        <p className="team-member-email">{carer.email}</p>
                      </div>
                      {isCarerAssigned(carer.email) ? (
                        <span className="team-assigned-text">Assigned</span>
                      ) : (
                        <button
                          onClick={() => assignCarer(carer.email)}
                          className="team-assign-btn"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Available Family Members */}
            <div className="card">
              <div className="card-content">
                <h3 className="card-title">
                  Available Family Members
                </h3>
                
                <div className="team-scroll-container">
                  {allFamilies.map((family) => (
                    <div key={family.email} className="team-member-item">
                      <div className="team-member-info">
                        <p className="team-member-name">{family.name}</p>
                        <p className="team-member-email">{family.email}</p>
                      </div>
                      {isFamilyAssigned(family.email) ? (
                        <span className="team-assigned-text">Assigned</span>
                      ) : (
                        <button
                          onClick={() => assignFamily(family.email)}
                          className="team-assign-btn"
                        >
                          Assign
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}