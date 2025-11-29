import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './IndexPage.css';
import HeroPeople from '../assets/people-eating-hero.svg';
import People1 from '../assets/people-eating-1.svg';
import People2 from '../assets/people-eating-2.svg';
import People3 from '../assets/people-eating-3.svg';

const IndexPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeRole, setActiveRole] = useState('food_donor');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    role: 'food_donor'
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'food_donor',
    organizationName: '',
    recipientType: '',
    phone: '',
    adminSecret: ''
  });
  
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  
  const { login, register, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
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
          // Stay on index page if role is unknown
          break;
      }
    }
  }, [user, loading, navigate]);

  // Don't render anything while checking auth status
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    
    try {
      const result = await login(loginData.email, loginData.password);
      
      if (result.success) {
        // Navigate based on role
        switch (loginData.role) {
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
        setLoginError(result.error);
      }
    } catch (err) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    
    if (registerData.password.length < 6) {
      setRegisterError('Password must be at least 6 characters');
      return;
    }
    
    setRegisterLoading(true);
    
    try {
      // Check if this is an admin registration
      if (registerData.role === 'admin') {
        // For admin registration, we need the admin secret
        if (!registerData.adminSecret) {
          setRegisterError('Admin secret is required for admin registration');
          setRegisterLoading(false);
          return;
        }
        
        // Call admin registration endpoint
        const response = await fetch('/api/auth/register-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: registerData.name,
            email: registerData.email,
            password: registerData.password,
            adminSecret: registerData.adminSecret
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Store token and user data
          localStorage.setItem('token', data.token);
          // Navigate to admin dashboard
          navigate('/admin');
        } else {
          setRegisterError(data.message || 'Admin registration failed');
        }
      } else {
        // Regular user registration
        const { confirmPassword, ...registrationData } = registerData;
        const result = await register(registrationData);
        
        if (result.success) {
          // Navigate based on role
          switch (registerData.role) {
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
          setRegisterError(result.error);
        }
      }
    } catch (err) {
      setRegisterError('Registration failed. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
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
    <div className="index-page">
      {/* Header with Roles */}
      <header className="index-header">
        <div className="header-content">
          <h1 className="platform-title">Food Waste Reduction Platform</h1>
          <nav className="roles-nav">
            <button 
              className={`role-button ${activeRole === 'food_donor' ? 'active' : ''}`}
              onClick={() => setActiveRole('food_donor')}
            >
              Food Donor
            </button>
            <button 
              className={`role-button ${activeRole === 'recipient_org' ? 'active' : ''}`}
              onClick={() => setActiveRole('recipient_org')}
            >
              Recipient
            </button>
            <button 
              className={`role-button ${activeRole === 'data_analyst' ? 'active' : ''}`}
              onClick={() => setActiveRole('data_analyst')}
            >
              Data Analyst
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h2>Reduce Food Waste, Help Communities</h2>
            <p className="quote">
              "Food recovery and redistribution are key strategies for reducing food waste while addressing food insecurity."
            </p>
            <p className="stats">
              <span className="stat-number">1.3 BILLION TONS</span> of food wasted annually worldwide
            </p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </div>
          </div>
          <div className="hero-image">
            {/* use a local SVG hero to avoid external dependencies */}
            <img src={HeroPeople} alt="People sharing a meal illustration" />
            <div className="hero-photo-caption">Connecting donors and recipients</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🍽️</div>
          <h3>Food Donors</h3>
          <p>List surplus food items and connect with organizations in need. Make a difference by reducing waste.</p>
          <div className="feature-image">
            <img src={People1} alt="Food donation" />
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🤝</div>
          <h3>Recipients</h3>
          <p>Request food donations and help serve communities. Access nutritious food for those in need.</p>
          <div className="feature-image">
            <img src={People2} alt="Community sharing" />
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Data Analysts</h3>
          <p>Track food waste trends and generate insights to optimize the platform's impact.</p>
          <div className="feature-image">
            <img src={People3} alt="Data analytics" />
          </div>
        </div>
      </section>

      {/* Admin Section */}
      <section className="admin-section">
        <div className="admin-content">
          <h2>Administrator Access</h2>
          <p>Platform management and user administration</p>
          <div className="admin-image">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Admin dashboard" />
          </div>
          <button 
            className="btn-admin"
            onClick={() => {
              setLoginData({...loginData, role: 'admin'});
              setShowLogin(true);
            }}
          >
            Admin Login
          </button>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="gallery-section">
        <h2>Together We Fight Food Waste</h2>
        <div className="gallery-grid">
          <div className="gallery-item">
            <img src={People1} alt="Fresh produce donation" />
          </div>
          <div className="gallery-item">
            <img src={People2} alt="Community food sharing" />
          </div>
          <div className="gallery-item">
            <img src={People3} alt="Food waste analytics" />
          </div>
          <div className="gallery-item">
            <img src={HeroPeople} alt="Community gathering illustration" />
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setShowLogin(false)}>×</button>
            <h2>Login to Your Account</h2>
            
            {loginError && <div className="error-message">{loginError}</div>}
            
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="login-role">Login As</label>
                <select 
                  id="login-role" 
                  name="role" 
                  value={loginData.role} 
                  onChange={handleLoginChange}
                >
                  <option value="food_donor">Food Donor</option>
                  <option value="recipient_org">Recipient Organization</option>
                  <option value="data_analyst">Data Analyst</option>
                </select>
                <p className="role-description">{getRoleDescription(loginData.role)}</p>
              </div>
              
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loginLoading}
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <p className="modal-footer">
              Don't have an account?{' '}
              <button 
                className="link-button" 
                onClick={() => {
                  setShowLogin(false);
                  setShowRegister(true);
                }}
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="modal-overlay">
          <div className="modal-content register-modal">
            <button className="close-button" onClick={() => setShowRegister(false)}>×</button>
            <h2>Create New Account</h2>
            
            {registerError && <div className="error-message">{registerError}</div>}
            
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label htmlFor="register-name">Name</label>
                <input
                  type="text"
                  id="register-name"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="register-email">Email</label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="register-role">Role</label>
                <select
                  id="register-role"
                  name="role"
                  value={registerData.role}
                  onChange={handleRegisterChange}
                  required
                >
                  <option value="food_donor">Food Donor</option>
                  <option value="recipient_org">Recipient Organization</option>
                  <option value="data_analyst">Data Analyst</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              
              {registerData.role === 'admin' && (
                <div className="form-group">
                  <label htmlFor="register-admin-secret">Admin Secret</label>
                  <input
                    type="password"
                    id="register-admin-secret"
                    name="adminSecret"
                    value={registerData.adminSecret}
                    onChange={handleRegisterChange}
                    placeholder="Enter admin secret key"
                    required
                  />
                  <p className="help-text">Contact system administrator for the secret key</p>
                </div>
              )}
              
              {registerData.role === 'admin' && (
                <div className="form-group">
                  <label htmlFor="register-admin-secret">Admin Secret</label>
                  <input
                    type="password"
                    id="register-admin-secret"
                    name="adminSecret"
                    value={registerData.adminSecret}
                    onChange={handleRegisterChange}
                    placeholder="Enter admin secret key"
                    required
                  />
                  <p className="help-text">Contact system administrator for the secret key</p>
                </div>
              )}
              
              {(registerData.role === 'food_donor' || registerData.role === 'recipient_org') && (
                <div className="form-group">
                  <label htmlFor="register-organization">Organization Name</label>
                  <input
                    type="text"
                    id="register-organization"
                    name="organizationName"
                    value={registerData.organizationName}
                    onChange={handleRegisterChange}
                  />
                </div>
              )}
              
              {registerData.role === 'recipient_org' && (
                <div className="form-group">
                  <label htmlFor="register-recipient-type">Organization Type</label>
                  <select
                    id="register-recipient-type"
                    name="recipientType"
                    value={registerData.recipientType}
                    onChange={handleRegisterChange}
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
                <label htmlFor="register-phone">Phone</label>
                <input
                  type="tel"
                  id="register-phone"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="register-confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="register-confirm-password"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
              
              <button type="submit" disabled={registerLoading} className="btn-primary">
                {registerLoading ? 'Registering...' : 'Register'}
              </button>
            </form>
            
            <p className="modal-footer">
              Already have an account?{' '}
              <button 
                className="link-button" 
                onClick={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexPage;