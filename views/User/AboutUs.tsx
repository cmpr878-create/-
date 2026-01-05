
import React from 'react';
import { AppState } from '../../types';

const AboutUsView: React.FC<{ data: AppState }> = ({ data }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-teal-700 text-white p-8 text-center">
          <h1 className="text-4xl font-bold">{data.settings.aboutTitle}</h1>
        </div>
        <div className="p-8 md:p-12 space-y-8">
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {data.settings.aboutContent.split('\n').map((para, i) => (
              <p key={i} className="mb-4">{para}</p>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-teal-50 p-6 rounded-xl border-l-4 border-teal-500">
              <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
                <i className="fas fa-bullseye"></i> আমাদের লক্ষ্য
              </h3>
              <p className="text-gray-600">আমাদের লক্ষ্য সদস্যদের মধ্যে মিতব্যয়িতা বৃদ্ধি করা এবং তাদের জীবনযাত্রার মান উন্নয়নে ভূমিকা রাখা।</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl border-l-4 border-orange-500">
              <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                <i className="fas fa-eye"></i> আমাদের ভিশন
              </h3>
              <p className="text-gray-600">একটি আদর্শ ও ডিজিটাল সমবায় সমিতি হিসেবে নিজেদের প্রতিষ্ঠিত করা।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsView;
