import React, { createContext, useState, useCallback } from 'react';
import { walletService } from '../services/walletService';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await walletService.getBalance();
      setBalance(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (limit = 50, offset = 0) => {
    try {
      setLoading(true);
      setError(null);
      const data = await walletService.getTransactions(limit, offset);
      setTransactions(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  const deposit = useCallback(async (amount, paymentMethod) => {
    try {
      setLoading(true);
      setError(null);
      const data = await walletService.deposit(amount, paymentMethod);
      await fetchBalance();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Deposit failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBalance]);

  const withdraw = useCallback(async (amount, walletAddress) => {
    try {
      setLoading(true);
      setError(null);
      const data = await walletService.withdraw(amount, walletAddress);
      await fetchBalance();
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Withdrawal failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchBalance]);

  const value = {
    balance,
    transactions,
    loading,
    error,
    fetchBalance,
    fetchTransactions,
    deposit,
    withdraw,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
