import React, { useState } from 'react';
import { toBengaliDigits, formatDateBengali } from '../../utils/formatters.js';
import {
  Calendar,
  Clock,
  Download,
  CheckCircle2,
  Sparkles,
  Heart,
  Activity,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const DonationCycleCalendar: React.FC = () => {
  const [lastDate, setLastDate] = useState(() => {
    // Default to 45 days ago
    const d = new Date();
    d.setDate(d.getDate() - 45);
    return d.toISOString().split('T')[0];
  });

  const [gender, setGender] = useState<'male' | 'female'>('male');

  // Male donation interval is 90 days (3 months), Female is 120 days (4 months)
  const intervalDays = gender === 'male' ? 90 : 120;

  const baseDate = new Date(lastDate);

  // Calculate 4 future donation milestones
  const milestones = [1, 2, 3, 4].map((step) => {
    const futureDate = new Date(baseDate);
    futureDate.setDate(baseDate.getDate() + intervalDays * step);
    return {
      step,
      date: futureDate.toISOString().split('T')[0],
      displayDate: formatDateBengali(futureDate.toISOString()),
      quarter: `দান ধাপ ${toBengaliDigits(step)}`,
    };
  });

  // Calculate next eligible date and countdown
  const nextEligibleDate = new Date(baseDate);
  nextEligibleDate.setDate(baseDate.getDate() + intervalDays);

  const today = new Date();
  const diffTime = nextEligibleDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isReady = diffDays <= 0;

  // Recovery milestones
  const plasmaRecoveryDays = 2; // 48h
  const plateletsRecoveryDays = 3;
  const redBloodCellsRecoveryDays = 42; // 6 weeks
  const ironRecoveryDays = intervalDays;

  // Generate .ICS Calendar File
  const handleDownloadIcs = () => {
    const eventDate = nextEligibleDate.toISOString().replace(/-|:|\.\d+/g, '');
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//barishal-Blood//Blood Donation Calendar//BN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:🩸 রক্তদানের উপযুক্ততার দিন - barishal-Blood
DESCRIPTION:আপনার পূর্ববর্তী রক্তদানের পর আজ আপনি পুনরায় রক্তদানে সম্পূর্ণ উপযুক্ত। barishal-Blood প্ল্যাটফর্মে গিয়ে জরুরি রোগীকে রক্তদান করুন। সফটওয়্যার আর্কিটেক্ট: MD. SAIDUL ISLAM
DTSTART:${eventDate.substring(0, 8)}T090000Z
DTEND:${eventDate.substring(0, 8)}T100000Z
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:আগামীকাল রক্তদানের সময়
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `blood-donation-reminder-${nextEligibleDate.toISOString().split('T')[0]}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>ফিচার ৪: বৈজ্ঞানিক রিকভারি ও রক্তদান সাইকেল ক্যালেন্ডার</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            রক্তদানের স্বাস্থ্য ক্যালেন্ডার ও স্মার্ট রিমাইন্ডার
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            শরীরের রক্তকণিকা ও আয়রন পুনরুদ্ধারের ধাপ এবং পরবর্তী ৪টি রক্তদানের সময়সূচি
          </p>
        </div>

        <button
          onClick={handleDownloadIcs}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>ক্যালেন্ডার ইভেন্ট (.ics) ডাউনলোড</span>
        </button>
      </div>

      {/* Input Selection Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">
            সর্বশেষ রক্তদানের তারিখ নির্বাচন করুন
          </label>
          <input
            type="date"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">
            রক্তদাতার লিঙ্গ (মেডিকেল রিকভারি সময়কাল)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setGender('male')}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                gender === 'male'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700'
              }`}
            >
              পুরুষ (প্রতি ৯০ দিন পর)
            </button>
            <button
              onClick={() => setGender('female')}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                gender === 'female'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700'
              }`}
            >
              নারী (প্রতি ১২০ দিন পর)
            </button>
          </div>
        </div>
      </div>

      {/* Live Status Hero Box */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isReady ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-amber-50/70 border-amber-200 text-amber-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isReady ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
          }`}>
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base">
              {isReady
                ? 'অভিনন্দন! আপনি এখন রক্তদানে সম্পূর্ণ প্রস্তুত ও উপযুক্ত'
                : `পরবর্তী রক্তদানের উপযুক্ত হতে আর ${toBengaliDigits(diffDays)} দিন বাকি`}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              পরবর্তী অনুমোদিত তারিখ: <strong>{milestones[0].displayDate}</strong>
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${
          isReady ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
        }`}>
          {isReady ? 'READY TO DONATE' : 'RECOVERY PHASE'}
        </span>
      </div>

      {/* Physiological Recovery Timeline */}
      <div className="space-y-2">
        <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
          শারীরিক উপাদান পুনরুদ্ধারের বিজ্ঞানসম্মত ধাপসমূহ:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">১. প্লাজমা ও রক্তরস</span>
            <span className="text-red-600 font-extrabold block text-sm mt-0.5">৪৮ ঘণ্টা</span>
            <span className="text-[11px] text-slate-500">প্রচুর পানি ও তরলে পূরণ হয়</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">২. প্লাটিলেট সেল</span>
            <span className="text-blue-600 font-extrabold block text-sm mt-0.5">৭২ ঘণ্টা</span>
            <span className="text-[11px] text-slate-500">স্বাভাবিক মাত্রায় ফিরে আসে</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">৩. লোহিত রক্তকণিকা (RBC)</span>
            <span className="text-rose-600 font-extrabold block text-sm mt-0.5">৪–৬ সপ্তাহ</span>
            <span className="text-[11px] text-slate-500">অস্থিমজ্জা নতুন সেল তৈরি করে</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-900 block">৪. আয়রন স্টোর (ফেরিটিন)</span>
            <span className="text-emerald-600 font-extrabold block text-sm mt-0.5">{toBengaliDigits(intervalDays)} দিন</span>
            <span className="text-[11px] text-slate-500">পরবর্তী দানের জন্য পূর্ণ সক্ষম</span>
          </div>
        </div>
      </div>

      {/* 4 Annual Milestones Projection */}
      <div>
        <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-3">
          আগামী ১ বছরের রক্তদানের সম্ভাব্য রোডম্যাপ:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {milestones.map((m) => (
            <div
              key={m.step}
              className="p-4 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 hover:border-red-300 transition text-center"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-black text-xs flex items-center justify-center mx-auto mb-2">
                {toBengaliDigits(m.step)}
              </div>
              <h5 className="font-bold text-xs text-slate-900 mb-1">{m.quarter}</h5>
              <div className="text-sm font-black text-red-700 mb-1">{m.displayDate}</div>
              <span className="text-[10px] text-slate-400 font-mono">{m.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
