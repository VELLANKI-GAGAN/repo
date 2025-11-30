import { useState, useEffect } from 'react';
import { foodListingsAPI, donationsAPI } from '../../services/api';
import './RecipientDashboard.css';

const RecipientDashboard = () => {
  const [availableListings, setAvailableListings] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listingsRes, requestsRes] = await Promise.all([
        foodListingsAPI.getAvailable(),
        donationsAPI.getMyRequests()
      ]);
      setAvailableListings(listingsRes.data);
      setMyRequests(requestsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDonation = async (listingId, quantity) => {
    try {
      await donationsAPI.create({
        foodListingId: listingId,
        requestedQuantity: quantity,
        notes: 'Request from recipient organization'
      });
      fetchData();
    } catch (error) {
      console.error('Error requesting donation:', error);
      alert(error.response?.data?.message || 'Error requesting donation');
    }
  };

  const handleUpdateStatus = async (donationId, status, peopleServed = 0) => {
    try {
      await donationsAPI.updateStatus(donationId, { 
        status,
        peopleServed: peopleServed || undefined
      });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  // Demo fallback data for development / empty states
  const demoAvailable = [
    {
      _id: 'demo-av-1',
      title: 'Fresh Veg Box',
      description: 'Seasonal vegetables packaged by local donor.',
      category: 'produce',
      quantity: 10,
      unit: 'boxes',
      reservedQuantity: 0,
      expirationDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
      storageRequirements: 'room_temperature',
      pickupLocation: { city: 'Mumbai', state: 'MH' },
      donor: { organizationName: 'Farmers Market Co' }
    },
    {
      _id: 'demo-av-2',
      title: 'Prepared Meals',
      description: 'Boxed prepared meals for immediate distribution.',
      category: 'prepared_food',
      quantity: 50,
      unit: 'servings',
      reservedQuantity: 0,
      expirationDate: new Date(Date.now() + 1 * 24 * 3600 * 1000).toISOString(),
      storageRequirements: 'refrigerated',
      pickupLocation: { city: 'Pune', state: 'MH' },
      donor: { organizationName: 'Community Cooks' }
    }
  ];

  const demoRequests = [
    {
      _id: 'demo-req-1',
      foodListing: { title: 'Fresh Veg Box', unit: 'boxes' },
      donor: { organizationName: 'Farmers Market Co' },
      status: 'pending',
      requestedQuantity: 2,
      peopleServed: 0
    },
    {
      _id: 'demo-req-2',
      foodListing: { title: 'Prepared Meals', unit: 'servings' },
      donor: { organizationName: 'Community Cooks' },
      status: 'confirmed',
      requestedQuantity: 20,
      peopleServed: 0
    }
  ];

  // Calculate statistics
  const totalRequests = myRequests.length;
  const pendingRequests = myRequests.filter(r => r.status === 'pending').length;
  const confirmedRequests = myRequests.filter(r => r.status === 'confirmed').length;
  const completedRequests = myRequests.filter(r => r.status === 'completed').length;
  const totalPeopleServed = myRequests
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + (r.peopleServed || 0), 0);
  const availableFood = availableListings.length;

  return (
    <div className="recipient-dashboard">
      <h1>Recipient Organization Dashboard</h1>

      {/* Statistics Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Available Food</h3>
          <p className="stat-value">{availableFood}</p>
        </div>
        <div className="stat-card">
          <h3>Total Requests</h3>
          <p className="stat-value">{totalRequests}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p className="stat-value">{pendingRequests}</p>
        </div>
        <div className="stat-card">
          <h3>Confirmed</h3>
          <p className="stat-value">{confirmedRequests}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-value">{completedRequests}</p>
        </div>
        <div className="stat-card">
          <h3>People Served</h3>
          <p className="stat-value">{totalPeopleServed}</p>
        </div>
      </div>

      {/* Available Food Listings */}
      <div className="section">
        <h2>Available Food Donations</h2>
        <div className="listings-grid">
          {(availableListings.length > 0 ? availableListings : demoAvailable).map((listing) => (
            <div key={listing._id} className="listing-card">
              {String(listing._id).startsWith('demo') && <div className="demo-badge">Demo</div>}
              <h3>{listing.title}</h3>
              <p className="description">{listing.description}</p>
              <div className="listing-details">
                <span className="badge">{listing.category}</span>
                <p><strong>Donor:</strong> {listing.donor?.organizationName || listing.donor?.name}</p>
                <p>
                  <strong>Total Quantity:</strong> {listing.quantity} {listing.unit}
                </p>
                <p>
                  <strong>Reserved:</strong> {listing.reservedQuantity || 0} {listing.unit}
                </p>
                <p>
                  <strong>Available:</strong> {listing.quantity - (listing.reservedQuantity || 0)} {listing.unit}
                </p>
                <p><strong>Expires:</strong> {new Date(listing.expirationDate).toLocaleDateString()}</p>
                <p><strong>Storage:</strong> {listing.storageRequirements}</p>
                <p><strong>Location:</strong> {listing.pickupLocation?.city}, {listing.pickupLocation?.state}</p>
              </div>
              <button
                onClick={() => {
                  const maxAvailable = listing.quantity - (listing.reservedQuantity || 0);
                  const quantity = prompt(`Enter quantity to request (max ${maxAvailable} ${listing.unit} available):`);
                  if (quantity && Number(quantity) > 0 && Number(quantity) <= maxAvailable) {
                    handleRequestDonation(listing._id, Number(quantity));
                  } else if (quantity && Number(quantity) > maxAvailable) {
                    alert(`Only ${maxAvailable} ${listing.unit} available!`);
                  }
                }}
                className="btn-primary"
              >
                Request Donation
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* My Donation Requests */}
      <div className="section">
        <h2>My Donation Requests</h2>
        
        {/* Recent Activity Summary */}
        {myRequests.length > 0 && (
          <div style={{marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
            <h3 style={{marginTop: 0}}>Recent Activity</h3>
            {(myRequests.length > 0 ? myRequests : demoRequests).slice(0, 3).map((request) => (
              <div key={request._id} style={{padding: '8px 0', borderBottom: '1px solid #dee2e6'}}>
                {String(request._id).startsWith('demo') && <span style={{background:'#FFECB3', padding:'2px 8px', borderRadius:'6px', marginRight:'10px', color:'#7A4A00'}}>Demo</span>}
                <strong>{request.foodListing?.title}</strong> from <strong>{request.donor?.organizationName || request.donor?.name}</strong>
                <span style={{marginLeft: '10px', color: request.status === 'completed' ? '#28a745' : request.status === 'confirmed' ? '#007bff' : '#ffc107'}}>
                  ({request.status})
                </span>
                {request.status === 'completed' && request.peopleServed > 0 && (
                  <span style={{marginLeft: '10px', color: '#666'}}>- Served {request.peopleServed} people</span>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Food Item</th>
                <th>Donor</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>People Served</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(myRequests.length > 0 ? myRequests : demoRequests).map((request) => (
                <tr key={request._id}>
                  <td>{request.foodListing?.title}</td>
                  <td>{request.donor?.organizationName || request.donor?.name}</td>
                  <td>{request.requestedQuantity} {request.foodListing?.unit}</td>
                  <td>
                    <span className={`badge-${request.status}`}>{request.status}</span>
                  </td>
                  <td>{request.peopleServed || 0}</td>
                  <td>
                    {request.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(request._id, 'in_transit')}
                          className="btn-small"
                        >
                          Mark In Transit
                        </button>
                        <button
                          onClick={() => {
                            const people = prompt('How many people were served?');
                            if (people && Number(people) > 0) {
                              handleUpdateStatus(request._id, 'completed', Number(people));
                            }
                          }}
                          className="btn-small btn-success"
                        >
                          Mark Complete
                        </button>
                      </>
                    )}
                    {request.status === 'in_transit' && (
                      <button
                        onClick={() => {
                          const people = prompt('How many people were served?');
                          if (people && Number(people) > 0) {
                            handleUpdateStatus(request._id, 'completed', Number(people));
                          }
                        }}
                        className="btn-small btn-success"
                      >
                        Mark Complete
                      </button>
                    )}
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(request._id, 'cancelled')}
                        className="btn-small btn-danger"
                      >
                        Cancel Request
                      </button>
                    )}
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

export default RecipientDashboard;
