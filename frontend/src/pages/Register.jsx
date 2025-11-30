import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'food_donor',
    organizationName: '',
    recipientType: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const preRole = params.get('role');
    if (preRole) setFormData((d) => ({ ...d, role: preRole }));
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);



    // Admin users should not be created via public registration. The backend allows admin creation only by the super-admin.

    if (result.success) {
      // Navigate based on role
      switch (formData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'food_donor':
          navigate('/donor');
          break;
        case 'recipient_org':
          navigate('/recipient');
          break;
        case 'data_analyst':
          navigate('/analyst');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Food Waste Platform</h1>
        <h2>Register</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="food_donor">Food Donor</option>
              <option value="recipient_org">Recipient Organization</option>
              <option value="data_analyst">Data Analyst</option>
              {/* Admin option removed — admins must be created by the super-admin (initial admin) */}
            </select>
          </div>

          {(formData.role === 'food_donor' || formData.role === 'recipient_org') && (
            <div className="form-group">
              <label htmlFor="organizationName">Organization Name</label>
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
              />
            </div>
          )}

          {formData.role === 'recipient_org' && (
            <div className="form-group">
              <label htmlFor="recipientType">Organization Type</label>
              <select
                id="recipientType"
                name="recipientType"
                value={formData.recipientType}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="food_bank">Food Bank</option>
                <option value="shelter">Shelter</option>
                <option value="community_center">Community Center</option>
                <option value="charity">Charity</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Admin secret input removed from the public registration UI */}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
