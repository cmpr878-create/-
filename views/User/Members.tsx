
import React from 'react';
import { AppState } from '../../types';

const MembersView: React.FC<{ data: AppState }> = ({ data }) => {
  const performanceColors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-400',
    red: 'bg-red-500'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <h1 className="text-4xl font-black text-gray-900 border-l-8 border-teal-600 pl-6">
          আমাদের গর্বিত সদস্যবৃন্দ
        </h1>
        <div className="bg-teal-50 px-6 py-3 rounded-2xl border-2 border-teal-100">
           <p className="text-teal-800 font-black">মোট সদস্য: <span className="text-2xl">{data.members.length}</span> জন</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Column: Member Cards Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.members.map((member) => (
              <div key={member.id} className="bg-white rounded-[2.5rem] shadow-xl border-2 border-gray-50 overflow-hidden hover:shadow-2xl transition-all group">
                <div className="p-8 flex items-center gap-6">
                  <div className="relative shrink-0">
                    <img 
                      src={member.imageUrl || 'https://via.placeholder.com/150'} 
                      className="w-24 h-24 rounded-[1.8rem] object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-500" 
                      alt={member.name} 
                    />
                    <span className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${performanceColors[member.performance] || 'bg-gray-400'} shadow-md animate-pulse`}></span>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight mb-1">{member.name}</h3>
                    <p className="text-xs font-black text-teal-700 font-mono tracking-widest uppercase mb-3">ID: #{member.id}</p>
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full w-max">
                      <i className="fas fa-calendar-alt"></i> যোগদান: {member.joinDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {data.members.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
              <i className="fas fa-users-slash text-6xl text-gray-200 mb-4"></i>
              <p className="text-gray-400 font-black text-xl italic">সদস্য তালিকা খালি</p>
            </div>
          )}
        </div>

        {/* Right Column: Rules & Info */}
        <div className="space-y-8">
          <section className="bg-teal-700 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border-b-8 border-teal-900">
            <div className="relative z-10">
              <h3 className="text-xs uppercase tracking-[0.3em] font-black text-teal-200 mb-2">মাসিক সঞ্চয়</h3>
              <p className="text-6xl font-black mb-4 tracking-tighter">৳ {data.settings.monthlySavingsAmount}</p>
              <p className="text-teal-100 font-bold opacity-80 leading-relaxed text-sm">প্রতি মাসের নির্দিষ্ট সময়ের মধ্যে সঞ্চয় জমা দেয়া সকল সদস্যের জন্য বাধ্যতামূলক।</p>
            </div>
            <i className="fas fa-piggy-bank absolute -bottom-4 -right-4 text-9xl text-white opacity-10 rotate-12"></i>
          </section>

          <section className="bg-white p-10 rounded-[3rem] shadow-xl border-2 border-gray-50">
            <h2 className="text-2xl font-black mb-6 text-gray-800 flex items-center gap-3">
              <i className="fas fa-scroll text-teal-600"></i> সদস্যপদ নিয়মাবলী
            </h2>
            <div className="space-y-4">
              {data.settings.membershipRules.split('\n').map((rule, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 rounded-2xl hover:bg-teal-50 transition-colors">
                  <span className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 font-black text-xs">{idx + 1}</span>
                  <p className="text-gray-700 font-bold text-sm leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MembersView;
