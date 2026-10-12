import React, { useState } from 'react';
import { BloodCompatibilityMatrix } from '../premium/BloodCompatibilityMatrix.js';
import { CrossMatchSimulator } from '../premium/CrossMatchSimulator.js';
import { EligibilityCalculator } from '../premium/EligibilityCalculator.js';
import { BloodMythBuster } from '../premium/BloodMythBuster.js';
import { NutritionDietPlanner } from '../premium/NutritionDietPlanner.js';
import { LifesaverQuiz } from '../premium/LifesaverQuiz.js';
import { FirstAidProtocolGuide } from '../premium/FirstAidProtocolGuide.js';
import { EmergencyPosterGenerator } from '../premium/EmergencyPosterGenerator.js';
import { RiverWaterAmbulanceGuide } from '../premium/RiverWaterAmbulanceGuide.js';
import { ThalassemiaBuddyNetwork } from '../premium/ThalassemiaBuddyNetwork.js';
import { DonationCycleCalendar } from '../premium/DonationCycleCalendar.js';
import {
  BookOpen,
  GitCompare,
  FlaskConical,
  CheckCircle,
  HelpCircle,
  Utensils,
  Award,
  LifeBuoy,
  AlertTriangle,
  Image,
  Ship,
  Heart,
  Calendar,
} from 'lucide-react';

export const LearnView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'matrix' | 'eligibility' | 'poster' | 'transit' | 'thalassemia' | 'calendar' | 'myths' | 'simulator' | 'nutrition' | 'quiz' | 'firstAid'
  >('matrix');

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-900 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 border border-red-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold mb-3 border border-red-400/30">
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span>শিক্ষামূলক ও সচেতনতামূলক স্বাস্থ্য কেন্দ্র</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            রক্ত ও রক্তদান সম্পর্কে জানুন · প্রিমিয়াম টুলস
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            রক্তের গ্রুপ সামঞ্জস্যতা, পোস্টার মেকার, নদী ও সড়ক ট্রানজিট রুট, থ্যালাসেমিয়া নেটওয়ার্ক, ক্যালেন্ডার শিডিউলার, ল্যাব ক্রস-ম্যাচ সিমুলেশন ও জরুরি ফার্স্ট-এইড প্রটোকল।
          </p>

          {/* Critical Medical Disclaimer */}
          <div className="bg-amber-500/15 border border-amber-400/30 rounded-2xl p-3 sm:p-4 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-extrabold text-amber-300">গুরুত্বপূর্ণ স্বাস্থ্য ও আইনি নির্দেশনা:</span>{' '}
              এই বিভাগের সমস্ত তথ্য ও সিমুলেটর শুধুমাত্র সাধারণ জ্ঞান ও শিক্ষামূলক উদ্দেশ্যে নির্মিত। যেকোনো ধরনের রক্ত সঞ্চালন (Blood Transfusion), রক্তদানের চূড়ান্ত অনুমতি বা ক্লিনিক্যাল সিদ্ধান্তের ক্ষেত্রে হাসপাতালের রেজিস্টার্ড চিকিৎসক ও ল্যাবরেটরি ক্রস-ম্যাচের রিপোর্ট অবশ্য পালনীয়।
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>রক্তের সামঞ্জস্যতা চার্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('poster')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'poster'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>জরুরি পোস্টার মেকার</span>
        </button>

        <button
          onClick={() => setActiveTab('eligibility')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'eligibility'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>রক্তদানের যোগ্যতা ক্যালকুলেটর</span>
        </button>

        <button
          onClick={() => setActiveTab('transit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'transit'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Ship className="w-3.5 h-3.5" />
          <span>রিভার ও ট্রানজিট গাইড</span>
        </button>

        <button
          onClick={() => setActiveTab('thalassemia')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'thalassemia'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>থ্যালাসেমিয়া নেটওয়ার্ক</span>
        </button>

        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'calendar'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>ডোনেশন সাইকেল ও ক্যালেন্ডার</span>
        </button>

        <button
          onClick={() => setActiveTab('myths')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'myths'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>ভুল ধারণা বনাম বাস্তবতা</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'simulator'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>ল্যাব ক্রস-ম্যাচ সিমুলেটর</span>
        </button>

        <button
          onClick={() => setActiveTab('nutrition')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'nutrition'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>পুষ্টি ও খাদ্য নির্দেশিকা</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>লাইফসেভার কুইজ</span>
        </button>

        <button
          onClick={() => setActiveTab('firstAid')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'firstAid'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>রক্তক্ষরণ ও ফার্স্ট-এইড</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="transition-all">
        {activeTab === 'matrix' && <BloodCompatibilityMatrix />}
        {activeTab === 'poster' && <EmergencyPosterGenerator />}
        {activeTab === 'eligibility' && <EligibilityCalculator />}
        {activeTab === 'transit' && <RiverWaterAmbulanceGuide />}
        {activeTab === 'thalassemia' && <ThalassemiaBuddyNetwork />}
        {activeTab === 'calendar' && <DonationCycleCalendar />}
        {activeTab === 'myths' && <BloodMythBuster />}
        {activeTab === 'simulator' && <CrossMatchSimulator />}
        {activeTab === 'nutrition' && <NutritionDietPlanner />}
        {activeTab === 'quiz' && <LifesaverQuiz />}
        {activeTab === 'firstAid' && <FirstAidProtocolGuide />}
      </div>
    </div>
  );
};
