import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.gatekeep.com.ng/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gatekeep_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

export const initializeBilling = () => api.post('/billing/initialize');

export const registerEstate = (data) => api.post('/register', data);
