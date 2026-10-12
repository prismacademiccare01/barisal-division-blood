import React, { useState } from 'react';
import { BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Compass,
  MapPin,
  Clock,
  Car,
  AlertCircle,
  Building2,
  Navigation,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface RouteData {
  fromUpazila: string;
  toHospital: string;
  distanceKm: number;
  ambulanceMinutes: number;
  autoMinutes: number;
  bridgesFerries: string[];
  trafficNotes: string;
}

export const SmartRouteNavigator: React.FC = () => {
  const [selectedOrigin, setSelectedOrigin] = useState('পটুয়াখালী সদর');
  const [selectedHospital, setSelectedHospital] = useState('শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল');

  const routes: Record<string, RouteData> = {
    'পটুয়াখালী সদর': {
      fromUpazila: 'পটুয়াখালী সদর',
      toHospital: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল',
      distanceKm: 38,
      ambulanceMinutes: 45,
      autoMinutes: 75,
      bridgesFerries: ['পায়রা সেতু (লেবুখালী ব্রিজ)'],
      trafficNotes: 'ফোর লেন সড়ক, কোনো ফেরি নেই। পায়রা সেতু হয়ে দ্রুততম প্রবেশ।',
    },
    'ভোলা সদর': {
      fromUpazila: 'ভোলা সদর',
      toHospital: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল',
      distanceKm: 42,
      ambulanceMinutes: 70,
      autoMinutes: 110,
      bridgesFerries: ['ভেলুমিয়া - লাহারহাট ফেরি পারাপার'],
      trafficNotes: 'নদী পারাপার জড়িত। জরুরি রোগীর জন্য স্পিডবোট ব্লাড ক্যারিয়ার বিকল্প উত্তম।',
    },
    'পিরোজপুর সদর': {
      fromUpazila: 'পিরোজপুর সদর',
      toHospital: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল',
      distanceKm: 65,
      ambulanceMinutes: 65,
      autoMinutes: 100,
      bridgesFerries: ['বেকুটিয়া সেতু (বঙ্গমাতা সেতু)'],
      trafficNotes: 'বেকুটিয়া সেতু চালুর পর এখন সরাসরি সড়ক যোগাযোগ নিরবচ্ছিন্ন।',
    },
    'বরগুনা সদর': {
      fromUpazila: 'বরগুনা সদর',
      toHospital: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল',
      distanceKm: 85,
      ambulanceMinutes: 90,
      autoMinutes: 150,
      bridgesFerries: ['পায়রা সেতু সংযোগ সড়ক'],
      trafficNotes: 'আমতলী হয়ে লেবুখালী সেতু দিয়ে দ্রুত বরিশাল সদরে পৌঁছানো যায়।',
    },
    'ঝালকাঠি সদর': {
      fromUpazila: 'ঝালকাঠি সদর',
      toHospital: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল',
      distanceKm: 22,
      ambulanceMinutes: 25,
      autoMinutes: 40,
      bridgesFerries: ['গাবখান সেতু'],
      trafficNotes: 'খুবই নিকটবর্তী রুট। ঝালকাঠি বাইপাস দিয়ে সরাসরি শেরেবাংলা মেডিকেলে প্রবেশ।',
    },
    'গৌরনদী (বরিশাল)': {
      fromUpazila: 'গৌরনদী (বরিশাল)',
      toHospital: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল',
      distanceKm: 35,
      ambulanceMinutes: 40,
      autoMinutes: 60,
      bridgesFerries: ['দোয়ারিকা ও শিকারপুর সেতু'],
      trafficNotes: 'ঢাকা-বরিশাল জাতীয় মহাসড়ক। কোনো ফেরি নেই, সরাসরি সংযোগ।',
    },
  };

  const currentRoute = routes[selectedOrigin] || routes['পটুয়াখালী সদর'];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
          <Navigation className="w-4 h-4" />
          <span>ফিচার ২০: স্মার্ট রুট ও হাসপাতাল নেভিগেশন ক্যালকুলেটর</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          উপজেলা-টু-হাসপাতাল রুট ও সময় পরিমাপক
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          রক্তদাতার অবস্থান থেকে হাসপাতালের সঠিক দূরত্ব, পায়রা/বেকুটিয়া সেতু ক্রসিং এবং অ্যাম্বুলেন্স ট্রাভেল টাইম
        </p>
      </div>

      {/* Origin Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">রক্তদাতার এলাকা / প্রারম্ভিক পয়েন্ট:</label>
          <select
            value={selectedOrigin}
            onChange={(e) => setSelectedOrigin(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium bg-white"
          >
            {Object.keys(routes).map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">গন্তব্য হাসপাতাল:</label>
          <input
            type="text"
            value={selectedHospital}
            readOnly
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-medium"
          />
        </div>
      </div>

      {/* Calculated Result Card */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">
                {currentRoute.fromUpazila} ➔ {currentRoute.toHospital}
              </h4>
              <span className="text-xs text-slate-500">
                সড়ক দূরত্ব: <strong>{toBengaliDigits(currentRoute.distanceKm)} কি.মি.</strong>
              </span>
            </div>
          </div>

          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">
            LIVE TRANSIT ESTIMATE
          </span>
        </div>

        {/* Transit Times Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">জরুরি অ্যাম্বুলেন্স ট্রাভেল টাইম</span>
              <strong className="text-base text-red-700 font-black">
                ~{toBengaliDigits(currentRoute.ambulanceMinutes)} মিনিট
              </strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">সাধারণ গাড়ি বা অটোরিকশা</span>
              <strong className="text-base text-slate-900 font-black">
                ~{toBengaliDigits(currentRoute.autoMinutes)} মিনিট
              </strong>
            </div>
          </div>
        </div>

        {/* Bridges & Road Conditions */}
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="text-slate-700">
            <strong>সেতু ও পারাপার: </strong>
            <span className="text-blue-700 font-semibold">{currentRoute.bridgesFerries.join(', ')}</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            {currentRoute.trafficNotes}
          </p>
        </div>
      </div>
    </div>
  );
};
