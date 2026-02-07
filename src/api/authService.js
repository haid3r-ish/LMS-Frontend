import api from './axios.js';

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    // --- FIX: Check for 'sessionCookie' OR 'token' ---
    const token = response.data.sessionCookie || response.data.token;
    
    if (token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', token); // We always save it as 'token' locally
    }
    return response.data;
  },

  // Signup
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    
    // --- FIX: Check for 'sessionCookie' here too ---
    const token = response.data.sessionCookie || response.data.token;

    if (token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};