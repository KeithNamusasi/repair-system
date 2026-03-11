const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get token
const getToken = () => localStorage.getItem('token');

// Helper for headers
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const api = {
  // Authentication
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return await response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  },

  // Products
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: getHeaders(),
    });
    return await response.json();
  },

  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return await response.json();
  },

  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return await response.json();
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return await response.json();
  },

  // Sales
  getSales: async () => {
    const response = await fetch(`${API_BASE_URL}/sales`, {
      headers: getHeaders(),
    });
    return await response.json();
  },

  createSale: async (saleData) => {
    const response = await fetch(`${API_BASE_URL}/sales`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(saleData),
    });
    return await response.json();
  },

  // Purchases
  getPurchases: async () => {
    const response = await fetch(`${API_BASE_URL}/purchases`, {
      headers: getHeaders(),
    });
    return await response.json();
  },

  createPurchase: async (purchaseData) => {
    const response = await fetch(`${API_BASE_URL}/purchases`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(purchaseData),
    });
    return await response.json();
  },

  // Repairs
  getRepairs: async () => {
    const response = await fetch(`${API_BASE_URL}/repairs`, {
      headers: getHeaders(),
    });
    return await response.json();
  },

  createRepair: async (repairData) => {
    const response = await fetch(`${API_BASE_URL}/repairs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(repairData),
    });
    return await response.json();
  },

  updateRepair: async (id, repairData) => {
    const response = await fetch(`${API_BASE_URL}/repairs/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(repairData),
    });
    return await response.json();
  },

  // Savings
  getSavings: async () => {
    const response = await fetch(`${API_BASE_URL}/savings`, {
      headers: getHeaders(),
    });
    return await response.json();
  },

  createSaving: async (savingData) => {
    const response = await fetch(`${API_BASE_URL}/savings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(savingData),
    });
    return await response.json();
  },
};

export default api;