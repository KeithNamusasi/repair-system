import { useState, useEffect } from 'react';
import api from '../api';

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    paymentMethod: 'Cash',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salesData, productsData] = await Promise.all([
        api.getSales(),
        api.getProducts(),
      ]);
      setSales(salesData);
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
      const selectedProduct = products.find((p) => p._id === formData.productId);
      
      if (!selectedProduct) {
        alert('Please select a product');
        return;
      }

      if (selectedProduct.stockQuantity < formData.quantity) {
        alert('Insufficient stock');
        return;
      }

      await api.createSale({
        productId: formData.productId,
        quantity: parseInt(formData.quantity),
        paymentMethod: formData.paymentMethod,
      });

      loadData();
      setShowModal(false);
      setFormData({
        productId: '',
        quantity: 1,
        paymentMethod: 'Cash',
      });
    } catch (error) {
      console.error('Error creating sale:', error);
    }
  };

  const getTotalSales = () => sales.reduce((sum, s) => sum + s.total, 0);
  const getTotalProfit = () => sales.reduce((sum, s) => sum + s.profit, 0);

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
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          New Sale
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold text-gray-900">KES {getTotalSales().toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Profit</p>
          <p className="text-2xl font-bold text-green-600">KES {getTotalProfit().toFixed(2)}</p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sale.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.productName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">KES {sale.sellingPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">KES {sale.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+KES {sale.profit.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.paymentMethod}</td>
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
            <h2 className="text-xl font-bold mb-4">New Sale</h2>
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
                  {products
                    .filter((p) => p.stockQuantity > 0)
                    .map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name} - ${product.sellPrice} (Stock: {product.stockQuantity})
                      </option>
                    ))}
                </select>
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
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  required
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="M-Pesa">M-Pesa</option>
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
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Complete Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sales;