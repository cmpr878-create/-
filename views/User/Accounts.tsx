
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppState, Member, Transaction } from '../../types';

interface AccountsViewProps {
  data: AppState;
  currentUser: Member | null;
  onLogin: (id: string, pass: string) => { success: boolean; type?: string };
  isAdmin: boolean;
  updateData: (newData: AppState) => void;
}

const AccountsView: React.FC<AccountsViewProps> = ({ data, currentUser, onLogin, isAdmin, updateData }) => {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [error, setError] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [passChangeStatus, setPassChangeStatus] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = onLogin(memberId, passwordInput);
    if (result.success) {
      if (result.type === 'ADMIN') {
        navigate('/admin');
      }
      setError('');
    } else {
      setError('ভুল আইডি অথবা পাসওয়ার্ড। সঠিক তথ্য দিয়ে চেষ্টা করুন।');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newPassword) return;
    const newMembers = data.members.map(m => 
      m.id === currentUser.id ? { ...m, password: newPassword } : m
    );
    updateData({ ...data, members: newMembers });
    setPassChangeStatus('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!');
    setNewPassword('');
    setTimeout(() => setPassChangeStatus(''), 5000);
  };

  if (isAdmin && !currentUser) {
     return (
       <div className="max-w-4xl mx-auto py-20 px-4 text-center">
         <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-orange-100 animate-fadeIn">
           <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
             <i className="fas fa-user-shield"></i>
           </div>
           <h2 className="text-3xl font-black text-gray-800 mb-4 text-orange-950">স্বাগতম, এডমিন!</h2>
           <p className="text-gray-500 mb-8 font-bold">আপনি বর্তমানে এডমিন মোডে আছেন।</p>
           <button 
             onClick={() => navigate('/admin')}
             className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-orange-700 transition shadow-xl transform active:scale-95"
           >
             এডমিন ড্যাশবোর্ড খুলুন
           </button>
         </div>
       </div>
     );
  }

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border-t-8 border-teal-600 animate-fadeIn">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-800">লগইন করুন</h2>
            <p className="text-gray-400 text-sm mt-3 font-bold italic text-teal-800 uppercase tracking-widest">হিসাব দেখতে তথ্য দিন</p>
          </div>
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-gray-700 font-black ml-1 uppercase text-xs">সদস্য আইডি</label>
              <input 
                type="text" 
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-teal-500 outline-none transition font-black text-gray-900"
                placeholder="সদস্য আইডি"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-gray-700 font-black ml-1 uppercase text-xs">পাসওয়ার্ড</label>
              <div className="relative">
                <input 
                  type={showLoginPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-teal-500 outline-none transition font-black text-gray-900 pr-14"
                  placeholder="পাসওয়ার্ড দিন"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition"
                >
                  <i className={`fas ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'} text-lg`}></i>
                </button>
              </div>
            </div>
            {error && <p className="text-red-700 text-sm bg-red-50 p-3 rounded-xl font-black border border-red-200 animate-shake">{error}</p>}
            <button className="w-full bg-teal-700 text-white py-5 rounded-2xl font-black text-lg hover:bg-teal-800 transition shadow-xl transform active:scale-95 border-b-4 border-teal-900">
              প্রবেশ করুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  const userTransactions = data.transactions.filter(t => t.memberId === currentUser.id);
  const totalUserSavings = userTransactions
    .filter(t => t.type === 'savings' && t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const userMessages = data.messages.filter(m => m.mobile === currentUser.mobile);

  const performanceLabels = {
    green: { color: 'bg-green-500', text: 'চমৎকার (Good)', icon: 'fa-check-circle', textColor: 'text-green-700', bg: 'bg-green-50' },
    yellow: { color: 'bg-yellow-500', text: 'চলমান (Average)', icon: 'fa-exclamation-circle', textColor: 'text-yellow-700', bg: 'bg-yellow-50' },
    red: { color: 'bg-red-500', text: 'অনিয়মিত (Poor)', icon: 'fa-times-circle', textColor: 'text-red-700', bg: 'bg-red-50' }
  };

  const perf = performanceLabels[currentUser.performance] || performanceLabels.yellow;

  const formatMonthYear = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('bn-BD', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 transition-all" onClick={() => setIsZoomed(false)}>
          <img src={currentUser.imageUrl || 'https://via.placeholder.com/150'} className="max-w-full max-h-[90vh] rounded-[3rem] shadow-2xl border-4 border-white" alt="Profile Full" />
          <button className="absolute top-8 right-8 text-white text-4xl"><i className="fas fa-times"></i></button>
        </div>
      )}

      {/* Header Profile Section */}
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden mb-12 border-2 border-gray-100">
        <div className="bg-teal-700 p-10 md:p-14 text-white flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group cursor-zoom-in" onClick={() => setIsZoomed(true)}>
              <img 
                src={currentUser.imageUrl || 'https://via.placeholder.com/150'} 
                className="w-44 h-44 rounded-[2.5rem] border-4 border-white object-cover shadow-2xl" 
                alt="Profile" 
              />
              <div className="absolute inset-0 bg-black/20 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <i className="fas fa-search-plus text-white text-3xl"></i>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-2">{currentUser.name}</h2>
              <p className="text-teal-200 font-mono text-xl mb-3">ID: #{currentUser.id} | {currentUser.mobile}</p>
              <div className={`inline-flex items-center gap-3 bg-white px-5 py-2 rounded-2xl text-sm font-black ${perf.textColor} shadow-lg`}>
                <span className={`w-3 h-3 rounded-full ${perf.color} animate-pulse`}></span>
                <span>পারফরম্যান্স: {perf.text}</span>
              </div>
            </div>
          </div>
          <div className="text-center md:text-right bg-white/10 p-10 rounded-[2.5rem] border-2 border-white/20 backdrop-blur-md">
            <h3 className="text-xs uppercase tracking-[0.2em] font-black text-teal-100 mb-2">আপনার মোট সঞ্চয়</h3>
            <p className="text-6xl font-black">৳ {totalUserSavings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Transaction History */}
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-gray-50">
            <h3 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-4">
              <i className="fas fa-receipt text-teal-600"></i> জমার খতিয়ান ও লেনদেন
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-5 text-xs font-black text-teal-950 uppercase tracking-widest">তারিখ</th>
                    <th className="px-6 py-5 text-xs font-black text-teal-950 uppercase tracking-widest">মাস ও বছর</th>
                    <th className="px-6 py-5 text-xs font-black text-teal-950 uppercase tracking-widest text-right">পরিমাণ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {userTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-teal-50 transition">
                      <td className="px-6 py-5 font-bold text-gray-500">{tx.date}</td>
                      <td className="px-6 py-5 font-black text-teal-800 text-lg">{formatMonthYear(tx.date)}</td>
                      <td className="px-6 py-5 font-black text-2xl text-gray-900 text-right">৳ {tx.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Password Change Section */}
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-t-8 border-blue-500 border-x border-b border-gray-100">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-gray-800">
              <i className="fas fa-key text-blue-600"></i> নিরাপত্তা সেটিংস
            </h3>
            <p className="text-xs text-gray-500 mb-6 font-bold uppercase tracking-wider">পাসওয়ার্ড পরিবর্তন করুন</p>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="relative">
                <input 
                  type={showChangePassword ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="নতুন পাসওয়ার্ড দিন" 
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-black focus:border-blue-500 outline-none pr-14"
                />
                <button 
                  type="button" 
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
                >
                  <i className={`fas ${showChangePassword ? 'fa-eye-slash' : 'fa-eye'} text-lg`}></i>
                </button>
              </div>
              {passChangeStatus && <p className="text-green-700 text-sm font-black bg-green-50 p-3 rounded-xl border border-green-100 animate-fadeIn">{passChangeStatus}</p>}
              <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-blue-700 transition">পাসওয়ার্ড আপডেট করুন</button>
            </form>
          </div>

          {/* Inbox Section */}
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-t-8 border-orange-500 border-x border-b border-gray-100">
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-gray-800">
              <i className="fas fa-comment-dots text-orange-500"></i> সাপোর্ট ইনবক্স
            </h3>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {userMessages.length > 0 ? userMessages.map(msg => (
                <div key={msg.id} className="p-6 bg-gray-50 rounded-[2rem] border-2 border-gray-100">
                  <p className="text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">{msg.date}</p>
                  <p className="text-gray-900 mb-4 italic font-bold">"{msg.text}"</p>
                  {msg.reply ? (
                    <div className="bg-teal-800 p-5 rounded-[1.5rem] shadow-xl">
                      <p className="text-[10px] font-black text-teal-200 uppercase mb-2">এডমিন উত্তর:</p>
                      <p className="text-white font-bold">{msg.reply}</p>
                    </div>
                  ) : (
                    <p className="text-orange-600 text-xs font-black uppercase tracking-widest"><i className="fas fa-clock mr-2 animate-pulse"></i> অপেক্ষমান...</p>
                  )}
                </div>
              )) : (
                <p className="text-center py-10 text-gray-400 font-bold italic">কোনো মেসেজ নেই</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsView;
