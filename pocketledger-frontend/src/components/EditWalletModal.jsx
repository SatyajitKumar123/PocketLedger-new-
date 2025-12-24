import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import api from "../api/axios";

export default function EditWalletModal({ isOpen, onClose, wallet, onSuccess }) {
  const [balance, setBalance] = useState("");

  // When the modal opens, pre-fill the current balance
  useEffect(() => {
    if (wallet) {
      setBalance(wallet.balance);
    }
  }, [wallet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the new balance to the API
      await api.patch("wallets/" + wallet.id + "/", { balance: balance });
      onSuccess(); // Refresh the dashboard
      onClose();
    } catch (error) {
      alert("Failed to update wallet");
    }
  };

  if (!isOpen || !wallet) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Edit {wallet.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Update Balance</label>
            <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 font-bold">{wallet.currency}</span>
                <input
                type="number"
                step="0.01"
                required
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xl font-bold text-gray-800 border-2 border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                />
            </div>
            <p className="text-xs text-gray-500 mt-2">
                Note: This manually overrides the balance regardless of transaction history.
            </p>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            <Save size={18} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}