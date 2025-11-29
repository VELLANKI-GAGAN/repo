import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'food_donor' // default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

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

  const getRoleDescription = (role) => {
    const descriptions = {
      admin: 'Manage platform users, listings, and analytics',
      food_donor: 'List surplus food and manage donations',
      recipient_org: 'Request food donations and track deliveries',
      data_analyst: 'Analyze food waste trends and generate reports'
    };
    return descriptions[role] || '';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Food Waste Platform</h1>
        <h2>Login to Your Account</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
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
            <label htmlFor="role">Login As</label>
            <select 
              id="role" 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              className="role-select"
            >
              <option value="admin">Administrator</option>
              <option value="food_donor">Food Donor</option>
              <option value="recipient_org">Recipient Organization</option>
              <option value="data_analyst">Data Analyst</option>
            </select>
            <p className="role-description">{getRoleDescription(formData.role)}</p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
