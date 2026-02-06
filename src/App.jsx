import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import TutorManagement from './pages/TutorManagement';
import TutorDetailsPage from './components/TutorDetailsPage';
import StudentPayments from './pages/payments/StudentPayments';
import TutorPayments from './pages/payments/TutorPayments';
import Calendar from './pages/payments/Calendar';
import RevenueAnalytics from './pages/RevenueManagement';
import Reports from './pages/Reports';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="admin">
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="tutors" element={<TutorManagement />} />
            <Route path="tutors/:id" element={<TutorDetailsPage />} />
            <Route path="payments">
              <Route index element={<Navigate to="students" replace />} />
              <Route path="students" element={<StudentPayments />} />
              <Route path="tutors" element={<TutorPayments />} />
              <Route path="calendar" element={<Calendar />} />
            </Route>
            <Route path="revenue" element={<RevenueAnalytics />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;