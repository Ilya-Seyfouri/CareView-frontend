import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'


import ManagerDashboard from './pages/managers/ManagerDashboard'
import CarerDashboard from './pages/carers/CarerDashboard'
import FamilyDashboard from './pages/family/FamilyDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'


import ManagerClients from './pages/managers/client/ManagerClients'
import ManagerClientDetail from './pages/managers/client/ManagerClientDetail'
import ManagerClientVisitLogs from './pages/managers/client/ManagerClientVisitLogs'
import ManagerClientTeam from './pages/managers/client/ManagerClientTeam'
import ManagerCarers from './pages/managers/carer/ManagerCarers'
import ManagerFamilies from './pages/managers/family/ManagerFamilies'
import ManagerCreateClient from './pages/managers/client/ManagerCreateClient'
import ManagerCreateCarer from './pages/managers/carer/ManagerCreateCarer'
import ManagerCreateFamily from './pages/managers/family/ManagerCreateFamily'
import ManagerSchedules from './pages/managers/schedule/ManagerSchedules'
import ManagerCreateSchedule from './pages/managers/schedule/ManagerCreateSchedule'
import ManagerCarerDetail from './pages/managers/carer/ManagerCarerDetail'
import ManagerFamilyDetail from './pages/managers/family/ManagerFamilyDetail'
import ManagerVisitLogDetail from './pages/managers/visitlog/ManagerVisitLogDetail'
import ManagerScheduleDetail from './pages/managers/schedule/ManagerScheduleDetail'
import ManagerClientSchedules from './pages/managers/client/ManagerClientSchedules'
import ManagerCreateVisitLog from './pages/managers/visitlog/ManagerCreateVisitLog'
import ManagerEditVisitLog from './pages/managers/visitlog/ManagerEditVisitLog'
import ManagerCarerSchedules from './pages/managers/carer/ManagerCarerSchedules' 
import ManagerCarerAssignments from './pages/managers/carer/ManagerCarerAssignments' 
import ManagerFamilySchedules from './pages/managers/family/ManagerFamilySchedules'

import ManagerFamilyAssignments from './pages/managers/family/ManagerFamilyAssignments' 

import CarerClients from './pages/carers/CarerClients'
import CarerClientDetail from './pages/carers/CarerClientDetail'
import CarerCreateVisitLog from './pages/carers/CarerCreateVisitLog'
import CarerSchedules from './pages/carers/CarerSchedules'
import CarerProfile from './pages/carers/CarerProfile'
import CarerVisitLogs from './pages/carers/CarerVisitLogs'
import CarerVisitLogDetail from './pages/carers/CarerVisitLogDetail' 
import CarerScheduleDetail from './pages/carers/CarerScheduleDetail'


import FamilyClients from './pages/family/FamilyClients'
import FamilyClientDetail from './pages/family/FamilyClientDetail'
import FamilyVisitLogs from './pages/family/FamilyVisitLogs'
import FamilyVisitLogDetail from './pages/family/FamilyVisitLogDetail' 
import FamilySchedules from './pages/family/FamilySchedules'
import FamilyProfile from './pages/family/FamilyProfile'

import AdminManagers from './pages/admin/AdminManagers'
import AdminManagerDetail from './pages/admin/AdminManagerDetail'
import AdminCreateManager from './pages/admin/AdminCreateManager'
import AdminActivityLogs from './pages/admin/AdminActivityLogs'


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Manager routes */}
          <Route 
            path="manager/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/manager/clients" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerClients />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/client/:client_id" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerClientDetail />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/client/:client_id/visit-logs" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerClientVisitLogs />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/client/:client_id/team" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerClientTeam />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/carers" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerCarers />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/families" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerFamilies />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/create/client" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerCreateClient />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/create/carer" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerCreateCarer />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/create/family-member" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerCreateFamily />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/schedules" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerSchedules />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/schedules/create" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerCreateSchedule />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/carer/:email" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerCarerDetail />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/manager/carer/:email/schedules" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerCarerSchedules />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/manager/carer/:email/assignments" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerCarerAssignments />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/family/:email" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerFamilyDetail />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/manager/family/:email/schedules" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerFamilySchedules />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/manager/family/:email/assignments" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerFamilyAssignments />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/client/:client_id/visit-logs/:visit_log_id" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerVisitLogDetail />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/schedules/:schedule_id" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerScheduleDetail />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/client/:client_id/schedules" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerClientSchedules />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/client/:client_id/visit-log/create" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerCreateVisitLog />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/manager/client/:client_id/visit-logs/:visit_log_id/edit" 
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerEditVisitLog />
              </ProtectedRoute>
            } 
          />
          
          {/* CARER ROUTES */}
          <Route 
            path="/carer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['carer']}>
                <CarerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/carer/me" 
            element={
              <ProtectedRoute allowedRoles={['manager', 'carer']}>
                <CarerProfile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/carer/me/clients" 
            element={
              <ProtectedRoute allowedRoles={['carer']}>
                <CarerClients />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/carer/me/clients/:client_id" 
            element={
              <ProtectedRoute allowedRoles={['carer']}>
                <CarerClientDetail />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/carer/me/clients/:client_id/visit-log/create" 
            element={
              <ProtectedRoute allowedRoles={['carer']}>
                <CarerCreateVisitLog />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/carer/me/clients/:client_id/visit-logs" 
            element={
              <ProtectedRoute allowedRoles={['carer']}>
                <CarerVisitLogs />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/carer/me/clients/:client_id/visit-logs/:visit_log_id" 
            element={
              <ProtectedRoute allowedRoles={['carer']}>
                <CarerVisitLogDetail />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/carer/me/schedules" 
            element={
              <ProtectedRoute allowedRoles={['carer']}>
                <CarerSchedules />
              </ProtectedRoute>
            } 
          />


          <Route 
            path="/carer/me/schedules/:schedule_id" 
            element={
              <ProtectedRoute allowedRoles={['carer']}>
                <CarerScheduleDetail />
              </ProtectedRoute>
            } 
          />


          
          
          {/* FAMILY ROUTES */}
          <Route 
            path="/family/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['family']}>
                <FamilyDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/family/me" 
            element={
              <ProtectedRoute allowedRoles={['family']}>
                <FamilyProfile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/family/me/clients" 
            element={
              <ProtectedRoute allowedRoles={['family']}>
                <FamilyClients />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/family/me/clients/:client_id" 
            element={
              <ProtectedRoute allowedRoles={['family']}>
                <FamilyClientDetail />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/family/me/clients/:client_id/visit-logs" 
            element={
              <ProtectedRoute allowedRoles={['family']}>
                <FamilyVisitLogs />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/family/me/clients/:client_id/visit-logs/:visit_log_id" 
            element={
              <ProtectedRoute allowedRoles={['family']}>
                <FamilyVisitLogDetail />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/family/me/schedules" 
            element={
              <ProtectedRoute allowedRoles={['family']}>
                <FamilySchedules />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />


          <Route 
            path="/admin/managers" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminManagers />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/managers/:email" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminManagerDetail />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/create/manager" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCreateManager />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/activity-logs" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminActivityLogs />
              </ProtectedRoute>
            } 
          />

          



       
          
          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App