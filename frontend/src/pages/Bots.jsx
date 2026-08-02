import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Play, Pause, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Bots = () => {
  const [bots, setBots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBot, setEditingBot] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    strategy: 'GRID',
    exchange: 'BINANCE',
    tradingPair: 'BTC/USDT',
    capital: '',
    riskPerTrade: 1,
  });

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/bots');
      setBots(response.data);
    } catch (error) {
      toast.error('Failed to load bots');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.capital) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingBot) {
        await api.put(`/bots/${editingBot.id}`, formData);
        toast.success('Bot updated successfully');
      } else {
        await api.post('/bots', formData);
        toast.success('Bot created successfully');
      }
      setShowModal(false);
      setFormData({
        name: '',
        strategy: 'GRID',
        exchange: 'BINANCE',
        tradingPair: 'BTC/USDT',
        capital: '',
        riskPerTrade: 1,
      });
      setEditingBot(null);
      fetchBots();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save bot');
    }
  };

  const handleEdit = (bot) => {
    setEditingBot(bot);
    setFormData({
      name: bot.name,
      strategy: bot.strategy,
      exchange: bot.exchange,
      tradingPair: bot.tradingPair,
      capital: bot.capital,
      riskPerTrade: bot.riskPerTrade,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bot?')) {
      try {
        await api.delete(`/bots/${id}`);
        toast.success('Bot deleted successfully');
        fetchBots();
      } catch (error) {
        toast.error('Failed to delete bot');
      }
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await api.patch(`/bots/${id}/toggle`, {
        status: currentStatus === 'active' ? 'inactive' : 'active',
      });
      toast.success('Bot status updated');
      fetchBots();
    } catch (error) {
      toast.error('Failed to toggle bot');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-gray-400">Loading bots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Trading Bots</h1>
          <p className="text-gray-400">Manage and monitor your automated trading bots</p>
        </div>
        <button
          onClick={() => {
            setEditingBot(null);
            setFormData({
              name: '',
              strategy: 'GRID',
              exchange: 'BINANCE',
              tradingPair: 'BTC/USDT',
              capital: '',
              riskPerTrade: 1,
            });
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          <Plus size={20} />
          <span>Create Bot</span>
        </button>
      </div>

      {/* Bots Grid */}
      {bots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <div
              key={bot.id}
              className="bg-darker border border-gray-700 rounded-lg p-6 hover:border-accent transition-colors"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{bot.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{bot.strategy} Strategy</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    bot.status === 'active'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-gray-900/30 text-gray-400'
                  }`}
                >
                  {bot.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Pair:</span>
                  <span className="font-medium">{bot.tradingPair}</span>
                </div>
                <div className="flex justify-between">
                  <span>Capital:</span>
                  <span className="font-medium">${bot.capital.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit:</span>
                  <span className={bot.profit >= 0 ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                    ${bot.profit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Trades:</span>
                  <span className="font-medium">{bot.tradeCount}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t border-gray-700">
                <button
                  onClick={() => handleToggle(bot.id, bot.status)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  {bot.status === 'active' ? (
                    <>
                      <Pause size={16} />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      <span>Start</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleEdit(bot)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(bot.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-darker border border-gray-700 rounded-lg p-12 text-center">
          <AlertCircle className="mx-auto text-gray-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No Bots Yet</h3>
          <p className="text-gray-400 mb-6">Start creating your first trading bot to get started</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Create Your First Bot</span>
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-darker border border-gray-700 rounded-lg max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingBot ? 'Edit Bot' : 'Create New Bot'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bot Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="My Trading Bot"
                  className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Strategy</label>
                <select
                  name="strategy"
                  value={formData.strategy}
                  onChange={handleChange}
                  className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                >
                  <option>GRID</option>
                  <option>DCA</option>
                  <option>MOMENTUM</option>
                  <option>SCALPING</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Exchange</label>
                <select
                  name="exchange"
                  value={formData.exchange}
                  onChange={handleChange}
                  className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                >
                  <option>BINANCE</option>
                  <option>COINBASE</option>
                  <option>KRAKEN</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Trading Pair</label>
                <input
                  type="text"
                  name="tradingPair"
                  value={formData.tradingPair}
                  onChange={handleChange}
                  placeholder="BTC/USDT"
                  className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Capital ($)</label>
                <input
                  type="number"
                  name="capital"
                  value={formData.capital}
                  onChange={handleChange}
                  placeholder="1000"
                  className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Risk Per Trade (%)</label>
                <input
                  type="number"
                  name="riskPerTrade"
                  value={formData.riskPerTrade}
                  onChange={handleChange}
                  placeholder="1"
                  className="w-full bg-dark border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors font-medium"
                >
                  {editingBot ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bots;
