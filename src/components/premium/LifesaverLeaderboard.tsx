import React, { useState } from 'react';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Trophy,
  Award,
  Sparkles,
  Heart,
  ShieldCheck,
  Star,
  Users,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  district: string;
  bloodGroup: string;
  totalDonations: number;
  points: number;
  badge: string;
  livesSaved: number;
}

export const LifesaverLeaderboard: React.FC = () => {
  const [filterPeriod, setFilterPeriod] = useState<'all_time' | 'this_year' | 'monthly'>('all_time');

  const leaders: LeaderboardUser[] = [
    {
      rank: 1,
      name: 'মো. রফিকুল ইসলাম',
      district: 'বরিশাল',
      bloodGroup: 'O+',
      totalDonations: 24,
      points: 2680,
      badge: 'ডায়মন্ড লিজেন্ড (Diamond)',
      livesSaved: 72,
    },
    {
      rank: 2,
      name: 'ডা. ফারহান আহমেদ',
      district: 'বরিশাল',
      bloodGroup: 'AB-',
      totalDonations: 19,
      points: 2150,
      badge: 'গোল্ডেন স্টার (Gold)',
      livesSaved: 57,
    },
    {
      rank: 3,
      name: 'আনিসুর রহমান শামীম',
      district: 'পটুয়াখালী',
      bloodGroup: 'B+',
      totalDonations: 16,
      points: 1820,
      badge: 'গোল্ডেন স্টার (Gold)',
      livesSaved: 48,
    },
    {
      rank: 4,
      name: 'সাইফুল ইসলাম রাসেল',
      district: 'ভোলা',
      bloodGroup: 'A+',
      totalDonations: 14,
      points: 1540,
      badge: 'সিলভার হিরো (Silver)',
      livesSaved: 42,
    },
    {
      rank: 5,
      name: 'মাহমুদুল হাসান',
      district: 'পিরোজপুর',
      bloodGroup: 'O-',
      totalDonations: 12,
      points: 1390,
      badge: 'সিলভার হিরো (Silver)',
      livesSaved: 36,
    },
    {
      rank: 6,
      name: 'তানভীর আহমেদ রনি',
      district: 'বরগুনা',
      bloodGroup: 'B-',
      totalDonations: 10,
      points: 1150,
      badge: 'ব্রোঞ্জ চ্যাম্পিয়ন (Bronze)',
      livesSaved: 30,
    },
    {
      rank: 7,
      name: 'শরীফুল আলম',
      district: 'ঝালকাঠি',
      bloodGroup: 'AB+',
      totalDonations: 9,
      points: 990,
      badge: 'ব্রোঞ্জ চ্যাম্পিয়ন (Bronze)',
      livesSaved: 27,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>ফিচার ১৪: বিভাগীয় জীবনরক্ষক র‍্যাঙ্কিং ও সম্মাননা</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            লাইফসেভার লিডারবোর্ড ও পয়েন্টস সিস্টেম
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            সর্বাধিক রক্তদান এবং দ্রুততম জরুরি রেসপন্সের ভিত্তিতে বরিশাল বিভাগের শীর্ষ জীবনরক্ষকদের তালিকা
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilterPeriod('all_time')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filterPeriod === 'all_time' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            সর্বকালের শীর্ষ
          </button>
          <button
            onClick={() => setFilterPeriod('this_year')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              filterPeriod === 'this_year' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            চলতি বছর (২০২৬)
          </button>
        </div>
      </div>

      {/* Points Rules Banner */}
      <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950">
        <span className="font-extrabold flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>পয়েন্ট অর্জনের নিয়মাবলী:</span>
        </span>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-amber-900 font-medium">
          <span>প্রতিটি পূর্ণ রক্তদান: +১০০ পয়েন্ট</span>
          <span>·</span>
          <span>জরুরি এসওএস রেসপন্স: +৫০ পয়েন্ট</span>
          <span>·</span>
          <span>নেগেটিভ/বিরল গ্রুপ বোনাস: +৩০ পয়েন্ট</span>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-2.5">
        {leaders.map((leader) => (
          <div
            key={leader.rank}
            className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              leader.rank === 1
                ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-300 shadow-xs'
                : leader.rank === 2
                ? 'bg-gradient-to-r from-slate-100/70 via-white to-slate-100/70 border-slate-300'
                : leader.rank === 3
                ? 'bg-gradient-to-r from-orange-50/60 via-white to-orange-50/60 border-orange-200'
                : 'bg-slate-50/60 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                leader.rank === 1
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : leader.rank === 2
                  ? 'bg-slate-300 text-slate-800'
                  : leader.rank === 3
                  ? 'bg-orange-300 text-orange-950'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {toBengaliDigits(leader.rank)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900">
                    {leader.name}
                  </h4>
                  <span className="text-xs font-black px-2 py-0.5 rounded-md bg-red-600 text-white">
                    {leader.bloodGroup}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {leader.district} জেলা · <span className="text-amber-800 font-semibold">{leader.badge}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="text-left sm:text-right">
                <span className="text-slate-400 block text-[11px]">মোট রক্তদান</span>
                <strong className="text-slate-900 text-sm">
                  {toBengaliDigits(leader.totalDonations)} বার (~{toBengaliDigits(leader.livesSaved)} জীবন)
                </strong>
              </div>

              <div className="text-left sm:text-right pl-3 border-l border-slate-200">
                <span className="text-slate-400 block text-[11px]">লাইফ পয়েন্ট</span>
                <span className="font-mono font-black text-amber-600 text-sm">
                  {toBengaliDigits(leader.points)} pts
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
