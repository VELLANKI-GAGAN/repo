import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getRoleName = (role) => {
    const roles = {
      admin: 'Admin',
      food_donor: 'Food Donor',
      recipient_org: 'Recipient Organization',
      data_analyst: 'Data Analyst'
    };
    return roles[role] || role;
  };

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin', icon: '📊' },
          { name: 'Users', path: '/admin/users', icon: '👥' },
          { name: 'Food Listings', path: '/admin/listings', icon: '🍽️' },
          { name: 'Donations', path: '/admin/donations', icon: '🤝' },
          { name: 'Analytics', path: '/admin/analytics', icon: '📈' }
        ];
      case 'food_donor':
        return [
          { name: 'Dashboard', path: '/donor', icon: '🏠' },
          { name: 'My Listings', path: '/donor/listings', icon: '📋' },
          { name: 'Donation Requests', path: '/donor/requests', icon: '📬' },
          { name: 'Create Listing', path: '/donor/create', icon: '➕' }
        ];
      case 'recipient_org':
        return [
          { name: 'Dashboard', path: '/recipient', icon: '🏠' },
          { name: 'Available Food', path: '/recipient/listings', icon: '🍽️' },
          { name: 'My Requests', path: '/recipient/requests', icon: '📝' },
          { name: 'History', path: '/recipient/history', icon: '🕒' }
        ];
      case 'data_analyst':
        return [
          { name: 'Dashboard', path: '/analyst', icon: '🏠' },
          { name: 'Reports', path: '/analyst/reports', icon: '📋' },
          { name: 'Analytics', path: '/analyst/analytics', icon: '📈' },
          { name: 'Insights', path: '/analyst/insights', icon: '🔍' }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Food Waste Platform</h3>
        <div className="user-role-badge">
          {getRoleName(user?.role)}
        </div>
      </div>
      
      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="user-info">
          <div className="user-name">{user?.name || 'User'}</div>
          <div className="user-email">{user?.email || 'user@example.com'}</div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="platform-stats">
          <div className="stat-item">
            <span className="stat-label">Version</span>
            <span className="stat-value">1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;