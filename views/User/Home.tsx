
import React from 'react';
import { Link } from 'react-router-dom';
import { AppState } from '../../types';

const HomeView: React.FC<{ data: AppState }> = ({ data }) => {
  const { settings, members, transactions, notices } = data;

  const totalSavings = transactions
    .filter(t => t.type === 'savings' && t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/1920/600?nature" 
            className="w-full h-full object-cover brightness-50" 
            alt="Hero Background" 
          />
        </div>
        <div className="relative z-10 text-white">
          <img src={settings.logo} className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-white shadow-2xl" alt="Logo" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{settings.name}</h1>
          <p className="text-xl md:text-2xl font-medium mb-2 text-teal-300 italic">"{settings.slogan}"</p>
          <p className="max-w-2xl mx-auto text-lg text-gray-200">{settings.intro}</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 mb-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/members" className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 text-center border-b-4 border-teal-500">
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-users text-2xl"></i>
            </div>
            <h3 className="text-gray-500 font-medium mb-1">মোট সদস্য সংখ্যা</h3>
            <p className="text-4xl font-bold text-gray-800">{members.length} জন</p>
          </Link>

          <Link to="/accounts" className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 text-center border-b-4 border-green-500">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-wallet text-2xl"></i>
            </div>
            <h3 className="text-gray-500 font-medium mb-1">মোট জমাকৃত অর্থ</h3>
            <p className="text-4xl font-bold text-gray-800">৳ {totalSavings.toLocaleString()}</p>
          </Link>

          <div className="bg-white p-8 rounded-xl shadow-lg lg:col-span-1 md:col-span-2 text-center border-b-4 border-orange-500">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-bullhorn text-2xl"></i>
            </div>
            <h3 className="text-gray-500 font-medium mb-1">গুরুত্বপূর্ণ নোটিশ</h3>
            <p className="text-lg font-bold text-gray-800 truncate">
              {notices.length > 0 ? notices[0].title : 'কোনো নতুন নোটিশ নেই'}
            </p>
            <Link to="/notices" className="text-teal-600 font-semibold text-sm hover:underline mt-2 inline-block">সব দেখুন</Link>
          </div>
        </div>
      </section>

      {/* About Section Teaser */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">{settings.aboutTitle}</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            {settings.aboutContent.substring(0, 200)}...
          </p>
          <Link to="/about" className="bg-teal-600 text-white px-8 py-3 rounded-full font-bold hover:bg-teal-700 transition shadow-lg">
            বিস্তারিত জানুন
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomeView;
