
import React from 'react';
import { AppState } from '../../types';

const NoticeBoardView: React.FC<{ data: AppState }> = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
        <i className="fas fa-clipboard-list text-teal-600 mr-2"></i> নোটিশ বোর্ড ও খবর
      </h1>
      
      <div className="space-y-6">
        {data.notices.length > 0 ? (
          data.notices.map((notice) => (
            <div key={notice.id} className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-teal-600 hover:shadow-xl transition">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded uppercase">অফিসিয়াল</span>
                    <span className="text-gray-400 text-sm">| {notice.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{notice.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{notice.content}</p>
                </div>
                <div className="flex-shrink-0">
                  <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition">
                    <i className="fas fa-file-download"></i> ডাউনলোড
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl text-gray-400 border-2 border-dashed">
            আপাতত কোনো নোটিশ নেই।
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoardView;
