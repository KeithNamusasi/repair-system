import { useState, useEffect } from 'react';
import api from '../api';

function Reports() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('daily');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, salesData, repairsData] = await Promise.all([
        api.getProducts(),
        api.getSales(),
        api.getRepairs(),
      ]);
      setProducts(productsData);
      setSales(salesData);
      setRepairs(repairsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDailySales = () => {
    const today = new Date().toDateString();
    return sales.filter((s) => new Date(s.date).toDateString() === today);
  };

  const getMonthlyProfit = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return sales
      .filter((s) => new Date(s.date) >= startOfMonth)
      .reduce((sum, s) => sum + s.profit, 0);
  };

  const getRepairIncome = () => {
    return repairs
      .filter((r) => r.status === 'Completed' || r.status === 'Collected')
      .reduce((sum, r) => sum + r.repairCost, 0);
  };

  const getLowStockProducts = () => {
    return products.filter((p) => p.stockQuantity < 5);
  };

  const getTotalSales = () => sales.reduce((sum, s) => sum + s.total, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const dailySales = getDailySales();
  const monthlyProfit = getMonthlyProfit();
  const lowStockProducts = getLowStockProducts();
  const repairIncome = getRepairIncome();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('daily')}
          className={`pb-2 px-1 ${activeTab === 'daily' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Daily Sales
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`pb-2 px-1 ${activeTab === 'monthly' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Monthly Profit
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`pb-2 px-1 ${activeTab === 'stock' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Product Stock
        </button>
        <button
          onClick={() => setActiveTab('repairs')}
          className={`pb-2 px-1 ${activeTab === 'repairs' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          Repair Income
        </button>
      </div>

      {/* Daily Sales */}
      {activeTab === 'daily' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Daily Sales Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Sales Today</p>
              <p className="text-2xl font-bold text-green-600">
                ${dailySales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Profit Today</p>
              <p className="text-2xl font-bold text-blue-600">
                ${dailySales.reduce((sum, s) => sum + s.profit, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Transactions Today</p>
              <p className="text-2xl font-bold text-purple-600">{dailySales.length}</p>
            </div>
          </div>
          
          <h3 className="text-md font-semibold mb-2">Sales Details</h3>
          {dailySales.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No sales today</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dailySales.map((sale) => (
                  <tr key={sale._id}>
                    <td className="px-4 py-2 text-sm">{sale.productName}</td>
                    <td className="px-4 py-2 text-sm">{sale.quantity}</td>
                    <td className="px-4 py-2 text-sm">${sale.total.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm text-green-600">+${sale.profit.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Monthly Profit */}
      {activeTab === 'monthly' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Profit Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Sales (All Time)</p>
              <p className="text-2xl font-bold text-green-600">${getTotalSales().toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Profit (All Time)</p>
              <p className="text-2xl font-bold text-blue-600">
                ${sales.reduce((sum, s) => sum + s.profit, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Profit This Month</p>
              <p className="text-2xl font-bold text-purple-600">${monthlyProfit.toFixed(2)}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-yellow-600">{sales.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Stock */}
      {activeTab === 'stock' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Product Stock Report</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Total Products: {products.length}</p>
            <p className="text-sm text-red-600">Low Stock Alerts: {lowStockProducts.length}</p>
          </div>
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Category</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Buy Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Sell Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id} className={product.stockQuantity < 5 ? 'bg-red-50' : ''}>
                  <td className="px-4 py-2 text-sm font-medium">{product.name}</td>
                  <td className="px-4 py-2 text-sm">{product.category}</td>
                  <td className="px-4 py-2 text-sm">${product.buyPrice}</td>
                  <td className="px-4 py-2 text-sm">${product.sellPrice}</td>
                  <td className="px-4 py-2 text-sm">
                    <span className={product.stockQuantity < 5 ? 'text-red-600 font-semibold' : ''}>
                      {product.stockQuantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Repair Income */}
      {activeTab === 'repairs' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Repair Income Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Repair Income</p>
              <p className="text-2xl font-bold text-green-600">${repairIncome.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Repairs</p>
              <p className="text-2xl font-bold text-blue-600">{repairs.length}</p>
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Customer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Device</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {repairs.map((repair) => (
                <tr key={repair._id}>
                  <td className="px-4 py-2 text-sm">{new Date(repair.dateReceived).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-sm">{repair.customerName}</td>
                  <td className="px-4 py-2 text-sm">{repair.device}</td>
                  <td className="px-4 py-2 text-sm">{repair.status}</td>
                  <td className="px-4 py-2 text-sm font-medium">${repair.repairCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reports;