import api from './api';

export const botService = {
  createBot: async (botData) => {
    const { data } = await api.post('/bot/create', botData);
    return data;
  },

  getBots: async () => {
    const { data } = await api.get('/bot/list');
    return data;
  },

  updateBot: async (botId, botData) => {
    const { data } = await api.put(`/bot/${botId}`, botData);
    return data;
  },

  deleteBot: async (botId) => {
    const { data } = await api.delete(`/bot/${botId}`);
    return data;
  },

  startBot: async (botId) => {
    const { data } = await api.post(`/bot/${botId}/start`);
    return data;
  },

  stopBot: async (botId) => {
    const { data } = await api.post(`/bot/${botId}/stop`);
    return data;
  },

  getBotPerformance: async (botId) => {
    const { data } = await api.get(`/bot/${botId}/performance`);
    return data;
  },
};
