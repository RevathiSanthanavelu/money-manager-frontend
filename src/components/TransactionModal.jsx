import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';

const CATEGORIES = ['salary', 'freelance', 'fuel', 'movie', 'food', 'loan', 'medical', 'utilities', 'entertainment', 'shopping', 'transport', 'other'];
const DIVISIONS = ['office', 'personal'];

export default function TransactionModal({ isOpen, onClose, onSubmit }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [division, setDivision] = useState('personal');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      division,
      description,
      date,
    });
    resetForm();
  };

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setCategory('food');
    setDivision('personal');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const modalRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const [pos, setPos] = useState(null); // { left, top }

  if (!isOpen) return null;

  const handlePointerDown = (e) => {
  if (!modalRef.current) return;

  isDragging.current = true;

  const rect = modalRef.current.getBoundingClientRect();
  offset.current = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  modalRef.current.setPointerCapture(e.pointerId);
  };


  const handlePointerMove = (e) => {
  if (!isDragging.current || !modalRef.current) return;

  setPos({
    left: e.clientX - offset.current.x,
    top: e.clientY - offset.current.y,
  });
  };


  const handlePointerUp = (e) => {
  isDragging.current = false;

  if (modalRef.current) {
    modalRef.current.releasePointerCapture(e.pointerId);
  }
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{
          position: 'absolute',
          left: pos ? `${pos.left}px` : '50%',
          top: pos ? `${pos.top}px` : '50%',
          transform: pos ? 'none' : 'translate(-50%, -50%)',
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >

        <div
        className="cursor-move font-semibold mb-4 flex justify-between items-center" onPointerDown={handlePointerDown}
        >
          <h2 className="text-2xl font-bold">Add Transaction</h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded font-semibold ${
                type === 'income'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded font-semibold ${
                type === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Expense
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DIVISIONS.map((div) => (
                  <option key={div} value={div}>
                    {div.charAt(0).toUpperCase() + div.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg mt-6 hover:bg-blue-600"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
