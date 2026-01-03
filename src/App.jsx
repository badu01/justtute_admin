import { useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import Login from './components/Login'
import { BrowserRouter, Route, Routes } from 'react-router'
import ProtectedRoute from './routes/ProtectedRoute'
function App() {
  const [count, setCount] = useState(0)

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
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
