import api from './api';

export const walletService = {
  getBalance: async () => {
    const { data } = await api.get('/credits/wallet-balance');
    return data;
  },

  getTransactions: async (limit = 50, offset = 0) => {
    const { data } = await api.get('/credits/transactions', {
      params: { limit, offset }
    });
    return data;
  },

  deposit: async (amount, paymentMethod) => {
    const { data } = await api.post('/credits/deposit', {
      amount,
      paymentMethod
    });
    return data;
  },

  withdraw: async (amount, walletAddress) => {
    const { data } = await api.post('/credits/withdraw', {
      amount,
      walletAddress
    });
    return data;
  },

  transfer: async (recipientId, amount, description) => {
    const { data } = await api.post('/credits/transfer', {
      recipientId,
      amount,
      description
    });
    return data;
  },

  swap: async (fromCurrency, toCurrency, amount) => {
    const { data } = await api.post('/crypto/swap', {
      fromCurrency,
      toCurrency,
      amount
    });
    return data;
  },
};
