import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import FoodDonorDashboard from './pages/dashboards/FoodDonorDashboard';
import RecipientDashboard from './pages/dashboards/RecipientDashboard';
import DataAnalystDashboard from './pages/dashboards/DataAnalystDashboard';
import UsersPage from './pages/admin/UsersPage';
import AdminDonationsPage from './pages/admin/DonationsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import FoodListingsPage from './pages/FoodListingsPage';
import DonationRequestsPage from './pages/DonationRequestsPage';
import IndexPage from './pages/IndexPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <UsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/donations"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDonationsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AnalyticsPage />
              </PrivateRoute>
            }
          />
          
          {/* Food Donor Routes */}
          <Route
            path="/donor"
            element={
              <PrivateRoute allowedRoles={['food_donor']}>
                <FoodDonorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/donor/listings"
            element={
              <PrivateRoute allowedRoles={['food_donor']}>
                <FoodListingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/donor/requests"
            element={
              <PrivateRoute allowedRoles={['food_donor']}>
                <DonationRequestsPage />
              </PrivateRoute>
            }
          />
          
          {/* Recipient Routes */}
          <Route
            path="/recipient"
            element={
              <PrivateRoute allowedRoles={['recipient_org']}>
                <RecipientDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/recipient/listings"
            element={
              <PrivateRoute allowedRoles={['recipient_org']}>
                <FoodListingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/recipient/requests"
            element={
              <PrivateRoute allowedRoles={['recipient_org']}>
                <DonationRequestsPage />
              </PrivateRoute>
            }
          />
          
          {/* Data Analyst Routes */}
          <Route
            path="/analyst"
            element={
              <PrivateRoute allowedRoles={['data_analyst']}>
                <DataAnalystDashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/unauthorized"
            element={
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1>Unauthorized</h1>
                <p>You don't have permission to access this page.</p>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
