
import { AppState } from './types';

export const INITIAL_DATA: AppState = {
  settings: {
    name: "بذر الغد",
    logo: "https://picsum.photos/200/200?random=logo",
    slogan: "Save Together, Grow Together",
    intro: "এটি একটি অলাভজনক সমবায় সমিতি। আমাদের মূল লক্ষ্য হল ক্ষুদ্র সঞ্চয়ের মাধ্যমে সদস্যদের আত্মনির্ভরশীল করে তোলা এবং এই অলাভজনক সমীতিকে লাভজনক সমীতিতে কনভার্ট করা।",
    aboutTitle: "আমাদের সম্পর্কে",
    aboutContent: "২০২৬ সালে শুরু আমাদের যাত্রা। বিশ্বস্ততা ও স্বচ্ছতাই আমাদের শক্তি। ইনশা আল্লাহ, একদিন আমরা সফলতার শিখরে পৌঁছাবো।",
    membershipRules: "১. যেকোনো প্রাপ্তবয়স্ক বাংলাদেশী নাগরিক সদস্য হতে পারবেন।\n২. নির্ধারিত টাকা সময়েল মধ্যে পরিশোধ করতে হবে।\n৩. প্রত্যেক মিটিংয়ে উপস্থিতি বাধ্যতামূলক।",
    monthlySavingsAmount:1000,
    contactAddress: "বাড়ি নং ...., ঢাকা-বাংলাদেশ",
    contactMobile: "01324532410",
    contactEmail: "bajrulgad@gmail.com",
    whatsappLink: "https://wa.me/8801700000000",
    facebookLink: "https://facebook.com/samity",
    googleMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116833.83187883446!2d90.33728813280826!3d23.78106723972236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1715421234567!5m2!1sen!2sbd",
    adminPassword: "admin123"
  },
  notices: [
    { id: '1', title: 'বার্ষিক সাধারণ সভা ২০২৪', content: 'আগামী ২০শে অক্টোবর আমাদের বার্ষিক সভা অনুষ্ঠিত হবে।', date: '2024-10-01' },
    { id: '2', title: 'নতুন সঞ্চয় স্কিম চালু', content: 'সদস্যদের সুবিধার জন্য ১০০০ টাকার মাসিক স্কিম চালু হয়েছে।', date: '2024-09-15' }
  ],
  activities: [
    { id: '1', title: 'পোল্ট্রি খামার প্রকল্প', status: 'ongoing', description: 'সদস্যদের লভ্যাংশ বৃদ্ধির জন্য নিজস্ব পোল্ট্রি খামার স্থাপনের কাজ চলছে।' },
    { id: '2', title: 'বৃক্ষরোপণ কর্মসূচি', status: 'completed', description: 'গত বর্ষায় ৫০০০ চারা বিতরণ করা হয়েছে।' }
  ],
  gallery: [
    { id: '1', title: 'মিটিংয়ের ছবি', description: '২০২৪ সালের সেপ্টেম্বর মাসের জরুরি মিটিং।', imageUrl: 'https://picsum.photos/400/300?random=1', type: 'image' },
    { id: '2', title: 'কার্যক্রমের ছবি', description: 'আমাদের নতুন প্রকল্প পরিদর্শনে সদস্যরা।', imageUrl: 'https://picsum.photos/400/300?random=2', type: 'image' }
  ],
  members: [
    { id: '1001', name: 'আব্দুল করিম', mobile: '01711111111', password: '111', joinDate: '2020-01-01', totalSavings: 50000, imageUrl: 'https://i.pravatar.cc/150?u=1001', performance: 'green' },
    { id: '1002', name: 'রহিমা বেগম', mobile: '01722222222', password: '222', joinDate: '2021-05-10', totalSavings: 35000, imageUrl: 'https://i.pravatar.cc/150?u=1002', performance: 'yellow' }
  ],
  transactions: [
    { id: 't1', memberId: '1001', amount: 500, date: '2024-10-01', type: 'savings', status: 'paid' },
    { id: 't2', memberId: '1001', amount: 500, date: '2024-09-01', type: 'savings', status: 'paid' },
    { id: 't3', memberId: '1002', amount: 500, date: '2024-10-01', type: 'savings', status: 'paid' }
  ],
  messages: []
};
