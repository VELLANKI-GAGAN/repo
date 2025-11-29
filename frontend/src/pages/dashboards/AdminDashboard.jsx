import { useState, useEffect } from 'react';
import { usersAPI, analyticsAPI } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        usersAPI.getAllUsers(),
        analyticsAPI.getOverview()
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId, isVerified) => {
    try {
      await usersAPI.verifyUser(userId, isVerified);
      fetchData();
    } catch (error) {
      console.error('Error verifying user:', error);
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      await usersAPI.toggleUserActive(userId, isActive);
      fetchData();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Stats Section */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Donations</h3>
            <p className="stat-value">{stats.totalDonations}</p>
          </div>
          <div className="stat-card">
            <h3>Waste Reduced</h3>
            <p className="stat-value">{stats.totalWasteReduced} kg</p>
          </div>
          <div className="stat-card">
            <h3>People Served</h3>
            <p className="stat-value">{stats.totalPeopleServed}</p>
          </div>
          <div className="stat-card">
            <h3>Active Donors</h3>
            <p className="stat-value">{stats.activeDonors}</p>
          </div>
          <div className="stat-card">
            <h3>Active Recipients</h3>
            <p className="stat-value">{stats.activeRecipients}</p>
          </div>
          <div className="stat-card">
            <h3>Available Listings</h3>
            <p className="stat-value">{stats.availableListings}</p>
          </div>
        </div>
      )}

      {/* Users Management */}
      <div className="section">
        <h2>User Management</h2>
        
        {/* User Summary */}
        <div style={{marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
          <h3 style={{marginTop: 0}}>User Distribution</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
            <div>
              <strong>Food Donors:</strong> {users.filter(u => u.role === 'food_donor').length}
            </div>
            <div>
              <strong>Recipients:</strong> {users.filter(u => u.role === 'recipient_org').length}
            </div>
            <div>
              <strong>Data Analysts:</strong> {users.filter(u => u.role === 'data_analyst').length}
            </div>
            <div>
              <strong>Admins:</strong> {users.filter(u => u.role === 'admin').length}
            </div>
            <div>
              <strong>Verified Users:</strong> {users.filter(u => u.isVerified).length}
            </div>
            <div>
              <strong>Active Users:</strong> {users.filter(u => u.isActive).length}
            </div>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Organization</th>
                <th>Verified</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.organizationName || '-'}</td>
                  <td>
                    <span className={user.isVerified ? 'badge-success' : 'badge-warning'}>
                      {user.isVerified ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span className={user.isActive ? 'badge-success' : 'badge-danger'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleVerifyUser(user._id, !user.isVerified)}
                      className="btn-small"
                    >
                      {user.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                    <button
                      onClick={() => handleToggleActive(user._id, !user.isActive)}
                      className="btn-small"
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
