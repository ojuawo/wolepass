import axios from 'axios';

const api = axios.create({
  baseURL: 'https://wolepass.komunisconcept.org.ng/wolepass_api/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wolepass_token');
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
