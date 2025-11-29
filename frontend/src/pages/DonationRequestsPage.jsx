import { useState, useEffect } from 'react';
import axios from 'axios';

const DonationRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/donations/my-requests');
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <div className="loading">Loading donation requests...</div>;

  return (
    <div className="page-container">
      <h1>My Donation Requests</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Food Item</th>
              <th>Donor</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.foodListing?.title}</td>
                <td>{request.donor?.name}</td>
                <td>{request.requestedQuantity}</td>
                <td>
                  <span className={`badge-${request.status}`}>{request.status}</span>
                </td>
                <td>
                  {request.status === 'pending' && (
                    <button
                      onClick={() => {}}
                      className="btn-small btn-danger"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationRequestsPage;