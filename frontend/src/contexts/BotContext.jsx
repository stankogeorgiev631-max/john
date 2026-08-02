import React, { createContext, useState, useCallback } from 'react';
import { botService } from '../services/botService';

export const BotContext = createContext();

export const BotProvider = ({ children }) => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await botService.getBots();
      setBots(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bots');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBot = useCallback(async (botData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await botService.createBot(botData);
      setBots([...bots, data]);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create bot';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [bots]);

  const updateBot = useCallback(async (botId, botData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await botService.updateBot(botId, botData);
      setBots(bots.map(bot => bot.id === botId ? data : bot));
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update bot';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [bots]);

  const deleteBot = useCallback(async (botId) => {
    try {
      setLoading(true);
      setError(null);
      await botService.deleteBot(botId);
      setBots(bots.filter(bot => bot.id !== botId));
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete bot';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [bots]);

  const startBot = useCallback(async (botId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await botService.startBot(botId);
      setBots(bots.map(bot => bot.id === botId ? data : bot));
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to start bot';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [bots]);

  const stopBot = useCallback(async (botId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await botService.stopBot(botId);
      setBots(bots.map(bot => bot.id === botId ? data : bot));
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to stop bot';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [bots]);

  const value = {
    bots,
    loading,
    error,
    fetchBots,
    createBot,
    updateBot,
    deleteBot,
    startBot,
    stopBot,
  };

  return (
    <BotContext.Provider value={value}>
      {children}
    </BotContext.Provider>
  );
};

export const useBot = () => {
  const context = React.useContext(BotContext);
  if (!context) {
    throw new Error('useBot must be used within a BotProvider');
  }
  return context;
};
