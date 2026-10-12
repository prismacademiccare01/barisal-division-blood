import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Heart,
  Droplet,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Apple,
  Coffee,
  Activity,
  Award,
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters.js';

interface MythFact {
  id: number;
  myth: string;
  fact: string;
  detail: string;
  category: 'health' | 'gender' | 'recovery' | 'safety';
}

const MYTHS_AND_FACTS: MythFact[] = [
  {
    id: 1,
    myth: 'রক্ত দিলে শরীর স্থায়ীভাবে দুর্বল হয়ে যায় এবং ওজন হ্রাস পায়।',
    fact: 'সম্পূর্ণ ভুল ধারণা! রক্তদানে শরীর দুর্বল হয় না, বরং নতুন রক্তকণিকা তৈরি দ্রুততর হয়।',
    detail: 'মানবদেহে গড়ে ৫ থেকে ৬ লিটার রক্ত থাকে। এর মাত্র ৩৫০-৪৫০ মিলি (এক ব্যাগ) গ্রহণ করা হয়, যা শরীর মাত্র ৪৮ ঘণ্টার মধ্যে তরল অংশে এবং ৪ থেকে ৮ সপ্তাহের মধ্যে লোহিত কণিকায় পুরোপুরি পূরণ করে ফেলে।',
    category: 'health',
  },
  {
    id: 2,
    myth: 'রক্ত দেওয়ার মাধ্যমে অন্য কোনো সংক্রামক রোগে আক্রান্ত হওয়ার ঝুঁকি থাকে।',
    fact: 'একেবারেই অসম্ভব! প্রতিটি রক্তদানে সম্পূর্ণ নতুন ও জীবাণুমুক্ত নিডেল ব্যবহার করা হয়।',
    detail: 'রক্ত সংগ্রহের সকল সরঞ্জাম একবার ব্যবহারের পর ধ্বংস করে ফেলা হয়। কোনো অবস্থাতেই রক্তদাতার সংক্রামিত হওয়ার ন্যূনতম ঝুঁকি থাকে না।',
    category: 'safety',
  },
  {
    id: 3,
    myth: 'মেয়েরা বা নারীরা রক্তদান করতে পারেন না।',
    fact: '১৮ থেকে ৬৫ বছর বয়সী যেকোনো সুস্থ নারী (ন্যূনতম ৪৫ কেজি ওজন ও ১২ গ্রাম/ডিএল হিমোগ্লোবিন) রক্ত দিতে পারেন।',
    detail: 'শুধু গর্ভাবস্থায় এবং স্তন্যদানকালে রক্তদান স্থগিত রাখা বাঞ্ছনীয়। অন্য সময়ে নারীদের রক্তদান সম্পূর্ণ নিরাপদ এবং অত্যন্ত প্রশংসনীয়।',
    category: 'gender',
  },
  {
    id: 4,
    myth: 'একবার রক্তদানের পর আর কখনো রক্ত দেওয়া যায় না বা দীর্ঘদিন অপেক্ষা করতে হয়।',
    fact: 'একজন প্রাপ্তবয়স্ক পুরুষ প্রতি ৩ মাস (৯০ দিন) এবং নারী প্রতি ৪ মাস (১২০ দিন) পরপর নিয়মিত রক্ত দিতে পারেন।',
    detail: 'নিয়মিত রক্তদানে হৃদরোগ ও স্ট্রোকের ঝুঁকি হ্রাস পায়, কারণ এটি শরীরে অতিরিক্ত আয়রনের ক্ষতিকর সঞ্চয় নিয়ন্ত্রণ করে।',
    category: 'recovery',
  },
  {
    id: 5,
    myth: 'ডায়াবেটিস বা উচ্চ রক্তচাপের রোগীরা কখনোই রক্ত দিতে পারেন না।',
    fact: 'যদি ডায়াবেটিস বা রক্তচাপ ওষুধের মাধ্যমে সম্পূর্ণ নিয়ন্ত্রণে থাকে, তবে চিকিৎসকের অনুমতি সাপেক্ষে রক্তদান সম্ভব।',
    detail: 'ইনসুলিন গ্রহণকারী নন এমন রোগী যদি সুস্থ বোধ করেন এবং রক্তচাপ স্বাভাবিক মাত্রায় থাকে, তবে রক্তদানে বাধা নেই।',
    category: 'health',
  },
  {
    id: 6,
    myth: 'ধূমপায়ী ব্যক্তিরা রক্তদান করতে পারেন না।',
    fact: 'ধূমপায়ীরা রক্ত দিতে পারেন, তবে রক্তদানের ৩ ঘণ্টা আগে ও ২ ঘণ্টা পর ধূমপান থেকে বিরত থাকা জরুরি।',
    detail: 'ধূমপানের পর রক্তে কার্বন মনোক্সাইড বৃদ্ধি পায়, তাই রক্তদানের সামান্য আগে ধূমপান না করা এবং প্রচুর জল পান করা আবশ্যক।',
    category: 'safety',
  },
];

export const BloodMythBuster: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    sleep: false,
    water: false,
    meal: false,
    feverFree: false,
    weightCheck: false,
  });

  const toggleCheck = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const readinessPercent = Math.round((checkedCount / 5) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-900/30 overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>চিকিৎসাবিজ্ঞান ও সচেতনতা গাইড</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            রক্তদান সংক্রান্ত প্রচলিত ভুল ধারণা বনাম বৈজ্ঞানিক সত্য
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            ভয় বা কুসংস্কার নয়, চিকিৎসাবিজ্ঞানের সঠিক তথ্য জানুন। একটি নিরাপদ রক্তদান শুধুমাত্র রোগীর জীবনই বাঁচায় না, আপনার নিজের শরীরেরও সুস্বাস্থ্য নিশ্চিত করে।
          </p>
        </div>
      </div>

      {/* Interactive 60-Second Readiness Checklist */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" />
              <span>ইন্টারেক্টিভ রক্তদান প্রস্তুতি চেকলিস্ট</span>
            </h3>
            <p className="text-xs text-slate-500">
              রক্তকেন্দ্রে যাওয়ার আগে নিচের বিষয়গুলো মিলিয়ে নিন:
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">আপনার প্রস্তুতি স্কোর</span>
              <span className="text-lg font-black text-emerald-600">
                {toBengaliDigits(readinessPercent)}%
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
              {toBengaliDigits(checkedCount)}/৫
            </div>
          </div>
        </div>

        {/* Check items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <label
            onClick={() => toggleCheck('sleep')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
              checklist.sleep
                ? 'bg-emerald-50/80 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                checklist.sleep ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-transparent'
              }`}
            >
              ✓
            </div>
            <div className="text-xs font-semibold">
              গত রাতে অন্তত ৬-৮ ঘণ্টা স্বাভাবিক ঘুম সম্পন্ন হয়েছে
            </div>
          </label>

          <label
            onClick={() => toggleCheck('water')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
              checklist.water
                ? 'bg-emerald-50/80 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                checklist.water ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-transparent'
              }`}
            >
              ✓
            </div>
            <div className="text-xs font-semibold">
              রক্তদানের পূর্বে ৫০০ মিলি পানি বা ডাবের পানি পান করেছি
            </div>
          </label>

          <label
            onClick={() => toggleCheck('meal')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
              checklist.meal
                ? 'bg-emerald-50/80 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                checklist.meal ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-transparent'
              }`}
            >
              ✓
            </div>
            <div className="text-xs font-semibold">
              খালি পেটে নেই (২-৩ ঘণ্টা আগে স্বাস্থ্যকর খাবার খেয়েছি)
            </div>
          </label>

          <label
            onClick={() => toggleCheck('feverFree')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
              checklist.feverFree
                ? 'bg-emerald-50/80 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                checklist.feverFree ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-transparent'
              }`}
            >
              ✓
            </div>
            <div className="text-xs font-semibold">
              গত ৭ দিনের মধ্যে কোনো জ্বর বা অ্যান্টিবায়োটিক সেবন করিনি
            </div>
          </label>

          <label
            onClick={() => toggleCheck('weightCheck')}
            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 select-none sm:col-span-2 ${
              checklist.weightCheck
                ? 'bg-emerald-50/80 border-emerald-200 text-slate-900'
                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                checklist.weightCheck ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-transparent'
              }`}
            >
              ✓
            </div>
            <div className="text-xs font-semibold">
              শারীরিক ওজন ন্যূনতম ৫০ কেজি (নারীদের ক্ষেত্রে ৪৫ কেজি) রয়েছে
            </div>
          </label>
        </div>

        {readinessPercent === 100 && (
          <div className="p-3 rounded-2xl bg-emerald-100/90 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>অভিনন্দন! আপনি রক্তদানের জন্য আদর্শ ও শারীরিকভাবে সম্পূর্ণ প্রস্তুত।</span>
          </div>
        )}
      </div>

      {/* Myths vs Facts Accordion List */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-red-600" />
          <span>সাধারণ ভুল ধারণা ও চিকিৎসাতথ্য</span>
        </h3>

        {MYTHS_AND_FACTS.map((item) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 hover:bg-slate-50/70 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-600 text-xs font-bold">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>ভুল ধারণা #{toBengaliDigits(item.id)}:</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                    "{item.myth}"
                  </h4>
                </div>

                <div className="p-1 rounded-xl bg-slate-100 text-slate-500 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 bg-emerald-50/30 space-y-3">
                  <div className="flex items-start gap-2.5 pt-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-emerald-900 text-xs sm:text-sm block">
                        সঠিক সত্য: {item.fact}
                      </span>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recovery Care Tips */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-3xl p-5 sm:p-6 border border-red-100">
        <h4 className="font-extrabold text-sm text-red-950 flex items-center gap-2 mb-3">
          <Apple className="w-4 h-4 text-red-600" />
          <span>রক্তদানের পরবর্তী ১২ ঘণ্টার যত্ন ও সতর্কতা</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white border border-red-100/80 shadow-xs">
            <span className="font-bold text-slate-800 block mb-1">পর্যাপ্ত পানি ও তরল</span>
            <p className="text-slate-500 leading-relaxed">
              রক্তদানের পর স্যালাইন, ফলের রস বা ডাবের পানি পান করুন। অতিরিক্ত ক্যাফেইন এড়িয়ে চলুন।
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-red-100/80 shadow-xs">
            <span className="font-bold text-slate-800 block mb-1">ভারী কাজ স্থগিত</span>
            <p className="text-slate-500 leading-relaxed">
              রক্তদানের পর অন্তত ৫ ঘণ্টা ভারী ওজন তোলা, কঠোর শরীরচর্চা বা মোটরসাইকেল চালানো থেকে বিরত থাকুন।
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white border border-red-100/80 shadow-xs">
            <span className="font-bold text-slate-800 block mb-1">আয়রন ও প্রোটিন</span>
            <p className="text-slate-500 leading-relaxed">
              ডিম, দুধ, কলা, খেজুর ও কচুশাক জাতীয় খাবার গ্রহণ করলে রক্ত উৎপাদন দ্রুততর হয়।
            </p>
          </div>
        </div>
      </div>

      {/* Architect Stamp */}
      <div className="p-3 text-center text-slate-400 text-xs flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>স্বাস্থ্য ও সচেতনতা সিস্টেম আর্কিটেক্ট: </span>
        <strong className="text-slate-700">MD. SAIDUL ISLAM</strong>
      </div>
    </div>
  );
};
