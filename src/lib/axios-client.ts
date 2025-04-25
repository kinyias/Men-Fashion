import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthTokens } from '@/types';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });
        
        // Save the new tokens
        setAuthTokens(data);
        
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout the user
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/auth/login?session=expired';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to set auth tokens
export const setAuthTokens = (tokens: AuthTokens) => {
  const { accessToken, refreshToken } = tokens;
  
  // Store tokens in cookies
  Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'strict' });
  Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict' });
  
  // Update axios headers
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

// Helper function to clear auth tokens
export const clearAuthTokens = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  delete api.defaults.headers.common.Authorization;
};

export default api;