import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getBackendUrl = (path = '') => {
  if (!path) return '';

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const backendOrigin = API_URL.replace(/\/api\/?$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${backendOrigin}${normalizedPath}`;
};

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecoamigos_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;