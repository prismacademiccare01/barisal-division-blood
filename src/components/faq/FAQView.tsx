import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Droplet,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Sparkles,
  PhoneCall,
  Search,
} from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
  category: 'general' | 'donation' | 'privacy' | 'emergency';
}

const FAQ_DATA: FaqItem[] = [
  // General
  {
    category: 'general',
    q: 'barishal-Blood (বরিশাল রক্ত) প্ল্যাটফর্মটি কী?',
    a: 'barishal-Blood হলো বরিশাল বিভাগের ৬টি জেলার (বরিশাল, ভোলা, পটুয়াখালী, পিরোজপুর, ঝালকাঠি, বরগুনা) একটি কেন্দ্রীয়, ডিজিটাল ও ভেরিফাইড রক্তদাতা ও জরুরি চিকিৎসা নেটওয়ার্ক। জরুরি মুহূর্তে যেকোনো রোগী দ্রুততম সময়ে রক্তের গ্রুপ ও নির্দিষ্ট এলাকা অনুযায়ী রক্তদাতা খুঁজে পেতে পারেন।',
  },
  {
    category: 'general',
    q: 'এই সেবা নিতে কি কোনো টাকা দিতে হয়?',
    a: 'না, সম্পূর্ণ বিনামূল্যে। রক্তদান একটি নিঃস্বার্থ মানবিক উদ্যোগ। এই প্ল্যাটফর্ম বা রক্তদাতার সাথে লেনদেনের কোনো আর্থিক সংশ্লিষ্টতা নেই। রক্ত কেনাবেচা আইনত দণ্ডনীয় অপরাধ।',
  },
  {
    category: 'general',
    q: 'বরিশাল বিভাগের কোন কোন এলাকা এই প্ল্যাটফর্মের আওতায় রয়েছে?',
    a: 'বরিশাল সদর সহ বিভাগের মোট ৬টি জেলা—বরিশাল, পটুয়াখালী, ভোলা, পিরোজপুর, বরগুনা ও ঝালকাঠি এবং এদের অন্তর্ভুক্ত প্রতিটি উপজেলা ও চরাঞ্চল এর নেটওয়ার্কের আওতাভুক্ত।',
  },

  // Donation
  {
    category: 'donation',
    q: 'কে রক্তদান করতে পারবেন এবং কী কী যোগ্যতা প্রয়োজন?',
    a: '১৮ থেকে ৬০ বছর বয়সী যেকোনো সুস্থ পুরুষ বা নারী, যার ওজন কমপক্ষে ৫০ কেজি (নারীদের ক্ষেত্রে ৪৫ কেজি), হিমোগ্লোবিন স্বাভাবিক মাত্রায় রয়েছে এবং যিনি সংক্রামক ব্যাধিমুক্ত, তিনি রক্তদান করতে পারেন। রক্তদানের মাঝে কমপক্ষে ৯০ থেকে ১২০ দিনের বিরতি থাকা আবশ্যক।',
  },
  {
    category: 'donation',
    q: 'রক্তদান করলে শরীরে কোনো দুর্বলতা বা ক্ষতি হয় কি?',
    a: 'না, কোনো ক্ষতি হয় না। মানবদেহের মোট রক্তের মাত্র এক ব্যাগ (৩৫০-৪৫০ মিলি) সংগ্রহ করা হয়, যা ২৪-৪৮ ঘণ্টার মধ্যে শরীরে তরলের সমতা ফিরে পায় এবং কয়েক সপ্তাহের মধ্যে অস্থিমজ্জা থেকে নতুন লোহিত রক্তকণিকা তৈরি হয়ে যায়। রক্তদান করলে হৃদরোগের ঝুঁকিও কমে।',
  },
  {
    category: 'donation',
    q: 'রক্তদানের আগে ও পরে কী কী সতর্কতা অবলম্বন করা উচিত?',
    a: 'রক্তদানের আগের রাতে ভালো ঘুম হওয়া উচিত এবং পর্যাপ্ত পানি ও পুষ্টিকর খাবার খাওয়া উচিত। খালি পেটে রক্তদান করা যাবে না। রক্তদানের পর অন্তত ১৫ মিনিট বিশ্রাম নেওয়া, মিষ্টি তরল বা স্যালাইন পান করা এবং ভারী শারীরিক ব্যায়াম পরিহার করা উচিত।',
  },

  // Privacy & Safety
  {
    category: 'privacy',
    q: 'রক্তদাতার ফোন নম্বর ও তথ্যের গোপনীয়তা কীভাবে রক্ষা করা হয়?',
    a: 'বরিশাল রক্ত প্ল্যাটফর্ম কঠোর প্রটেক্টেড আর্কিটেকচার মেনে চলে। রক্তদাতার সুনির্দিষ্ট বাড়ির ঠিকানা কখনো উন্মুক্ত করা হয় না, কেবল আনুমানিক এলাকা প্রদর্শিত হয়। রক্তদাতার ফোন নম্বর অপ্রয়োজনীয় কল বা স্প্যামিং থেকে রক্ষায় কন্ট্রোল্ড কলিং ও লগইন অ্যাক্সেসের অধীন রাখা হয়েছে। এছাড়াও রক্তদাতা যেকোনো সময় নিজের ড্যাশবোর্ড থেকে প্রাপ্যতা "সাময়িক বিরতিতে" রাখতে পারেন।',
  },
  {
    category: 'privacy',
    q: 'ভেরিফাইড রক্তদাতা (Verified Donor) কীভাবে হওয়া যায়?',
    a: 'মোবাইল নম্বর ও পূর্ববর্তী রক্তদানের তথ্য সঠিক থাকলে অ্যাডমিন ভেরিফিকেশন এবং কমিউনিটি রেফারেন্সের মাধ্যমে প্রোফাইলে ব্লু ভেরিফাইড ব্যাজ প্রদান করা হয়। এর ফলে রোগীরা আস্থার সাথে যোগাযোগ করতে পারেন।',
  },

  // Emergency
  {
    category: 'emergency',
    q: 'জরুরি রক্তের আবেদন কীভাবে করতে হয়?',
    a: 'মূল পাতায় অথবা জরুরি রক্ত বিভাগে গিয়ে "+ রক্তের আবেদন করুন" বাটনে ক্লিক করুন। রোগীর নাম, রক্তের গ্রুপ, প্রয়োজনীয় ব্যাগের সংখ্যা, হাসপাতালের নাম ও যোগাযোগ নম্বর লিখে সাবমিট করলেই আবেদনটি লাইভ ফিডে যুক্ত হবে এবং সংশ্লিষ্ট জেলার রক্তদাতাদের রাডারে দৃশ্যমান হবে।',
  },
  {
    category: 'emergency',
    q: 'সোশ্যাল মিডিয়া পোস্টার ও জরুরি এসএমএস কীভাবে তৈরি করব?',
    a: 'জরুরি রক্তের আবেদনের পাশেই "পোস্টার মেকার" ও "এসএমএস মেকার" টুল রয়েছে। এতে এক ক্লিকেই রোগীর তথ্যসহ স্বয়ংক্রিয় ব্যানার তৈরি হয়ে যাবে যা হোয়াটসঅ্যাপ, ফেসবুক ও মেসেঞ্জারে সরাসরি শেয়ার করা যায়।',
  },
  {
    category: 'emergency',
    q: 'থ্যালাসেমিয়া রোগী ও প্লাটিলেটের জন্য কি কোনো বিশেষ সুবিধা আছে?',
    a: 'হ্যাঁ! আমাদের প্ল্যাটফর্মে থ্যালাসেমিয়া রোগীদের জন্য রেগুলার ২০-৩০ দিন পর পর রক্তদানের বিশেষ "থ্যালাসেমিয়া বাডি নেটওয়ার্ক" এবং ডেঙ্গু রোগীদের জন্য "প্লাটিলেট ও এসডিপি ম্যাচিং সেল" সক্রিয় রয়েছে।',
  },
];

export const FAQView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleIndex = (idx: number) => {
    if (openIndices.includes(idx)) {
      setOpenIndices(openIndices.filter((i) => i !== idx));
    } else {
      setOpenIndices([...openIndices, idx]);
    }
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-red-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold mb-3 border border-red-400/30">
            <HelpCircle className="w-3.5 h-3.5 text-red-400" />
            <span>সাহায্য ও তথ্য কেন্দ্র</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            বরিশাল রক্ত প্ল্যাটফর্মের কার্যপদ্ধতি, রক্তদানের সঠিক নিয়মাবলী, রক্তদাতার গোপনীয়তা এবং জরুরি যোগাযোগ সংক্রান্ত সমস্ত তথ্যের সহজ সমাধান।
          </p>

          {/* Search box inside banner */}
          <div className="mt-5 relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="আপনার প্রশ্ন লিখে খুঁজুন (যেমন: যোগ্যতা, নম্বর, হাসপাতাল)..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white placeholder-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-red-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          সকল প্রশ্ন ({FAQ_DATA.length})
        </button>

        <button
          onClick={() => setSelectedCategory('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            selectedCategory === 'general'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          সাধারণ তথ্য
        </button>

        <button
          onClick={() => setSelectedCategory('donation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            selectedCategory === 'donation'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          রক্তদান ও যোগ্যতা
        </button>

        <button
          onClick={() => setSelectedCategory('privacy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            selectedCategory === 'privacy'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          নিরাপত্তা ও গোপনীয়তা
        </button>

        <button
          onClick={() => setSelectedCategory('emergency')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
            selectedCategory === 'emergency'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          জরুরি আবেদন ও সেবা
        </button>
      </div>

      {/* Accordion Questions */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500 text-xs">
            আপনার অনুসন্ধানের সাথে মিল রেখে কোনো প্রশ্ন পাওয়া যায়নি। অনুগ্রহ করে ভিন্ন শব্দ দিয়ে অনুসন্ধান করুন।
          </div>
        ) : (
          filteredFaqs.map((item, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition shadow-xs hover:border-red-200"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-3 bg-white hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-black text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <span>{item.q}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                    <p className="pl-10">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Help Hotline Note */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              আরও কোনো প্রশ্ন বা জরুরি সাহায্য প্রয়োজন?
            </h4>
            <p className="text-xs text-slate-600">
              আমাদের ২৪ ঘণ্টা হটলাইন ও স্বেচ্ছাসেবী টিম যেকোনো মুহূর্তে পাশে রয়েছে।
            </p>
          </div>
        </div>

        <a
          href="tel:999"
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-xs shrink-0"
        >
          জরুরি কল: ৯৯৯
        </a>
      </div>
    </div>
  );
};
