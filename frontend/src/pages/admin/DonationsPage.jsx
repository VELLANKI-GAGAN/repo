import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('/api/donations');
        setDonations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching donations:', error);
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) return <div className="loading">Loading donations...</div>;

  return (
    <div className="page-container">
      <h1>All Donations</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Donor</th>
              <th>Recipient</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td>{donation.foodListing?.title}</td>
                <td>{donation.donor?.name}</td>
                <td>{donation.recipient?.name}</td>
                <td>{donation.requestedQuantity}</td>
                <td>
                  <span className={`badge-${donation.status}`}>{donation.status}</span>
                </td>
                <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDonationsPage;