import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBalance: 0,
    activeBotsCount: 0,
    totalProfit: 0,
    dailyProfit: 0,
  });
  const [bots, setBots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, botsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/bots'),
      ]);

      setStats(statsRes.data);
      setBots(botsRes.data.slice(0, 5)); // Show top 5 bots
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, change, isPositive }) => (
    <div className="bg-darker border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm font-medium">{label}</span>
        <div className="bg-accent/10 p-3 rounded-lg">
          <Icon className="text-accent" size={20} />
        </div>
      </div>
      <div className="mb-2">
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      {change !== undefined && (
        <div className="flex items-center space-x-1">
          {isPositive ? (
            <TrendingUp className="text-green-500" size={16} />
          ) : (
            <TrendingDown className="text-red-500" size={16} />
          )}
          <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
            {isPositive ? '+' : ''}{change}%
          </span>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-400">Here's your trading bot performance overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={DollarSign}
          label="Total Balance"
          value={`$${stats.totalBalance.toFixed(2)}`}
          change={5.2}
          isPositive={true}
        />
        <StatCard
          icon={Zap}
          label="Active Bots"
          value={stats.activeBotsCount}
        />
        <StatCard
          icon={TrendingUp}
          label="Total Profit"
          value={`$${stats.totalProfit.toFixed(2)}`}
          change={12.5}
          isPositive={true}
        />
        <StatCard
          icon={Activity}
          label="Daily Profit"
          value={`$${stats.dailyProfit.toFixed(2)}`}
          change={3.2}
          isPositive={true}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button className="bg-accent hover:bg-accent-dark text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Create New Bot
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          View Analytics
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Connect Exchange
        </button>
      </div>

      {/* Recent Bots Table */}
      <div className="bg-darker border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Activity size={24} />
            <span>Recent Trading Bots</span>
          </h2>
        </div>
        
        {bots.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 bg-dark">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Bot Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Strategy</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Profit</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Trades</th>
                </tr>
              </thead>
              <tbody>
                {bots.map((bot) => (
                  <tr key={bot.id} className="border-b border-gray-700 hover:bg-dark/50 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{bot.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          bot.status === 'active'
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-gray-900/30 text-gray-400'
                        }`}
                      >
                        {bot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{bot.strategy}</td>
                    <td className="px-6 py-4">
                      <span className={bot.profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                        ${bot.profit.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{bot.tradeCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <AlertCircle className="mx-auto text-gray-500 mb-2" size={32} />
            <p className="text-gray-400">No bots created yet. Start by creating your first trading bot!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
