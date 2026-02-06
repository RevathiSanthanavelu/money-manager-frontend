import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function Dashboard({ dashboardData, period, onPeriodChange }) {
  if (!dashboardData) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex gap-2">
          {['weekly', 'monthly', 'yearly'].map((p) => (
            <button
              key={p}
              onClick={() => onPeriodChange(p)}
              className={`px-4 py-2 rounded font-semibold ${
                period === p
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Income</p>
              <p className="text-3xl font-bold">₹{dashboardData.totalIncome}</p>
            </div>
            <TrendingUp size={32} className="opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Expense</p>
              <p className="text-3xl font-bold">₹{dashboardData.totalExpense}</p>
            </div>
            <TrendingDown size={32} className="opacity-50" />
          </div>
        </div>

        <div
          className={`bg-gradient-to-br ${
            dashboardData.balance >= 0
              ? 'from-blue-400 to-blue-600'
              : 'from-orange-400 to-orange-600'
          } rounded-lg p-6 text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Balance</p>
              <p className="text-3xl font-bold">₹{dashboardData.balance}</p>
            </div>
            <DollarSign size={32} className="opacity-50" />
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(dashboardData.categoryBreakdown).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(dashboardData.categoryBreakdown).map(
              ([category, amount]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 capitalize">{category}</p>
                  <p className="text-xl font-bold">₹{amount}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
