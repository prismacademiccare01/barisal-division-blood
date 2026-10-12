import React from 'react';
import { Phone, ShieldAlert, Building2, Flame, Heart, AlertCircle, PhoneCall } from 'lucide-react';

export const EmergencySpeedDialBoard: React.FC = () => {
  const hotlines = [
    {
      name: 'জাতীয় জরুরি সেবা (৯৯৯)',
      category: 'জাতীয় হটলাইন',
      phone: '999',
      desc: 'পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিসের কেন্দ্রীয় জরুরি কল সেন্টার। টোল ফ্রি।',
      icon: ShieldAlert,
      badge: 'টোল ফ্রি',
      color: 'bg-red-600 text-white',
    },
    {
      name: 'শেরেবাংলা মেডিকেল ব্লাড ব্যাংক',
      category: 'বিভাগীয় ব্লাড ব্যাংক',
      phone: '০৪৩১-২১৭৩৭',
      desc: 'দক্ষিণাঞ্চলের সর্ববৃহৎ সরকারি ব্লাড ব্যাংক ও জরুরি ট্রান্সফিউশন সেন্টার।',
      icon: Building2,
      badge: '২৪ ঘণ্টা লাইভ',
      color: 'bg-rose-700 text-white',
    },
    {
      name: 'বরিশাল ফায়ার সার্ভিস ও সিভিল ডিফেন্স',
      category: 'উদ্ধার ও অ্যাম্বুলেন্স',
      phone: '০৪৩১-৬২৩৩৩',
      desc: 'জরুরি অ্যাম্বুলেন্স পরিবহন ও সড়ক দুর্ঘটনা উদ্ধার ইউনিট বরিশাল।',
      icon: Flame,
      badge: 'রেসকিউ টিম',
      color: 'bg-amber-600 text-white',
    },
    {
      name: 'সিভিল সার্জন কার্যালয়, বরিশাল',
      category: 'জেলা স্বাস্থ্য প্রশাসন',
      phone: '০৪৩১-২১৮২৮',
      desc: 'বরিশাল জেলার স্বাস্থ্য সমন্বয় ও সরকারি হাসপাতাল তথ্য সেল।',
      icon: Heart,
      badge: 'স্বাস্থ্য প্রশাসন',
      color: 'bg-blue-600 text-white',
    },
    {
      name: 'রেড ক্রিসেন্ট ব্লাড সেন্টার বরিশাল',
      category: 'মানবিক স্বেচ্ছাসেবা',
      phone: '০১৭০১-৯৯৮৮৭৭',
      desc: 'স্বেচ্ছায় রক্তদান ও রক্তের জরুরি স্ক্রিনিং সহযোগিতা কেন্দ্র।',
      icon: Heart,
      badge: 'রেড ক্রিসেন্ট',
      color: 'bg-red-700 text-white',
    },
    {
      name: 'স্বাস্থ্য বাতায়ন (১৬২৬৩)',
      category: 'মেডিকেল পরামর্শ',
      phone: '16263',
      desc: 'স্বাস্থ্য মন্ত্রণালয়ের ২৪ ঘণ্টা সরাসরি অভিজ্ঞ ডাক্তারের স্বাস্থ্য পরামর্শ।',
      icon: PhoneCall,
      badge: 'সরকারি সেবা',
      color: 'bg-emerald-600 text-white',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
          <PhoneCall className="w-4 h-4" />
          <span>ফিচার ৭: বিভাগীয় জরুরি স্পিড-ডায়াল ও হটবোর্ড</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          জরুরি হেল্পলাইন ও ১-ট্যাপ স্পিড ডায়াল বোর্ড
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          যেকোনো সংকটময় মুহূর্তে বরিশাল বিভাগের প্রধান হাসপাতাল ও জরুরি সংস্থার সাথে সরাসরি যোগাযোগ
        </p>
      </div>

      {/* Grid of Speed Dials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotlines.map((h, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-red-200 hover:shadow-xs transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${h.color} shadow-sm`}>
                  <h.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                  {h.badge}
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                {h.name}
              </h4>

              <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                {h.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-slate-800">
                {h.phone}
              </span>

              <a
                href={`tel:${h.phone}`}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>সরাসরি কল</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
