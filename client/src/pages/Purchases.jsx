import { useState, useEffect } from 'react';
import api from '../api';

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    supplier: '',
    quantity: 1,
    buyingPrice: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [purchasesData, productsData] = await Promise.all([
        api.getPurchases(),
        api.getProducts(),
      ]);
      setPurchases(purchasesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createPurchase({
        productId: formData.productId,
        supplier: formData.supplier,
        quantity: parseInt(formData.quantity),
        buyingPrice: parseFloat(formData.buyingPrice),
      });

      loadData();
      setShowModal(false);
      setFormData({
        productId: '',
        supplier: '',
        quantity: 1,
        buyingPrice: '',
      });
    } catch (error) {
      console.error('Error creating purchase:', error);
    }
  };

  const getTotalPurchases = () => purchases.reduce((sum, p) => sum + p.totalCost, 0);

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
        <h1 className="text-2xl font-bold text-gray-900">Purchases</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          New Purchase
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-sm font-medium text-gray-500">Total Purchases</p>
        <p className="text-2xl font-bold text-gray-900">KES {getTotalPurchases().toFixed(2)}</p>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(purchase.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{purchase.supplier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES {purchase.buyingPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">KES {purchase.totalCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">New Purchase</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <select
                  required
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Supplier</label>
                <input
                  type="text"
                  required
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Buying Price</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.buyingPrice}
                  onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Add Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Purchases;