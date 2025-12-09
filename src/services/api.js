
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
  // change to your backend URL when deploying:
  // baseURL: 'https://your-server.com/api',
});

// Automatically attach JWT token (if you add login later)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
