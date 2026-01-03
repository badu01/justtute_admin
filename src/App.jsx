import { useState } from 'react'
import AdminDashboard from './components/AdminDashboard'
import Login from './components/Login'
import { BrowserRouter, Route, Routes } from 'react-router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<AdminDashboard />} />
      <Route path='login' element={<Login />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
