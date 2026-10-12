import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { api } from '../../services/api.js';
import { toBengaliDigits, formatDateBengali, getDaysSinceLastDonation } from '../../utils/formatters.js';
import { DigitalDonorCard } from '../premium/DigitalDonorCard.js';
import { DonorCertificateModal } from '../premium/DonorCertificateModal.js';
import {
  User,
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
} from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, logout, refreshUser, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [area, setArea] = useState(user?.district || '');
  const [lastDonation, setLastDonation] = useState('');
  const [totalDonations, setTotalDonations] = useState(user?.total_donations || 0);
  const [isAvailable, setIsAvailable] = useState(user?.is_available === 1);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

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
        area,
        last_donation_date: lastDonation || undefined,
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

  const donationEligibility = getDaysSinceLastDonation(user?.created_at); // default check

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Premium Digital Donor Smart Card Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-red-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              ডিজিটাল রক্তদাতা স্মার্ট কার্ড (Digital Lifesaver Pass)
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
            অফিসিয়াল পাস
          </span>
        </div>
        <DigitalDonorCard user={user} onOpenCertificate={() => setShowCertificate(true)} />
      </div>

      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
              {user.blood_group || user.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                {user.is_verified === 1 && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> ভেরিফাইড
                  </span>
                )}
                {isAdmin && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                    <Shield className="w-3.5 h-3.5 text-amber-600" /> অ্যাডমিন
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}
                </span>
                {user.upazila && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {user.upazila}, {user.district}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition border border-red-100"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>

        {/* Availability Toggle Switch */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-slate-800">রক্তদানের প্রস্তুতি স্ট্যাটাস</h4>
            <p className="text-xs text-slate-500">
              {isAvailable
                ? 'অনুরোধ আসলে রক্তদাতাদের তালিকায় আপনি সক্রিয় হিসেবে দৃশ্যমান আছেন'
                : 'আপাতত আপনার নম্বর রক্তদানের জন্য অনুপলব্ধ থাকবে'}
            </p>
          </div>

          <button
            onClick={handleToggleAvailability}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                isAvailable ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Donation Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <Heart className="w-4 h-4 text-red-500" /> মোট রক্তদান
          </div>
          <span className="text-2xl font-black text-slate-900">
            {toBengaliDigits(user.total_donations || 0)} বার
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            প্রতিটি দানে বাঁচে তিনটি অমূল্য জীবন
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
            <Clock className="w-4 h-4 text-blue-500" /> রক্তের গ্রুপ
          </div>
          <span className="text-2xl font-black text-red-600">{user.blood_group || 'O+'}</span>
          <span className="text-[11px] text-slate-400 block mt-1">
            বরিশাল রক্ত ভেরিফাইড ডোনার
          </span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-sm">প্রোফাইল তথ্য সম্পাদন</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
          >
            <Edit2 className="w-3.5 h-3.5" />
            {isEditing ? 'বাতিল' : 'পরিবর্তন করুন'}
          </button>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 mb-4">
            {msg}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">পূর্ণ নাম</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">এলাকা / ঠিকানা</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="যেমন: নতুন বাজার, সদর রোড"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">মোট রক্তদান সংখ্যা</label>
                <input
                  type="number"
                  min="0"
                  value={totalDonations}
                  onChange={(e) => setTotalDonations(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">সর্বশেষ রক্তদানের তারিখ</label>
                <input
                  type="date"
                  value={lastDonation}
                  onChange={(e) => setLastDonation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition"
            >
              {saving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
            </button>
          </form>
        ) : (
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">অ্যাকাউন্টের ধরন:</span>
              <span className="font-semibold text-slate-800 capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">অবস্থান:</span>
              <span className="font-semibold text-slate-800">
                {user.upazila ? `${user.upazila}, ${user.district}` : 'বরিশাল সদর'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-400">নিবন্ধন তারিখ:</span>
              <span className="font-semibold text-slate-800">
                {formatDateBengali(user.created_at)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">অ্যাপ ডেভেলপার:</span>
              <span className="font-bold text-slate-900">MD. SAIDUL ISLAM</span>
            </div>
          </div>
        )}
      </div>

      {/* Official Certificate Modal */}
      <DonorCertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        user={user}
      />
    </div>
  );
};
