
import React, { useState } from 'react';
import { AppState, Message } from '../../types';

interface ContactViewProps {
  data: AppState;
  updateData: (newData: AppState) => void;
}

const ContactView: React.FC<ContactViewProps> = ({ data, updateData }) => {
  const { settings } = data;
  const [formData, setFormData] = useState({ name: '', mobile: '', text: '' });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.text) return;

    setIsSubmitting(true);
    const newMessage: Message = {
      id: Date.now().toString(),
      senderName: formData.name,
      mobile: formData.mobile,
      text: formData.text,
      date: new Date().toLocaleString('bn-BD'),
      isRead: false
    };

    const newData = {
      ...data,
      messages: [newMessage, ...(data.messages || [])]
    };
    
    // Proper state update without reload
    updateData(newData);
    
    setStatus('আপনার মেসেজ সফলভাবে পাঠানো হয়েছে। এডমিন প্যানেল থেকে উত্তর চেক করুন।');
    setFormData({ name: '', mobile: '', text: '' });
    setIsSubmitting(false);

    // Auto clear status after 5 seconds
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">আমাদের সাথে যোগাযোগ করুন</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              যেকোনো জিজ্ঞাসা, অভিযোগ বা পরামর্শের জন্য আমাদের সরাসরি মেসেজ পাঠাতে পারেন। আমাদের টীম শীঘ্রই আপনার সাথে যোগাযোগ করবে।
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center shrink-0">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">হেল্পলাইন</p>
                <p className="font-mono text-lg font-bold text-gray-800">{settings.contactMobile}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">ইমেইল</p>
                <p className="font-bold text-gray-800">{settings.contactEmail}</p>
              </div>
            </div>
          </div>
          
          <div className="h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.01] transition-transform duration-300">
             <iframe src={settings.googleMapEmbed} className="w-full h-full border-0" allowFullScreen={true} loading="lazy" title="Office Map"></iframe>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-50">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">সরাসরি মেসেজ দিন</h2>
            <div className="h-1 w-20 bg-teal-500 mt-2 rounded-full"></div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-700 font-bold ml-1">আপনার নাম</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-800" 
                placeholder="পুরো নাম লিখুন" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 font-bold ml-1">মোবাইল নম্বর</label>
              <input 
                type="text" 
                value={formData.mobile}
                onChange={e => setFormData({...formData, mobile: e.target.value})}
                className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition-all text-gray-800 font-mono" 
                placeholder="সদস্য মোবাইল নম্বর" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-gray-700 font-bold ml-1">বার্তা</label>
              <textarea 
                value={formData.text}
                onChange={e => setFormData({...formData, text: e.target.value})}
                className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition-all h-40 text-gray-800 resize-none" 
                placeholder="এখানে বিস্তারিত লিখুন..."
                required
              ></textarea>
            </div>
            {status && (
              <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm font-medium flex items-center gap-3 border border-green-100 animate-pulse">
                <i className="fas fa-check-circle"></i> {status}
              </div>
            )}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-teal-700 transition shadow-xl transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <i className="fas fa-circle-notch fa-spin"></i>
              ) : (
                <><i className="fas fa-paper-plane"></i> মেসেজ পাঠান</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
