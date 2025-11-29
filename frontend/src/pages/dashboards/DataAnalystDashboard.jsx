import { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';
import './DataAnalystDashboard.css';

const DataAnalystDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [topDonors, setTopDonors] = useState([]);
  const [topRecipients, setTopRecipients] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [overviewRes, categoryRes, donorsRes, recipientsRes, trendsRes] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getCategoryBreakdown(),
        analyticsAPI.getTopDonors(10),
        analyticsAPI.getTopRecipients(10),
        analyticsAPI.getTrends({ period: 'monthly' })
      ]);

      setOverview(overviewRes.data);
      setCategoryBreakdown(categoryRes.data);
      setTopDonors(donorsRes.data);
      setTopRecipients(recipientsRes.data);
      setTrends(trendsRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;

  return (
    <div className="analyst-dashboard">
      <h1>Data Analyst Dashboard</h1>

      {/* Overview Stats */}
      {overview && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Donations</h3>
            <p className="stat-value">{overview.totalDonations}</p>
          </div>
          <div className="stat-card">
            <h3>Total Waste Reduced</h3>
            <p className="stat-value">{overview.totalWasteReduced.toFixed(2)} kg</p>
          </div>
          <div className="stat-card">
            <h3>Total People Served</h3>
            <p className="stat-value">{overview.totalPeopleServed}</p>
          </div>
          <div className="stat-card">
            <h3>Active Donors</h3>
            <p className="stat-value">{overview.activeDonors}</p>
          </div>
          <div className="stat-card">
            <h3>Active Recipients</h3>
            <p className="stat-value">{overview.activeRecipients}</p>
          </div>
          <div className="stat-card">
            <h3>Available Listings</h3>
            <p className="stat-value">{overview.availableListings}</p>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="section">
        <h2>Food Waste by Category</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Donations Count</th>
                <th>Total Weight (kg)</th>
                <th>People Served</th>
              </tr>
            </thead>
            <tbody>
              {categoryBreakdown.map((category) => (
                <tr key={category._id}>
                  <td className="category-name">{category._id}</td>
                  <td>{category.count}</td>
                  <td>{category.totalWeight?.toFixed(2) || 0}</td>
                  <td>{category.peopleServed || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Donors */}
      <div className="section">
        <h2>Top Donors by Impact</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Donor</th>
                <th>Organization</th>
                <th>Donations</th>
                <th>Total Waste Reduced (kg)</th>
                <th>People Served</th>
              </tr>
            </thead>
            <tbody>
              {topDonors.map((donor, index) => (
                <tr key={donor.donorId}>
                  <td className="rank">{index + 1}</td>
                  <td>{donor.donorName}</td>
                  <td>{donor.organizationName || '-'}</td>
                  <td>{donor.donationCount}</td>
                  <td>{donor.totalWaste?.toFixed(2) || 0}</td>
                  <td>{donor.totalPeople || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Recipients */}
      <div className="section">
        <h2>Top Recipients by Impact</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Recipient</th>
                <th>Organization</th>
                <th>Donations Received</th>
                <th>Total Waste Reduced (kg)</th>
                <th>People Served</th>
              </tr>
            </thead>
            <tbody>
              {topRecipients.map((recipient, index) => (
                <tr key={recipient.recipientId}>
                  <td className="rank">{index + 1}</td>
                  <td>{recipient.recipientName}</td>
                  <td>{recipient.organizationName || '-'}</td>
                  <td>{recipient.donationsReceived}</td>
                  <td>{recipient.totalWaste?.toFixed(2) || 0}</td>
                  <td>{recipient.totalPeople || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="section">
        <h2>Monthly Donation Trends</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Period</th>
                <th>Donations</th>
                <th>Waste Reduced (kg)</th>
                <th>People Served</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend, index) => (
                <tr key={index}>
                  <td>
                    {trend._id.month}/{trend._id.year}
                  </td>
                  <td>{trend.count}</td>
                  <td>{trend.totalWaste?.toFixed(2) || 0}</td>
                  <td>{trend.totalPeople || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataAnalystDashboard;
