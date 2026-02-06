import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import { updateTransaction, deleteTransaction } from '../utils/api';

export default function TransactionHistory({ transactions, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const canEdit = (transaction) => {
    const now = new Date();
    const createdAt = new Date(transaction.createdAt);
    const hoursPassed = (now - createdAt) / (1000 * 60 * 60);
    return hoursPassed < 12;
  };

  const handleEdit = async (transaction) => {
    try {
      await updateTransaction(transaction._id, editData);
      setEditingId(null);
      onEdit();
    } catch (error) {
      alert('Failed to update transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteTransaction(id);
        onDelete();
      } catch (error) {
        alert('Failed to delete transaction');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No transactions yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Division</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-right py-3 px-4">Amount</th>
                <th className="text-center py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.type.charAt(0).toUpperCase() +
                        transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm capitalize">
                    {transaction.category}
                  </td>
                  <td className="py-3 px-4 text-sm capitalize">
                    {transaction.division}
                  </td>
                  <td className="py-3 px-4 text-sm">{transaction.description}</td>
                  <td className="py-3 px-4 text-right font-semibold">
                    {transaction.type === 'income' ? '+' : '-'}₹
                    {transaction.amount}
                  </td>
                  <td className="py-3 px-4 text-center space-x-2">
                    {canEdit(transaction) ? (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(transaction._id);
                            setEditData(transaction);
                          }}
                          className="inline-block p-1 hover:bg-blue-100 rounded"
                          title="Edit"
                        >
                          <Edit2 size={16} className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="inline-block p-1 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-gray-400 text-xs"
                        title="Cannot edit after 12 hours"
                      >
                        <AlertCircle size={14} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
