import { useState, useEffect } from 'react';
import axios from 'axios';

const FoodListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('/api/food-listings');
        setListings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <div className="loading">Loading food listings...</div>;

  return (
    <div className="page-container">
      <h1>Food Listings</h1>
      <div className="listings-grid">
        {listings.map((listing) => (
          <div key={listing._id} className="listing-card">
            <h3>{listing.title}</h3>
            <p className="description">{listing.description}</p>
            <div className="listing-details">
              <span className="badge">{listing.category}</span>
              <span className="badge">{listing.status}</span>
              <p><strong>Quantity:</strong> {listing.quantity} {listing.unit}</p>
              <p><strong>Expires:</strong> {new Date(listing.expirationDate).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodListingsPage;