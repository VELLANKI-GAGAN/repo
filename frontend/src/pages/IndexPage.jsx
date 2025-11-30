import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './IndexPage.css';
import HeroPeople from '../assets/people-eating-hero.svg';
import People1 from '../assets/people-eating-1.svg';
import People2 from '../assets/people-eating-2.svg';
import People3 from '../assets/people-eating-3.svg';
// Local photo used in the About section — SVG fallback ensures it displays even if a JPG placeholder wasn't provided
import PeoplePhoto from '../assets/people-eating-photo.svg';

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
    // adminSecret removed — admin creation is not allowed via public registration
  });
  
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  
  const { login, register, user, loading } = useAuth();
  const navigate = useNavigate();

  // Do NOT automatically redirect logged-in users away from the landing page.
  // Keeping the IndexPage visible is a better UX — provide an explicit "Go to dashboard" button below
  // if the user is authenticated instead of forcing a redirect on mount.

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
        // Disallow public admin registration — register-admin requires super-admin auth
        if (registerData.role === 'admin') {
          setRegisterError('Admin accounts cannot be created via public registration. Contact the super-admin.');
          setRegisterLoading(false);
          return;
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

    const roleHero = {
      food_donor: {
        title: 'List surplus food — Reduce waste and help others',
        subtitle: 'Share extra meals and connect with organizations in need. Quick, safe, and impactful.'
      },
      recipient_org: {
        title: 'Request donations — Feed your community',
        subtitle: 'Request nutritious food donations and coordinate deliveries for the people you serve.'
      },
      data_analyst: {
        title: 'Analyze impact — Turn data into action',
        subtitle: 'Track trends, uncover hotspots of waste, and measure the platform’s impact.'
      },
      admin: {
        title: 'Manage the platform',
        subtitle: 'Admins maintain users, listings and analytics to ensure the system runs smoothly.'
      }
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
              onClick={() => {
                setActiveRole('food_donor');
                setLoginData({...loginData, role: 'food_donor'});
                setRegisterData({...registerData, role: 'food_donor'});
              }}
            >
              Food Donor
            </button>
            <button 
              className={`role-button ${activeRole === 'recipient_org' ? 'active' : ''}`}
              onClick={() => {
                setActiveRole('recipient_org');
                setLoginData({...loginData, role: 'recipient_org'});
                setRegisterData({...registerData, role: 'recipient_org'});
              }}
            >
              Recipient
            </button>
            {/* Admin role is not shown here to prevent users from registering admins from the UI */}
            <button 
              className={`role-button ${activeRole === 'data_analyst' ? 'active' : ''}`}
              onClick={() => {
                setActiveRole('data_analyst');
                setLoginData({...loginData, role: 'data_analyst'});
                setRegisterData({...registerData, role: 'data_analyst'});
              }}
            >
              Data Analyst
            </button>
          </nav>
          <div className="auth-nav">
            <a className="role-about" href="#about">About</a>
            <button
              className="role-login"
              onClick={() => navigate(`/login?role=${activeRole}`)}
            >
              Login
            </button>
            <button
              className="role-register"
              onClick={() => navigate(`/register?role=${activeRole}`)}
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h2>{roleHero[activeRole]?.title ?? 'Reduce Food Waste, Help Communities'}</h2>
            <p className="quote">
              "Food recovery and redistribution are key strategies for reducing food waste while addressing food insecurity."
            </p>
            <p className="stats role-subtitle">
              {roleHero[activeRole]?.subtitle}
            </p>
            <p className="stats">
              <span className="stat-number">1.3 BILLION TONS</span> of food wasted annually worldwide
            </p>
            <div className="cta-buttons">
                <button
                  className="btn-primary"
                  onClick={() => {
                    // ensure modal opens with selected role
                    setLoginData({...loginData, role: activeRole});
                    setShowLogin(true);
                  }}
                >
                  {`Login as ${activeRole === 'food_donor' ? 'Food Donor' : activeRole === 'recipient_org' ? 'Recipient' : 'Data Analyst'}`}
                </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  // pre-select role for registration modal
                  setRegisterData({...registerData, role: activeRole});
                  setShowRegister(true);
                }}
              >
                {`Register as ${activeRole === 'food_donor' ? 'Food Donor' : activeRole === 'recipient_org' ? 'Recipient' : 'Data Analyst'}`}
              </button>
              {/* If a user is already logged in, make it obvious how to reach their dashboard */}
              {user && (
                <button
                  className="btn-ghost"
                  onClick={() => {
                    // Navigate to the correct dashboard for the authenticated user's role
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
                        navigate('/');
                    }
                  }}
                >
                  Go to dashboard
                </button>
              )}
            </div>
          </div>
          <div className="hero-image">
            {/* use a local SVG hero to avoid external dependencies */}
            <img src={HeroPeople} alt="People sharing a meal illustration" />
            <div className="hero-photo-caption">Connecting donors and recipients</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <div className="about-image">
            <img src={PeoplePhoto} alt="Children eating together" />
          </div>
          <div className="about-text">
            <h2>About — FEDF Food Waste Reduction Platform</h2>
            <p>
              Build a platform to track and reduce food waste. The app offers solutions to manage food resources more efficiently, help people understand the impact of food waste, and improve overall food security.
            </p>
            <ul>
              <li><strong>Admin:</strong> Manage platform content, oversee user interactions, and ensure data accuracy.</li>
              <li><strong>Food Donor:</strong> List surplus food, coordinate donations, and track impact.</li>
              <li><strong>Recipient Organization:</strong> Request food donations, manage logistics, and distribute to those in need.</li>
              <li><strong>Data Analyst:</strong> Track food waste trends, analyze data, and generate reports to improve efficiency.</li>
            </ul>
            <p className="about-note">This project focuses on reducing waste and improving food security by connecting donors and recipients, with admin controls and analytics to measure impact.</p>
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
              // open login modal with admin role preselected — admin login remains available
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
          <div className="gallery-item">
            <img src={PeoplePhoto} alt="People eating — photo" />
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
                  <option value="admin">Administrator</option>
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
                    {/* Admin option removed — admins are created only by the super-admin */}
                </select>
              </div>
              
              {/* Admin creation is not supported via the public registration modal */}
              
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