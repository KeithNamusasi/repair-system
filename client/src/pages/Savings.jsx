import { useState, useEffect } from 'react';
import api from '../api';

function Savings() {
  const [savings, setSavings] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    note: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadSavings();
  }, []);

  const loadSavings = async () => {
    try {
      const [savingsData, salesData] = await Promise.all([
        api.getSavings(),
        api.getSales(),
      ]);
      setSavings(savingsData);
      setSales(salesData);
    } catch (error) {
      console.error('Error loading savings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalProfit = () => sales.reduce((sum, s) => sum + s.profit, 0);
  const getTotalSavings = () => savings.reduce((sum, s) => sum + s.amount, 0);
  const getAvailableSavings = () => getTotalProfit() - getTotalSavings();

  // Daily savings (today)
  const getDailySavings = () => {
    const today = new Date().toDateString();
    return savings
      .filter(s => new Date(s.date).toDateString() === today)
      .reduce((sum, s) => sum + s.amount, 0);
  };

  // Weekly savings (this week)
  const getWeeklySavings = () => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);
    return savings
      .filter(s => new Date(s.date) >= weekStart)
      .reduce((sum, s) => sum + s.amount, 0);
  };

  // Monthly savings (this month)
  const getMonthlySavings = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return savings
      .filter(s => new Date(s.date) >= monthStart)
      .reduce((sum, s) => sum + s.amount, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const amount = parseFloat(formData.amount);
    const available = getAvailableSavings();
    
    if (amount > available) {
      setError(`Cannot save more than available profit (KES ${available.toFixed(2)})`);
      return;
    }

    try {
      await api.createSaving({
        amount: parseFloat(formData.amount),
        note: formData.note,
      });

      loadSavings();
      setShowModal(false);
      setFormData({
        amount: '',
        note: '',
      });
    } catch (error) {
      console.error('Error creating saving:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Savings</h1>
        <button
          onClick={() => {
            setError('');
            setShowModal(true);
          }}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Add Savings
        </button>
      </div>

      {/* Savings Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl shadow-lg p-5 text-white">
          <p className="text-cyan-100 text-sm font-medium">Total Profit</p>
          <p className="text-2xl font-bold mt-1">KES {getTotalProfit().toFixed(2)}</p>
          <p className="text-cyan-200 text-xs mt-1">All time earnings</p>
        </div>

        <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl shadow-lg p-5 text-white">
          <p className="text-teal-100 text-sm font-medium">Total Savings</p>
          <p className="text-2xl font-bold mt-1">KES {getTotalSavings().toFixed(2)}</p>
          <p className="text-teal-200 text-xs mt-1">Already saved</p>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-5 text-white">
          <p className="text-green-100 text-sm font-medium">Available to Save</p>
          <p className="text-2xl font-bold mt-1">KES {getAvailableSavings().toFixed(2)}</p>
          <p className="text-green-200 text-xs mt-1">Can still save</p>
        </div>

        <div className="bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl shadow-lg p-5 text-white">
          <p className="text-violet-100 text-sm font-medium">Monthly Savings</p>
          <p className="text-2xl font-bold mt-1">KES {getMonthlySavings().toFixed(2)}</p>
          <p className="text-violet-200 text-xs mt-1">This month</p>
        </div>
      </div>

      {/* Period Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Today's Savings</p>
          <p className="text-xl font-bold text-gray-900">KES {getDailySavings().toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">This Week's Savings</p>
          <p className="text-xl font-bold text-gray-900">KES {getWeeklySavings().toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">This Month's Savings</p>
          <p className="text-xl font-bold text-gray-900">KES {getMonthlySavings().toFixed(2)}</p>
        </div>
      </div>

      {/* Savings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (KES)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {savings.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No savings recorded yet</td>
                </tr>
              ) : (
                savings.map((saving) => (
                  <tr key={saving._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(saving.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">KES {saving.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{saving.note || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Savings</h2>
            
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-700">
                Available to save: <strong>KES {getAvailableSavings().toFixed(2)}</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Savings cannot exceed total profit
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={getAvailableSavings()}
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Note (Optional)</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                  placeholder="What is this saving for?"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Add Savings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Savings;
