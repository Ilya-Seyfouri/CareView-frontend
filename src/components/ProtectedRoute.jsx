import { Navigate } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, allowedroles = [] }) {

    const { isAuthenticated, role, isLoading } = useAuth()


    if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }


  //Redirect to login if user isnt authorized

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }


  //check role based permissions

  if (allowedroles.length > 0 && !allowedroles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to view this page.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Your role: {role}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Required: {allowedroles.join(' or ')}
          </p>
        </div>
      </div>
    )

  }

  return children //user is authenticated and has the correct roles - show the page
}