import React, { useState } from 'react';
import { DonorReputationProfile, SocialPost, BloodGroup } from '../../types/index.js';
import { SocialStorageService } from '../../services/socialData.js';
import { DonorCertificateModal } from '../premium/DonorCertificateModal.js';
import {
  X,
  ShieldCheck,
  Award,
  Heart,
  Droplet,
  MapPin,
  Calendar,
  MessageSquare,
  UserPlus,
  UserCheck,
  Share2,
  TrendingUp,
  Flame,
  CheckCircle2,
  FileText,
  Star,
  Users,
} from 'lucide-react';

interface PremiumDonorProfileModalProps {
  onClose: () => void;
  onOpenMessage?: (donorId: string | number) => void;
  profileData?: DonorReputationProfile;
}

export const PremiumDonorProfileModal: React.FC<PremiumDonorProfileModalProps> = ({
  onClose,
  onOpenMessage,
  profileData,
}) => {
  const profile = profileData || SocialStorageService.getReputation();
  const [activeTab, setActiveTab] = useState<'posts' | 'donations' | 'impact' | 'badges' | 'certificates'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(profile.followers_count || 489);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
  };

  const donorTierColors = {
    Bronze: 'from-amber-600 to-amber-700 text-amber-100',
    Silver: 'from-slate-400 to-slate-500 text-white',
    Golden: 'from-amber-400 to-yellow-500 text-amber-950',
    Platinum: 'from-cyan-400 to-blue-600 text-white',
  }[profile.level || 'Golden'];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* Cover Photo */}
          <div className="relative h-44 sm:h-52 w-full bg-gradient-to-r from-red-800 to-rose-900 overflow-hidden">
            <img
              src={
                profile.cover_url ||
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80'
              }
              alt="Cover"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Level Tier Badge in cover */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-lg bg-gradient-to-r ${donorTierColors}`}
              >
                🏆 {profile.level} Donor Level
              </span>
            </div>
          </div>

          {/* Profile Header info */}
          <div className="px-6 pb-4 relative">
            {/* Avatar overlapping cover */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-14 mb-4 gap-3">
              <div className="relative inline-block">
                <img
                  src={
                    profile.avatar_url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                  }
                  alt={profile.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-white"
                />
                <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-red-600 text-white text-xs font-black flex items-center justify-center shadow-md ring-2 ring-white">
                  {profile.blood_group}
                </span>
              </div>

              {/* Action Buttons: Follow & Message */}
              <div className="flex items-center gap-2 pt-2 sm:pt-0">
                <button
                  onClick={handleToggleFollow}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isFollowing
                      ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (onOpenMessage) onOpenMessage(profile.id);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>
              </div>
            </div>

            {/* Name, Verified badge & Location */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{profile.name}</h2>
                {profile.is_verified_donor && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Donor
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  {profile.district}, {profile.upazila}
                </span>
                <span>•</span>
                <span className="font-bold text-red-600">রক্তের গ্রুপ: {profile.blood_group}</span>
              </div>

              {profile.bio && (
                <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-xl">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <p className="text-lg font-black text-red-600 leading-none">{profile.total_donations}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-1">রক্তদান সম্পন্ন</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <p className="text-lg font-black text-slate-800 leading-none">{profile.posts_count}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-1">কমিউনিটি পোস্ট</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <p className="text-lg font-black text-amber-600 leading-none">{profile.impact_score}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-1">Impact Score</p>
              </div>
              <div className="hidden sm:block bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <p className="text-lg font-black text-blue-600 leading-none">{followersCount}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-1">অনুসারী (Followers)</p>
              </div>
            </div>

            {/* Impact Score Visual Bar (Healthy Impact, not toxic competition) */}
            <div className="mt-4 p-3.5 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border border-red-200/70">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-extrabold text-red-900 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                  Donor Impact Score
                </span>
                <span className="font-black text-red-600 text-sm">{profile.impact_score} / ১০০০</span>
              </div>
              <div className="w-full h-3 bg-red-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-rose-600 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (profile.impact_score / 1000) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                * এই স্কোর স্বাস্থ্যসম্মত নিয়মিত রক্তদান, জরুরি সাড়া ও মানুষকে জীবন বাঁচাতে উদ্বুদ্ধকরণের প্রতীক।
              </p>
            </div>
          </div>

          {/* Profile Tabs: Posts | Donations | Impact | Badges | Certificates */}
          <div className="border-y border-slate-200 bg-slate-50 px-6 flex items-center gap-4 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-3 border-b-2 cursor-pointer transition whitespace-nowrap ${
                activeTab === 'posts'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              পোস্টসমূহ (Posts)
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              className={`py-3 border-b-2 cursor-pointer transition whitespace-nowrap ${
                activeTab === 'donations'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              রক্তদান হিস্ট্রি (Donations)
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`py-3 border-b-2 cursor-pointer transition whitespace-nowrap ${
                activeTab === 'impact'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              ইমপ্যাক্ট অ্যানালিটিক্স (Impact)
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`py-3 border-b-2 cursor-pointer transition whitespace-nowrap ${
                activeTab === 'badges'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              অর্জন ও ব্যাজ ({profile.badges.length})
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`py-3 border-b-2 cursor-pointer transition whitespace-nowrap ${
                activeTab === 'certificates'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              সার্টিফিকেট ভল্ট
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="p-6">
            {/* 1. Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                      🩸 Donation Story
                    </span>
                    <span className="text-[11px] text-slate-400">১০ অক্টোবর ২০২৬</span>
                  </div>
                  <h4 className="font-black text-sm text-slate-900 mb-1">
                    🩸 আজ ১২তম বার রক্তদান করলাম
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    আলহামদুলিল্লাহ! আজ বরিশাল সদর হাসপাতালে এক থ্যালাসেমিয়া আক্রান্ত শিশুর জন্য ১২তম বারের মতো O+ রক্তদান সম্পন্ন করলাম।
                  </p>
                </div>
              </div>
            )}

            {/* 2. Donations Tab */}
            {activeTab === 'donations' && (
              <div className="space-y-3">
                {[
                  { count: 12, hospital: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল', date: '১০ অক্টোবর ২০২৬', patient: 'থ্যালাসেমিয়া রোগী' },
                  { count: 11, hospital: 'বরিশাল জেনারেল (সদর) হাসপাতাল', date: '১৫ জুলাই ২০২৬', patient: 'জরুরি সার্জারি' },
                  { count: 10, hospital: 'দক্ষিণ অ্যাপোলো ডায়াগনস্টিক', date: '২০ এপ্রিল ২০২৬', patient: 'ডেঙ্গু প্লেটলেট' },
                ].map((item) => (
                  <div key={item.count} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-red-600 text-white font-black flex items-center justify-center">
                        #{item.count}
                      </span>
                      <div>
                        <p className="font-black text-slate-900">{item.hospital}</p>
                        <p className="text-[11px] text-slate-500">{item.patient}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">{item.date}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Impact Tab */}
            {activeTab === 'impact' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
                    <p className="text-2xl font-black text-red-600">{profile.emergency_responses}</p>
                    <p className="font-bold text-slate-700 mt-1">জরুরি সাড়াদান (Emergency Responses)</p>
                    <p className="text-[10px] text-slate-500 mt-1">সংকটকালে তাৎক্ষণিক সাড়া দিয়ে জীবন রক্ষা</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <p className="text-2xl font-black text-emerald-600">{profile.people_reached}+</p>
                    <p className="font-bold text-slate-700 mt-1">মানুষ উপকৃত (People Reached)</p>
                    <p className="text-[10px] text-slate-500 mt-1">সরাসরি ও পরোক্ষভাবে উপকৃত রোগীরা</p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Badges Tab */}
            {activeTab === 'badges' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.badges.map((b) => (
                  <div key={b.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <span className="text-2xl p-2 bg-white rounded-xl shadow-xs">{b.icon}</span>
                    <div>
                      <h5 className="font-black text-xs text-slate-900">{b.name}</h5>
                      <p className="text-[10px] text-slate-500">{b.description}</p>
                      <span className="text-[9px] text-slate-400 block mt-0.5">অর্জিত: {b.unlocked_at}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center space-y-3">
                <Award className="w-10 h-10 text-amber-600 mx-auto" />
                <h4 className="font-black text-sm text-slate-900">
                  বরিশাল বিভাগীয় অফিসিয়াল রক্তদাতা প্রশংসাপত্র
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  ১২তম সফল রক্তদানের স্বীকৃতি হিসেবে ডিজিটাল প্রশংসাপত্র ও ভেরিফিকেশন কিউআর কোড প্রস্তুত রয়েছে।
                </p>
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  সার্টিফিকেট ভিউ ও ডাউনলোড
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCertificateModal && (
        <DonorCertificateModal
          isOpen={true}
          donor={{
            id: Number(profile.id),
            user_id: Number(profile.id),
            name: profile.name,
            blood_group: profile.blood_group,
            gender: 'male',
            district: profile.district,
            upazila: profile.upazila,
            total_donations: profile.total_donations,
            is_available: 1,
            is_verified: 1,
            phone: '01700000000',
          }}
          onClose={() => setShowCertificateModal(false)}
        />
      )}
    </div>
  );
};
