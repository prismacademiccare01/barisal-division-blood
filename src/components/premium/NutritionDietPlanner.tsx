import React, { useState } from 'react';
import {
  Apple,
  Coffee,
  Heart,
  Droplet,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Leaf,
  Beef,
  Flame,
} from 'lucide-react';

export const NutritionDietPlanner: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<'pre_donation' | 'post_donation' | 'iron_rich'>('pre_donation');

  const dietItems = {
    pre_donation: [
      {
        name: 'পর্যাপ্ত পানি ও ওরস্যালাইন',
        desc: 'রক্তদানের ২৪ ঘণ্টা আগে অন্তত ২.৫ থেকে ৩ লিটার পানি পান করুন। রক্তদানের ঠিক ১ ঘণ্টা আগে ৫০০ মিলি পানি বা ডাবের পানি পান করুন।',
        tag: 'হাইড্রেটিং ফ্লুইড',
        icon: Droplet,
        color: 'text-blue-600 bg-blue-50',
      },
      {
        name: 'হালকা শর্করা ও নাশতা',
        desc: 'খালি পেটে কখনো রক্ত দেবেন না। রক্তদানের ২-৩ ঘণ্টা আগে ডিম সেদ্ধ, রুটি, কলা বা খিচুড়ি দিয়ে স্বাস্থ্যকর খাবার খান।',
        tag: 'এনার্জি ব্যালান্স',
        icon: Apple,
        color: 'text-amber-600 bg-amber-50',
      },
      {
        name: 'তৈলাক্ত ফাস্টফুড পরিহার',
        desc: 'রক্তদানের আগের দিন অতিরিক্ত চর্বিযুক্ত ও ভাজাভুজি পরিহার করুন; এতে রক্তের প্লাজমার লিপিড মাত্রা বেড়ে রক্ত পরীক্ষায় জটিলতা হতে পারে।',
        tag: 'সতর্কতা',
        icon: Flame,
        color: 'text-red-600 bg-red-50',
      },
    ],
    post_donation: [
      {
        name: 'তাত্ক্ষণিক রিফ্রেশমেন্ট ও জুস',
        desc: 'রক্তদানের পরপরই মিষ্টি ফলের রস, গ্লুকোজ বা ডাবের পানি পান করুন। এটি রক্তচাপ স্বাভাবিক রাখতে সহায়তা করে।',
        tag: 'প্রথম ৩০ মিনিট',
        icon: Sparkles,
        color: 'text-emerald-600 bg-emerald-50',
      },
      {
        name: 'পর্যাপ্ত প্রোটিন ও তরল গ্রহণ',
        desc: 'পরবর্তী ৪৮ ঘণ্টা প্রতি ঘণ্টায় পানি বা স্যুপ পান করুন এবং মুরগির মাংস, মাছ, ডাল ও দুধের মতো প্রোটিনযুক্ত খাবার খান।',
        tag: '৪৮ ঘণ্টার ডায়েট',
        icon: Beef,
        color: 'text-purple-600 bg-purple-50',
      },
      {
        name: 'চা ও কফি সাময়িক বিরতি',
        desc: 'রক্তদানের পরপরই গাঢ় চা বা কফি পান করবেন না, কারণ ক্যাফেইন ও ট্যানিন শরীর থেকে দ্রুত আয়রন শোষণে বাধা দেয়।',
        tag: 'জরুরি নিয়ম',
        icon: Coffee,
        color: 'text-rose-600 bg-rose-50',
      },
    ],
    iron_rich: [
      {
        name: 'স্থানীয় কচুশাক ও পালংশাক',
        desc: 'দক্ষিণাঞ্চলের সহজলভ্য কচুশাক, ডাঁটাশাক ও কলমিশাকে রয়েছে বিপুল পরিমাণ উদ্ভিজ্জ নন-হিম আয়রন ও ফলিক এসিড।',
        tag: 'সবুজ শাকসবজি',
        icon: Leaf,
        color: 'text-emerald-700 bg-emerald-50',
      },
      {
        name: 'কলিজা ও লাল মাংস',
        desc: 'খাসি বা গরুর কলিজায় থাকা হিম আয়রন মানব শরীর খুব দ্রুত শোষণ করে লোহিত রক্তকণিকা (RBC) পুনর্গঠন করে।',
        tag: 'সেরা হিম আয়রন',
        icon: Beef,
        color: 'text-red-700 bg-red-50',
      },
      {
        name: 'ডালিম, বেদানা ও ভিটামিন সি (লেবু)',
        desc: 'আয়রনযুক্ত খাবারের সাথে এক টুকরো লেবু খেলে ভিটামিন সি-এর সহায়তায় আয়রন শোষণ ক্ষমতা ৩ গুণ বৃদ্ধি পায়।',
        tag: 'শোষণ বুস্টার',
        icon: Apple,
        color: 'text-amber-700 bg-amber-50',
      },
    ],
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Leaf className="w-4 h-4" />
          <span>ফিচার ৬: ক্লিনিক্যাল নিউট্রিশন ও আয়রন রিকভারি প্ল্যানার</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          রক্তদান প্রস্তুতি ডায়েট ও স্থানীয় পুষ্টি নির্দেশিকা
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          রক্তদানের পূর্বে, রক্তদানের পরে এবং রক্তকণিকা দ্রুত বৃদ্ধির জন্য স্থানীয় পুষ্টিকর খাবারের তালিকা
        </p>
      </div>

      {/* Segmented Phase Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none text-xs">
        <button
          onClick={() => setSelectedPhase('pre_donation')}
          className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${
            selectedPhase === 'pre_donation'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          রক্তদানের আগের প্রস্তুতি
        </button>

        <button
          onClick={() => setSelectedPhase('post_donation')}
          className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${
            selectedPhase === 'post_donation'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          রক্তদানের পরের রিকভারি
        </button>

        <button
          onClick={() => setSelectedPhase('iron_rich')}
          className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${
            selectedPhase === 'iron_rich'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          আয়রন ও হিমোগ্লোবিন বুস্টার খাবার
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dietItems[selectedPhase].map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 hover:shadow-xs transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                  {item.tag}
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 mb-1.5">
                {item.name}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>ডাক্তারি পরামর্শ অনুযায়ী অনুমোদিত</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
