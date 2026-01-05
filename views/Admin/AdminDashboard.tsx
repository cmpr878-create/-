
import React, { useState } from 'react';
import { AppState, Member, Notice, Activity, Transaction, GalleryItem, Message } from '../../types';

interface AdminDashboardProps {
  data: AppState;
  updateData: (newData: AppState) => void;
}

type AdminTab = 'settings' | 'members' | 'transactions' | 'notices' | 'activities' | 'gallery' | 'messages';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ data, updateData }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('settings');
  const [editingItem, setEditingItem] = useState<{ type: string; id: string } | null>(null);
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

  // Form States
  const [memberForm, setMemberForm] = useState<Partial<Member>>({});
  const [noticeForm, setNoticeForm] = useState<Partial<Notice>>({});
  const [activityForm, setActivityForm] = useState<Partial<Activity>>({});
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({});
  const [replyForm, setReplyForm] = useState({ msgId: '', text: '' });
  const [transactionForm, setTransactionForm] = useState<Partial<Transaction>>({ 
    type: 'savings', 
    status: 'paid', 
    date: new Date().toISOString().split('T')[0] 
  });

  const toggleMemberPassword = (id: string) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateData({
      ...data,
      settings: { ...data.settings, [name]: name === 'monthlySavingsAmount' ? Number(value) : value }
    });
  };

  const saveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name || !memberForm.mobile) return;
    
    let newMembers = [...data.members];
    const memberData = {
      ...memberForm,
      performance: memberForm.performance || 'yellow',
      joinDate: memberForm.joinDate || new Date().toISOString().split('T')[0],
      totalSavings: memberForm.totalSavings || 0,
      password: memberForm.password || '123456'
    } as Member;

    if (editingItem?.type === 'member') {
      newMembers = newMembers.map(m => m.id === editingItem.id ? { ...m, ...memberData } : m);
    } else {
      memberData.id = memberForm.id || (Math.floor(Math.random() * 9000) + 1000).toString();
      newMembers.push(memberData);
    }
    updateData({ ...data, members: newMembers });
    setMemberForm({});
    setEditingItem(null);
  };

  const saveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) return;
    let newNotices = [...data.notices];
    if (editingItem?.type === 'notice') {
      newNotices = newNotices.map(n => n.id === editingItem.id ? { ...n, ...noticeForm } as Notice : n);
    } else {
      const notice: Notice = {
        id: Date.now().toString(),
        title: noticeForm.title!,
        content: noticeForm.content!,
        date: noticeForm.date || new Date().toISOString().split('T')[0]
      };
      newNotices = [notice, ...newNotices];
    }
    updateData({ ...data, notices: newNotices });
    setNoticeForm({});
    setEditingItem(null);
  };

  const saveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityForm.title) return;
    let newActivities = [...data.activities];
    if (editingItem?.type === 'activity') {
      newActivities = newActivities.map(a => a.id === editingItem.id ? { ...a, ...activityForm } as Activity : a);
    } else {
      const act: Activity = {
        id: Date.now().toString(),
        title: activityForm.title!,
        description: activityForm.description || '',
        status: activityForm.status || 'planned'
      };
      newActivities = [act, ...newActivities];
    }
    updateData({ ...data, activities: newActivities });
    setActivityForm({});
    setEditingItem(null);
  };

  const saveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.imageUrl) return;
    let newGallery = [...data.gallery];
    if (editingItem?.type === 'gallery') {
      newGallery = newGallery.map(g => g.id === editingItem.id ? { ...g, ...galleryForm } as GalleryItem : g);
    } else {
      const item: GalleryItem = {
        id: Date.now().toString(),
        type: 'image',
        imageUrl: galleryForm.imageUrl!,
        title: galleryForm.title || 'স্মৃতি',
        description: galleryForm.description || ''
      };
      newGallery = [item, ...newGallery];
    }
    updateData({ ...data, gallery: newGallery });
    setGalleryForm({});
    setEditingItem(null);
  };

  const saveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionForm.memberId || !transactionForm.amount) return;
    const tx: Transaction = {
      id: Date.now().toString(),
      memberId: transactionForm.memberId!,
      amount: Number(transactionForm.amount),
      date: transactionForm.date || new Date().toISOString().split('T')[0],
      type: (transactionForm.type as any) || 'savings',
      status: 'paid'
    };
    updateData({ ...data, transactions: [tx, ...data.transactions] });
    setTransactionForm({ type: 'savings', status: 'paid', date: new Date().toISOString().split('T')[0] });
  };

  const saveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyForm.text) return;
    const newMessages = data.messages.map(m => 
      m.id === replyForm.msgId ? { ...m, reply: replyForm.text, isRead: true } : m
    );
    updateData({ ...data, messages: newMessages });
    setReplyForm({ msgId: '', text: '' });
  };

  const formatMonthYear = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('bn-BD', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full lg:w-72 space-y-2">
          <div className="bg-teal-950 text-white p-6 rounded-3xl shadow-2xl mb-6 border border-teal-800">
            <h2 className="font-black text-2xl flex items-center gap-2">
              <i className="fas fa-user-shield text-orange-400"></i> এডমিন
            </h2>
            <p className="text-xs text-teal-300 opacity-90 uppercase tracking-widest mt-1 font-bold">ম্যানেজমেন্ট প্যানেল</p>
          </div>
          
          {[
            { id: 'settings', icon: 'fa-cog', label: 'সেটিংস' },
            { id: 'members', icon: 'fa-users', label: 'সদস্যবৃন্দ' },
            { id: 'transactions', icon: 'fa-money-bill-wave', label: 'লেনদেন এন্ট্রি' },
            { id: 'messages', icon: 'fa-comments', label: 'মেসেজ ইনবক্স' },
            { id: 'notices', icon: 'fa-bullhorn', label: 'নোটিশ বোর্ড' },
            { id: 'activities', icon: 'fa-tasks', label: 'কার্যক্রম' },
            { id: 'gallery', icon: 'fa-images', label: 'গ্যালারি' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as AdminTab); setEditingItem(null); }}
              className={`w-full text-left px-5 py-4 rounded-2xl font-black transition-all flex items-center gap-4 border ${activeTab === tab.id ? 'bg-teal-800 text-white shadow-xl translate-x-1 border-teal-600' : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-200'}`}
            >
              <i className={`fas ${tab.icon} w-6 text-center text-lg ${activeTab === tab.id ? 'text-orange-300' : 'text-teal-700'}`}></i> 
              <span>{tab.label}</span>
              {tab.id === 'messages' && data.messages.filter(m => !m.reply).length > 0 && (
                <span className="ml-auto bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full animate-bounce">New</span>
              )}
            </button>
          ))}
        </aside>

        {/* Dynamic Content */}
        <div className="flex-grow bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 min-h-[70vh]">
          
          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-fadeIn text-gray-900">
              <h2 className="text-3xl font-black flex items-center gap-3 border-b pb-4">
                <i className="fas fa-sliders-h text-teal-600"></i> সাইট সেটিংস ও পাসওয়ার্ড
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="md:col-span-2 bg-orange-50 p-6 rounded-2xl border-2 border-orange-100">
                  <label className="text-xs font-black text-orange-900 uppercase tracking-widest mb-2 block">এডমিন লগইন পাসওয়ার্ড পরিবর্তন</label>
                  <input type="text" name="adminPassword" value={data.settings.adminPassword} onChange={handleSettingsChange} className="w-full px-5 py-3 bg-white border-2 border-orange-200 rounded-2xl focus:border-orange-500 outline-none transition font-black text-gray-900" placeholder="নতুন এডমিন পাসওয়ার্ড" />
                </div>
                <div>
                  <label className="text-xs font-black text-teal-900 uppercase tracking-widest mb-2 block">সমিতির নাম</label>
                  <input name="name" value={data.settings.name} onChange={handleSettingsChange} className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-teal-500 outline-none font-black text-gray-900" />
                </div>
                <div>
                  <label className="text-xs font-black text-teal-900 uppercase tracking-widest mb-2 block">স্লোগান</label>
                  <input name="slogan" value={data.settings.slogan} onChange={handleSettingsChange} className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-teal-500 outline-none font-black text-gray-900" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-black text-teal-900 uppercase tracking-widest mb-2 block">লোগো ছবি (URL)</label>
                  <input name="logo" value={data.settings.logo} onChange={handleSettingsChange} className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-teal-500 outline-none font-bold text-gray-900" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-black text-teal-900 uppercase tracking-widest mb-2 block">আমাদের সম্পর্কে</label>
                  <textarea rows={4} name="aboutContent" value={data.settings.aboutContent} onChange={handleSettingsChange} className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-teal-500 outline-none font-bold text-gray-900" />
                </div>
              </div>
            </div>
          )}

          {/* TAB: MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-10 text-gray-900">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-3xl font-black">সদস্য বৃন্দ ব্যবস্থাপনা</h2>
                <button onClick={() => {setMemberForm({}); setEditingItem(null);}} className="bg-teal-800 text-white px-6 py-2 rounded-xl text-sm font-black hover:bg-teal-900 transition">নতুন সদস্য যোগ</button>
              </div>

              <form onSubmit={saveMember} className="bg-gray-50 p-8 rounded-3xl border-2 border-teal-100 grid md:grid-cols-3 gap-6">
                <h3 className="md:col-span-3 font-black text-teal-950 flex items-center gap-2">
                  <i className={`fas ${editingItem ? 'fa-edit' : 'fa-plus-circle'}`}></i>
                  {editingItem ? 'সদস্যের তথ্য পরিবর্তন' : 'নতুন সদস্য যোগ করুন'}
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-black text-teal-800 ml-1">সদস্য আইডি</label>
                  <input placeholder="আইডি" value={memberForm.id || ''} onChange={e => setMemberForm({...memberForm, id: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl outline-none font-bold text-gray-900" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-teal-800 ml-1">সদস্যের নাম</label>
                  <input placeholder="নাম" value={memberForm.name || ''} onChange={e => setMemberForm({...memberForm, name: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl outline-none font-bold text-gray-900" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-teal-800 ml-1">পাসওয়ার্ড</label>
                  <div className="relative">
                    <input 
                      type={showFormPassword ? "text" : "password"}
                      placeholder="পাসওয়ার্ড" 
                      value={memberForm.password || ''} 
                      onChange={e => setMemberForm({...memberForm, password: e.target.value})} 
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl outline-none font-bold text-gray-900" 
                    />
                    <button type="button" onClick={() => setShowFormPassword(!showFormPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <i className={`fas ${showFormPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-teal-800 ml-1">মোবাইল নম্বর</label>
                  <input placeholder="মোবাইল" value={memberForm.mobile || ''} onChange={e => setMemberForm({...memberForm, mobile: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl outline-none font-bold text-gray-900" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-teal-800 ml-1">পারফরম্যান্স (কালার)</label>
                  <select 
                    value={memberForm.performance || 'yellow'} 
                    onChange={e => setMemberForm({...memberForm, performance: e.target.value as any})} 
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl outline-none font-black text-gray-900"
                  >
                    <option value="green">সবুজ (চমৎকার)</option>
                    <option value="yellow">হলুদ (চলমান)</option>
                    <option value="red">লাল (দুর্বল)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-teal-800 ml-1">ছবির লিংক</label>
                  <input placeholder="Image URL" value={memberForm.imageUrl || ''} onChange={e => setMemberForm({...memberForm, imageUrl: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl outline-none font-bold text-gray-900" />
                </div>
                <div className="md:col-span-3 flex justify-end gap-3 mt-4">
                   {editingItem && <button type="button" onClick={() => {setEditingItem(null); setMemberForm({});}} className="text-gray-600 font-bold px-4">বাতিল</button>}
                   <button className="bg-teal-800 text-white px-10 py-3 rounded-2xl font-black shadow-xl">সদস্য তথ্য সেভ</button>
                </div>
              </form>

              <div className="grid gap-4">
                {data.members.map(m => (
                  <div key={m.id} className="p-4 border-2 border-gray-100 rounded-3xl flex items-center justify-between hover:bg-teal-50 transition shadow-sm bg-white">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={m.imageUrl || 'https://via.placeholder.com/150'} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" alt="" />
                        <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${m.performance === 'green' ? 'bg-green-500' : m.performance === 'yellow' ? 'bg-yellow-400' : 'bg-red-500'}`}></span>
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-lg leading-tight">{m.name}</p>
                        <div className="flex items-center gap-2 text-xs font-black text-teal-800 font-mono">
                          <span>ID: #{m.id}</span>
                          <span className="text-gray-300">|</span>
                          <div className="flex items-center gap-1">
                             <span>Pass: {visiblePasswords[m.id] ? (m.password || 'N/A') : '••••••'}</span>
                             <button onClick={() => toggleMemberPassword(m.id)} className="text-gray-400 hover:text-teal-600 transition">
                               <i className={`fas ${visiblePasswords[m.id] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => { setEditingItem({type:'member', id:m.id}); setMemberForm(m); }} className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition"><i className="fas fa-edit"></i></button>
                       <button onClick={() => updateData({...data, members: data.members.filter(x => x.id !== m.id)})} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TRANSACTIONS */}
          {activeTab === 'transactions' && (
            <div className="space-y-10 animate-fadeIn text-gray-900">
                <h2 className="text-3xl font-black flex items-center gap-4 border-b pb-4">
                  <i className="fas fa-wallet text-teal-600"></i> সঞ্চয় এন্ট্রি ও খতিয়ান
                </h2>
                <form onSubmit={saveTransaction} className="grid md:grid-cols-4 gap-6 items-end bg-gray-100 p-8 rounded-3xl border-2 border-teal-200">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-teal-950 uppercase ml-1">সদস্য নির্বাচন</label>
                    <select value={transactionForm.memberId || ''} onChange={e => setTransactionForm({...transactionForm, memberId: e.target.value})} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-2xl outline-none font-black text-gray-950">
                      <option value="">সদস্য সিলেক্ট করুন</option>
                      {data.members.map(m => <option key={m.id} value={m.id}>{m.name} (#{m.id})</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-teal-950 uppercase ml-1">পরিমাণ (৳)</label>
                    <input type="number" placeholder="৳" value={transactionForm.amount || ''} onChange={e => setTransactionForm({...transactionForm, amount: Number(e.target.value)})} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-2xl outline-none font-black text-teal-900" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-teal-950 uppercase ml-1">তারিখ</label>
                    <input type="date" value={transactionForm.date || ''} onChange={e => setTransactionForm({...transactionForm, date: e.target.value})} className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-2xl outline-none font-black text-gray-950" />
                  </div>
                  <button className="bg-teal-800 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-teal-900 transition transform active:scale-95">জমা করুন</button>
                </form>

                <div className="overflow-x-auto rounded-[2rem] border-2 border-gray-200 shadow-xl bg-white">
                  <table className="w-full text-left">
                    <thead className="bg-gray-200 border-b-2 border-gray-300">
                      <tr>
                        <th className="px-6 py-5 text-xs font-black text-teal-950 uppercase">সদস্য</th>
                        <th className="px-6 py-5 text-xs font-black text-teal-950 uppercase">মাস ও বছর</th>
                        <th className="px-6 py-5 text-xs font-black text-teal-950 uppercase">পরিমাণ</th>
                        <th className="px-6 py-5 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.transactions.map(t => {
                        const m = data.members.find(mem => mem.id === t.memberId);
                        return (
                          <tr key={t.id} className="hover:bg-teal-50 transition">
                            <td className="px-6 py-5">
                              <p className="font-black text-gray-950">{m?.name || 'অজ্ঞাত'}</p>
                              <p className="text-[10px] text-teal-900 font-black">ID: #{t.memberId}</p>
                            </td>
                            <td className="px-6 py-5">
                              <p className="font-black text-teal-950">{formatMonthYear(t.date)}</p>
                              <p className="text-[10px] text-gray-500 font-bold">{t.date}</p>
                            </td>
                            <td className="px-6 py-5 font-black text-xl text-gray-950">৳ {t.amount}</td>
                            <td className="px-6 py-5 text-right">
                              <button onClick={() => updateData({...data, transactions: data.transactions.filter(x => x.id !== t.id)})} className="w-10 h-10 bg-red-100 text-red-700 rounded-xl hover:bg-red-700 hover:text-white transition"><i className="fas fa-trash-alt"></i></button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
            </div>
          )}

          {/* TAB: ACTIVITIES */}
          {activeTab === 'activities' && (
            <div className="space-y-10 animate-fadeIn text-gray-900">
               <h2 className="text-3xl font-black flex items-center gap-4 border-b pb-4">
                 <i className="fas fa-tasks text-teal-600"></i> কার্যক্রম ও প্রজেক্ট লিস্ট
               </h2>
               <form onSubmit={saveActivity} className="bg-blue-50 p-8 rounded-[2.5rem] border-2 border-blue-100 space-y-5">
                 <h3 className="font-black text-blue-950 flex items-center gap-2">
                   <i className="fas fa-plus-circle"></i> {editingItem ? 'কার্যক্রম এডিট' : 'নতুন কার্যক্রম যোগ'}
                 </h3>
                 <div className="grid md:grid-cols-2 gap-5">
                    <input placeholder="কার্যক্রমের নাম" value={activityForm.title || ''} onChange={e => setActivityForm({...activityForm, title: e.target.value})} className="px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl outline-none font-bold text-gray-950" />
                    <select value={activityForm.status || 'planned'} onChange={e => setActivityForm({...activityForm, status: e.target.value as any})} className="px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl outline-none font-black text-gray-950">
                      <option value="planned">পরিকল্পিত</option>
                      <option value="ongoing">চলমান</option>
                      <option value="completed">সম্পন্ন</option>
                    </select>
                 </div>
                 <textarea rows={3} placeholder="বিস্তারিত বর্ণনা" value={activityForm.description || ''} onChange={e => setActivityForm({...activityForm, description: e.target.value})} className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-2xl outline-none font-bold text-gray-900" />
                 <div className="flex justify-end gap-3">
                   {editingItem && <button type="button" onClick={() => {setEditingItem(null); setActivityForm({});}} className="text-gray-600 font-bold px-4">বাতিল</button>}
                   <button className="bg-blue-800 text-white px-10 py-3 rounded-2xl font-black shadow-lg">সেভ কার্যক্রম</button>
                 </div>
               </form>

               <div className="grid gap-4 mt-8">
                 {data.activities.map(a => (
                   <div key={a.id} className="p-6 bg-white border-2 border-gray-100 rounded-3xl flex justify-between items-center hover:bg-blue-50 transition shadow-sm">
                      <div className="flex items-center gap-4">
                         <div className={`w-3 h-3 rounded-full ${a.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'}`}></div>
                         <div>
                            <h4 className="font-black text-gray-950 text-lg leading-tight">{a.title}</h4>
                            <p className="text-xs text-blue-800 font-bold uppercase">{a.status}</p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingItem({type: 'activity', id: a.id}); setActivityForm(a); }} className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition"><i className="fas fa-edit"></i></button>
                        <button onClick={() => updateData({...data, activities: data.activities.filter(x => x.id !== a.id)})} className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-700 rounded-xl hover:bg-red-700 hover:text-white transition"><i className="fas fa-trash"></i></button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* TAB: NOTICES */}
          {activeTab === 'notices' && (
            <div className="space-y-10 animate-fadeIn text-gray-900">
                <h2 className="text-3xl font-black border-b pb-4">নোটিশ বোর্ড ম্যানেজমেন্ট</h2>
                <form onSubmit={saveNotice} className="bg-orange-50 p-8 rounded-[2.5rem] border-2 border-orange-100 space-y-6">
                   <input placeholder="টাইটেল" value={noticeForm.title || ''} onChange={e => setNoticeForm({...noticeForm, title: e.target.value})} className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl font-black text-gray-950" />
                   <textarea rows={4} placeholder="বিস্তারিত কন্টেন্ট..." value={noticeForm.content || ''} onChange={e => setNoticeForm({...noticeForm, content: e.target.value})} className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-900" />
                   <div className="flex justify-between items-center">
                     <input type="date" value={noticeForm.date || ''} onChange={e => setNoticeForm({...noticeForm, date: e.target.value})} className="px-4 py-2 border-2 border-gray-200 rounded-xl font-bold" />
                     <button className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg">নোটিশ পাবলিশ</button>
                   </div>
                </form>

                <div className="grid gap-4">
                  {data.notices.map(n => (
                    <div key={n.id} className="p-6 bg-white border-2 border-gray-100 rounded-3xl flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-gray-900">{n.title}</h4>
                        <p className="text-xs font-bold text-orange-600 mb-2">{n.date}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{n.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => {setEditingItem({type:'notice', id:n.id}); setNoticeForm(n);}} className="text-blue-600 p-2"><i className="fas fa-edit"></i></button>
                        <button onClick={() => updateData({...data, notices: data.notices.filter(x => x.id !== n.id)})} className="text-red-600 p-2"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          )}

          {/* TAB: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-10 animate-fadeIn text-gray-900">
               <h2 className="text-3xl font-black border-b pb-4">গ্যালারি অ্যালবাম</h2>
               <form onSubmit={saveGallery} className="bg-purple-50 p-8 rounded-[2.5rem] border-2 border-purple-100 space-y-6">
                 <div className="grid md:grid-cols-2 gap-5">
                   <input placeholder="ফটোর ইউআরএল" value={galleryForm.imageUrl || ''} onChange={e => setGalleryForm({...galleryForm, imageUrl: e.target.value})} className="px-5 py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-950" />
                   <input placeholder="টাইটেল" value={galleryForm.title || ''} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} className="px-5 py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-950" />
                 </div>
                 <button className="bg-purple-800 text-white px-12 py-3 rounded-2xl font-black w-full shadow-lg">ফটো যোগ করুন</button>
               </form>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 {data.gallery.map(img => (
                   <div key={img.id} className="relative group rounded-3xl overflow-hidden border-2 border-gray-100 shadow-md">
                     <img src={img.imageUrl} className="w-full h-40 object-cover" alt="" />
                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-4">
                        <p className="text-white text-xs font-bold mb-2 text-center">{img.title}</p>
                        <button onClick={() => updateData({...data, gallery: data.gallery.filter(x => x.id !== img.id)})} className="bg-red-600 text-white p-2 rounded-full"><i className="fas fa-trash text-xs"></i></button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-8 animate-fadeIn text-gray-900">
              <h2 className="text-3xl font-black border-b pb-4">মেসেজ ও ফিডব্যাক</h2>
              <div className="grid gap-6">
                {data.messages.map(m => (
                  <div key={m.id} className="p-8 border-2 border-gray-100 rounded-[2.5rem] bg-gray-50 relative group">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-black text-gray-900 text-xl">{m.senderName}</h4>
                        <p className="text-xs text-teal-800 font-black font-mono">{m.mobile} • {m.date}</p>
                      </div>
                      {!m.reply && <span className="bg-orange-500 text-white text-[10px] px-3 py-1 rounded-full font-black animate-pulse">New</span>}
                    </div>
                    <div className="bg-white p-4 rounded-2xl mb-4 border-2 border-teal-50 italic font-bold">"{m.text}"</div>
                    {m.reply ? (
                      <div className="bg-teal-800 p-4 rounded-2xl text-white shadow-xl relative animate-fadeIn">
                        <p className="text-[10px] font-black text-teal-200 uppercase mb-1">আপনার উত্তর:</p>
                        <p className="font-bold">{m.reply}</p>
                        <button onClick={() => {
                          const updated = data.messages.map(msg => msg.id === m.id ? {...msg, reply: undefined} : msg);
                          updateData({...data, messages: updated});
                        }} className="text-xs text-teal-300 underline mt-2 font-black">এডিট উত্তর</button>
                      </div>
                    ) : (
                      <form onSubmit={saveReply} className="flex gap-3">
                        <input 
                          placeholder="উত্তর লিখুন..." 
                          className="flex-grow px-4 py-3 bg-white border-2 border-gray-200 rounded-xl outline-none font-bold" 
                          value={replyForm.msgId === m.id ? replyForm.text : ''}
                          onChange={e => setReplyForm({msgId: m.id, text: e.target.value})}
                          onFocus={() => setReplyForm({...replyForm, msgId: m.id})}
                        />
                        <button className="bg-teal-800 text-white px-6 py-3 rounded-xl font-black shadow-lg">Reply</button>
                      </form>
                    )}
                    <button onClick={() => updateData({...data, messages: data.messages.filter(x => x.id !== m.id)})} className="absolute top-6 right-6 text-red-200 hover:text-red-600 transition p-2"><i className="fas fa-trash-alt"></i></button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
