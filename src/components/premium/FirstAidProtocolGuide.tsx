import React, { useState } from 'react';
import {
  HeartPulse,
  AlertTriangle,
  Activity,
  Droplet,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Search,
  PhoneCall,
  Sparkles,
  LifeBuoy,
} from 'lucide-react';

interface Protocol {
  id: string;
  title: string;
  category: 'bleeding' | 'fainting' | 'shock' | 'transfusion';
  summary: string;
  steps: string[];
  doList: string[];
  dontList: string[];
  emergencyContact: string;
}

const PROTOCOLS: Protocol[] = [
  {
    id: 'severe-bleeding',
    title: 'দুর্ঘটনায় তীব্র রক্তক্ষরণ বন্ধের তাৎক্ষণিক উপায়',
    category: 'bleeding',
    summary: 'অ্যাম্বুলেন্স আসার আগে রক্তক্ষরণ দ্রুত বন্ধ করা রোগীর জীবন বাঁচানোর সবচেয়ে গুরুত্বপূর্ণ ধাপ।',
    steps: [
      'পরিষ্কার গজ বা কাপড় দিয়ে ক্ষতস্থানে সরাসরি হাতের তালু দিয়ে শক্ত চাপ (Direct Pressure) বজায় রাখুন।',
      'চাপ বজায় রেখেই ক্ষতস্থানটি সম্ভব হলে রোগীর হৃদপিণ্ডের লেভেলের উপরে তুলে রাখুন (Elevation)।',
      'কাপড় ভিজে গেলে আগের কাপড় না সরিয়ে তার উপর আরও কাপড় দিয়ে শক্ত ব্যান্ডেজ বেঁধে দিন।',
      'যদি অঙ্গচ্ছেদ বা ধমনী কেটে প্রচণ্ড ফিনকি দিয়ে রক্ত বের হয়, কেবল তখনই ক্ষতের ২ ইঞ্চি উপরে টার্নিকেট (Tourniquet) ব্যবহার করুন এবং সময় লিখে রাখুন।',
    ],
    doList: [
      'রোগীকে শুইয়ে রাখুন ও শান্ত রাখুন।',
      'চাপ দেওয়ার কাপড় রক্তে ভিজে গেলেও প্রথম কাপড়টি তুলবেন না।',
      'জরুরি রক্তদাতাদের রক্তের গ্রুপ প্রস্তুত রাখুন।',
    ],
    dontList: [
      'ক্ষতের ভেতরে ঢুকে থাকা কোনো ধারালো বস্তু নিজে টেনে বের করবেন না।',
      'ক্ষতে মাটি, গোবর বা অননুমোদিত গাছের পাতা লাগাবেন না।',
    ],
    emergencyContact: '৯৯৯ বা স্থানীয় ট্রমা সেন্টার',
  },
  {
    id: 'post-donation-faint',
    title: 'রক্তদানের পর মাথা ঘোরা বা ভ্যাসোভ্যাগাল সিনকোপ',
    category: 'fainting',
    summary: 'রক্তদানের পর রক্তচাপ সাময়িক কমে গেলে মাথা ঘোরা বা চোখ অন্ধকার হয়ে আসতে পারে।',
    steps: [
      'ব্যক্তিকে সাথে সাথে চিৎ করে শুইয়ে দিন। বসার চেষ্টা করতে দেবেন না।',
      'পায়ের নিচে বালিশ বা কাপড় দিয়ে পা দুটি শরীরের চেয়ে অন্তত ১২ ইঞ্চি উঁচুতে তুলে রাখুন (Trendelenburg Position)।',
      'টাইট বেল্ট, কলার বা ওড়না আলগা করে উন্মুক্ত বাতাস চলাচল নিশ্চিত করুন।',
      'জ্ঞান পুরোপুরি ফিরলে ধীরে ধীরে মুখে খাবার পানি, ওরস্যালাইন বা মিষ্টি ফলের রস পান করান।',
      'অন্তত ২০ মিনিট সম্পূর্ণ বিশ্রাম দিন, হঠাৎ উঠে দাঁড়াতে দেবেন না।',
    ],
    doList: [
      'মাথার চেয়ে পা উঁচুতে রাখুন যাতে মস্তিষ্কে রক্তপ্রবাহ বাড়ে।',
      'মুখে ঠান্ডা পানির ঝাপটা দিন ও কপালে ভেজা রুমাল রাখুন।',
    ],
    dontList: [
      'অজ্ঞান অবস্থায় মুখে কোনো তরল বা খাবার জোর করে ঢালবেন না।',
      'তাড়াহুড়ো করে রোগীকে তুলে বসানোর চেষ্টা করবেন না।',
    ],
    emergencyContact: 'শেরেবাংলা মেডিকেল ব্লাড ব্যাংক: ০৪৩১-২১৭৩৭',
  },
  {
    id: 'hypovolemic-shock',
    title: 'রক্তশূন্যতাজনিত শক (Hypovolemic Shock) চিহ্নিতকরণ',
    category: 'shock',
    summary: 'প্রচুর রক্তক্ষরণে শরীরের প্রধান অঙ্গগুলোতে অক্সিজেন সরবরাহ বন্ধ হয়ে যাওয়া একটি জীবনঘাতী জরুরি অবস্থা।',
    steps: [
      'লক্ষণ লক্ষ্য করুন: শরীর অতিরিক্ত ঠান্ডা ও ঘাম হওয়া, দ্রুত ও অগভীর শ্বাসপ্রশ্বাস, ঠোঁট ও নখ নীল হয়ে যাওয়া, তীব্র তৃষ্ণা।',
      'রোগীকে শুইয়ে কম্বল দিয়ে শরীর গরম রাখুন (Hypothermia প্রতিরোধ করুন)।',
      'যদি বমি না থাকে, তবে পা উঁচুতে রাখুন। বমি থাকলে রোগীকে একপাশে কাত করে শুইয়ে দিন (Recovery Position)।',
      'কোনো কালক্ষেপণ না করে দ্রুততম উপায়ে আইভি স্যালাইন ও ও-নেগেটিভ (O-) বা ক্রস-ম্যাচ রক্তের জন্য হাসপাতালে নিন।',
    ],
    doList: [
      'রোগীর শ্বাস-প্রশ্বাস নিয়মিত পর্যবেক্ষণ করুন।',
      'রোগীকে চাদর বা কম্বল দিয়ে ঢেকে শরীরের তাপমাত্রা ধরে রাখুন।',
    ],
    dontList: [
      'শকে থাকা রোগীকে মুখে কোনো খাবার বা ভারী পানীয় দেবেন না।',
      'রোগীকে একা ফেলে কোথাও যাবেন না।',
    ],
    emergencyContact: 'জরুরি অ্যাম্বুলেন্স: ৯৯৯',
  },
  {
    id: 'transfusion-reaction',
    title: 'রক্ত গ্রহণের সময় রিঅ্যাকশন বা পার্শ্বপ্রতিক্রিয়া হলে করণীয়',
    category: 'transfusion',
    summary: 'রোগীকে রক্ত দেওয়ার সময় শরীর কাঁপিয়ে জ্বর আসা বা শ্বাসকষ্ট হলে অবিলম্বে ট্রান্সফিউশন বন্ধ করা আবশ্যক।',
    steps: [
      'রক্ত সঞ্চালনের ক্ল্যাম্প অবিলম্বে বন্ধ (Stop Transfusion) করুন কিন্তু আইভি ক্যানুলা খুলে ফেলবেন না।',
      'সাথে সাথে কর্তব্যরত ডাক্তার ও নার্সকে ডাকুন।',
      'স্বাভাবিক স্যালাইন (Normal Saline) ধীরে ধীরে চালু রাখুন যাতে শিরার রাস্তা খোলা থাকে।',
      'রক্তের ব্যাগ এবং ব্যবহৃত আইভি সেট সংরক্ষণ করুন পরবর্তী ল্যাবরেটরি পরীক্ষার জন্য।',
    ],
    doList: [
      'রোগীর তাপমাত্রা, পালস ও রক্তচাপ দ্রুত রেকর্ড করুন।',
      'ডাক্তারের নির্দেশ মোতাবেক অ্যান্টিহিস্টামিন বা হাইড্রোকর্টিসন ইনজেকশন প্রস্তুত রাখুন।',
    ],
    dontList: [
      'রিঅ্যাকশন হওয়ার পরও "অল্প একটু রক্ত বাকি আছে" ভেবে চালিয়ে রাখবেন না।',
    ],
    emergencyContact: 'হাসপাতাল ডিউটি মেডিকেল অফিসার',
  },
];

export const FirstAidProtocolGuide: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('severe-bleeding');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = PROTOCOLS.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-emerald-700/60">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-bold border border-emerald-400/30 text-emerald-200">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>অফলাইন মেডিকেল ইমার্জেন্সি গাইডবুক</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            রক্তক্ষরণ ও ফার্স্ট-এইড প্রটোকল
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            দুর্ঘটনায় অতিরিক্ত রক্তপাত বন্ধ, রক্তদানের পর মাথা ঘোরা কিংবা ট্রান্সফিউশন রিঅ্যাকশনের ক্ষেত্রে আন্তর্জাতিক রেড ক্রস ও ডিজিএইচএস মানসম্মত জরুরি প্রাথমিক চিকিৎসা গাইড।
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="লক্ষণ বা পরিস্থিতি দিয়ে খুঁজুন (যেমন: মাথা ঘোরা, রক্তক্ষরণ, শক)..."
          className="w-full px-2 py-1.5 text-xs text-slate-800 focus:outline-hidden"
        />
      </div>

      {/* Accordion Cards */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isOpen = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition"
            >
              <button
                onClick={() => setExpandedId(isOpen ? '' : item.id)}
                className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      লাইফসেভিং প্রটোকল
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.summary}</p>
                </div>

                <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0 mt-1">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-slate-100 space-y-5 text-xs">
                  {/* Step-by-Step Action Plan */}
                  <div className="space-y-2">
                    <h4 className="font-black text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wide">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      ধাপে ধাপে করণীয় পদক্ষেপ:
                    </h4>
                    <ol className="space-y-2 pl-1">
                      {item.steps.map((st, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-slate-700">
                          <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] flex items-center justify-center shrink-0 border border-emerald-200">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{st}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Do's and Don'ts Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        যা অবশ্যই করবেন:
                      </span>
                      <ul className="space-y-1 text-slate-700 text-[11px]">
                        {item.doList.map((d, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-200 space-y-1.5">
                      <span className="font-bold text-red-900 flex items-center gap-1.5 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        যা ভুলেও করবেন না:
                      </span>
                      <ul className="space-y-1 text-slate-700 text-[11px]">
                        {item.dontList.map((d, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-red-600 font-bold">✕</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Hot Contact */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">
                      জরুরি রেফারেল: <strong className="text-slate-900">{item.emergencyContact}</strong>
                    </span>
                    <a
                      href="tel:999"
                      className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-red-700 transition"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>৯৯৯ কল করুন</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
