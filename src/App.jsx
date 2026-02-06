import { useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import Login from './components/Login'
import { BrowserRouter, Route, Routes } from 'react-router'
import ProtectedRoute from './routes/ProtectedRoute'
import TutorDetailsPage from './components/TutorDetailsPage'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/tutors/:id" element={<TutorDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
