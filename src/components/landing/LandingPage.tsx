import React, { useState } from 'react';
import { BloodRequest, Donor, BloodGroup } from '../../types/index.js';
import {
  BARISHAL_DIVISION_DISTRICTS,
  BLOOD_GROUPS,
  getUpazilasForDistrict,
} from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Droplet,
  Search,
  HeartHandshake,
  ShieldCheck,
  Building2,
  PhoneCall,
  ArrowRight,
  Clock,
  Sparkles,
  Smartphone,
  Radio,
  Heart,
  HeartPulse,
  Code2,
  Trophy,
  Compass,
  HelpCircle,
  Activity,
  CheckCircle2,
  Users,
  MapPin,
  Calendar,
  AlertCircle,
  Share2,
  Award,
  Zap,
  Lock,
  ChevronRight,
  Shield,
  Filter,
  GitCompare,
  Ship,
  Image,
} from 'lucide-react';
import { BarishalTransitRouteEngine } from '../premium/BarishalTransitRouteEngine.js';

interface LandingPageProps {
  onSearchBloodGroup: (bg: string, district?: string, upazila?: string) => void;
  onOpenCreateRequest: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenDeveloperModal: () => void;
  onOpenFlutterHub?: () => void;
  recentRequests: BloodRequest[];
  featuredDonors: Donor[];
  onViewRequestDetails: (r: BloodRequest) => void;
  onViewCertificate?: (d: Donor) => void;
  isLoggedIn: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSearchBloodGroup,
  onOpenCreateRequest,
  onNavigateTab,
  onOpenAuth,
  onOpenDeveloperModal,
  onOpenFlutterHub,
  recentRequests,
  featuredDonors,
  onViewRequestDetails,
  onViewCertificate,
  isLoggedIn,
}) => {
  // Cascading search form states
  const [selectedBg, setSelectedBg] = useState<string>('all');
  const [selectedDist, setSelectedDist] = useState<string>('all');
  const [selectedUpz, setSelectedUpz] = useState<string>('all');

  // Interactive Live Blood Compatibility State
  const [activeMatrixGroup, setActiveMatrixGroup] = useState<BloodGroup>('O-');

  const MATRIX_INFO: Record<BloodGroup, { canGive: string[]; canTake: string[]; isUniversal?: string; note: string }> = {
    'O-': {
      canGive: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canTake: ['O-'],
      isUniversal: 'সার্বজনীন দাতা (Universal Donor)',
      note: 'জরুরি মুহূর্তে যেকোনো গ্রুপের মুমূর্ষু রোগীকে তাৎক্ষণিকভাবে রক্ত দিতে পারেন। তবে নিজের প্রয়োজনে শুধুমাত্র O- রক্ত নিতে পারেন।',
    },
    'O+': {
      canGive: ['O+', 'A+', 'B+', 'AB+'],
      canTake: ['O+', 'O-'],
      note: 'সবচেয়ে বেশি ব্যবহৃত রক্তের গ্রুপ। সকল পজিটিভ গ্রুপের রোগীকে রক্ত দিতে সক্ষম।',
    },
    'A-': {
      canGive: ['A+', 'A-', 'AB+', 'AB-'],
      canTake: ['A-', 'O-'],
      note: 'বিরল নেগেটিভ গ্রুপের রক্ত। A ও AB উভয় গ্রুপের রোগীদের রক্ত দিতে পারেন।',
    },
    'A+': {
      canGive: ['A+', 'AB+'],
      canTake: ['A+', 'A-', 'O+', 'O-'],
      note: 'A+ ও AB+ রোগীদের রক্ত দিতে পারেন এবং ৪টি গ্রুপ থেকে রক্ত গ্রহণ করতে পারেন।',
    },
    'B-': {
      canGive: ['B+', 'B-', 'AB+', 'AB-'],
      canTake: ['B-', 'O-'],
      note: 'বিরল নেগেটিভ রক্তের গ্রুপ। B ও AB উভয় গ্রুপের রোগীদের রক্ত দিতে সক্ষম।',
    },
    'B+': {
      canGive: ['B+', 'AB+'],
      canTake: ['B+', 'B-', 'O+', 'O-'],
      note: 'বাংলাদেশে অন্যতম প্রচলিত গ্রুপ। B+ ও AB+ রোগীদের রক্ত দিতে পারেন।',
    },
    'AB-': {
      canGive: ['AB+', 'AB-'],
      canTake: ['AB-', 'A-', 'B-', 'O-'],
      note: 'অত্যন্ত বিরল রক্তের গ্রুপ। সকল নেগেটিভ রক্তের গ্রুপ থেকে রক্ত গ্রহণ করতে পারেন।',
    },
    'AB+': {
      canGive: ['AB+'],
      canTake: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      isUniversal: 'সার্বজনীন গ্রহীতা (Universal Recipient)',
      note: 'সার্বজনীন গ্রহীতা — যে কোনো গ্রুপের রক্ত গ্রহণ করতে পারেন। রক্ত দিতে পারেন শুধুমাত্র AB+ রোগীকে।',
    },
  };

  const availableUpazilas =
    selectedDist !== 'all' ? getUpazilasForDistrict(selectedDist) : [];

  const handleDistrictChange = (dist: string) => {
    setSelectedDist(dist);
    setSelectedUpz('all');
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchBloodGroup(selectedBg, selectedDist, selectedUpz);
  };

  // Filter urgent requests
  const urgentRequests = recentRequests.slice(0, 3);
  const topDonors = featuredDonors.slice(0, 4);

  // Six Section 1 Statistics:
  // 1. Registered Donors
  // 2. Verified Donors
  // 3. Successful Donations
  // 4. Connected Hospitals
  // 5. Active Emergency Requests
  // 6. Covered Districts
  const activeRequestsCount = recentRequests.filter((r) => r.status === 'active').length;

  const stats = [
    {
      label: 'নিবন্ধিত রক্তদাতা',
      sub: 'Registered Donors',
      count: '৩,৮৫০+',
      icon: Users,
      color: 'text-red-600 bg-red-50',
    },
    {
      label: 'যাচাইকৃত রক্তদাতা',
      sub: 'Verified Donors',
      count: '২,৯২০+',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'সফল রক্তদান সম্পন্ন',
      sub: 'Successful Donations',
      count: '৪,১০০+',
      icon: HeartPulse,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      label: 'সংযুক্ত হাসপাতাল ও ব্লাড ব্যাংক',
      sub: 'Connected Hospitals',
      count: '২৮+',
      icon: Building2,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'সক্রিয় জরুরি রক্তের আবেদন',
      sub: 'Active Emergency Requests',
      count: `${toBengaliDigits(activeRequestsCount > 0 ? activeRequestsCount : 8)}টি`,
      icon: AlertCircle,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'আওতাভুক্ত জেলা',
      sub: 'Covered Districts',
      count: '৬টি',
      icon: MapPin,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  const districtDetails = [
    {
      name: 'বরিশাল',
      bengali: 'বরিশাল সদর ও উপজেলাসমূহ',
      donors: '১,৪২০+',
      hospitals: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, সদর হাসপাতাল',
      focus: 'বিভাগীয় প্রধান স্বাস্থ্যকেন্দ্র ও মেডিকেল হাব',
    },
    {
      name: 'ভোলা',
      bengali: 'ভোলা সদর, চরফ্যাশন ও দ্বীপ এলাকা',
      donors: '৫৬০+',
      hospitals: 'ভোলা ২৫০ শয্যা জেনারেল হাসপাতাল',
      focus: 'দ্বীপজেলা জরুরি ওয়াটার অ্যাম্বুলেন্স কানেকশন',
    },
    {
      name: 'পটুয়াখালী',
      bengali: 'পটুয়াখালী সদর, কুয়াকাটা ও উপকূল',
      donors: '৭৮০+',
      hospitals: 'পটুয়াখালী মেডিকেল কলেজ ও হাসপাতাল',
      focus: 'উপকূলীয় ২৪/৭ ইমার্জেন্সি রেসপন্স টিম',
    },
    {
      name: 'পিরোজপুর',
      bengali: 'পিরোজপুর সদর, ভাণ্ডারিয়া ও মঠবাড়িয়া',
      donors: '৪৫০+',
      hospitals: 'পিরোজপুর জেলা সদর হাসপাতাল',
      focus: 'নদীবেষ্টিত এলাকা জরুরি স্কোয়াড',
    },
    {
      name: 'ঝালকাঠি',
      bengali: 'ঝালকাঠি সদর, নলছিটি ও রাজাপুর',
      donors: '৩০০+',
      hospitals: 'ঝালকাঠি ১০০ শয্যা জেলা হাসপাতাল',
      focus: 'সেন্ট্রাল জংশন দ্রুত যোগাযোগ ব্যবস্থা',
    },
    {
      name: 'বরগুনা',
      bengali: 'বরগুনা সদর, আমতলী ও পাথরঘাটা',
      donors: '৩৪০+',
      hospitals: 'বরগুনা জেনারেল ও উপজেলা স্বাস্থ্য কমপ্লেক্স',
      focus: 'দক্ষিণাঞ্চলীয় উপকূলীয় জরুরি সহায়তা সেল',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Top Emergency Helpline Ribbon */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-4 py-2.5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <span className="font-extrabold tracking-wide">বরিশাল বিভাগীয় হেল্পলাইন:</span>
          <span className="text-red-100 font-medium">জরুরি মুহূর্তে সঠিক রক্তদাতাকে দ্রুত খুঁজে পাওয়া</span>
        </div>
        <div className="flex items-center gap-3 font-semibold">
          <button
            onClick={onOpenCreateRequest}
            className="bg-white text-red-700 px-3 py-1 rounded-xl text-[11px] font-extrabold hover:bg-red-50 transition active:scale-95 shadow-xs cursor-pointer"
          >
            + জরুরি রক্তের আবেদন করুন
          </button>
          <button
            onClick={() => onNavigateTab('portal')}
            className="text-white hover:text-red-100 underline decoration-red-300 text-[11px] font-bold cursor-pointer"
          >
            {isLoggedIn ? 'ইউজার পোর্টাল' : 'আমি রক্তদাতা'}
          </button>
        </div>
      </div>

      {/* 2. Public Hero Banner (Section 1: Hero: “জরুরি রক্ত দরকার?”, Blood Group → District → Upazila → Search, 3 CTAs) */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-red-950 to-slate-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden border border-red-900/40">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-200 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>বরিশাল বিভাগীয় স্মার্ট ব্লাড ইমার্জেন্সি নেটওয়ার্ক</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-3 text-balance">
            জরুরি রক্ত দরকার?
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
            নিরাপদ, যাচাইকৃত ও প্রযুক্তিনির্ভরভাবে সঠিক রক্তদাতাকে দ্রুত খুঁজে নিন। বরিশাল, ভোলা, পটুয়াখালী, পিরোজপুর, ঝালকাঠি ও বরগুনার প্রতিটি প্রান্তের সমন্বিত প্ল্যাটফর্ম।
          </p>

          {/* Cascading Search: Blood Group → District → Upazila → Search */}
          <form
            onSubmit={handleHeroSearchSubmit}
            className="bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/20 mb-8 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-red-200 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-4 h-4 text-red-400" />
                <span>তাত্ক্ষণিক ফিল্টার ও অনুসন্ধান:</span>
              </span>
              <span className="text-[11px] text-slate-300">
                Blood Group → District → Upazila
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* 1. Blood Group */}
              <div>
                <label className="block text-[11px] font-bold text-slate-200 mb-1">
                  রক্তের গ্রুপ
                </label>
                <select
                  value={selectedBg}
                  onChange={(e) => setSelectedBg(e.target.value)}
                  className="w-full bg-white text-slate-900 font-bold text-xs rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">সকল গ্রুপ (All Groups)</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. District */}
              <div>
                <label className="block text-[11px] font-bold text-slate-200 mb-1">
                  জেলা নির্বাচন
                </label>
                <select
                  value={selectedDist}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full bg-white text-slate-900 font-bold text-xs rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">সকল জেলা (৬টি জেলা)</option>
                  {BARISHAL_DIVISION_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Upazila */}
              <div>
                <label className="block text-[11px] font-bold text-slate-200 mb-1">
                  উপজেলা নির্বাচন
                </label>
                <select
                  value={selectedUpz}
                  onChange={(e) => setSelectedUpz(e.target.value)}
                  disabled={selectedDist === 'all'}
                  className="w-full bg-white text-slate-900 font-bold text-xs rounded-xl px-3 py-2.5 border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <option value="all">
                    {selectedDist === 'all'
                      ? 'আগে জেলা বেছে নিন'
                      : 'সকল উপজেলা'}
                  </option>
                  {availableUpazilas.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Search Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-red-600/30 transition cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>রক্ত খুঁজুন</span>
                </button>
              </div>
            </div>

            {/* Quick Blood Group Chips */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-300 font-medium">
                দ্রুত গ্রুপ নির্বাচন:
              </span>
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => {
                    setSelectedBg(bg);
                    onSearchBloodGroup(bg, selectedDist, selectedUpz);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                    selectedBg === bg
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white/15 text-white hover:bg-white/30'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </form>

          {/* Section 1: Three Primary CTAs */}
          {/* CTA 1: রক্ত খুঁজুন */}
          {/* CTA 2: জরুরি রক্তের আবেদন করুন */}
          {/* CTA 3: আমি রক্তদাতা */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('search')}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-lg shadow-red-600/30 transition cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>রক্ত খুঁজুন</span>
            </button>

            <button
              onClick={onOpenCreateRequest}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 active:scale-95 text-white px-5 py-3.5 rounded-2xl font-bold text-sm border border-white/20 transition cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-red-400" />
              <span>জরুরি রক্তের আবেদন করুন</span>
            </button>

            <button
              onClick={() => {
                if (isLoggedIn) {
                  onNavigateTab('portal');
                } else {
                  onOpenAuth();
                }
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-5 py-3.5 rounded-2xl font-black text-sm shadow-md transition cursor-pointer sm:ml-auto"
            >
              <Award className="w-4 h-4" />
              <span>আমি রক্তদাতা (লগইন / নিবন্ধন)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Section 1 Statistics (All 6 core metrics) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition"
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {s.count}
              </div>
              <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                {s.label}
              </p>
              <span className="text-[10px] text-slate-400 font-medium">
                {s.sub}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* 4. Urgent Requests Feed */}
      {urgentRequests.length > 0 && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
                <h2 className="text-xl font-extrabold text-slate-900">
                  জরুরি রক্তের তাগিদ (Emergency Requests)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                রোগীদের দ্রুত রক্তপ্রাপ্তি নিশ্চিত করতে তাৎক্ষণিক সহায়তা দিন
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('requests')}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>সকল আবেদন দেখুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {urgentRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => onViewRequestDetails(req)}
                className="rounded-2xl border border-red-100 bg-gradient-to-b from-red-50/50 to-white p-4 hover:border-red-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-red-600 text-white font-black text-xs">
                      {req.blood_group} গ্রুপ
                    </span>
                    <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                      {toBengaliDigits(req.units_needed)} ব্যাগ প্রয়োজন
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm mb-1 line-clamp-1">
                    রোগী: {req.patient_name}
                  </h3>

                  <p className="text-xs text-slate-600 flex items-center gap-1 line-clamp-1 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{req.hospital_name}</span>
                  </p>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {req.upazila}, {req.district}
                    </span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-red-100/80 flex items-center justify-between text-xs font-bold text-red-600">
                  <span>সাড়া দিন / বিবরণ</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Barishal Division 6 Districts Coverage (Section 2) */}
      <section className="space-y-5">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">
            বরিশাল বিভাগের ৬টি জেলার কভারেজ
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            জেলা ও উপজেলা ভিত্তিক নেটওয়ার্ক
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            District → Upazila → Area ক্রমানুসারে যেকোনো প্রান্তের রক্তদাতাদের সহজ অনুসন্ধান
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {districtDetails.map((dist, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-red-200 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-black text-sm">
                      {idx + 1}
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      {dist.name}
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {dist.donors} রক্তদাতা
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                  <div className="flex items-start gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{dist.hospitals}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <Shield className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{dist.focus}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSearchBloodGroup('all', dist.name, 'all');
                }}
                className="w-full py-2 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-700 font-bold text-xs rounded-xl border border-slate-200 transition text-center cursor-pointer"
              >
                {dist.name} জেলায় রক্তদাতা খুঁজুন →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5.1 Interactive Live Blood Matrix & Lifesaver Super-Toolkit */}
      <section className="bg-gradient-to-br from-white via-slate-50 to-red-50/40 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-1 border border-red-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ইন্টারেক্টিভ মেডিকেল টুলবক্স</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              লাইভ ব্লাড গ্রুপ ম্যাচিং ও প্রাপ্যতা নির্দেশিকা
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              যেকোনো রক্তের গ্রুপ নির্বাচন করে তাত্ক্ষণিকভাবে সামঞ্জস্যতা এবং গ্রহীতা-দাতার তালিকা দেখুন
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('learn')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>সম্পূর্ণ মেডিকেল গাইড ও সিমুলেটর</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 8 Blood Group Interactive Selector Buttons */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {BLOOD_GROUPS.map((group) => {
            const isSelected = activeMatrixGroup === group;
            return (
              <button
                key={group}
                onClick={() => setActiveMatrixGroup(group)}
                className={`py-3 px-2 rounded-2xl font-black text-sm sm:text-base transition text-center cursor-pointer flex flex-col items-center justify-center gap-1 border ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30 scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <span>{group}</span>
                <span className={`text-[9px] font-semibold ${isSelected ? 'text-red-100' : 'text-slate-400'}`}>
                  {group === 'O-' ? 'সার্বজনীন' : group === 'AB+' ? 'গ্রহীতা' : 'গ্রুপ'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Blood Group Card Display */}
        {MATRIX_INFO[activeMatrixGroup] && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-black text-xl flex items-center justify-center shadow-sm">
                  {activeMatrixGroup}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">
                      রক্তের গ্রুপ: {activeMatrixGroup}
                    </h3>
                    {MATRIX_INFO[activeMatrixGroup].isUniversal && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                        ★ {MATRIX_INFO[activeMatrixGroup].isUniversal}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {MATRIX_INFO[activeMatrixGroup].note}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSearchBloodGroup(activeMatrixGroup)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{activeMatrixGroup} রক্তদাতা খুঁজুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Can Give To */}
              <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-100">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>যাদের রক্ত দিতে পারবেন (Can Donate To):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MATRIX_INFO[activeMatrixGroup].canGive.map((bg) => (
                    <span
                      key={bg}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-extrabold text-xs shadow-2xs"
                    >
                      {bg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Can Receive From */}
              <div className="bg-blue-50/60 rounded-xl p-3.5 border border-blue-100">
                <div className="flex items-center gap-1.5 font-bold text-blue-800 mb-2">
                  <Heart className="w-4 h-4 text-blue-600" />
                  <span>যাদের থেকে রক্ত নিতে পারবেন (Can Receive From):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {MATRIX_INFO[activeMatrixGroup].canTake.map((bg: string) => (
                    <span
                      key={bg}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-extrabold text-xs shadow-2xs"
                    >
                      {bg}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4 Quick Super Tools Navigation Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <button
            onClick={() => onNavigateTab('learn')}
            className="p-3.5 rounded-2xl bg-white hover:bg-red-50/60 border border-slate-200 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Image className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-red-600">
              জরুরি পোস্টার মেকার
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">১-ক্লিকে এইচডি ব্যানার তৈরি</p>
          </button>

          <button
            onClick={() => onNavigateTab('learn')}
            className="p-3.5 rounded-2xl bg-white hover:bg-blue-50/60 border border-slate-200 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Ship className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600">
              নদী ও ট্রানজিট গাইড
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">ওয়াটার অ্যাম্বুলেন্স ও রুট</p>
          </button>

          <button
            onClick={() => onNavigateTab('hospitals')}
            className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50/60 border border-slate-200 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-600">
              ব্লাড ব্যাংক মজুত
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">লাইভ স্টক বোর্ড পর্যবেক্ষণ</p>
          </button>

          <button
            onClick={() => onNavigateTab('learn')}
            className="p-3.5 rounded-2xl bg-white hover:bg-amber-50/60 border border-slate-200 text-left transition group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600">
              ডোনেশন ক্যালেন্ডার
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">৯০ দিনের সাইকেল কাউন্টার</p>
          </button>
        </div>
      </section>

      {/* 5.2 Barishal Transit & Cold-Chain Route Engine */}
      <BarishalTransitRouteEngine />

      {/* 5.3 Official Flutter Mobile Application Showcase */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 rounded-3xl p-6 sm:p-8 border border-cyan-900/50 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-cyan-950 shrink-0">
            <Smartphone className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-800/60">
                Official Flutter 3.x Client
              </span>
              <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
                Android APK & iOS
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              barishal-Blood Flutter মোবাইল অ্যাপ্লিকেশন
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
              সরাসরি ফোনে ইনস্টল করার জন্য সম্পূর্ণ Dart/Flutter সোর্স কোড, লাইভ ফোন সিমুলেটর এবং রিলিজ APK বিল্ডার অন্তর্ভুক্ত।
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
          {onOpenFlutterHub && (
            <button
              onClick={onOpenFlutterHub}
              className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>মোবাইল সিমুলেটর ও সোর্স হাব</span>
            </button>
          )}

          <button
            onClick={() => onNavigateTab('emergency')}
            className="w-full sm:w-auto px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>জরুরি রক্ত সেন্টার</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 6. Medical & Platform Core Principles */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
            নিরাপত্তা, গোপনীয়তা ও প্রযুক্তি
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-2">
            প্ল্যাটফর্মের মূল বৈশিষ্ট্য ও মূলনীতি
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            জরুরি মুহূর্তে রোগীর নিরাপত্তা ও রক্তদাতার গোপনীয়তা রক্ষায় আমাদের কঠোর মানদণ্ড
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/80">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center font-black text-xl mb-4 border border-red-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base mb-2">গোপনীয়তা ও প্রটেক্টেড কন্টাক্ট</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              রক্তদাতার সুনির্দিষ্ট ঠিকানা কখনো জনসমক্ষে প্রকাশ করা হয় না। ফোন নম্বর অযাচিত স্প্যাম থেকে সুরক্ষিত রাখতে কন্ট্রোল্ড অ্যাক্সেস ও ভেরিফিকেশন প্রযোজ্য।
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/80">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-black text-xl mb-4 border border-amber-500/30">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base mb-2">স্মার্ট ম্যাচিং ও ডোনার রাডার</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              রক্তের সামঞ্জস্যতা, প্রাপ্যতা স্ট্যাটাস ও আনুমানিক দূরত্বের ভিত্তিতে স্মার্ট র‍্যাঙ্কিং ব্যবস্থা দ্রুততম সময়ে রক্তদাতা নিশ্চিত করে।
            </p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700/80">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-xl mb-4 border border-blue-500/30">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base mb-2">স্মার্ট ডোনার পাস ও সনদ</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              রক্তদাতাদের জন্য কিউআর কোড সম্বলিত ডিজিটাল আইডি পাস, রক্তদানের ইতিহাস ট্র্যাকিং ও স্বীকৃতি হিসেবে অফিসিয়াল ডিজিটাল সম্মাননা সনদ।
            </p>
          </div>
        </div>
      </section>

      {/* 7. Hall of Fame Spotlight */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-extrabold text-slate-900">
                জীবনরক্ষক হল অব ফেম (Hall of Fame)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              যাদের নিঃস্বার্থ রক্তদানে রক্ষা পেয়েছে সহস্র রোগীর জীবন
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('search')}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>সকল রক্তদাতা দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topDonors.map((d) => (
            <div
              key={d.id}
              className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/70 hover:shadow-md transition text-center flex flex-col items-center"
            >
              <div className="relative mb-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                  {d.blood_group}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">
                  ★
                </div>
              </div>

              <h4 className="font-extrabold text-slate-900 text-sm">{d.name}</h4>
              <p className="text-xs text-slate-500 mb-2">
                {d.upazila}, {d.district}
              </p>

              <div className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black mb-3">
                {toBengaliDigits(d.total_donations)} বার রক্তদান
              </div>

              {onViewCertificate && (
                <button
                  onClick={() => onViewCertificate(d)}
                  className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>সম্মাননা সনদ দেখুন</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Developer Credit Recognition */}
      <section className="bg-gradient-to-r from-red-600 via-rose-600 to-red-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shrink-0">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-200 uppercase tracking-widest mb-1">
              <span>চিফ সফটওয়্যার আর্কিটেক্ট ও লিড ইঞ্জিনিয়ার</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>MD. SAIDUL ISLAM</span>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white text-xs">
                ✓
              </span>
            </h3>
            <p className="text-xs text-red-100 mt-1 max-w-lg leading-relaxed">
              বরিশাল বিভাগের মানুষের জন্য দ্রুততম সময়ে রক্ত প্রাপ্তি ও জীবনরক্ষায় উদ্ভাবনী ডিজিটাল প্রযুক্তি আর্কিটেকচার ডিজাইন ও বাস্তবায়ন।
            </p>
          </div>
        </div>

        <button
          onClick={onOpenDeveloperModal}
          className="bg-white text-red-700 hover:bg-red-50 active:scale-95 px-5 py-3 rounded-2xl font-black text-xs shadow-md transition shrink-0 cursor-pointer"
        >
          ডেভেলপার প্রোফাইল ও বায়ো
        </button>
      </section>

      {/* 9. Final Call to Action */}
      <section className="text-center py-6">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
          আজই যুক্ত হোন এই মহৎ মানবিক উদ্যোগে
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          আপনার রক্তদান বাঁচিয়ে দিতে পারে একটি অমূল্য জীবন। বিনামূল্যে নিবন্ধন করুন এবং বরিশাল রক্ত পরিবারের গর্বিত অংশীদার হোন।
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              if (isLoggedIn) {
                onNavigateTab('portal');
              } else {
                onOpenAuth();
              }
            }}
            className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-sm shadow-md transition active:scale-95 cursor-pointer"
          >
            {isLoggedIn ? 'আমার ইউজার পোর্টালে যান' : 'আমি রক্তদাতা হিসেবে যুক্ত হতে চাই'}
          </button>
          <button
            onClick={() => onNavigateTab('search')}
            className="px-6 py-3.5 bg-white text-slate-800 hover:bg-slate-50 rounded-2xl font-bold text-sm border border-slate-300 shadow-xs transition active:scale-95 cursor-pointer"
          >
            রক্তদাতা ডিরেক্টরি ব্রাউজ করুন
          </button>
        </div>
      </section>
    </div>
  );
};
