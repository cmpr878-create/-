
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AppState, Member } from './types';
import { INITIAL_DATA } from './constants';

// Views
import HomeView from './views/User/Home';
import AboutUsView from './views/User/AboutUs';
import MembersView from './views/User/Members';
import ActivitiesView from './views/User/Activities';
import AccountsView from './views/User/Accounts';
import NoticeBoardView from './views/User/NoticeBoard';
import GalleryView from './views/User/Gallery';
import ContactView from './views/User/Contact';

// Admin Views
import AdminDashboard from './views/Admin/AdminDashboard';

const App: React.FC = () => {
  const [data, setData] = useState<AppState>(() => {
    const saved = localStorage.getItem('samity_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [currentUser, setCurrentUser] = useState<Member | null>(() => {
    const saved = localStorage.getItem('samity_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('samity_admin') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('samity_data', JSON.stringify(data));
  }, [data]);

  const updateData = (newData: AppState) => {
    setData({ ...newData });
  };

  const handleLogin = (id: string, pass: string) => {
    // Secret Admin Login Check
    if (id.toLowerCase() === 'admin' && pass === (data.settings.adminPassword || 'admin123')) {
      setIsAdmin(true);
      localStorage.setItem('samity_admin', 'true');
      return { success: true, type: 'ADMIN' };
    }

    // Normal Member Login Check
    const member = data.members.find(m => m.id === id && (m.password === pass || m.mobile === pass));
    if (member) {
      setCurrentUser(member);
      localStorage.setItem('samity_user', JSON.stringify(member));
      return { success: true, type: 'USER' };
    }
    return { success: false };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('samity_user');
    localStorage.removeItem('samity_admin');
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation 
          settings={data.settings} 
          currentUser={currentUser} 
          isAdmin={isAdmin} 
          handleLogout={handleLogout} 
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomeView data={data} />} />
            <Route path="/about" element={<AboutUsView data={data} />} />
            <Route path="/members" element={<MembersView data={data} />} />
            <Route path="/activities" element={<ActivitiesView data={data} />} />
            <Route path="/accounts" element={<AccountsView data={data} currentUser={currentUser} onLogin={handleLogin} isAdmin={isAdmin} updateData={updateData} />} />
            <Route path="/notices" element={<NoticeBoardView data={data} />} />
            <Route path="/gallery" element={<GalleryView data={data} />} />
            <Route path="/contact" element={<ContactView data={data} updateData={updateData} />} />
            <Route path="/admin" element={
              isAdmin ? <AdminDashboard data={data} updateData={updateData} /> : <Navigate to="/accounts" />
            } />
          </Routes>
        </main>

        <Footer settings={data.settings} />
      </div>
    </HashRouter>
  );
};

const Navigation: React.FC<{ settings: any, currentUser: Member | null, isAdmin: boolean, handleLogout: () => void }> = ({ settings, currentUser, isAdmin, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'হোম', path: '/' },
    { label: 'আমাদের সম্পর্কে', path: '/about' },
    { label: 'সদস্যবৃন্দ', path: '/members' },
    { label: 'কার্যক্রম', path: '/activities' },
    { label: 'হিসাব', path: '/accounts' },
    { label: 'নোটিশ বোর্ড', path: '/notices' },
    { label: 'গ্যালারি', path: '/gallery' },
    { label: 'যোগাযোগ', path: '/contact' },
  ];

  return (
    <nav className="bg-teal-700 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img className="h-10 w-10 rounded-full border-2 border-white object-cover" src={settings.logo} alt="Logo" />
              <span className="font-bold text-xl hidden md:block">{settings.name}</span>
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path ? 'bg-teal-800 text-white' : 'hover:bg-teal-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium bg-orange-600 hover:bg-orange-700 animate-pulse">এডমিন প্যানেল</Link>
              )}
              {(currentUser || isAdmin) && (
                <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700">লগ আউট</button>
              )}
            </div>
          </div>
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-teal-200 hover:text-white hover:bg-teal-800 focus:outline-none"
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-teal-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-teal-600"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium bg-orange-600">এডমিন ড্যাশবোর্ড</Link>
          )}
          {(currentUser || isAdmin) && (
            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-red-600">লগ আউট</button>
          )}
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC<{ settings: any }> = ({ settings }) => (
  <footer className="bg-gray-900 text-white py-12 mt-auto">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <h3 className="text-2xl font-black mb-4 text-teal-400">{settings.name}</h3>
        <p className="text-gray-400 leading-relaxed">{settings.slogan}</p>
      </div>
      <div>
        <h4 className="font-black mb-6 text-gray-100 uppercase tracking-widest text-sm">দ্রুত মেনু</h4>
        <div className="grid grid-cols-2 gap-4 text-gray-400 text-sm">
          <Link to="/" className="hover:text-teal-400 transition">হোম</Link>
          <Link to="/about" className="hover:text-teal-400 transition">সম্পর্কে</Link>
          <Link to="/members" className="hover:text-teal-400 transition">সদস্যবৃন্দ</Link>
          <Link to="/accounts" className="hover:text-teal-400 transition">হিসাব</Link>
        </div>
      </div>
      <div>
        <h4 className="font-black mb-6 text-gray-100 uppercase tracking-widest text-sm">যোগাযোগ</h4>
        <div className="space-y-4 text-gray-400 text-sm">
          <p><i className="fas fa-phone-alt text-teal-500 mr-2"></i> {settings.contactMobile}</p>
          <p><i className="fas fa-envelope text-teal-500 mr-2"></i> {settings.contactEmail}</p>
        </div>
      </div>
    </div>
    <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-600 text-xs">
      <p>© 2026 {settings.name}। সকল স্বত্ব সংরক্ষিত।</p>
    </div>
  </footer>
);

export default App;
