import axios from 'axios';

const api = axios.create({
  baseURL: 'https://money-manager-backend-m5eg.onrender.com/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (name, email, password) => 
  api.post('/auth/register', { name, email, password });

export const login = (email, password) => 
  api.post('/auth/login', { email, password });

// Transactions
export const addTransaction = (transaction) => 
  api.post('/transactions', transaction);

export const getTransactions = (filters = {}) => 
  api.get('/transactions', { params: filters });

export const getDashboard = (period = 'monthly') => 
  api.get('/transactions/dashboard', { params: { period } });

export const updateTransaction = (id, data) => 
  api.put(`/transactions/${id}`, data);

export const deleteTransaction = (id) => 
  api.delete(`/transactions/${id}`);

export default api;
