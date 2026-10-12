import React, { useState } from 'react';
import { BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  MapPin,
  Building2,
  Users,
  ShieldAlert,
  Flame,
  ArrowRight,
  Droplet,
  Compass,
} from 'lucide-react';

export const DivisionHeatmap: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('বরিশাল');

  const districtData: Record<string, {
    donorsCount: number;
    urgencyLevel: 'high' | 'medium' | 'normal';
    majorHospitals: string[];
    criticalGroups: string[];
    riverRouteNotes: string;
    coordinates: { x: number; y: number };
  }> = {
    'বরিশাল': {
      donorsCount: 1420,
      urgencyLevel: 'high',
      majorHospitals: ['শেরেবাংলা মেডিকেল কলেজ হাসপাতাল', 'জেনারেল হাসপাতাল (সদর)', 'সাউথ অ্যাপোলো হাসপাতাল'],
      criticalGroups: ['O-', 'AB-', 'B-'],
      riverRouteNotes: 'বিভাগীয় সদর। সড়কপথে সরাসরি সংযোগ ও বরিশাল নদী বন্দর লঞ্চঘাট জোন।',
      coordinates: { x: 50, y: 35 },
    },
    'পটুয়াখালী': {
      donorsCount: 780,
      urgencyLevel: 'medium',
      majorHospitals: ['পটুয়াখালী মেডিকেল কলেজ হাসপাতাল', '২৫০ শয্যা জেনারেল হাসপাতাল'],
      criticalGroups: ['A-', 'O-'],
      riverRouteNotes: 'পায়রা সেতু (লেবুখালী ব্রিজ) হয়ে বরিশাল সদরে দ্রুত যোগাযোগ।',
      coordinates: { x: 48, y: 65 },
    },
    'ভোলা': {
      donorsCount: 560,
      urgencyLevel: 'high',
      majorHospitals: ['ভোলা ২৫০ শয্যা জেনারেল হাসপাতাল', 'চরফ্যাশন উপজেলা স্বাস্থ্য কমপ্লেক্স'],
      criticalGroups: ['B-', 'AB-'],
      riverRouteNotes: 'দ্বীপজেলা। ভেলুমিয়া ও লাহারহাট ফেরি পারাপার। জরুরি স্পিডবোট ব্লাড সার্ভিস চালু।',
      coordinates: { x: 72, y: 48 },
    },
    'পিরোজপুর': {
      donorsCount: 450,
      urgencyLevel: 'normal',
      majorHospitals: ['পিরোজপুর জেলা সদর হাসপাতাল', 'ভাণ্ডারিয়া উপজেলা হেলথ কমপ্লেক্স'],
      criticalGroups: ['O-', 'A+'],
      riverRouteNotes: 'বেকুটিয়া সেতু (বঙ্গমাতা সেতু) হয়ে বরিশাল সদরে দ্রুত যান চলাচল।',
      coordinates: { x: 28, y: 42 },
    },
    'বরগুনা': {
      donorsCount: 340,
      urgencyLevel: 'medium',
      majorHospitals: ['বরগুনা জেনারেল হাসপাতাল', 'পাথরঘাটা স্বাস্থ্য কমপ্লেক্স'],
      criticalGroups: ['O-', 'B+'],
      riverRouteNotes: 'উপকূলীয় এলাকা। বিষখালী ও পায়রা নদী বেষ্টিত। জরুরি অ্যাম্বুলেন্স স্কোয়াড।',
      coordinates: { x: 35, y: 80 },
    },
    'ঝালকাঠি': {
      donorsCount: 300,
      urgencyLevel: 'normal',
      majorHospitals: ['ঝালকাঠি ১০০ শয্যা জেলা সদর হাসপাতাল', 'নলছিটি হেলথ কমপ্লেক্স'],
      criticalGroups: ['AB-', 'O+'],
      riverRouteNotes: 'বরিশাল সদরের নিকটতম প্রতিবেশী জেলা। সুগন্ধা নদী তীরবর্তী দ্রুত রুট।',
      coordinates: { x: 38, y: 30 },
    },
  };

  const current = districtData[selectedDistrict] || districtData['বরিশাল'];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>ফিচার ১৩: বরিশাল বিভাগীয় ইন্টারেক্টিভ ডেনসিটি ম্যাপ</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          বিভাগীয় রক্তদাতা মানচিত্র ও ডিস্ট্রিক্ট হটস্পট
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          ৬টি জেলার রক্তদাতার ঘনত্ব, প্রধান হাসপাতাল ও নদীবেষ্টিত জরুরি পরিবহন রুটের বাস্তব পর্যবেক্ষণ
        </p>
      </div>

      {/* Main Grid: Visual Map Left + Detailed Card Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Map Representation (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-5 border border-slate-800 text-white relative min-h-[340px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>বরিশাল বিভাগীয় ভৌগোলিক জোন</span>
              <span className="text-red-400 font-bold">লাইভ মনিটর</span>
            </div>
            <p className="text-[11px] text-slate-300">
              জেলায় ক্লিক করে রক্তদাতার ঘনত্ব ও তথ্য দেখুন:
            </p>
          </div>

          {/* Interactive District Pills Map */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-6">
            {Object.keys(districtData).map((dName) => {
              const dInfo = districtData[dName];
              const isSelected = selectedDistrict === dName;
              return (
                <button
                  key={dName}
                  onClick={() => setSelectedDistrict(dName)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs">{dName}</span>
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                  </div>
                  <span className="text-[11px] font-mono mt-1 block opacity-90">
                    {toBengaliDigits(dInfo.donorsCount)} রক্তদাতা
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>বিভাগীয় ৬ জেলা · উপকূলীয় ও নদী সংযোগ</span>
            <span className="text-emerald-400">২৪ ঘণ্টা সচল</span>
          </div>
        </div>

        {/* Selected District Details (6 cols) */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h4 className="text-lg font-black text-slate-900">{selectedDistrict} জেলা</h4>
              <span className="text-xs font-semibold text-slate-500">
                মোট নিবন্ধিত রক্তদাতা: <strong>{toBengaliDigits(current.donorsCount)} জন</strong>
              </span>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              current.urgencyLevel === 'high'
                ? 'bg-red-100 text-red-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {current.urgencyLevel === 'high' ? 'উচ্চ চাহিদা জোন' : 'মাঝারি চাহিদা জোন'}
            </span>
          </div>

          {/* Hospitals */}
          <div>
            <span className="font-bold text-xs text-slate-700 block mb-1.5">
              প্রধান সরকারি ও বেসরকারি হাসপাতাল:
            </span>
            <div className="space-y-1">
              {current.majorHospitals.map((h, i) => (
                <div key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Groups */}
          <div>
            <span className="font-bold text-xs text-slate-700 block mb-1">
              এই জেলায় সর্বাধিক ঘাটতি থাকা রক্তের গ্রুপ:
            </span>
            <div className="flex gap-1.5">
              {current.criticalGroups.map((bg) => (
                <span key={bg} className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-black text-xs">
                  {bg}
                </span>
              ))}
            </div>
          </div>

          {/* River Route & Connectivity Notes */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
            <strong className="text-slate-900 block mb-0.5">নদী ও সড়ক যোগাযোগ নোট:</strong>
            <p className="text-[11px] leading-relaxed">{current.riverRouteNotes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
