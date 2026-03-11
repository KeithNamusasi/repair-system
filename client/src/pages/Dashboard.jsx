import { useState, useEffect } from 'react';
import api from '../api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

function Dashboard() {
  const [stats, setStats] = useState({
    totalSalesToday: 0,
    totalPurchases: 0,
    totalProfit: 0,
    totalProducts: 0,
    pendingRepairs: 0,
    lowStockAlerts: 0,
    totalSavings: 0,
    totalRevenue: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [recentSavings, setRecentSavings] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [repairStatusData, setRepairStatusData] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [profitVsSavings, setProfitVsSavings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [products, sales, repairs, purchases, savings] = await Promise.all([
        api.getProducts(),
        api.getSales(),
        api.getRepairs(),
        api.getPurchases(),
        api.getSavings(),
      ]);

      const today = new Date().toDateString();
      const todaySales = sales.filter((s) => new Date(s.date).toDateString() === today);
      
      const totalSalesToday = todaySales.reduce((sum, s) => sum + s.total, 0);
      const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
      const totalPurchases = purchases.reduce((sum, p) => sum + p.totalCost, 0);
      const totalSavings = savings.reduce((sum, s) => sum + s.amount, 0);
      const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
      const pendingRepairs = repairs.filter((r) => r.status === 'Pending').length;
      const inProgressRepairs = repairs.filter((r) => r.status === 'In Repair').length;
      const completedRepairs = repairs.filter((r) => r.status === 'Completed').length;
      const lowStockAlerts = products.filter((p) => p.stockQuantity < 5).length;

      setStats({
        totalSalesToday,
        totalPurchases,
        totalProfit,
        totalProducts: products.length,
        pendingRepairs,
        lowStockAlerts,
        totalSavings,
        totalRevenue,
      });

      setRecentSales(todaySales.slice(0, 5));
      setRecentPurchases(purchases.slice(0, 5));
      setRecentSavings(savings.slice(0, 5));

      // Calculate sales trend for last 7 days
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const daySales = sales.filter((s) => new Date(s.date).toDateString() === dateStr);
        const dayPurchases = purchases.filter((p) => new Date(p.date).toDateString() === dateStr);
        last7Days.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          sales: daySales.reduce((sum, s) => sum + s.total, 0),
          profit: daySales.reduce((sum, s) => sum + s.profit, 0),
          purchases: dayPurchases.reduce((sum, p) => sum + p.totalCost, 0),
        });
      }
      setSalesTrend(last7Days);

      // Calculate category distribution
      const categoryMap = {};
      products.forEach((p) => {
        const cat = p.category || 'Uncategorized';
        categoryMap[cat] = (categoryMap[cat] || 0) + p.stockQuantity;
      });
      setCategoryData(
        Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
      );

      // Calculate repair status distribution
      setRepairStatusData([
        { name: 'Pending', value: pendingRepairs },
        { name: 'In Repair', value: inProgressRepairs },
        { name: 'Completed', value: completedRepairs },
      ].filter(d => d.value > 0));

      // Calculate supplier distribution from purchases
      const supplierMap = {};
      purchases.forEach((p) => {
        const supplier = p.supplier || 'Unknown';
        supplierMap[supplier] = (supplierMap[supplier] || 0) + p.totalCost;
      });
      setSupplierData(
        Object.entries(supplierMap).map(([name, value]) => ({ name, value: Math.round(value) }))
      );

      // Profit vs Savings comparison
      setProfitVsSavings([
        { name: 'Total Profit', value: Math.round(totalProfit), fill: '#10B981' },
        { name: 'Total Savings', value: Math.round(totalSavings), fill: '#06B6D4' },
        { name: 'Purchases', value: Math.round(totalPurchases), fill: '#F59E0B' },
        { name: 'Revenue', value: Math.round(totalRevenue), fill: '#8B5CF6' },
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales Today */}
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Sales Today</p>
              <p className="text-3xl font-bold mt-1">KES {stats.totalSalesToday.toFixed(2)}</p>
              <p className="text-green-200 text-xs mt-1">Revenue generated today</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Profit */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Profit</p>
              <p className="text-3xl font-bold mt-1">KES {stats.totalProfit.toFixed(2)}</p>
              <p className="text-blue-200 text-xs mt-1">All time earnings</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Savings */}
        <div className="bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm font-medium">Total Savings</p>
              <p className="text-3xl font-bold mt-1">KES {stats.totalSavings.toFixed(2)}</p>
              <p className="text-cyan-200 text-xs mt-1">Business savings</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">KES {stats.totalRevenue.toFixed(2)}</p>
              <p className="text-violet-200 text-xs mt-1">Gross revenue</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Products</p>
              <p className="text-3xl font-bold mt-1">{stats.totalProducts}</p>
              <p className="text-purple-200 text-xs mt-1">In inventory</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Repairs */}
        <div className="bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Pending Repairs</p>
              <p className="text-3xl font-bold mt-1">{stats.pendingRepairs}</p>
              <p className="text-amber-200 text-xs mt-1">Awaiting action</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Low Stock</p>
              <p className="text-3xl font-bold mt-1">{stats.lowStockAlerts}</p>
              <p className="text-red-200 text-xs mt-1">Need restocking</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Purchases */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl shadow-lg p-5 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Purchases</p>
              <p className="text-3xl font-bold mt-1">KES {stats.totalPurchases.toFixed(2)}</p>
              <p className="text-orange-200 text-xs mt-1">Inventory costs</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales & Profit Trend Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">📈 Sales & Profit Trend (7 Days)</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  name="Sales (KES)"
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                  name="Profit (KES)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Categories Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">📦 Products by Category</h2>
          </div>
          <div className="h-72">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={true}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} units`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-16 h-16 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p>No products available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Overview Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">💼 Business Overview</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitVsSavings} layout="vertical" barSize={40}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#6B7280" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={11} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => `KES ${value.toFixed(2)}`}
                  cursor={{ fill: '#F3F4F6' }}
                />
                <Bar dataKey="value" name="Amount (KES)" radius={[0, 4, 4, 0]}>
                  {profitVsSavings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Repair Status Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">🔧 Repair Status</h2>
          </div>
          <div className="h-72">
            {repairStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repairStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                  <YAxis stroke="#6B7280" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="value" name="Repairs" radius={[8, 8, 0, 0]} barSize={60}>
                    {repairStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-16 h-16 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>No repairs recorded</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">🛒 Recent Sales</h2>
              <span className="text-sm text-green-600 font-medium">Today</span>
            </div>
          </div>
          <div className="p-5">
            {recentSales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">No sales today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div key={sale._id} className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{sale.productName}</p>
                        <p className="text-xs text-gray-500">Qty: {sale.quantity} × ${sale.sellingPrice}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">${sale.total.toFixed(2)}</p>
                      <p className="text-xs text-green-600 font-medium">+${sale.profit.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">📥 Recent Purchases</h2>
              <span className="text-sm text-orange-600 font-medium">Inventory</span>
            </div>
          </div>
          <div className="p-5">
            {recentPurchases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-sm">No purchases yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPurchases.slice(0, 5).map((purchase) => (
                  <div key={purchase._id} className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{purchase.supplier || 'Supplier'}</p>
                        <p className="text-xs text-gray-500">Qty: {purchase.quantity} × ${purchase.buyingPrice}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-sm">${purchase.totalCost.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{new Date(purchase.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Savings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-cyan-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">💰 Recent Savings</h2>
              <span className="text-sm text-cyan-600 font-medium">Business</span>
            </div>
          </div>
          <div className="p-5">
            {recentSavings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-sm">No savings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSavings.slice(0, 5).map((saving) => (
                  <div key={saving._id} className="flex justify-between items-center p-3 bg-cyan-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-cyan-100 rounded-lg">
                        <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">${saving.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{saving.note || 'No note'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-cyan-600 text-sm">+${saving.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{new Date(saving.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Supplier Distribution */}
      {supplierData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">🏭 Purchases by Supplier</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#6B7280" fontSize={11} />
                <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={11} width={120} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => `$${value.toFixed(2)}`}
                />
                <Bar dataKey="value" name="Total Spent ($)" fill="#F59E0B" radius={[0, 8, 8, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
