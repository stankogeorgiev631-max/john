import api from './api';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const { data } = await api.get('/auth/profile');
    return data;
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/auth/profile', profileData);
    return data;
  },
};
