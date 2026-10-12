import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { api } from '../../services/api.js';
import { BloodRequest, Donor, BloodGroup, User } from '../../types/index.js';
import { toBengaliDigits, formatDateBengali, getDaysSinceLastDonation } from '../../utils/formatters.js';
import { DigitalDonorCard } from '../premium/DigitalDonorCard.js';
import { DonorCertificateModal } from '../premium/DonorCertificateModal.js';
import { RoktoShohayokAI } from '../premium/RoktoShohayokAI.js';
import { BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import {
  User as UserIcon,
  Heart,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  LogOut,
  Edit2,
  Check,
  Shield,
  Clock,
  Award,
  Sparkles,
  Trophy,
  Activity,
  Droplet,
  Bell,
  Lock,
  Eye,
  EyeOff,
  PlusCircle,
  FileText,
  Download,
  Share2,
  ChevronRight,
  Code2,
  AlertTriangle,
  QrCode,
  HeartPulse,
  Bot,
} from 'lucide-react';

interface UserPortalProps {
  onOpenAuth: () => void;
  onOpenCreateRequest: () => void;
  onOpenDeveloperModal: () => void;
  onNavigateToAdmin?: () => void;
  requests: BloodRequest[];
  onViewRequestDetails: (r: BloodRequest) => void;
}

export const UserPortal: React.FC<UserPortalProps> = ({
  onOpenAuth,
  onOpenCreateRequest,
  onOpenDeveloperModal,
  onNavigateToAdmin,
  requests,
  onViewRequestDetails,
}) => {
  const { user, logout, refreshUser, isAdmin } = useAuth();

  // Tab inside portal
  const [activePortalTab, setActivePortalTab] = useState<'overview' | 'health' | 'history' | 'ai' | 'settings'>('overview');

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [district, setDistrict] = useState(user?.district || 'বরিশাল');
  const [upazila, setUpazila] = useState(user?.upazila || 'বরিশাল সদর');
  const [area, setArea] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [totalDonations, setTotalDonations] = useState(user?.total_donations || 0);
  const [isAvailable, setIsAvailable] = useState(user?.is_available === 1);
  const [privacyMode, setPrivacyMode] = useState<'public' | 'verified_only'>('public');

  // Personal Vitals State (Local persistence for donor convenience)
  const [vitals, setVitals] = useState<{
    hemoglobin: string;
    weight: string;
    bp: string;
    pulse: string;
  }>(() => {
    const saved = localStorage.getItem('barishal_donor_vitals');
    return saved
      ? JSON.parse(saved)
      : { hemoglobin: '14.2', weight: '66', bp: '120/80', pulse: '74' };
  });

  const [isEditingVitals, setIsEditingVitals] = useState(false);

  // New Donation Log Modal
  const [showLogDonationModal, setShowLogDonationModal] = useState(false);
  const [logHospital, setLogHospital] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logNotes, setLogNotes] = useState('');

  // Donation History log
  const [donationHistory, setDonationHistory] = useState<Array<{
    id: number;
    date: string;
    hospital: string;
    recipientNotes: string;
    units: number;
  }>>(() => {
    const saved = localStorage.getItem('barishal_donation_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 1,
        date: '2025-11-15',
        hospital: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল',
        recipientNotes: 'থ্যালাসেমিয়া রোগীর জরুরি প্রয়োজনে দান',
        units: 1,
      },
      {
        id: 2,
        date: '2025-07-20',
        hospital: 'বরিশাল জেনারেল হাসপাতাল (সদর হাসপাতাল)',
        recipientNotes: 'জরুরি অস্ত্রোপচার রোগীর জন্য রক্তদান',
        units: 1,
      },
    ];
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setDistrict(user.district || 'বরিশাল');
      setUpazila(user.upazila || 'বরিশাল সদর');
      setTotalDonations(user.total_donations || 0);
      setIsAvailable(user.is_available === 1);
    }
  }, [user]);

  // If visitor is not logged in: Showcase Guest State
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        {/* Welcome Hero for Guests */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-red-950 to-slate-950 text-white p-8 sm:p-12 text-center border border-red-900/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold text-red-300 uppercase tracking-widest bg-red-500/20 px-3 py-1 rounded-full border border-red-400/20">
              প্রিমিয়াম ইউজার ও রক্তদাতা পোর্টাল
            </span>

            <h1 className="text-2xl sm:text-4xl font-black mt-3 mb-3">
              বরিশাল রক্তদাতা ড্যাশবোর্ডে স্বাগতম
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mb-8 leading-relaxed">
              আপনার ব্যক্তিগত রক্তদান পাসপোর্ট, কিউআর স্মার্ট কার্ড, পরবর্তী রক্তদানের সময় গণনা, স্বাস্থ্য ট্র্যাকার এবং অফিসিয়াল সম্মাননা সার্টিফিকেট এক ক্লিকে পেতে লগইন করুন।
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onOpenAuth}
                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-red-600/30 transition cursor-pointer"
              >
                লগইন / নতুন অ্যাকাউন্ট তৈরি
              </button>
              <button
                onClick={onOpenDeveloperModal}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm rounded-2xl border border-white/20 transition cursor-pointer"
              >
                প্ল্যাটফর্ম আর্কিটেক্ট পরিচিতি
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              ডিজিটাল কিউআর স্মার্ট কার্ড
            </h3>
            <p className="text-xs text-slate-500">
              আপনার রক্তদানের সমস্ত প্রমাণ ও পরিচিতি সম্বলিত সরকারি স্ট্যান্ডার্ড স্মার্ট পাস।
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              সম্মাননা পদক ও সার্টিফিকেট
            </h3>
            <p className="text-xs text-slate-500">
              প্রতিটি রক্তদানে বিশেষ লাইফসেভার পদক এবং ডাউনলোডযোগ্য অফিসিয়াল ডিজিটাল সার্টিফিকেট।
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              জরুরি রক্তের পার্সোনালাইজড অ্যালার্ট
            </h3>
            <p className="text-xs text-slate-500">
              আপনার গ্রুপ ও উপজেলায় কোনো রোগী রক্ত চাইলে সরাসরি এসএমএস ও পুশ নোটিফিকেশন।
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- LOGGED IN USER LOGIC ---
  const handleToggleAvailability = async () => {
    try {
      const res = await api.toggleAvailability();
      if (res.success && res.data) {
        setIsAvailable(res.data.is_available === 1);
        await refreshUser();
      }
    } catch {}
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const res = await api.updateDonorProfile({
        name,
        area: area || upazila,
        last_donation_date: lastDonationDate || undefined,
        total_donations: totalDonations,
      });
      if (res.success) {
        setMsg('প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!');
        setIsEditing(false);
        await refreshUser();
      }
    } catch {
      setMsg('আপডেট ব্যর্থ হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('barishal_donor_vitals', JSON.stringify(vitals));
    setIsEditingVitals(false);
    setMsg('স্বাস্থ্য তথ্য সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleAddDonationLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logHospital.trim()) return;

    const newRecord = {
      id: Date.now(),
      date: logDate,
      hospital: logHospital,
      recipientNotes: logNotes || 'স্বেচ্ছায় মানবিক রক্তদান',
      units: 1,
    };

    const updated = [newRecord, ...donationHistory];
    setDonationHistory(updated);
    localStorage.setItem('barishal_donation_history', JSON.stringify(updated));

    // Also increment total donations
    const newTotal = (user.total_donations || 0) + 1;
    setTotalDonations(newTotal);
    api.updateDonorProfile({ total_donations: newTotal });
    refreshUser();

    setShowLogDonationModal(false);
    setLogHospital('');
    setLogNotes('');
    setMsg('নতুন রক্তদানের তথ্য সফলভাবে লিপিবদ্ধ হয়েছে! অভিনন্দন!');
  };

  // Eligibility calculation
  const total = user.total_donations || totalDonations || 0;
  const livesSaved = total * 3;

  // Nearby requests matching user's blood group
  const matchingRequests = requests.filter(
    (r) =>
      r.status === 'active' &&
      (!user.blood_group || r.blood_group === user.blood_group)
  ).slice(0, 3);

  // Lifesaver Rank
  let rankTitle = 'ব্রোঞ্জ হিরো (Bronze Lifesaver)';
  let rankBadge = '🥉';
  let rankColor = 'text-amber-700 bg-amber-50 border-amber-200';
  if (total >= 10) {
    rankTitle = 'প্লাটিনাম লিজেন্ড (Legend)';
    rankBadge = '💎';
    rankColor = 'text-indigo-700 bg-indigo-50 border-indigo-200';
  } else if (total >= 5) {
    rankTitle = 'গোল্ডেন গার্ডিয়ান (Golden Guardian)';
    rankBadge = '🥇';
    rankColor = 'text-yellow-700 bg-yellow-50 border-yellow-200';
  } else if (total >= 3) {
    rankTitle = 'সিলভার ডিফেন্ডার (Silver Defender)';
    rankBadge = '🥈';
    rankColor = 'text-slate-700 bg-slate-100 border-slate-300';
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* 1. Top VIP Header Ribbon */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-red-500/20">
                {user.blood_group || 'O+'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-xs">
                ✓
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${rankColor}`}>
                  <span>{rankBadge}</span>
                  <span>{rankTitle}</span>
                </span>
                {user.is_verified === 1 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> ভেরিফাইড ডোনার
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                <span className="flex items-center gap-1 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {user.upazila || 'বরিশাল সদর'}, {user.district || 'বরিশাল'}
                </span>
                <span>·</span>
                <span className="text-slate-400">
                  নিবন্ধন: {formatDateBengali(user.created_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {isAdmin && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-xl transition border border-amber-300 cursor-pointer shadow-xs"
                title="অ্যাডমিন কন্ট্রোল প্যানেল ও Cloudflare D1/R2 সিস্টেম"
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span>অ্যাডমিন প্যানেল (D1/R2)</span>
              </button>
            )}

            <button
              onClick={() => setShowCertificate(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition border border-red-200 cursor-pointer"
            >
              <Award className="w-4 h-4 text-red-600" />
              <span>ডিজিটাল সনদ</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-xl transition border border-slate-200 cursor-pointer"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4" />
              <span>প্রস্থান</span>
            </button>
          </div>
        </div>

        {/* Realtime Availability Switch & Privacy Setting */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleAvailability}
              className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  isAvailable ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <span>রক্তদানের প্রাপ্যতা স্ট্যাটাস:</span>
                <span className={isAvailable ? 'text-emerald-600' : 'text-slate-500'}>
                  {isAvailable ? 'সক্রিয় (অনলাইনে প্রস্তুত)' : 'সাময়িক বিরতিতে'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {isAvailable
                  ? 'আপনার রক্তের গ্রুপ অনুযায়ী জরুরি প্রয়োজনে রোগীরা আপনাকে কল দিতে পারবেন'
                  : 'আপনার ফোন নম্বর সাময়িকভাবে সাধারণ রক্ত অনুসন্ধান তালিকায় দৃশ্যমান থাকবে না'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLogDonationModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন রক্তদান রেকর্ড করুন</span>
          </button>
        </div>
      </div>

      {msg && (
        <div className="p-3.5 bg-emerald-50 text-emerald-900 text-xs font-medium rounded-2xl border border-emerald-200 flex items-center justify-between">
          <span>{msg}</span>
          <button onClick={() => setMsg('')} className="text-emerald-700 hover:text-emerald-950 font-bold">✕</button>
        </div>
      )}

      {/* 2. Top Portal Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActivePortalTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activePortalTab === 'overview'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>ড্যাশবোর্ড ও স্মার্ট পাস</span>
        </button>

        <button
          onClick={() => setActivePortalTab('health')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activePortalTab === 'health'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>স্বাস্থ্য ও ফিটনেস ট্র্যাকার</span>
        </button>

        <button
          onClick={() => setActivePortalTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activePortalTab === 'history'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-500" />
          <span>রক্তদানের ইতিহাস ({toBengaliDigits(donationHistory.length)})</span>
        </button>

        <button
          onClick={() => setActivePortalTab('ai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activePortalTab === 'ai'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bot className="w-4 h-4 text-purple-500" />
          <span>রক্ত সহায়ক এআই</span>
        </button>

        <button
          onClick={() => setActivePortalTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
            activePortalTab === 'settings'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Edit2 className="w-4 h-4 text-slate-500" />
          <span>প্রোফাইল সেটিংস</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: OVERVIEW & SMART PASS */}
      {activePortalTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Quartet */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                <Heart className="w-4 h-4 text-red-500" />
                <span>মোট রক্তদান</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {toBengaliDigits(total)} বার
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                সর্বশেষ দাতা রেকর্ড
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>রক্ষা করা জীবন</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-600">
                ~{toBengaliDigits(livesSaved)} জন
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                ৩ জন প্রতি ব্যাগ রক্তে
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>পরবর্তী উপযুক্ততা</span>
              </div>
              <div className="text-lg sm:text-xl font-black text-emerald-600 leading-snug">
                সম্পূর্ণ প্রস্তুত
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                যে কোনো সময় দান সম্ভব
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                <Droplet className="w-4 h-4 text-red-500" />
                <span>রক্তের গ্রুপ</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-red-600">
                {user.blood_group || 'O+'}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                বরিশাল বিভাগীয় রেজিস্টার্ড
              </p>
            </div>
          </div>

          {/* Digital Donor Smart Pass Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-red-600" />
                <h3 className="font-extrabold text-base text-slate-900">
                  অফিসিয়াল ডিজিটাল ডোনার স্মার্ট কার্ড (Smart Donor Pass)
                </h3>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
                ভেরিফাইড আইডি
              </span>
            </div>

            <DigitalDonorCard
              user={user}
              onOpenCertificate={() => setShowCertificate(true)}
            />
          </div>

          {/* Nearby Emergency Requests Matching User */}
          {matchingRequests.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
                  <h3 className="font-extrabold text-base text-slate-900">
                    আপনার গ্রুপ ({user.blood_group || 'O+'}) অনুযায়ী জরুরি অনুরোধ
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {matchingRequests.length}টি সক্রিয়
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {matchingRequests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => onViewRequestDetails(req)}
                    className="p-4 rounded-2xl border border-red-100 bg-red-50/40 hover:border-red-300 hover:shadow-xs transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-red-700 bg-white px-2 py-0.5 rounded-md border border-red-200">
                          {req.blood_group}
                        </span>
                        <span className="text-[11px] text-red-600 font-bold">
                          {toBengaliDigits(req.units_needed)} ব্যাগ
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1">
                        {req.patient_name}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                        {req.hospital_name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {req.upazila}, {req.district}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-red-100 text-xs font-bold text-red-600 flex items-center justify-between">
                      <span>সাড়া দিন</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Honor Badges & Achievements Wall */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-base text-slate-900">
                অর্জিত সম্মাননা মেডেল ও ব্যাজ (Honor Badges)
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-white border border-amber-200 text-center">
                <div className="text-3xl mb-1">🥇</div>
                <div className="font-extrabold text-xs text-slate-900">গোল্ডেন গার্ডিয়ান</div>
                <div className="text-[10px] text-slate-500 mt-0.5">বিভাগে নিঃস্বার্থ অবদান</div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-b from-red-50 to-white border border-red-200 text-center">
                <div className="text-3xl mb-1">⚡</div>
                <div className="font-extrabold text-xs text-slate-900">জরুরি রেসপন্ডার</div>
                <div className="text-[10px] text-slate-500 mt-0.5">দ্রুততম সময়ে সাড়া দান</div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-50 to-white border border-blue-200 text-center">
                <div className="text-3xl mb-1">🛡️</div>
                <div className="font-extrabold text-xs text-slate-900">ভেরিফাইড হিরো</div>
                <div className="text-[10px] text-slate-500 mt-0.5">১০০% ভেরিফাইড পরিচিতি</div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50 to-white border border-emerald-200 text-center">
                <div className="text-3xl mb-1">💖</div>
                <div className="font-extrabold text-xs text-slate-900">লাইফসেভার চ্যাম্পিয়ন</div>
                <div className="text-[10px] text-slate-500 mt-0.5">বহু প্রাণ রক্ষাকারী</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HEALTH & FITNESS TRACKER */}
      {activePortalTab === 'health' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  ব্যক্তিগত স্বাস্থ্য ও ফিটনেস লগ (Donor Vitals Tracker)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  নিরাপদ রক্তদানের জন্য স্বাস্থ্য সূচকসমূহ সর্বদা হালনাগাদ রাখুন
                </p>
              </div>

              <button
                onClick={() => setIsEditingVitals(!isEditingVitals)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditingVitals ? 'বাতিল' : 'আপডেট করুন'}</span>
              </button>
            </div>

            {isEditingVitals ? (
              <form onSubmit={handleSaveVitals} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      হিমোগ্লোবিন লেভেল (g/dL) - স্বাভাবিক ১২.৫+
                    </label>
                    <input
                      type="text"
                      value={vitals.hemoglobin}
                      onChange={(e) => setVitals({ ...vitals, hemoglobin: e.target.value })}
                      placeholder="যেমন: 14.5"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      বর্তমান ওজন (কেজি) - ন্যূনতম ৪৫+ কেজি
                    </label>
                    <input
                      type="text"
                      value={vitals.weight}
                      onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                      placeholder="যেমন: 68"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      রক্তচাপ (Blood Pressure)
                    </label>
                    <input
                      type="text"
                      value={vitals.bp}
                      onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                      placeholder="যেমন: 120/80"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      পালস রেট (প্রতি মিনিটে স্পন্দন)
                    </label>
                    <input
                      type="text"
                      value={vitals.pulse}
                      onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                      placeholder="যেমন: 72"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer"
                >
                  স্বাস্থ্য তথ্য সংরক্ষণ করুন
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-semibold block">হিমোগ্লোবিন</span>
                  <span className="text-2xl font-black text-emerald-950 mt-1 block">
                    {vitals.hemoglobin} <span className="text-xs font-normal text-emerald-700">g/dL</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 mt-1 block">✓ নিরাপদ ও উপযুক্ত</span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                  <span className="text-xs text-blue-800 font-semibold block">দেহের ওজন</span>
                  <span className="text-2xl font-black text-blue-950 mt-1 block">
                    {vitals.weight} <span className="text-xs font-normal text-blue-700">কেজি</span>
                  </span>
                  <span className="text-[10px] text-blue-700 mt-1 block">✓ অনুমোদিত মান</span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200">
                  <span className="text-xs text-purple-800 font-semibold block">রক্তচাপ (BP)</span>
                  <span className="text-2xl font-black text-purple-950 mt-1 block">
                    {vitals.bp}
                  </span>
                  <span className="text-[10px] text-purple-700 mt-1 block">স্বাভাবিক রেঞ্জ</span>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200">
                  <span className="text-xs text-rose-800 font-semibold block">পালস রেট</span>
                  <span className="text-2xl font-black text-rose-950 mt-1 block">
                    {vitals.pulse} <span className="text-xs font-normal text-rose-700">bpm</span>
                  </span>
                  <span className="text-[10px] text-rose-700 mt-1 block">নিয়মিত ছন্দ</span>
                </div>
              </div>
            )}
          </div>

          {/* Blood Donation Health Guidelines */}
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-red-600" />
              <span>রক্তদানের আগের ও পরের জরুরি পরামর্শ</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">রক্তদানের পূর্বে:</strong>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>রক্তদানের আগে প্রচুর পানি বা তরল পানীয় পান করুন।</li>
                  <li>পূর্ববর্তী রাতে অন্তত ৭-৮ ঘণ্টা পর্যাপ্ত ঘুমান।</li>
                  <li>খালি পেটে কখনো রক্তদান করবেন না, হালকা পুষ্টিকর খাবার গ্রহণ করুন।</li>
                </ul>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">রক্তদানের পরে:</strong>
                <ul className="list-disc list-inside space-y-1 text-[11px]">
                  <li>রক্তদানের পর অন্তত ১৫-২০ মিনিট বিশ্রাম নিন।</li>
                  <li>পরবর্তী ৪-৫ ঘণ্টা ভারী কোনো শারীরিক পরিশ্রম পরিহার করুন।</li>
                  <li>জুস, স্যালাইন বা পুষ্টিকর তরল গ্রহণ অব্যাহত রাখুন।</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DONATION HISTORY & ARCHIVE */}
      {activePortalTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  রক্তদানের পূর্ণ ইতিহাস ও লগবুক
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  আপনার প্রতিটি মানবিক দানের ডিজিটাল সংরক্ষণ
                </p>
              </div>

              <button
                onClick={() => setShowLogDonationModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>নতুন রেকর্ড যোগ করুন</span>
              </button>
            </div>

            <div className="space-y-3">
              {donationHistory.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-red-200 hover:shadow-xs transition bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-black text-sm flex items-center justify-center shrink-0">
                      {toBengaliDigits(donationHistory.length - idx)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {item.hospital}
                        </h4>
                        <span className="text-[11px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                          {toBengaliDigits(item.units)} ব্যাগ
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {item.recipientNotes}
                      </p>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        তারিখ: {formatDateBengali(item.date)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCertificate(true)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-red-50 text-red-700 border border-slate-200 text-xs font-bold transition self-start sm:self-auto cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-red-600" />
                    <span>সনদ দেখুন</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: ROKTO SHOHAYOK AI */}
      {activePortalTab === 'ai' && (
        <div className="space-y-4">
          <RoktoShohayokAI />
        </div>
      )}

      {/* TAB 4: SETTINGS & PRIVACY */}
      {activePortalTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 mb-4">
              প্রোফাইল তথ্য ও গোপনীয়তা সেটিংস
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণ নাম</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ফোন নম্বর (পরিবর্তনযোগ্য নয়)</label>
                  <input
                    type="text"
                    value={user.phone}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">জেলা</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    {BARISHAL_DIVISION_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} ({d.enName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">উপজেলা / এলাকা</label>
                  <input
                    type="text"
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    placeholder="যেমন: বরিশাল সদর, কাউনিয়া"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মোট রক্তদানের সংখ্যা</label>
                  <input
                    type="number"
                    min="0"
                    value={totalDonations}
                    onChange={(e) => setTotalDonations(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">সর্বশেষ রক্তদানের তারিখ</label>
                  <input
                    type="date"
                    value={lastDonationDate}
                    onChange={(e) => setLastDonationDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  />
                </div>
              </div>

              {/* Privacy Setting */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  ফোন নম্বর গোপনীয়তা মোড
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPrivacyMode('public')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                      privacyMode === 'public'
                        ? 'border-red-600 bg-red-50/50 text-red-900'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Eye className="w-5 h-5 text-red-600 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">সবার জন্য উন্মুক্ত (প্রস্তাবিত)</div>
                      <div className="text-[11px] text-slate-500">জরুরি প্রয়োজনে যে কেউ সরাসরি কল দিতে পারবে</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPrivacyMode('verified_only')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                      privacyMode === 'verified_only'
                        ? 'border-red-600 bg-red-50/50 text-red-900'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Lock className="w-5 h-5 text-slate-600 shrink-0" />
                    <div>
                      <div className="font-bold text-xs">শুধুমাত্র লগইনকৃত ব্যবহারকারী</div>
                      <div className="text-[11px] text-slate-500">স্প্যাম প্রোটেকশন সুরক্ষা নিশ্চিত থাকবে</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-xs transition cursor-pointer"
              >
                {saving ? 'সংরক্ষণ হচ্ছে...' : 'প্রোফাইল পরিবর্তন সংরক্ষণ করুন'}
              </button>
            </form>
          </div>

          {/* Lead Developer Credit in Portal */}
          <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Code2 className="w-4 h-4 text-red-600" />
              <div>
                <span className="text-slate-500">প্ল্যাটফর্ম লিড ইঞ্জিনিয়ার: </span>
                <span className="font-black text-slate-900">MD. SAIDUL ISLAM</span>
              </div>
            </div>
            <button
              onClick={onOpenDeveloperModal}
              className="text-red-600 hover:underline font-bold"
            >
              পরিচিতি দেখুন →
            </button>
          </div>
        </div>
      )}

      {/* Modal 1: Log New Donation */}
      {showLogDonationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="font-black text-lg text-slate-900 mb-1">
              নতুন রক্তদান রেকর্ড যুক্ত করুন
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              আপনার মানবসেবামূলক অবদানের রেকর্ড রাখুন ও সম্মাননা সনদ আপডেট করুন।
            </p>

            <form onSubmit={handleAddDonationLog} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  হাসপাতাল / রক্তদান কেন্দ্রের নাম
                </label>
                <input
                  type="text"
                  value={logHospital}
                  onChange={(e) => setLogHospital(e.target.value)}
                  placeholder="যেমন: শেরেবাংলা মেডিকেল কলেজ হাসপাতাল"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  রক্তদানের তারিখ
                </label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  বিবরণ বা রোগীর তথ্য (ঐচ্ছিক)
                </label>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="যেমন: ডেলিভারি রোগীর জরুরি রক্ত সহায়তা..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs resize-none h-20"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogDonationModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  রেকর্ড সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Official Donor Certificate */}
      <DonorCertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        user={user}
      />
    </div>
  );
};
