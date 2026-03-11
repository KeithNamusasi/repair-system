import { useState, useEffect } from 'react';
import api from '../api';

function Repairs() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    device: '',
    problemDescription: '',
    repairCost: '',
    status: 'Pending',
  });

  useEffect(() => {
    loadRepairs();
  }, []);

  const loadRepairs = async () => {
    try {
      const data = await api.getRepairs();
      setRepairs(data);
    } catch (error) {
      console.error('Error loading repairs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createRepair({
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        device: formData.device,
        problemDescription: formData.problemDescription,
        repairCost: parseFloat(formData.repairCost) || 0,
        status: formData.status,
      });

      loadRepairs();
      setShowModal(false);
      setFormData({
        customerName: '',
        phoneNumber: '',
        device: '',
        problemDescription: '',
        repairCost: '',
        status: 'Pending',
      });
    } catch (error) {
      console.error('Error creating repair:', error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.updateRepair(id, { status: newStatus });
      loadRepairs();
    } catch (error) {
      console.error('Error updating repair:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Repair':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Collected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPendingCount = () => repairs.filter(r => r.status === 'Pending').length;
  const getInProgressCount = () => repairs.filter(r => r.status === 'In Repair').length;
  const getCompletedCount = () => repairs.filter(r => r.status === 'Completed').length;
  const getCollectedCount = () => repairs.filter(r => r.status === 'Collected').length;
  const getTotalEarnings = () => repairs
    .filter(r => r.status === 'Completed' || r.status === 'Collected')
    .reduce((sum, r) => sum + (r.repairCost || 0), 0);

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
        <h1 className="text-2xl font-bold text-gray-900">Repairs</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
        >
          New Repair
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-gray-900">{getPendingCount()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">In Repair</p>
          <p className="text-2xl font-bold text-gray-900">{getInProgressCount()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-gray-900">{getCompletedCount()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-gray-500">
          <p className="text-sm text-gray-500">Collected</p>
          <p className="text-2xl font-bold text-gray-900">{getCollectedCount()}</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow p-4 text-white">
          <p className="text-sm text-green-100">Total Earnings</p>
          <p className="text-2xl font-bold">KES {getTotalEarnings().toFixed(2)}</p>
        </div>
      </div>

      {/* Repairs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {repairs.map((repair) => (
                <tr key={repair._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(repair.dateReceived).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{repair.customerName}</div>
                    <div className="text-sm text-gray-500">{repair.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{repair.device}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{repair.problemDescription}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(repair.status)}`}>
                      {repair.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {(repair.status === 'Completed' || repair.status === 'Collected') ? (
                      <span className="text-green-600">KES {repair.repairCost?.toFixed(2) || '0.00'}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={repair.status}
                      onChange={(e) => updateStatus(repair._id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Repair">In Repair</option>
                      <option value="Completed">Completed</option>
                      <option value="Collected">Collected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">New Repair</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Device</label>
                <input
                  type="text"
                  required
                  value={formData.device}
                  onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., iPhone 12, Samsung S21"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Problem Description</label>
                <textarea
                  required
                  value={formData.problemDescription}
                  onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Cost (KES)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.repairCost}
                  onChange={(e) => setFormData({ ...formData, repairCost: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">Cost will be shown when repair is completed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Repair">In Repair</option>
                  <option value="Completed">Completed</option>
                </select>
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
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                >
                  Add Repair
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Repairs;
