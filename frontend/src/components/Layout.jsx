import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleName = (role) => {
    const roles = {
      admin: 'Admin',
      food_donor: 'Food Donor',
      recipient_org: 'Recipient Organization',
      data_analyst: 'Data Analyst'
    };
    return roles[role] || role;
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content main-content-with-sidebar">
        <nav className="navbar">
          <div className="navbar-brand">
            <h2>Food Waste Platform</h2>
          </div>
          <div className="navbar-menu">
            <span className="user-info">
              {user?.name} ({getRoleName(user?.role)})
            </span>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
};

export default Layout;
