import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './dashboards/AdminDashboard';
import FoodDonorDashboard from './dashboards/FoodDonorDashboard';
import RecipientDashboard from './dashboards/RecipientDashboard';
import DataAnalystDashboard from './dashboards/DataAnalystDashboard';
import Layout from '../components/Layout';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'food_donor':
        return <FoodDonorDashboard />;
      case 'recipient_org':
        return <RecipientDashboard />;
      case 'data_analyst':
        return <DataAnalystDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
};

export default Dashboard;
