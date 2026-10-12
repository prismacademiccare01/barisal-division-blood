import React, { useState } from 'react';
import { BloodGroup } from '../../types/index.js';
import { BLOOD_GROUPS } from '../../utils/locations.js';
import {
  Droplet,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Activity,
  Layers,
} from 'lucide-react';

export const CrossMatchSimulator: React.FC = () => {
  const [patientGroup, setPatientGroup] = useState<BloodGroup>('B+');
  const [donorGroup, setDonorGroup] = useState<BloodGroup>('O+');

  // Compatibility matrix
  const isCompatible = (p: BloodGroup, d: BloodGroup) => {
    // Red cell compatibility rules
    if (p === 'AB+') return true; // Universal recipient
    if (p === 'AB-') return ['AB-', 'A-', 'B-', 'O-'].includes(d);
    if (p === 'A+') return ['A+', 'A-', 'O+', 'O-'].includes(d);
    if (p === 'A-') return ['A-', 'O-'].includes(d);
    if (p === 'B+') return ['B+', 'B-', 'O+', 'O-'].includes(d);
    if (p === 'B-') return ['B-', 'O-'].includes(d);
    if (p === 'O+') return ['O+', 'O-'].includes(d);
    if (p === 'O-') return d === 'O-'; // Only O-
    return false;
  };

  const compatible = isCompatible(patientGroup, donorGroup);

  const componentShelfLife = [
    {
      name: 'হোল ব্লাড (Whole Blood)',
      storage: '২° সে - ৬° সে তাপমাত্রায় রেফ্রিজারেটরে',
      duration: '৩৫ দিন (CPDA-1 প্রিজারভেটিভসহ)',
      usage: 'তীব্র রক্তক্ষরণ, বড় ট্রমা ও জরুরি সার্জারিতে',
      color: 'border-red-200 bg-red-50/50',
    },
    {
      name: 'প্যাকড রেড সেলস (PRBC)',
      storage: '২° সে - ৬° সে তাপমাত্রায়',
      duration: '৪২ দিন (SAGM সলিউশনসহ)',
      usage: 'থ্যালাসেমিয়া, রক্তস্বল্পতা ও কার্ডিয়াক সার্জারি',
      color: 'border-rose-200 bg-rose-50/50',
    },
    {
      name: 'প্লাটিলেট কনসেনট্রেট (Platelets)',
      storage: '২০° সে - ২৪° সে (ধারাবাহিক অ্যাজিটেটরে)',
      duration: 'মাত্র ৫ দিন (দ্রুত ব্যবহার আবশ্যক)',
      usage: 'ডেঙ্গু হেমোরেজিক ফিভার, লিউকেমিয়া ও থ্রম্বোসাইটোপেনিয়া',
      color: 'border-amber-200 bg-amber-50/50',
    },
    {
      name: 'ফ্রেশ ফ্রোজেন প্লাজমা (FFP)',
      storage: '-১৮° সে বা তার কম ডিপ ফ্রিজে',
      duration: '১ বছর (৩৬৫ দিন)',
      usage: 'কোয়াগুলেশন ফ্যাক্টর ঘাটতি, লিভার ডিজিজ ও প্লাজমা এক্সচেঞ্জ',
      color: 'border-blue-200 bg-blue-50/50',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>ফিচার ১২: ভার্চুয়াল ক্রস-ম্যাচ ইঞ্জিন ও রক্তের শেলফ-লাইফ</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          ক্রস-ম্যাচ সিমুলেটর ও উপাদান স্থায়িত্ব ট্র্যাকার
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          রোগী ও রক্তদাতার গ্রুপের তাৎক্ষণিক ম্যাচিং ফলাফল এবং রক্তের প্রতিটি উপাদানের সঠিক সংরক্ষণ মেয়াদ
        </p>
      </div>

      {/* Simulator Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <label className="block font-bold text-slate-700 mb-2">
            রোগীর রক্তের গ্রুপ (Recipient Blood Group):
          </label>
          <div className="grid grid-cols-4 gap-2">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => setPatientGroup(bg)}
                className={`py-2 rounded-xl font-black text-xs transition ${
                  patientGroup === bg
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <label className="block font-bold text-slate-700 mb-2">
            সম্ভাব্য রক্তদাতার রক্তের গ্রুপ (Donor Blood Group):
          </label>
          <div className="grid grid-cols-4 gap-2">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => setDonorGroup(bg)}
                className={`py-2 rounded-xl font-black text-xs transition ${
                  donorGroup === bg
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulation Result */}
      <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        compatible ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            compatible ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {compatible ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base">
              {compatible
                ? `ম্যাচিং সফল: ${patientGroup} রোগী ${donorGroup} রক্তদাতার রক্ত গ্রহণ করতে পারবেন`
                : `ইনকম্প্যাটিবল: ${patientGroup} রোগীকে ${donorGroup} রক্ত দেওয়া মারাত্মক বিপজ্জনক`}
            </h4>
            <p className="text-xs opacity-90 mt-0.5">
              {compatible
                ? 'ট্রান্সফিউশনের পূর্বে ল্যাবরেটরিতে মেজর ও মাইনর ক্রস-ম্যাচিং নিশ্চিত করা আবশ্যক।'
                : 'ভুল গ্রুপের রক্ত দিলে শরীরে মারাত্মক হিমোলাইটিক ট্রান্সফিউশন রিঅ্যাকশন হতে পারে।'}
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-black shrink-0 ${
          compatible ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
        }`}>
          {compatible ? 'COMPATIBLE' : 'INCOMPATIBLE'}
        </span>
      </div>

      {/* Blood Components Shelf Life Grid */}
      <div>
        <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-3">
          রক্তের উপাদান ও ব্লাড ব্যাংক সংরক্ষণ স্থায়িত্ব (Shelf Life):
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {componentShelfLife.map((c, i) => (
            <div key={i} className={`p-4 rounded-2xl border ${c.color} flex flex-col justify-between`}>
              <div>
                <h5 className="font-bold text-slate-900 mb-1">{c.name}</h5>
                <span className="text-sm font-black text-red-700 block mb-1">{c.duration}</span>
                <p className="text-[11px] text-slate-500 mb-2">সংরক্ষণ: {c.storage}</p>
              </div>
              <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-medium">
                ব্যবহার: {c.usage}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
