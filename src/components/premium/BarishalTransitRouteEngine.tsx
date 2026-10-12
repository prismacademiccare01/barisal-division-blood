import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  Ship,
  Truck,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters.js';

interface RouteDetail {
  origin: string;
  destination: string;
  distanceKm: number;
  estMinutes: number;
  routeType: 'road' | 'river' | 'bridge';
  bridgeName?: string;
  recommendedTransport: string;
  coldChainAdvice: string;
  emergencyHotline: string;
}

const BARISHAL_ROUTES: Record<string, RouteDetail> = {
  'bhola-sbmch': {
    origin: 'ভোলা সদর / ভেদুরিয়া ঘাট',
    destination: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল (শেবাচিম), বরিশাল',
    distanceKm: 38,
    estMinutes: 45,
    routeType: 'river',
    recommendedTransport: 'ভেদুরিয়া-লাহারহাট স্পিডবোট + জরুরি অ্যাম্বুলেন্স',
    coldChainAdvice: 'নদীপথে ঝাঁকুনি প্রতিরোধে আইসবক্সে কুলিং জেলপ্যাক ব্যবহার বাধ্যতামূলক (২°-৬° সে.)।',
    emergencyHotline: '০১৭০০-০০০০০১ (ভোলা ভেদুরিয়া স্পিডবোট অ্যাসোসিয়েশন)',
  },
  'patuakhali-sbmch': {
    origin: 'পটুয়াখালী মেডিকেল / সদর হাসপাতাল',
    destination: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল (শেবাচিম), বরিশাল',
    distanceKm: 42,
    estMinutes: 40,
    routeType: 'bridge',
    bridgeName: 'লেবুখালী পায়রা সেতু (পায়রা ব্রিজ)',
    recommendedTransport: 'ঢাকা-পটুয়াখালী জাতীয় মহাসড়ক দিয়ে দ্রুত অ্যাম্বুলেন্স',
    coldChainAdvice: 'পায়রা সেতু দিয়ে কোনো ফেরি পারাপারের বিলম্ব নেই। সরাসরি ৩০-৪০ মিনিটে পৌঁছানো সম্ভব।',
    emergencyHotline: '০১৭০০-০০০০০২ (পটুয়াখালী অ্যাম্বুলেন্স সার্ভিস)',
  },
  'pirojpur-sbmch': {
    origin: 'পিরোজপুর জেলা হাসপাতাল',
    destination: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল (শেবাচিম), বরিশাল',
    distanceKm: 55,
    estMinutes: 50,
    routeType: 'bridge',
    bridgeName: 'বেকুতিয়া ৮ম বাংলাদেশ-চীন মৈত্রী সেতু (কচা নদী)',
    recommendedTransport: 'ঝালকাঠি-রাজাপুর হাইওয়ে দিয়ে সরাসরি অ্যাম্বুলেন্স',
    coldChainAdvice: 'বেকুতিয়া সেতু চালুর পর ফেরিমুক্ত দ্রুততম রুট। তাপমাত্রার ওঠানামা এড়াতে কন্টেইনার লক রাখুন।',
    emergencyHotline: '০১৭০০-০০০০০৩ (পিরোজপুর অ্যাম্বুলেন্স)',
  },
  'jhalakathi-sbmch': {
    origin: 'ঝালকাঠি সদর হাসপাতাল',
    destination: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল (শেবাচিম), বরিশাল',
    distanceKm: 22,
    estMinutes: 25,
    routeType: 'road',
    recommendedTransport: 'বরিশাল-ঝালকাঠি হাইওয়ে রোড এক্সপ্রেস',
    coldChainAdvice: 'স্বল্প দূরত্বের রুট। সরাসরি ৩০ মিনিটের মধ্যে পৌঁছে দ্রুত ক্রস-ম্যাচে পাঠান।',
    emergencyHotline: '০১৭০০-০০০০০৪ (ঝালকাঠি জরুরি লাইন)',
  },
  'barguna-sbmch': {
    origin: 'বরগুনা জেনারেল হাসপাতাল',
    destination: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল (শেবাচিম), বরিশাল',
    distanceKm: 85,
    estMinutes: 80,
    routeType: 'bridge',
    bridgeName: 'আমতলী-পায়রা সেতু এক্সপ্রেস রুট',
    recommendedTransport: 'হাই-স্পিড আইসিইউ অ্যাম্বুলেন্স',
    coldChainAdvice: 'দীর্ঘ ট্রানজিট (> ১ ঘণ্টা)। আইসবক্সে বরফের সংস্পর্শ থেকে রক্তের ব্যাগ আলাদা রাখুন যেন হিমোলাইসিস না ঘটে।',
    emergencyHotline: '০১৭০০-০০০০০৫ (বরগুনা রেড ক্রিসেন্ট)',
  },
  'bakerganj-sbmch': {
    origin: 'বাকেরগঞ্জ উপজেলা স্বাস্থ্য কমপ্লেক্স',
    destination: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল (শেবাচিম), বরিশাল',
    distanceKm: 24,
    estMinutes: 28,
    routeType: 'road',
    recommendedTransport: 'পটুয়াখালী-বরিশাল হাইওয়ে অ্যাম্বুলেন্স',
    coldChainAdvice: '৩০ মিনিটের কম সময়ে নিরাপদ ট্রানজিট সম্পন্ন করা যায়।',
    emergencyHotline: '০১৭০০-০০০০০৬ (বাকেরগঞ্জ জরুরি সংযোগ)',
  },
};

export const BarishalTransitRouteEngine: React.FC = () => {
  const [selectedRouteKey, setSelectedRouteKey] = useState<string>('patuakhali-sbmch');

  const currentRoute = BARISHAL_ROUTES[selectedRouteKey] || BARISHAL_ROUTES['patuakhali-sbmch'];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-1 border border-red-200">
            <Compass className="w-3.5 h-3.5" />
            <span>স্মার্ট ব্লাড ট্রানজিট ও কোল্ড-চেইন ইঞ্জিন</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            বরিশাল বিভাগীয় গোল্ডেন-আওয়ার্স রুট নির্দেশিকা
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            রক্ত সংগ্রহের স্থান থেকে হাসপাতালে পৌঁছানোর দ্রুততম পথ, সেতু ও কোল্ড-বক্স তাপমাত্রা গাইড
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>৬ জেলা কভারেজ</span>
          </span>
        </div>
      </div>

      {/* Route Selector Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 block">রুট নির্বাচন করুন:</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(BARISHAL_ROUTES).map(([key, route]) => (
            <button
              key={key}
              onClick={() => setSelectedRouteKey(key)}
              className={`p-3 rounded-2xl text-left border transition cursor-pointer flex flex-col justify-between ${
                selectedRouteKey === key
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <div className="font-extrabold text-xs line-clamp-1">{route.origin.split('/')[0]}</div>
              <div className={`text-[10px] mt-1 flex items-center justify-between ${
                selectedRouteKey === key ? 'text-red-100' : 'text-slate-500'
              }`}>
                <span>{toBengaliDigits(route.distanceKm)} কিমি</span>
                <span className="font-bold">~{toBengaliDigits(route.estMinutes)} মিনিট</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Route Dynamic Card */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>যাত্রা শুরু:</span>
              <strong className="text-slate-800 font-extrabold">{currentRoute.origin}</strong>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Navigation className="w-4 h-4 text-red-600 shrink-0" />
              <span>গন্তব্য হাসপাতাল:</span>
              <strong className="text-slate-800 font-extrabold">{currentRoute.destination}</strong>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-5">
            <div>
              <span className="text-[10px] text-slate-500 block">দূরত্ব</span>
              <span className="text-lg font-black text-slate-900">{toBengaliDigits(currentRoute.distanceKm)} কিমি</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">আনুমানিক সময়</span>
              <span className="text-lg font-black text-red-600">{toBengaliDigits(currentRoute.estMinutes)} মিনিট</span>
            </div>
          </div>
        </div>

        {/* Technical Guidance & Cold Chain Safety */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              {currentRoute.routeType === 'river' ? (
                <Ship className="w-4 h-4 text-blue-600" />
              ) : (
                <Truck className="w-4 h-4 text-red-600" />
              )}
              <span>যানবাহন ও সেতু রুট</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {currentRoute.recommendedTransport}
            </p>
            {currentRoute.bridgeName && (
              <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                🌉 {currentRoute.bridgeName}
              </span>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-800">
              <Thermometer className="w-4 h-4 text-amber-600" />
              <span>কোল্ড-চেইন ও তাপমাত্রা (২°-৬° সে.)</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {currentRoute.coldChainAdvice}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>জরুরি ট্রান্সপোর্ট হটলাইন</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed font-mono">
              {currentRoute.emergencyHotline}
            </p>
            <span className="text-[10px] text-slate-400 block">জরুরি রুট ক্লিয়ারেন্স ও সহায়তা</span>
          </div>
        </div>
      </div>
    </div>
  );
};
