import React, { useState } from 'react';
import { BloodGroup, Donor, BloodRequest } from '../../types/index.js';
import { BLOOD_GROUPS, BARISHAL_DIVISION_DISTRICTS, getUpazilasForDistrict } from '../../utils/locations.js';
import {
  Users,
  MapPin,
  Droplet,
  Flame,
  ShieldCheck,
  MessageSquare,
  Search,
  Sparkles,
  PhoneCall,
  HeartHandshake,
  BookOpen,
} from 'lucide-react';

interface BloodGroupCommunitiesProps {
  onCallDonor?: (donor: Donor) => void;
  onViewDonorProfile?: (donor: Donor) => void;
  donors: Donor[];
  requests: BloodRequest[];
  onOpenCreateRequest: () => void;
}

export const BloodGroupCommunities: React.FC<BloodGroupCommunitiesProps> = ({
  onCallDonor,
  onViewDonorProfile,
  donors,
  requests,
  onOpenCreateRequest,
}) => {
  const [activeGroup, setActiveGroup] = useState<BloodGroup>('O+');
  const [activeDistrict, setActiveDistrict] = useState<string>('বরিশাল');
  const [activeUpazila, setActiveUpazila] = useState<string>('বরিশাল সদর');
  const [mode, setMode] = useState<'blood_group' | 'area'>('blood_group');

  // Filter donors by blood group
  const groupDonors = donors.filter((d) => d.blood_group === activeGroup);
  // Filter active emergency requests for this blood group
  const groupRequests = requests.filter(
    (r) =>
      r.blood_group === activeGroup &&
      (r.emergency_level === 'critical' || r.emergency_level === 'urgent' || r.status === 'active' || r.status === 'pending')
  );

  // Area donors
  const upazilas = getUpazilasForDistrict(activeDistrict);
  const areaDonors = donors.filter(
    (d) => d.district === activeDistrict && (activeUpazila === 'all' || d.upazila === activeUpazila)
  );

  const bloodGroupDietTips: Record<BloodGroup, string> = {
    'A+': 'উদ্ভিজ্জ প্রোটিন, সবুজ শাকসবজি ও ফলমূল বেশি খান। আয়রনের ঘাটতি রোধে খেজুর ও কাজুবাদাম উপকারী।',
    'A-': 'পর্যাপ্ত পানি ও সাইট্রাস ফ্রুট গ্রহণ করুন যা হিমোগ্লোবিনের আয়রন শোষণ ত্বরান্বিত করে।',
    'B+': 'দুগ্ধজাত খাবার, ডিম, মুরগির মাংস ও তাজা সবজি আপনার শক্তির প্রধান উৎস।',
    'B-': 'নিয়মিত পুষ্টিকর খাদ্য ও পর্যাপ্ত ঘুম রক্ত পুনরুৎপাদনে সহায়তা করে।',
    'AB+': 'মিশ্র সুষম খাদ্য, ডালিম, সামুদ্রিক মাছ ও রঙিন শাকসবজি নিয়মিত খান।',
    'AB-': 'রেয়ার ব্লাড গ্রুপ হিসেবে ৯০ দিন পর পর সুস্থতা নিশ্চিত করে রক্তদান সমাজকে রক্ষা করে।',
    'O+': 'সর্বজনীন ডোনার! উচ্চ প্রোটিনযুক্ত খাবার যেমন মাছ, ডাল ও পালংশাক নিয়মিত রাখুন।',
    'O-': 'ইউনিভার্সাল এমার্জেন্সি সেভার! আপনার এক ব্যাগ রক্ত যেকোনো মানুষের জীবন রক্ষায় প্রযোজ্য।',
  };

  return (
    <div className="space-y-6">
      {/* Top Toggle: Blood Group Communities vs Area Communities */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            বরিশাল রক্ত কমিউনিটি হাব
          </h3>
          <p className="text-xs text-slate-500">
            রক্তের গ্রুপভিত্তিক ও এলাকাভিত্তিক স্বতন্ত্র নেটওয়ার্ক ও সেবাদান
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setMode('blood_group')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl transition cursor-pointer ${
              mode === 'blood_group'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🩸 রক্তের গ্রুপ কমিউনিটি
          </button>
          <button
            onClick={() => setMode('area')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl transition cursor-pointer ${
              mode === 'area'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📍 উপজেলা ও এলাকাভিত্তিক
          </button>
        </div>
      </div>

      {/* MODE 1: Blood Group Communities (A+, A-, B+, B-, AB+, AB-, O+, O-) */}
      {mode === 'blood_group' && (
        <div className="space-y-6">
          {/* Blood Group Tabs */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {BLOOD_GROUPS.map((bg) => {
              const count = donors.filter((d) => d.blood_group === bg).length;
              const isSelected = activeGroup === bg;
              return (
                <button
                  key={bg}
                  onClick={() => setActiveGroup(bg)}
                  className={`p-3 rounded-2xl flex flex-col items-center justify-center transition border cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-500/20 scale-105 font-black'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-base font-black">{bg}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-red-100' : 'text-slate-400'}`}>
                    {count} ডোনার
                  </span>
                </button>
              );
            })}
          </div>

          {/* Group Overview Banner */}
          <div className="bg-gradient-to-r from-red-900 via-rose-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-black">
                    Official Community
                  </span>
                  <span className="text-xs text-white/70">বরিশাল বিভাগ</span>
                </div>
                <h2 className="text-2xl font-black">{activeGroup} ব্লাড গ্রুপ কমিউনিটি</h2>
                <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
                  {bloodGroupDietTips[activeGroup]}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenCreateRequest}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5" />
                  {activeGroup} জরুরি আবেদন
                </button>
              </div>
            </div>
          </div>

          {/* Active Emergency Requests for this group */}
          {groupRequests.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-red-700 flex items-center gap-1.5">
                <Flame className="w-4 h-4 animate-pulse" />
                {activeGroup} রক্তের জরুরি আবেদনসমূহ
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {groupRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start justify-between text-xs"
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black">
                        {req.blood_group} জরুরি
                      </span>
                      <p className="font-bold text-slate-900 mt-1.5">{req.hospital_name}</p>
                      <p className="text-[11px] text-slate-600">{req.district}, {req.upazila}</p>
                    </div>
                    <span className="font-black text-rose-700 text-sm">{req.units_needed} ব্যাগ</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Donors list inside this blood group */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900">
                নিবন্ধিত {activeGroup} রক্তদাতাগণ ({groupDonors.length} জন)
              </h4>
              <span className="text-[11px] text-slate-500">গোপনীয়তা নিশ্চিত ও সুরক্ষিত</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {groupDonors.map((d) => (
                <div
                  key={d.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-black text-sm flex items-center justify-center">
                      {d.blood_group}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{d.name}</h5>
                      <p className="text-[11px] text-slate-500">{d.district}, {d.upazila}</p>
                      <span className="text-[10px] text-emerald-600 font-medium">
                        {d.total_donations} বার রক্তদান
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onViewDonorProfile && (
                      <button
                        onClick={() => onViewDonorProfile(d)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition"
                        title="প্রোফাইল দেখুন"
                      >
                        প্রোফাইল
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: Area-Based Community (Barishal: Sadar, Babuganj, Bakerganj, Wazirpur, Gournadi, etc.) */}
      {mode === 'area' && (
        <div className="space-y-6">
          {/* District & Upazila Selectors */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">জেলা নির্বাচন</label>
              <select
                value={activeDistrict}
                onChange={(e) => {
                  setActiveDistrict(e.target.value);
                  const firstUp = getUpazilasForDistrict(e.target.value)[0];
                  setActiveUpazila(firstUp || 'all');
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
              >
                {BARISHAL_DIVISION_DISTRICTS.map((dst) => (
                  <option key={dst.name} value={dst.name}>{dst.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">উপজেলা নির্বাচন</label>
              <select
                value={activeUpazila}
                onChange={(e) => setActiveUpazila(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-xs"
              >
                <option value="all">সকল উপজেলা</option>
                {upazilas.map((up) => (
                  <option key={up} value={up}>{up}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Area Summary Banner */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                উপজেলা নেটওয়ার্ক
              </span>
              <h3 className="text-xl font-black mt-0.5">
                {activeDistrict} — {activeUpazila === 'all' ? 'সমগ্র জেলা' : activeUpazila}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                * ব্যবহারকারীর নির্দিষ্ট বাড়ি/বাসা কখনো প্রকাশ করা হয় না। শুধুমাত্র এলাকাভিত্তিক সুরক্ষিত সংযোগ বজায় রাখা হয়।
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-red-400">{areaDonors.length}</span>
              <p className="text-[10px] text-slate-400">অ্যাক্টিভ রক্তদাতা</p>
            </div>
          </div>

          {/* Donors in this area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {areaDonors.map((d) => (
              <div
                key={d.id}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs text-slate-900">{d.name}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-black">
                      {d.blood_group}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{d.upazila}</p>
                </div>

                {onViewDonorProfile && (
                  <button
                    onClick={() => onViewDonorProfile(d)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    প্রোফাইল
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
