import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin API functions
export const adminAPI = {
  // Dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // History
  getHistory: () => api.get('/admin/history'),
  
  // Matched donations
  getMatchedDonations: () => api.get('/admin/matched'),
  
  // Requests
  getAllRequests: (status = '') => {
    const url = status ? `/admin/requests?status=${status}` : '/admin/requests';
    return api.get(url);
  },
  
  // Update donation status
  updateDonationStatus: (donationId, status) => 
    api.patch(`/admin/donation/${donationId}/status`, { status }),
};

export default api;
