import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials)
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users'),
  verifyUser: (id, isVerified) => api.put(`/users/${id}/verify`, { isVerified }),
  toggleUserActive: (id, isActive) => api.put(`/users/${id}/active`, { isActive }),
  getDonors: () => api.get('/users/donors'),
  getRecipients: () => api.get('/users/recipients')
};

// Food Listings API
export const foodListingsAPI = {
  getAll: (params) => api.get('/food-listings', { params }),
  getAvailable: () => api.get('/food-listings/available'),
  getMyListings: () => api.get('/food-listings/my-listings'),
  getById: (id) => api.get(`/food-listings/${id}`),
  create: (data) => api.post('/food-listings', data),
  update: (id, data) => api.put(`/food-listings/${id}`, data),
  delete: (id) => api.delete(`/food-listings/${id}`)
};

// Donations API
export const donationsAPI = {
  getAll: () => api.get('/donations'),
  getMyDonations: () => api.get('/donations/my-donations'),
  getMyRequests: () => api.get('/donations/my-requests'),
  getById: (id) => api.get(`/donations/${id}`),
  create: (data) => api.post('/donations', data),
  updateStatus: (id, data) => api.put(`/donations/${id}/status`, data)
};

// Analytics API
export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getTrends: (params) => api.get('/analytics/trends', { params }),
  getCategoryBreakdown: () => api.get('/analytics/category-breakdown'),
  getTopDonors: (limit) => api.get('/analytics/top-donors', { params: { limit } }),
  getTopRecipients: (limit) => api.get('/analytics/top-recipients', { params: { limit } }),
  getImpactReport: (params) => api.get('/analytics/impact-report', { params })
};

export default api;
