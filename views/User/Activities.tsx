
import React from 'react';
import { AppState } from '../../types';

const ActivitiesView: React.FC<{ data: AppState }> = ({ data }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 underline decoration-teal-500 underline-offset-8">আমাদের কার্যক্রম ও ভবিষ্যৎ পরিকল্পনা</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-teal-700">
            <i className="fas fa-tasks"></i> চলমান ও সম্পন্ন কার্যক্রম
          </h2>
          <div className="space-y-4">
            {data.activities.filter(a => a.status !== 'planned').map(activity => (
              <div key={activity.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{activity.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {activity.status === 'completed' ? 'সম্পন্ন' : 'চলমান'}
                  </span>
                </div>
                <p className="text-gray-600">{activity.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-orange-700">
            <i className="fas fa-lightbulb"></i> ভবিষ্যৎ ব্যবসা পরিকল্পনা
          </h2>
          <div className="space-y-4">
            {data.activities.filter(a => a.status === 'planned').map(activity => (
              <div key={activity.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{activity.title}</h3>
                <p className="text-gray-600">{activity.description}</p>
              </div>
            ))}
            {data.activities.filter(a => a.status === 'planned').length === 0 && (
              <div className="bg-gray-100 p-8 text-center rounded-xl text-gray-500 italic">
                আপাতত নতুন কোনো পরিকল্পনা নেই।
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ActivitiesView;
