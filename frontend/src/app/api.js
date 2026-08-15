import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const normalizedApiUrl = rawApiUrl.endsWith('/api/v1')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, '')}/api/v1`;

const api = axios.create({
  baseURL: normalizedApiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
