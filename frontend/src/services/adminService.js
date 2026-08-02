import api from './api';

export const adminService = {
  creditUser: async (traderId, amount, description, paymentMethod) => {
    const { data } = await api.post('/admin/credit-user', {
      traderId,
      amount,
      description,
      paymentMethod
    });
    return data;
  },

  getUsers: async (page = 1, limit = 20) => {
    const { data } = await api.get('/admin/users', {
      params: { page, limit }
    });
    return data;
  },

  getUserTransactions: async (userId) => {
    const { data } = await api.get(`/admin/users/${userId}/transactions`);
    return data;
  },

  suspendUser: async (userId) => {
    const { data } = await api.put(`/admin/users/${userId}/suspend`);
    return data;
  },

  getStats: async () => {
    const { data } = await api.get('/admin/stats');
    return data;
  },
};
