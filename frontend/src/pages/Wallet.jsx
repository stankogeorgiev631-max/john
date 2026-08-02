import React, { useState, useEffect } from 'react';
import { Send, Plus, TrendingUp, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Wallet = () => {
  const [walletData, setWalletData] = useState({
    totalBalance: 0,
    availableBalance: 0,
    lockedBalance: 0,
    currency: 'USD',
  });
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      const [walletRes, transactionsRes] = await Promise.all([
        api.get('/wallet'),
        api.get('/wallet/transactions'),
      ]);

      setWalletData(walletRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      toast.error('Failed to load wallet data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await api.post('/wallet/deposit', { amount: parseFloat(depositAmount) });
      toast.success('Deposit initiated successfully');
      setShowDepositModal(false);
      setDepositAmount('');
      fetchWalletData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deposit failed');
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(withdrawAmount) > walletData.availableBalance) {
      toast.error('Insufficient balance for withdrawal');
      return;
    }

    try {
      await api.post('/wallet/withdraw', { amount: parseFloat(withdrawAmount) });
      toast.success('Withdrawal initiated successfully');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      fetchWalletData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Withdrawal failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-gray-400">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Wallet</h1>
        <p className="text-gray-400">Manage your balance and transactions</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-accent to-accent-dark rounded-lg p-8 mb-8 shadow-xl">
        <div className="flex justify-between items-start mb-12">
          <div>
            <p className="text-accent/60 text-sm font-medium mb-2">Total Balance</p>
            <div className="flex items-center space-x-3">
              <h2 className="text-4xl font-bold text-white">
                {showBalance ? `$${walletData.totalBalance.toFixed(2)}` : '••••••'}
              </h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/60 hover:text-white transition-colors"
              >
                {showBalance ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-accent/60 text-sm font-medium mb-1">Currency</p>
            <p className="text-2xl font-bold text-white">{walletData.currency}</p>
          </div>
        </div>

        {/* Balance Breakdown */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Unlock size={16} className="text-green-400" />
              <p className="text-sm text-white/60">Available</p>
            </div>
            <p className="text-2xl font-bold text-green-400">
              ${walletData.availableBalance.toFixed(2)}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Lock size={16} className="text-orange-400" />
              <p className="text-sm text-white/60">Locked</p>
            </div>
            <p className="text-2xl font-bold text-orange-400">
              ${walletData.lockedBalance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => setShowDepositModal(true)}
            className="flex-1 flex items-center justify-center space-x-2 bg-white text-accent font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Plus size={20} />
            <span>Deposit</span>
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex-1 flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <Send size={20} />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-darker border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <TrendingUp size={24} />
            <span>Transaction History</span>
          </h2>
        </div>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-dark">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Reference</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-700 hover:bg-dark/50 transition-colors">
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          tx.type === 'deposit'
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-red-900/30 text-red-400'
                        }`}
                      >
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          tx.status === 'completed'
                            ? 'bg-blue-900/30 text-blue-400'
                            : tx.status === 'pending'
                            ? 'bg-yellow-900/30 text-yellow-400'
                            : 'bg-red-900/30 text-red-400'
                        }`}
                      >
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm font-mono">{tx.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <TrendingUp className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-400">No transactions yet</p>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-darker border border-gray-700 rounded-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Deposit Funds</h2>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="1000"
                  step="0.01"
                  className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  Please note: Deposits are processed within 1-2 business days. You will receive a confirmation email.
                </p>
              </div>

              <div className="flex space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositAmount('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors font-medium"
                >
                  Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-darker border border-gray-700 rounded-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Withdraw Funds</h2>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount (USD)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="500"
                  step="0.01"
                  className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Available: ${walletData.availableBalance.toFixed(2)}
                </p>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <p className="text-sm text-yellow-300">
                  Please note: Withdrawals are processed within 3-5 business days. A 1% withdrawal fee will be charged.
                </p>
              </div>

              <div className="flex space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawAmount('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors font-medium"
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
