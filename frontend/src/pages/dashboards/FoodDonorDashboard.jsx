import { useState, useEffect } from 'react';
import { foodListingsAPI, donationsAPI } from '../../services/api';
import './FoodDonorDashboard.css';

const FoodDonorDashboard = () => {
  const [listings, setListings] = useState([]);
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'produce',
    quantity: '',
    unit: 'kg',
    expirationDate: '',
    availableFrom: '',
    availableUntil: '',
    storageRequirements: 'room_temperature',
    pickupLocation: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listingsRes, donationsRes] = await Promise.all([
        foodListingsAPI.getMyListings(),
        donationsAPI.getMyDonations()
      ]);
      setListings(listingsRes.data);
      setDonations(donationsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        pickupLocation: {
          ...formData.pickupLocation,
          [locationField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await foodListingsAPI.create(formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'produce',
        quantity: '',
        unit: 'kg',
        expirationDate: '',
        availableFrom: '',
        availableUntil: '',
        storageRequirements: 'room_temperature',
        pickupLocation: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
      fetchData();
    } catch (error) {
      console.error('Error creating listing:', error);
    }
  };

  const handleUpdateDonationStatus = async (donationId, status) => {
    try {
      await donationsAPI.updateStatus(donationId, { status });
      fetchData();
    } catch (error) {
      console.error('Error updating donation:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  // Calculate statistics
  const totalListings = listings.length;
  const totalDonations = donations.length;
  const completedDonations = donations.filter(d => d.status === 'completed').length;
  const pendingRequests = donations.filter(d => d.status === 'pending').length;
  const totalWasteReduced = donations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + (d.wasteReduced || 0), 0);
  const totalPeopleServed = donations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + (d.peopleServed || 0), 0);

  return (
    <div className="donor-dashboard">
      <h1>Food Donor Dashboard</h1>

      {/* Statistics Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Listings</h3>
          <p className="stat-value">{totalListings}</p>
        </div>
        <div className="stat-card">
          <h3>Total Donations</h3>
          <p className="stat-value">{totalDonations}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-value">{completedDonations}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Requests</h3>
          <p className="stat-value">{pendingRequests}</p>
        </div>
        <div className="stat-card">
          <h3>Waste Reduced</h3>
          <p className="stat-value">{totalWasteReduced.toFixed(1)} kg</p>
        </div>
        <div className="stat-card">
          <h3>People Served</h3>
          <p className="stat-value">{totalPeopleServed}</p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary"
      >
        {showForm ? 'Cancel' : 'List Surplus Food'}
      </button>

      {/* Add Listing Form */}
      {showForm && (
        <div className="form-section">
          <h2>Create Food Listing</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="produce">Produce</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                  <option value="bakery">Bakery</option>
                  <option value="prepared_food">Prepared Food</option>
                  <option value="canned">Canned</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select name="unit" value={formData.unit} onChange={handleChange}>
                  <option value="kg">Kilograms</option>
                  <option value="lbs">Pounds</option>
                  <option value="servings">Servings</option>
                  <option value="items">Items</option>
                  <option value="boxes">Boxes</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiration Date</label>
                <input
                  type="date"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Storage</label>
                <select name="storageRequirements" value={formData.storageRequirements} onChange={handleChange}>
                  <option value="room_temperature">Room Temperature</option>
                  <option value="refrigerated">Refrigerated</option>
                  <option value="frozen">Frozen</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Available From</label>
                <input
                  type="datetime-local"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Available Until</label>
                <input
                  type="datetime-local"
                  name="availableUntil"
                  value={formData.availableUntil}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <h3>Pickup Location</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  name="location.street"
                  value={formData.pickupLocation.street}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.pickupLocation.city}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.pickupLocation.state}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="location.zipCode"
                  value={formData.pickupLocation.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Create Listing
            </button>
          </form>
        </div>
      )}

      {/* My Listings */}
      <div className="section">
        <h2>My Food Listings</h2>
        <div className="listings-grid">
          {listings.map((listing) => (
            <div key={listing._id} className="listing-card">
              <h3>{listing.title}</h3>
              <p className="description">{listing.description}</p>
              <div className="listing-details">
                <span className="badge">{listing.category}</span>
                <span className="badge">{listing.status}</span>
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donations */}
      <div className="section">
        <h2>Donation Requests</h2>
        
        {/* Recent Donations Summary */}
        {donations.length > 0 && (
          <div style={{marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
            <h3 style={{marginTop: 0}}>Recent Donations</h3>
            {donations.slice(0, 3).map((donation) => (
              <div key={donation._id} style={{padding: '8px 0', borderBottom: '1px solid #dee2e6'}}>
                <strong>{donation.foodListing?.title}</strong> to <strong>{donation.recipient?.organizationName || donation.recipient?.name}</strong>
                <span style={{marginLeft: '10px', color: donation.status === 'completed' ? '#28a745' : donation.status === 'confirmed' ? '#007bff' : '#ffc107'}}>
                  ({donation.status})
                </span>
                {donation.status === 'completed' && donation.peopleServed > 0 && (
                  <span style={{marginLeft: '10px', color: '#666'}}>- {donation.peopleServed} people served</span>
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
                <th>Recipient</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation) => (
                <tr key={donation._id}>
                  <td>{donation.foodListing?.title}</td>
                  <td>{donation.recipient?.name}</td>
                  <td>{donation.requestedQuantity}</td>
                  <td>
                    <span className={`badge-${donation.status}`}>{donation.status}</span>
                  </td>
                  <td>
                    {donation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateDonationStatus(donation._id, 'confirmed')}
                          className="btn-small btn-success"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateDonationStatus(donation._id, 'cancelled')}
                          className="btn-small btn-danger"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {donation.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateDonationStatus(donation._id, 'completed')}
                        className="btn-small btn-success"
                      >
                        Mark Complete
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

export default FoodDonorDashboard;
