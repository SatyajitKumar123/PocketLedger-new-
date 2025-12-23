import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../api/axios";

export default function TransactionModal({ isOpen, onClose, wallets, onSuccess }) {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    type: "EXPENSE",
    date: new Date().toISOString().split('T')[0],
    wallet: "",
    category: ""
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get("transactions/categories/").then(res => setCategories(res.data));
      if (wallets.length > 0 && !formData.wallet) {
        setFormData(prev => ({ ...prev, wallet: wallets[0].id }));
      }
    }
  }, [isOpen, wallets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        category: formData.category || null
      };
      
      await api.post("transactions/", payload);
      onSuccess();
      onClose();
      setFormData(prev => ({ ...prev, amount: "", description: "" }));
    } catch (error) {
      alert("Failed: " + JSON.stringify(error.response?.data));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">New Transaction</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "EXPENSE" })}
              className={`py-2 text-sm font-semibold rounded-md transition-colors ${formData.type === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "INCOME" })}
              className={`py-2 text-sm font-semibold rounded-md transition-colors ${formData.type === 'INCOME' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              className="w-full text-3xl font-bold text-gray-800 border-b-2 border-gray-200 focus:border-blue-500 outline-none py-2"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Grocery Shopping"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wallet</label>
              <select
                value={formData.wallet}
                onChange={e => setFormData({...formData, wallet: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                {wallets.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="">No Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white shadow-md hover:shadow-lg transition-all ${
                formData.type === 'EXPENSE' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? "Saving..." : `Add ${formData.type === 'EXPENSE' ? 'Expense' : 'Income'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}