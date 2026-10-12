import React, { useState } from 'react';
import { BloodRequest, Donor, BloodGroup } from '../../types/index.js';
import { BloodRequestCard } from '../request/BloodRequestCard.js';
import { DonorCard } from '../donor/DonorCard.js';
import { LiveDonorRadar } from '../premium/LiveDonorRadar.js';
import { BloodCompatibilityMatrix } from '../premium/BloodCompatibilityMatrix.js';
import { HospitalLiveStockBoard } from '../premium/HospitalLiveStockBoard.js';
import { EligibilityCalculator } from '../premium/EligibilityCalculator.js';
import { DonorHallOfFame } from '../premium/DonorHallOfFame.js';
import { SmartProximityEstimator } from '../premium/SmartProximityEstimator.js';
import { BloodMythBuster } from '../premium/BloodMythBuster.js';
import { EmergencyPosterGenerator } from '../premium/EmergencyPosterGenerator.js';
import { AmbulanceOxygenDirectory } from '../premium/AmbulanceOxygenDirectory.js';
import { ThalassemiaBuddyNetwork } from '../premium/ThalassemiaBuddyNetwork.js';
import { DonationCycleCalendar } from '../premium/DonationCycleCalendar.js';
import { PlateletApheresisMatcher } from '../premium/PlateletApheresisMatcher.js';
import { NutritionDietPlanner } from '../premium/NutritionDietPlanner.js';
import { EmergencySpeedDialBoard } from '../premium/EmergencySpeedDialBoard.js';
import { VolunteerClubsDirectory } from '../premium/VolunteerClubsDirectory.js';
import { PreDonationHealthScore } from '../premium/PreDonationHealthScore.js';
import { CertificateValidator } from '../premium/CertificateValidator.js';
import { EmergencySmsGenerator } from '../premium/EmergencySmsGenerator.js';
import { CrossMatchSimulator } from '../premium/CrossMatchSimulator.js';
import { DivisionHeatmap } from '../premium/DivisionHeatmap.js';
import { LifesaverLeaderboard } from '../premium/LifesaverLeaderboard.js';
import { DonorWallOfGratitude } from '../premium/DonorWallOfGratitude.js';
import { SeasonalCrisisMonitor } from '../premium/SeasonalCrisisMonitor.js';
import { InteractiveNotificationCenter } from '../premium/InteractiveNotificationCenter.js';
import { LifesaverQuiz } from '../premium/LifesaverQuiz.js';
import { LiveSOSAudioBroadcaster } from '../premium/LiveSOSAudioBroadcaster.js';
import { SmartRouteNavigator } from '../premium/SmartRouteNavigator.js';
import { RoktoShohayokAI } from '../premium/RoktoShohayokAI.js';
import { BloodCampScheduler } from '../premium/BloodCampScheduler.js';
import { RiverWaterAmbulanceGuide } from '../premium/RiverWaterAmbulanceGuide.js';
import { FirstAidProtocolGuide } from '../premium/FirstAidProtocolGuide.js';
import { BARISHAL_DIVISION_DISTRICTS, BLOOD_GROUPS } from '../../utils/locations.js';
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
  Image,
  Truck,
  Layers,
  FileCheck,
  MessageSquare,
  TrendingUp,
  Bell,
  Navigation,
  Flame,
  MapPin,
  Bot,
  Ship,
  Ticket,
  LifeBuoy,
} from 'lucide-react';

interface HomeViewProps {
  onSearchBloodGroup: (bg: string) => void;
  onOpenCreateRequest: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenDeveloperModal?: () => void;
  recentRequests: BloodRequest[];
  featuredDonors: Donor[];
  onRespondClick: (r: BloodRequest) => void;
  onViewRequestDetails: (r: BloodRequest) => void;
  onShareRequest?: (r: BloodRequest) => void;
  onCallDonor: (d: Donor) => void;
  onReportDonor: (d: Donor) => void;
  onViewDonorProfile: (d: Donor) => void;
  onViewCertificate?: (d: Donor) => void;
  isLoggedIn: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSearchBloodGroup,
  onOpenCreateRequest,
  onNavigateTab,
  onOpenDeveloperModal,
  recentRequests,
  featuredDonors,
  onRespondClick,
  onViewRequestDetails,
  onShareRequest,
  onCallDonor,
  onReportDonor,
  onViewDonorProfile,
  onViewCertificate,
  isLoggedIn,
}) => {
  const [hubCategory, setHubCategory] = useState<'all' | 'emergency' | 'clinical' | 'community'>('all');
  const [activeHubTab, setActiveHubTab] = useState<string>('requests');

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-800 text-white p-6 sm:p-10 shadow-xl overflow-hidden">
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-red-200 uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>বরিশাল বিভাগীয় ডিজিটাল ব্লাড নেটওয়ার্ক</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug sm:leading-tight mb-3 text-balance">
            আপনার এক ব্যাগ রক্ত, <br />
            বাঁচাতে পারে একটি অমূল্য জীবন
          </h1>

          <p className="text-xs sm:text-sm text-red-100/90 font-normal mb-6 leading-relaxed max-w-xl">
            বরিশাল সদর, পটুয়াখালী, ভোলা, পিরোজপুর, বরগুনা ও ঝালকাঠির প্রতিটি উপজেলা জুড়ে ভেরিফাইড রক্তদাতাদের সাথে দ্রুত ও নিরাপদ সংযোগ।
          </p>

          {/* Quick Blood Group Search Pills */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 mb-6">
            <span className="block text-[11px] font-bold text-red-100 uppercase tracking-wider mb-2">
              যে গ্রুপের রক্ত খুঁজছেন নির্বাচন করুন:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  onClick={() => onSearchBloodGroup(bg)}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-red-700 font-black text-xs sm:text-sm shrink-0 shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('search')}
              className="flex items-center gap-2 bg-white text-red-600 px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md hover:bg-red-50 active:scale-95 transition"
            >
              <Search className="w-4 h-4" />
              <span>রক্তদাতা খুঁজুন</span>
            </button>

            <button
              onClick={onOpenCreateRequest}
              className="flex items-center gap-2 bg-red-950/40 hover:bg-red-950/60 border border-white/30 text-white px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm active:scale-95 transition"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>জরুরি রক্তের আবেদন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-red-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">
              জরুরি মুহূর্তে হাসপাতালের ব্লাড ব্যাংক যোগাযোগ
            </h4>
            <p className="text-xs text-slate-500">
              শের-ই-বাংলা মেডিকেল (SBMCH) অথবা জাতীয় জরুরি সেবা ৯৯৯
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="tel:01711223344"
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition"
          >
            SBMCH হটলাইন
          </a>
          <a
            href="tel:999"
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            কল ৯৯৯
          </a>
        </div>
      </div>

      {/* Premium Interactive Feature Hub Tabs */}
      <div className="space-y-4">
        {/* Category Pills Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs">
            <button
              onClick={() => { setHubCategory('all'); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                hubCategory === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              সকল ফিচার (২০টি)
            </button>
            <button
              onClick={() => { setHubCategory('emergency'); setActiveHubTab('poster'); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                hubCategory === 'emergency' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              জরুরি রেসপন্স ও ট্রানজিট
            </button>
            <button
              onClick={() => { setHubCategory('clinical'); setActiveHubTab('thalassemia'); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                hubCategory === 'clinical' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ক্লিনিক্যাল ও পেশেন্ট কেয়ার
            </button>
            <button
              onClick={() => { setHubCategory('community'); setActiveHubTab('heatmap'); }}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                hubCategory === 'community' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              কমিউনিটি ও সম্মাননা
            </button>
          </div>
        </div>

        {/* Feature Buttons Scrollable Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs font-bold">
          {(hubCategory === 'all' || hubCategory === 'emergency') && (
            <>
              <button
                onClick={() => setActiveHubTab('ai')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'ai'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md ring-2 ring-red-400'
                    : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 hover:bg-red-100 border border-red-200'
                }`}
              >
                <Bot className="w-4 h-4 text-red-600" />
                <span>রক্ত সহায়ক এআই</span>
                <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded-full">২৪/৭</span>
              </button>

              <button
                onClick={() => setActiveHubTab('requests')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'requests'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>জরুরি রক্তের অনুরোধ</span>
              </button>

              <button
                onClick={() => setActiveHubTab('poster')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'poster'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Image className="w-3.5 h-3.5 text-rose-500" />
                <span>সোশ্যাল পোস্টার মেকার</span>
              </button>

              <button
                onClick={() => setActiveHubTab('ambulance')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'ambulance'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-blue-500" />
                <span>অ্যাম্বুলেন্স ও অক্সিজেন</span>
              </button>

              <button
                onClick={() => setActiveHubTab('speedDial')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'speedDial'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                <span>১-ট্যাপ স্পিড ডায়াল</span>
              </button>

              <button
                onClick={() => setActiveHubTab('smsGen')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'smsGen'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                <span>এসএমএস ও বার্তা মেকার</span>
              </button>

              <button
                onClick={() => setActiveHubTab('sosAudio')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'sosAudio'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>অডিও এসওএস সাইরেন</span>
              </button>

              <button
                onClick={() => setActiveHubTab('routeNav')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'routeNav'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Navigation className="w-3.5 h-3.5 text-indigo-500" />
                <span>রুট ও ব্রিজ নেভিগেটর</span>
              </button>

              <button
                onClick={() => setActiveHubTab('waterAmbulance')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'waterAmbulance'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Ship className="w-3.5 h-3.5 text-blue-500" />
                <span>নদীপথ ও ওয়াটার অ্যাম্বুলেন্স</span>
              </button>

              <button
                onClick={() => setActiveHubTab('firstAid')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'firstAid'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <LifeBuoy className="w-3.5 h-3.5 text-emerald-500" />
                <span>রক্তক্ষরণ ও ফার্স্ট-এইড</span>
              </button>

              <button
                onClick={() => setActiveHubTab('radar')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'radar'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-rose-500" />
                <span>লাইভ ব্লাড রাডার</span>
              </button>

              <button
                onClick={() => setActiveHubTab('proximity')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'proximity'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-amber-500" />
                <span>স্মার্ট প্রক্সিমিটি</span>
              </button>
            </>
          )}

          {(hubCategory === 'all' || hubCategory === 'clinical') && (
            <>
              <button
                onClick={() => setActiveHubTab('thalassemia')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'thalassemia'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>থ্যালাসেমিয়া বাডি স্কোয়াড</span>
              </button>

              <button
                onClick={() => setActiveHubTab('cycleCal')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'cycleCal'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>সাইকেল ক্যালেন্ডার ও .ics</span>
              </button>

              <button
                onClick={() => setActiveHubTab('platelet')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'platelet'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                <span>প্লাটিলেট (SDP) ম্যাচিং</span>
              </button>

              <button
                onClick={() => setActiveHubTab('nutrition')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'nutrition'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>ডায়েট ও আয়রন প্ল্যানার</span>
              </button>

              <button
                onClick={() => setActiveHubTab('healthScore')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'healthScore'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5 text-red-500" />
                <span>প্রি-ডোনেশন ফিটনেস স্কোর</span>
              </button>

              <button
                onClick={() => setActiveHubTab('crossMatch')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'crossMatch'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-500" />
                <span>ক্রস-ম্যাচ সিমুলেটর</span>
              </button>

              <button
                onClick={() => setActiveHubTab('stock')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'stock'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>ব্লাড ব্যাংক লাইভ স্টক</span>
              </button>

              <button
                onClick={() => setActiveHubTab('compatibility')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'compatibility'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-red-500" />
                <span>গ্রুপ মেলবন্ধন</span>
              </button>

              <button
                onClick={() => setActiveHubTab('eligibility')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'eligibility'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5 text-emerald-500" />
                <span>রক্তদান যোগ্যতা ক্যালকুলেটর</span>
              </button>
            </>
          )}

          {(hubCategory === 'all' || hubCategory === 'community') && (
            <>
              <button
                onClick={() => setActiveHubTab('heatmap')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'heatmap'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>বিভাগীয় ডেনসিটি হিটম্যাপ</span>
              </button>

              <button
                onClick={() => setActiveHubTab('leaderboard')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'leaderboard'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>লাইফসেভার লিডারবোর্ড</span>
              </button>

              <button
                onClick={() => setActiveHubTab('gratitude')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'gratitude'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>থ্যাঙ্ক ইউ নোটবুক</span>
              </button>

              <button
                onClick={() => setActiveHubTab('camp')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'camp'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Ticket className="w-3.5 h-3.5 text-rose-500" />
                <span>রক্তদান ক্যাম্প ও ড্রাইভ</span>
              </button>

              <button
                onClick={() => setActiveHubTab('clubs')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'clubs'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5 text-blue-500" />
                <span>যুব ও স্বেচ্ছাসেবী ক্লাবস</span>
              </button>

              <button
                onClick={() => setActiveHubTab('certVerify')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'certVerify'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>সনদ ভেরিফায়ার</span>
              </button>

              <button
                onClick={() => setActiveHubTab('seasonal')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'seasonal'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                <span>সিজনাল সংকট মনিটর</span>
              </button>

              <button
                onClick={() => setActiveHubTab('notifs')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'notifs'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>নোটিফিকেশন সেন্টার</span>
              </button>

              <button
                onClick={() => setActiveHubTab('quiz')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'quiz'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
                <span>লাইফসেভার নলেজ কুইজ</span>
              </button>

              <button
                onClick={() => setActiveHubTab('hallOfFame')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'hallOfFame'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>রক্তযোদ্ধা হল অব ফেম</span>
              </button>

              <button
                onClick={() => setActiveHubTab('myths')}
                className={`px-3.5 py-2 rounded-xl shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  activeHubTab === 'myths'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>ভুল ধারণা বনাম সত্য</span>
              </button>
            </>
          )}
        </div>

        {/* Tab 1: Live Emergency Requests */}
        {activeHubTab === 'requests' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                  অতি জরুরি রক্তের প্রয়োজন
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  এখনই রক্তের প্রয়োজন রয়েছে এমন রোগীদের তালিকা
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('requests')}
                className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <span>সকল অনুরোধ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentRequests.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-400 text-xs border border-slate-200">
                বর্তমানে কোনো জরুরি অনুরোধ নেই।
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentRequests.slice(0, 4).map((r) => (
                  <BloodRequestCard
                    key={r.id}
                    request={r}
                    onRespondClick={onRespondClick}
                    onViewDetails={onViewRequestDetails}
                    onShareClick={onShareRequest}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Live Radar Screen */}
        {activeHubTab === 'radar' && (
          <LiveDonorRadar
            donors={featuredDonors}
            onCallDonor={onCallDonor}
            onViewDonorProfile={onViewDonorProfile}
          />
        )}

        {/* Tab: Hall of Fame */}
        {activeHubTab === 'hallOfFame' && (
          <DonorHallOfFame
            donors={featuredDonors}
            onCallDonor={onCallDonor}
            onViewProfile={onViewDonorProfile}
            onViewCertificate={onViewCertificate}
          />
        )}

        {/* Tab: Smart Proximity & Route Estimator */}
        {activeHubTab === 'proximity' && (
          <SmartProximityEstimator
            donors={featuredDonors}
            onCallDonor={onCallDonor}
            onViewProfile={onViewDonorProfile}
            onOpenCreateRequest={onOpenCreateRequest}
          />
        )}

        {/* Tab 3: Compatibility Matrix */}
        {activeHubTab === 'compatibility' && (
          <BloodCompatibilityMatrix
            onSearchGroup={(group: BloodGroup) => onSearchBloodGroup(group)}
          />
        )}

        {/* Tab 4: Live Hospital Stock Board */}
        {activeHubTab === 'stock' && (
          <HospitalLiveStockBoard
            onDonateClick={(group) => onSearchBloodGroup(group)}
          />
        )}

        {/* Tab 5: Eligibility Calculator */}
        {activeHubTab === 'eligibility' && <EligibilityCalculator />}

        {/* Tab 6: Myth Buster & Health Awareness */}
        {activeHubTab === 'myths' && <BloodMythBuster />}

        {/* Tab 7: Emergency Poster Generator */}
        {activeHubTab === 'poster' && (
          <EmergencyPosterGenerator
            initialRequest={recentRequests[0] || null}
            onOpenCreateRequest={onOpenCreateRequest}
          />
        )}

        {/* Tab 8: Emergency SMS Generator */}
        {activeHubTab === 'sms' && <EmergencySmsGenerator />}

        {/* Tab 9: Emergency Speed Dial Board */}
        {activeHubTab === 'speedDial' && <EmergencySpeedDialBoard />}

        {/* Tab 10: Ambulance & Oxygen Directory */}
        {activeHubTab === 'ambulance' && <AmbulanceOxygenDirectory />}

        {/* Tab 11: Live SOS Siren & Audio Broadcast */}
        {activeHubTab === 'sosAudio' && <LiveSOSAudioBroadcaster />}

        {/* Tab 12: Smart Route Navigator */}
        {activeHubTab === 'routeNav' && <SmartRouteNavigator />}

        {/* Tab 13: Thalassemia Buddy Squad */}
        {activeHubTab === 'thalassemia' && <ThalassemiaBuddyNetwork />}

        {/* Tab 14: Donation Cycle Calendar */}
        {activeHubTab === 'cycleCal' && <DonationCycleCalendar />}

        {/* Tab 15: Platelet Apheresis Matcher */}
        {activeHubTab === 'platelet' && <PlateletApheresisMatcher />}

        {/* Tab 16: Nutrition & Iron Diet Planner */}
        {activeHubTab === 'nutrition' && <NutritionDietPlanner />}

        {/* Tab 17: Pre-Donation Health Score */}
        {activeHubTab === 'healthScore' && <PreDonationHealthScore />}

        {/* Tab 18: Cross-Match Simulator */}
        {activeHubTab === 'crossMatch' && <CrossMatchSimulator />}

        {/* Tab 19: Division Heatmap */}
        {activeHubTab === 'heatmap' && <DivisionHeatmap />}

        {/* Tab 20: Lifesaver Leaderboard */}
        {activeHubTab === 'leaderboard' && <LifesaverLeaderboard />}

        {/* Tab 21: Donor Wall of Gratitude */}
        {activeHubTab === 'gratitude' && <DonorWallOfGratitude />}

        {/* Tab 22: Volunteer Clubs Directory */}
        {activeHubTab === 'clubs' && <VolunteerClubsDirectory />}

        {/* Tab 23: Certificate Validator */}
        {activeHubTab === 'certVerify' && <CertificateValidator />}

        {/* Tab 24: Seasonal Crisis Monitor */}
        {activeHubTab === 'seasonal' && <SeasonalCrisisMonitor />}

        {/* Tab 25: Interactive Notification Center */}
        {activeHubTab === 'notifs' && <InteractiveNotificationCenter />}

        {/* Tab 26: Lifesaver Knowledge Quiz */}
        {activeHubTab === 'quiz' && <LifesaverQuiz />}

        {/* Tab 27: Rokto Shohayok AI */}
        {activeHubTab === 'ai' && <RoktoShohayokAI />}

        {/* Tab 28: Blood Camp & Mobile Drive Scheduler */}
        {activeHubTab === 'camp' && <BloodCampScheduler />}

        {/* Tab 29: River Water Ambulance Guide */}
        {activeHubTab === 'waterAmbulance' && <RiverWaterAmbulanceGuide />}

        {/* Tab 30: First Aid & Severe Bleeding Protocol Guide */}
        {activeHubTab === 'firstAid' && <FirstAidProtocolGuide />}
      </div>

      {/* Featured Ready Donors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              প্রস্তুত ভেরিফাইড রক্তদাতাগণ
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              যাঁরা বর্তমানে রক্তদানের জন্য সম্পূর্ণ প্রস্তুত
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('search')}
            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
          >
            <span>সকল রক্তদাতা</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredDonors.slice(0, 4).map((d) => (
            <DonorCard
              key={d.id}
              donor={d}
              onCallClick={onCallDonor}
              onReportClick={onReportDonor}
              onViewProfile={onViewDonorProfile}
            />
          ))}
        </div>
      </div>

      {/* District Coverage Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-red-600" />
          বরিশাল বিভাগের ৬টি জেলার কভারেজ
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          যে কোনো জেলার রক্তদাতা বা হাসপাতালের তথ্য জানতে ট্যাপ করুন:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BARISHAL_DIVISION_DISTRICTS.map((d) => (
            <button
              key={d.name}
              onClick={() => onNavigateTab('search')}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-red-50 border border-slate-100 hover:border-red-200 text-left transition group"
            >
              <span className="font-bold text-slate-800 group-hover:text-red-600 text-sm block">
                {d.name} জেলা
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                {d.upazilas.length} টি উপজেলা
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Platform Features / Why barishal-Blood */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 mb-1">যাচাইকৃত রক্তদাতা</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            ভুয়া বা অনুপলব্ধ নম্বর প্রতিরোধে রক্তদাতার তথ্য নিয়মিত মনিটরিং ও ভেরিফাই করা হয়।
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 mb-1">স্বয়ংক্রিয় ৯০ দিন বিরতি</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            একবার রক্তদানের পর নিরাপদ স্বাস্থ্য সুরক্ষায় ৯০ দিন স্বয়ংক্রিয়ভাবে বিরতি হিসাব করা হয়।
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
            <Smartphone className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 mb-1">PWA ও মোবাইল অ্যাপ রেডি</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            অফলাইন ক্যাশিং, ইনস্টল সুবিধা এবং দ্রুতগতির মোবাইল-ফার্স্ট আর্কিটেকচার।
          </p>
        </div>
      </div>

      {/* Developer Recognition Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>সফটওয়্যার ইঞ্জিনিয়ারিং ও সিস্টেম আর্কিটেকচার</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Lead Developer: <span className="text-red-400">MD. SAIDUL ISLAM</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            বরিশাল রক্ত একটি পূর্ণাঙ্গ প্রোডাকশন-রেডি ডিজিটাল ব্লাড নেটওয়ার্ক। নিরাপদ রিলেশনাল ডেটাবেজ, পিডব্লিউএ অফলাইন সাপোর্ট এবং আধুনিক আরবিকিউ অথেনটিকেশনে সমৃদ্ধ।
          </p>
        </div>

        {onOpenDeveloperModal && (
          <button
            onClick={onOpenDeveloperModal}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs shadow-lg shadow-red-900/40 shrink-0 flex items-center gap-2 transition active:scale-95"
          >
            <Code2 className="w-4 h-4" />
            <span>ডেভেলপার প্রোফাইল ও বিস্তারিত</span>
          </button>
        )}
      </div>
    </div>
  );
};
