import { useState, useEffect } from 'react';
import axios from 'axios';

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // In a real app, this would fetch actual analytics data
        const mockData = {
          totalUsers: 124,
          totalListings: 87,
          totalDonations: 87,
          wasteReduced: 1250,
          peopleServed: 2450,
          topCategories: [
            { category: 'produce', count: 32 },
            { category: 'dairy', count: 28 },
            { category: 'bakery', count: 15 },
            { category: 'prepared_food', count: 12 }
          ]
        };
        setAnalytics(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="loading">Loading analytics...</div>;

  return (
    <div className="page-container">
      <h1>Platform Analytics</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{analytics.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Food Listings</h3>
          <p className="stat-value">{analytics.totalListings}</p>
        </div>
        <div className="stat-card">
          <h3>Donations</h3>
          <p className="stat-value">{analytics.totalDonations}</p>
        </div>
        <div className="stat-card">
          <h3>Waste Reduced (kg)</h3>
          <p className="stat-value">{analytics.wasteReduced}</p>
        </div>
        <div className="stat-card">
          <h3>People Served</h3>
          <p className="stat-value">{analytics.peopleServed}</p>
        </div>
      </div>
      
      <div className="section">
        <h2>Top Food Categories</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Listings</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topCategories?.map((item, index) => (
                <tr key={index}>
                  <td className="category-name">{item.category}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;