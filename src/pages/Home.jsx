import React, { useState  , useCallback } from 'react';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import TransactionHistory from '../components/TransactionHistory';
import TransactionModal from '../components/TransactionModal';
import { Plus, Filter } from 'lucide-react';
import { addTransaction, getTransactions, getDashboard } from '../utils/api';

const CATEGORIES = ['salary', 'freelance', 'fuel', 'movie', 'food', 'loan', 'medical', 'utilities', 'entertainment', 'shopping', 'transport', 'other'];
const DIVISIONS = ['office', 'personal'];

export default function Home({ user, onLogout }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [period, setPeriod] = useState('monthly');
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    division: '',
    type: '',
    startDate: '',
    endDate: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [transRes, dashRes] = await Promise.all([
        getTransactions(filters),
        getDashboard(period),
      ]);
      setTransactions(transRes.data || []);
      setDashboardData(
        dashRes?.data || {
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
          categoryBreakdown: {},
        }
      );
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // 👇 PREVENT infinite loading
      setDashboardData({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        categoryBreakdown: {},
      });
    }
  },[filters , period]);

  const handleAddTransaction = async (transactionData) => {
  console.log("Submitting:", transactionData); // 👈 ADD THIS
  try {
    const res = await addTransaction(transactionData);
    console.log("Response:", res);
    setIsModalOpen(false);
    fetchData();
  } catch (error) {
    console.error("Add transaction error:", error.response || error);
    alert('Failed to add transaction');
  }
  };


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      division: '',
      type: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Transaction Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Transaction
        </button>

        {/* Dashboard */}
        <Dashboard
          dashboardData={dashboardData}
          period={period}
          onPeriodChange={setPeriod}
        />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
          >
            <Filter size={20} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Division</label>
                <select
                  name="division"
                  value={filters.division}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Divisions</option>
                  {DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div.charAt(0).toUpperCase() + div.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <TransactionHistory
          transactions={transactions}
          onDelete={fetchData}
          onEdit={fetchData}
        />
      </div>

      {/* Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
    </div>
  );
}
