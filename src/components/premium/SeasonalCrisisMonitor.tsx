import React, { useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  CloudRain,
  Flame,
  Droplet,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const SeasonalCrisisMonitor: React.FC = () => {
  const currentSeason = 'পোস্ট-মনসুন ও ডেঙ্গু সতর্কবার্তা';

  const seasonalTrends = [
    {
      period: 'আগস্ট – নভেম্বর (ডেঙ্গু পিক সিজন)',
      threat: 'তীব্র প্লাটিলেট ও হোল ব্লাড সংকট',
      severity: 'অতি উচ্চ (Critical)',
      notes: 'ডেঙ্গু হেমোরেজিক ফিভারের কারণে বরিশাল শেরেবাংলা মেডিকেলে দৈনিক ৫০+ ব্যাগ প্লাটিলেটের চাহিদা তৈরি হয়।',
      advice: '১৮-৪০ বছর বয়সী সুস্থ ব্যক্তিদের জরুরি প্লাটিলেট ডোনেশনের জন্য প্রস্তুত থাকা উচিত।',
      color: 'border-red-300 bg-red-50/60 text-red-950',
      badge: 'HIGH ALERT',
    },
    {
      period: 'রমজান মাস (সিয়াম সাধনার মাস)',
      threat: 'দিনের বেলা রক্তদাতার স্বাভাবিক ঘাটতি',
      severity: 'উচ্চ (Severe)',
      notes: 'রোজা রাখার কারণে দিনের বেলায় রক্তদান সম্ভব হয় না, ফলে ব্লাড ব্যাংকে তীব্র সংকট দেখা দেয়।',
      advice: 'ইফতার ও তারাবির পর রাত ৮টা থেকে রাত ১১টা পর্যন্ত রক্তদান ক্যাম্পেইনে অংশ নিন।',
      color: 'border-amber-300 bg-amber-50/60 text-amber-950',
      badge: 'NIGHT CAMPAIGN',
    },
    {
      period: 'মে – জুন / অক্টোবর (ঘূর্ণিঝড় ও উপকূলীয় দুর্যোগ)',
      threat: 'চরাঞ্চল বিচ্ছিন্নতা ও ট্রমা কেয়ার',
      severity: 'মাঝারি (Moderate)',
      notes: 'ঘূর্ণিঝড় বা জলোচ্ছ্বাসের সময় পাথরঘাটা, চরফ্যাশন ও গলাচিপায় সড়ক যোগাযোগ ব্যাহত হতে পারে।',
      advice: 'দুর্যোগের পূর্বেই স্থানীয় উপজেলা স্বাস্থ্য কমপ্লেক্সে পর্যাপ্ত ও-নেগেটিভ ও হোল ব্লাড মজুত রাখা হয়।',
      color: 'border-blue-300 bg-blue-50/60 text-blue-950',
      badge: 'DISASTER READY',
    },
    {
      period: 'ডিসেম্বর – জানুয়ারি (শীতকালীন রুটিন সার্জারি)',
      threat: 'ইলেক্টিভ সার্জারির উচ্চ চাপ',
      severity: 'নিয়মিত (Normal)',
      notes: 'শীতকালে অর্থোপেডিক ও পরিকল্পিত অস্ত্রোপচার বেশি হওয়ায় নিয়মিত রক্তের প্রয়োজন হয়।',
      advice: 'স্বেচ্ছায় রক্তদান ক্লাবগুলোর নিয়মিত ৩ মাসের ডোনেশন রুটিন সক্রিয় থাকে।',
      color: 'border-emerald-300 bg-emerald-50/60 text-emerald-950',
      badge: 'ROUTINE STABLE',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>ফিচার ১৬: বিভাগীয় রক্তের চাহিদা পূর্বাভাস</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          মৌসুমি রক্তের ঘাটতি ও দুর্যোগ পূর্বাভাস মনিটর
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          ডেঙ্গু মৌসুম, রমজান মাস ও প্রাকৃতিক দুর্যোগের সময় দক্ষিণাঞ্চলের রক্তের চাহিদার বৈজ্ঞানিক পূর্বাভাস
        </p>
      </div>

      {/* Current Realtime Status Banner */}
      <div className="p-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-800 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-red-200 uppercase tracking-widest block">
              বর্তমান বিভাগীয় পরিস্থিতি
            </span>
            <h4 className="font-extrabold text-base">{currentSeason}</h4>
          </div>
        </div>

        <div className="text-xs text-red-100 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
          প্লাটিলেট ও ও-নেগেটিভ (O-) স্টক অগ্রাধিকার দেওয়া হচ্ছে
        </div>
      </div>

      {/* Seasonal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {seasonalTrends.map((s, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border ${s.color} flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black text-slate-900">
                  {s.period}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-800">
                  {s.badge}
                </span>
              </div>

              <h5 className="font-extrabold text-sm text-red-700 mb-1">
                ঝুঁকি: {s.threat}
              </h5>

              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                {s.notes}
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-200/80 text-[11px] text-slate-900 font-medium">
              💡 <strong>করণীয়:</strong> {s.advice}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
