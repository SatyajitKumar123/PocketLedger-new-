import { useEffect, useState } from "react";
import api from "../api/axios";
import { Wallet, LogOut, TrendingUp, TrendingDown, Calendar, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TransactionModal from "../components/TransactionModal";

export default function Dashboard() {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletRes, transRes] = await Promise.all([
        api.get("wallets/"),
        api.get("transactions/")
      ]);
      setWallets(walletRes.data);
      setTransactions(transRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
      if (error.response && error.response.status === 401) {
          navigate("/");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">PocketLedger</h1>
            <p className="text-sm text-gray-500">Welcome back</p>
          </div>
          
          <div className="flex gap-4">
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
                <Plus size={18} /> Add Transaction
            </button>

            <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
                <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Wallets Section */}
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Wallets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet) => (
                <div key={wallet.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                    <Wallet size={24} />
                    </div>
                    <div>
                    <h3 className="font-semibold text-gray-900">{wallet.name}</h3>
                    <p className="text-xs text-gray-500 uppercase font-bold">{wallet.type}</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Available Balance</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {wallet.currency} {wallet.balance}
                    </p>
                </div>
                </div>
            ))}
            </div>
        </div>

        {/* Transactions Section */}
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {transactions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No transactions found. Add one!
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-600">Description</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${t.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {t.type === 'INCOME' ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                                            </div>
                                            <span className="font-medium text-gray-900">{t.description || "No Description"}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500">
                                            {t.category_name || "Uncategorized"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14}/>
                                            {t.date}
                                        </div>
                                    </td>
                                    <td className={`p-4 font-bold text-right ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'INCOME' ? '+' : '-'} {t.amount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        
        {/* The Modal Component */}
        <TransactionModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            wallets={wallets}
            onSuccess={fetchData}
        />

      </div>
    </div>
  );
}