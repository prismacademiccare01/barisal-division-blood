import React, { useState } from 'react';
import { BloodGroup } from '../../types/index.js';
import { BLOOD_GROUPS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Activity,
  Heart,
  Droplet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const PlateletApheresisMatcher: React.FC = () => {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [weight, setWeight] = useState(62);
  const [plateletCount, setPlateletCount] = useState('220000');
  const [lastPlateletDays, setLastPlateletDays] = useState(20);
  const [aspirinHistory, setAspirinHistory] = useState(false);
  const [hasVeinAccess, setHasVeinAccess] = useState(true);

  // Criteria for Single Donor Platelets (SDP):
  // 1. Weight >= 55kg
  // 2. Platelet count >= 150,000 /uL (ideally > 200,000)
  // 3. Last platelet donation >= 15 days ago (or whole blood >= 90 days)
  // 4. No aspirin or NSAIDs in past 48 hours
  // 5. Good prominent vein for apheresis machine needle
  const isWeightOk = weight >= 55;
  const numPlatelet = Number(plateletCount) || 0;
  const isPlateletCountOk = numPlatelet >= 150000;
  const isIntervalOk = lastPlateletDays >= 15;
  const isAspirinOk = !aspirinHistory;
  const isVeinOk = hasVeinAccess;

  const isEligible = isWeightOk && isPlateletCountOk && isIntervalOk && isAspirinOk && isVeinOk;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>ফিচার ৫: ডেঙ্গু ও সংকটকালীন প্লাটিলেট ম্যাচিং ইঞ্জিন</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            প্লাটিলেট অ্যাফারেসিস (SDP) ম্যাচিং ও যোগ্যতা যাচাই
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ডেঙ্গু এবং হেমাটোলজি রোগীদের জরুরি সিঙ্গেল ডোনার প্লাটিলেট (SDP) দানের আন্তর্জাতিক স্ট্যান্ডার্ড
          </p>
        </div>

        <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 self-start sm:self-auto">
          অ্যাফারেসিস মেশিন: শেরেবাংলা মেডিকেল
        </div>
      </div>

      {/* Information Banner */}
      <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
        <span className="font-extrabold flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>SDP বনাম সাধারণ রক্তদানের পার্থক্য:</span>
        </span>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          সাধারণ রক্তদানে ১ ব্যাগ রক্ত থেকে ১ ইউনিট প্লাটিলেট পাওয়া যায়। কিন্তু অ্যাফারেসিস মেশিনে রক্তদাতার শরীর থেকে কেবল প্লাটিলেট সংগ্রহ করে বাকি লোহিত রক্তকণিকা শরীরে ফিরিয়ে দেওয়া হয়। এতে ১ জন দাতার থেকে ৬-৮ ইউনিটের সমপরিমাণ (মেগা ইউনিট) প্লাটিলেট পাওয়া যায়।
        </p>
      </div>

      {/* Assessment Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-3.5">
          <div>
            <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              রক্তদাতার ওজন: {weight} কেজি (ন্যূনতম ৫৫ কেজি প্রয়োজন)
            </label>
            <input
              type="range"
              min="45"
              max="110"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              রক্তে প্লাটিলেট সংখ্যা (কাউন্ট / μL)
            </label>
            <input
              type="number"
              step="5000"
              value={plateletCount}
              onChange={(e) => setPlateletCount(e.target.value)}
              placeholder="যেমন: 200000"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">স্বাভাবিক রেঞ্জ: ১,৫০,০০০ - ৪,৫০,০০০</span>
          </div>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              সর্বশেষ প্লাটিলেট বা রক্তদানের ব্যবধান: {lastPlateletDays} দিন
            </label>
            <input
              type="range"
              min="1"
              max="60"
              value={lastPlateletDays}
              onChange={(e) => setLastPlateletDays(Number(e.target.value))}
              className="w-full accent-rose-600"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">প্লাটিলেটের জন্য ১৫ দিন, পূর্ণ রক্তদানের জন্য ৯০ দিন</span>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={aspirinHistory}
                onChange={(e) => setAspirinHistory(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 accent-rose-600"
              />
              <span>বিগত ৪৮ ঘণ্টায় অ্যাসপিরিন/পেইনকিলার সেবন করেছেন?</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={hasVeinAccess}
                onChange={(e) => setHasVeinAccess(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 accent-rose-600"
              />
              <span>দুই হাতে স্পষ্ট দৃশ্যমান মোটা রগ (Vein) রয়েছে?</span>
            </label>
          </div>
        </div>
      </div>

      {/* Result Status Card */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isEligible ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            isEligible ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {isEligible ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base">
              {isEligible
                ? `অভিনন্দন! আপনি ${bloodGroup} প্লাটিলেট (SDP) অ্যাফারেসিস দানের জন্য সম্পূর্ণ উপযুক্ত`
                : 'আপাতত প্লাটিলেট (SDP) দানের মেডিকেল শর্ত পূরণ হয়নি'}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {isEligible
                ? 'ডেঙ্গু সংকটে শেরেবাংলা মেডিকেলে ১ জন রোগীর জীবন বাঁচাতে আপনার ১টি দানই যথেষ্ট।'
                : 'শর্তাবলী পরীক্ষা করুন: ওজন ৫৫+ কেজি, প্লাটিলেট ১.৫ লাখ+, অ্যাসপিরিন মুক্ত ৪৮ ঘণ্টা।'}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${
          isEligible ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
        }`}>
          {isEligible ? 'SDP MATCHED' : 'NOT READY'}
        </span>
      </div>
    </div>
  );
};
