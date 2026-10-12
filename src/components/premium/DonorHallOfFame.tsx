import React, { useState } from 'react';
import { Donor } from '../../types/index.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Trophy,
  Award,
  Sparkles,
  ShieldCheck,
  Heart,
  Phone,
  Search,
  Filter,
  Flame,
  Star,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

interface DonorHallOfFameProps {
  donors: Donor[];
  onCallDonor: (donor: Donor) => void;
  onViewProfile: (donor: Donor) => void;
  onViewCertificate?: (donor: Donor) => void;
}

type HonorTier = 'all' | 'legend' | 'gold' | 'silver' | 'bronze';

export const DonorHallOfFame: React.FC<DonorHallOfFameProps> = ({
  donors,
  onCallDonor,
  onViewProfile,
  onViewCertificate,
}) => {
  const [selectedTier, setSelectedTier] = useState<HonorTier>('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [salutes, setSalutes] = useState<Record<number, number>>({});

  // Helper to get donor tier
  const getDonorTier = (count: number) => {
    if (count >= 10) return 'legend';
    if (count >= 5) return 'gold';
    if (count >= 3) return 'silver';
    return 'bronze';
  };

  const getTierBadge = (count: number) => {
    if (count >= 10) {
      return {
        label: 'লাইফসেভার লিজেন্ড',
        bg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black',
        icon: Trophy,
        ring: 'ring-2 ring-amber-400',
      };
    }
    if (count >= 5) {
      return {
        label: 'গোল্ডেন গার্ডিয়ান',
        bg: 'bg-gradient-to-r from-yellow-400 to-amber-300 text-amber-950 font-bold',
        icon: Award,
        ring: 'ring-2 ring-yellow-400',
      };
    }
    if (count >= 3) {
      return {
        label: 'সিলভার ডিফেন্ডার',
        bg: 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 font-bold',
        icon: Star,
        ring: 'ring-1 ring-slate-300',
      };
    }
    return {
      label: 'ব্রোঞ্জ হিরো',
      bg: 'bg-gradient-to-r from-orange-200 to-amber-200 text-amber-900 font-bold',
      icon: Heart,
      ring: 'ring-1 ring-orange-300',
    };
  };

  // Sort donors by donation count descending
  const sortedDonors = [...donors].sort((a, b) => (b.total_donations || 0) - (a.total_donations || 0));

  const filteredDonors = sortedDonors.filter((d) => {
    const tier = getDonorTier(d.total_donations || 0);
    if (selectedTier !== 'all' && tier !== selectedTier) return false;
    if (districtFilter !== 'all' && d.district !== districtFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = d.name.toLowerCase().includes(q);
      const matchBg = d.blood_group.toLowerCase().includes(q);
      const matchUpazila = d.upazila?.toLowerCase().includes(q);
      if (!matchName && !matchBg && !matchUpazila) return false;
    }
    return true;
  });

  const handleSalute = (donorId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSalutes((prev) => ({
      ...prev,
      [donorId]: (prev[donorId] || 0) + 1,
    }));
  };

  // Aggregate stats
  const totalDonationsCount = donors.reduce((acc, curr) => acc + (curr.total_donations || 0), 0);
  const estimatedLivesSaved = totalDonationsCount * 3;
  const verifiedCount = donors.filter((d) => d.is_verified).length;

  return (
    <div className="space-y-6">
      {/* Hero Banner with Royal Gradient */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-indigo-900/40 overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>বরিশাল বিভাগীয় রক্তযোদ্ধা হল অব ফেম</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              মানবতার শ্রেষ্ঠ নায়ক ও সম্মানিত রক্তদাতাগণ
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              স্বেচ্ছায় রক্তদান করে যারা বরিশাল বিভাগের হাজারো রোগীর জীবন বাঁচিয়েছেন, তাদের প্রতি আমাদের সশ্রদ্ধ কৃতজ্ঞতা ও ডিজিটাল সম্মাননা।
            </p>
          </div>

          {/* Quick Counter Cards */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-center shrink-0">
            <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="block text-xl sm:text-2xl font-black text-amber-400">
                {toBengaliDigits(totalDonationsCount)}
              </span>
              <span className="text-[11px] text-slate-300">মোট রক্তদান</span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="block text-xl sm:text-2xl font-black text-rose-400">
                {toBengaliDigits(estimatedLivesSaved)}+
              </span>
              <span className="text-[11px] text-slate-300">জীবন রক্ষা</span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="block text-xl sm:text-2xl font-black text-emerald-400">
                {toBengaliDigits(verifiedCount)}
              </span>
              <span className="text-[11px] text-slate-300">যাচাইকৃত যোদ্ধা</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Tier Badges Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedTier('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedTier === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            সকল রক্তযোদ্ধা
          </button>
          <button
            onClick={() => setSelectedTier('legend')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1 ${
              selectedTier === 'legend'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>লিজেন্ড (১০+)</span>
          </button>
          <button
            onClick={() => setSelectedTier('gold')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1 ${
              selectedTier === 'gold'
                ? 'bg-yellow-500 text-slate-950 shadow-xs'
                : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>গোল্ড (৫+)</span>
          </button>
          <button
            onClick={() => setSelectedTier('silver')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1 ${
              selectedTier === 'silver'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>সিলভার (৩+)</span>
          </button>
          <button
            onClick={() => setSelectedTier('bronze')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1 ${
              selectedTier === 'bronze'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>ব্রোঞ্জ (১+)</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম বা উপজেলা খুঁজুন..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>
      </div>

      {/* Hall of Fame List */}
      {filteredDonors.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center text-slate-500 border border-slate-200">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 text-base mb-1">
            এই ক্যাটাগরিতে কোনো রক্তদাতা পাওয়া যায়নি
          </h4>
          <p className="text-xs text-slate-500">ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDonors.map((donor, index) => {
            const count = donor.total_donations || 0;
            const badge = getTierBadge(count);
            const BadgeIcon = badge.icon;
            const extraSalutes = salutes[donor.id] || 0;
            const totalSaluteDisplay = count * 7 + 12 + extraSalutes;

            return (
              <div
                key={donor.id}
                onClick={() => onViewProfile(donor)}
                className="group relative bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-red-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Top Rank Ribbon */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    {/* Donor Avatar with Blood Badge */}
                    <div className="relative">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
                        {donor.name.charAt(0)}
                      </div>
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-lg bg-red-600 text-white text-[10px] font-black border border-white">
                        {donor.blood_group}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-red-600 transition-colors">
                          {donor.name}
                        </h4>
                        {donor.is_verified ? (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : null}
                      </div>
                      <p className="text-xs text-slate-500">
                        {donor.upazila}, {donor.district}
                      </p>
                    </div>
                  </div>

                  {/* Rank position (top 3 highlights) */}
                  {index < 3 && (
                    <span className="px-2 py-1 rounded-xl bg-amber-100 text-amber-900 font-black text-[11px] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                      #{toBengaliDigits(index + 1)}
                    </span>
                  )}
                </div>

                {/* Tier Badge & Statistics */}
                <div className="space-y-3 mb-4">
                  <div className={`px-3 py-1.5 rounded-xl text-xs flex items-center justify-between ${badge.bg}`}>
                    <span className="flex items-center gap-1.5">
                      <BadgeIcon className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </span>
                    <span className="font-black">
                      {toBengaliDigits(count)} বার রক্তদান
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-[11px] text-slate-400">জীবন বাঁচিয়েছেন</span>
                      <span className="font-bold text-slate-800">
                        প্রায় {toBengaliDigits(count * 3)} টি
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-[11px] text-slate-400">অবস্থা</span>
                      <span
                        className={`font-bold ${
                          donor.is_available ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      >
                        {donor.is_available ? 'রক্তদানে প্রস্তুত' : 'বিশ্রামে আছেন'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Salute button */}
                  <button
                    onClick={(e) => handleSalute(donor.id, e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition active:scale-90"
                    title="রক্তযোদ্ধাকে স্যালুট জানান"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                    <span>স্যালুট ({toBengaliDigits(totalSaluteDisplay)})</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* View Certificate */}
                    {onViewCertificate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewCertificate(donor);
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title="ডিজিটাল সম্মাননা সনদ দেখুন"
                      >
                        <FileCheck2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}

                    {/* Direct Call */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCallDonor(donor);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition active:scale-95"
                    >
                      <Phone className="w-3 h-3" />
                      <span>যোগাযোগ</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Architect Signature Stamp */}
      <div className="text-center py-2 text-slate-400 text-xs flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>হল অব ফেম সিস্টেম ও সম্মাননা আর্কিটেক্ট: </span>
        <strong className="text-slate-700">MD. SAIDUL ISLAM</strong>
      </div>
    </div>
  );
};
