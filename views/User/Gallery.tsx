
import React from 'react';
import { AppState } from '../../types';

const GalleryView: React.FC<{ data: AppState }> = ({ data }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-12 text-center text-gray-800">আমাদের স্মৃতি ও কার্যক্রম গ্যালারি</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.gallery.map((item) => (
          <div key={item.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={item.imageUrl} 
                className="w-full h-full object-cover transition transform duration-500 group-hover:scale-105" 
                alt={item.title} 
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <i className="fas fa-play-circle text-6xl text-white opacity-80 group-hover:opacity-100"></i>
                </div>
              )}
            </div>
            <div className="p-5 flex-grow">
              <h3 className="font-bold text-xl text-gray-800 mb-2 border-b pb-1 border-teal-100">{item.title}</h3>
              {item.description && (
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  <i className="fas fa-quote-left text-teal-300 mr-2"></i>
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}

        {data.gallery.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed rounded-2xl">
            গ্যালারিতে কোনো ছবি বা ভিডিও যোগ করা হয়নি।
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryView;
