import React, { useState } from 'react';
import { BloodGroup } from '../../types/index.js';
import { BLOOD_GROUPS, BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Heart,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Phone,
  HelpCircle,
} from 'lucide-react';

interface ThalassemiaPatient {
  id: number;
  patientName: string;
  age: number;
  bloodGroup: BloodGroup;
  intervalDays: number; // e.g. 21 days or 30 days
  nextDue: string;
  hospital: string;
  district: string;
  guardianPhone: string;
  buddiesCount: number;
  neededBuddies: number;
}

export const ThalassemiaBuddyNetwork: React.FC = () => {
  const [patients, setPatients] = useState<ThalassemiaPatient[]>([
    {
      id: 1,
      patientName: 'আরিয়ান আহমেদ (৭ বছর)',
      age: 7,
      bloodGroup: 'B+',
      intervalDays: 25,
      nextDue: '2026-10-18',
      hospital: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল',
      district: 'বরিশাল',
      guardianPhone: '০১৭১১-২২৩৩৪৪',
      buddiesCount: 2,
      neededBuddies: 3,
    },
    {
      id: 2,
      patientName: 'জান্নাতুল মাওয়া (১১ বছর)',
      age: 11,
      bloodGroup: 'O+',
      intervalDays: 30,
      nextDue: '2026-10-22',
      hospital: 'পটুয়াখালী ২৫০ শয্যা হাসপাতাল',
      district: 'পটুয়াখালী',
      guardianPhone: '০১৮২২-৩৩৪৪৫৫',
      buddiesCount: 3,
      neededBuddies: 3,
    },
    {
      id: 3,
      patientName: 'তানভীর ইসলাম (৫ বছর)',
      age: 5,
      bloodGroup: 'A+',
      intervalDays: 21,
      nextDue: '2026-10-15',
      hospital: 'ভোলা জেলা সদর হাসপাতাল',
      district: 'ভোলা',
      guardianPhone: '০১৯৩৩-৪৫৫৫৬৬',
      buddiesCount: 1,
      neededBuddies: 3,
    },
  ]);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newAge, setNewAge] = useState(8);
  const [newBloodGroup, setNewBloodGroup] = useState<BloodGroup>('O+');
  const [newInterval, setNewInterval] = useState(25);
  const [newHospital, setNewHospital] = useState('শেরেবাংলা মেডিকেল কলেজ হাসপাতাল');
  const [newDistrict, setNewDistrict] = useState('বরিশাল');
  const [newPhone, setNewPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName || !newPhone) return;

    const newRecord: ThalassemiaPatient = {
      id: Date.now(),
      patientName: `${newPatientName} (${toBengaliDigits(newAge)} বছর)`,
      age: newAge,
      bloodGroup: newBloodGroup,
      intervalDays: newInterval,
      nextDue: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hospital: newHospital,
      district: newDistrict,
      guardianPhone: newPhone,
      buddiesCount: 0,
      neededBuddies: 3,
    };

    setPatients([newRecord, ...patients]);
    setShowRegisterModal(false);
    setNewPatientName('');
    setNewPhone('');
    setSuccessMsg('থ্যালাসেমিয়া রোগীর নিয়মিত ব্লাড কেয়ার সার্কেলে সফলভাবে নিবন্ধিত হয়েছে!');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleJoinAsBuddy = (patientId: number) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId ? { ...p, buddiesCount: Math.min(p.buddiesCount + 1, p.neededBuddies) } : p
      )
    );
    setSuccessMsg('ধন্যবাদ! আপনি এই নিয়মিত শিশু রোগীর ব্লাড বাডি স্কোয়াডে যুক্ত হয়েছেন।');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-rose-600" />
            <span>ফিচার ৩: নিয়মিত শিশু রোগী কেয়ার ও ডোনার সার্কেল</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            থ্যালাসেমিয়া ব্লাড বাডি নেটওয়ার্ক (Chronic Care)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            যেসব শিশুর প্রতি ২১–৩০ দিন পর পর রক্তের প্রয়োজন, তাদের জন্য ৩ জন স্থায়ী রক্তদাতার আবর্তিত স্কোয়াড
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন নিয়মিত রোগী নিবন্ধন</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-900 text-xs font-semibold rounded-2xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Concept Explanation Card */}
      <div className="bg-gradient-to-r from-rose-50 to-red-50 p-4 rounded-2xl border border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="font-extrabold text-rose-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>ব্লাড বাডি মডেল কী এবং কীভাবে কাজ করে?</span>
          </span>
          <p className="text-slate-600 text-[11px] leading-relaxed max-w-2xl">
            প্রতিটি শিশুর জন্য ৩ জন রক্তদাতার একটি স্থায়ী টিম গঠন করা হয়। প্রতি ৩ মাস পর পর পালাক্রমে ১ জন রক্ত দিলে সারা বছর শিশুর রক্তের কোনো অভাব হয় না এবং পরিবারকে প্রতি মাসে রক্তদাতার সন্ধানে দিশেহারা হতে হয় না।
          </p>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {patients.map((p) => {
          const isComplete = p.buddiesCount >= p.neededBuddies;
          return (
            <div
              key={p.id}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-rose-300 hover:shadow-xs transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-red-600 text-white font-black text-xs">
                    {p.bloodGroup} গ্রুপ
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    isComplete ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {p.buddiesCount}/{p.neededBuddies} জন বাডি যুক্ত
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                  {p.patientName}
                </h4>

                <p className="text-xs text-slate-600 mb-1">
                  🏥 {p.hospital}
                </p>

                <p className="text-[11px] text-slate-500 mb-2">
                  📍 {p.district} · রক্তদানের ব্যবধান: প্রতি {toBengaliDigits(p.intervalDays)} দিন
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 space-y-1 mb-3">
                  <div className="flex items-center justify-between">
                    <span>পরবর্তী রক্তের তারিখ:</span>
                    <strong className="text-rose-600">{p.nextDue}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>অভিভাবকের ফোন:</span>
                    <span className="font-mono font-bold">{p.guardianPhone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                {isComplete ? (
                  <div className="w-full py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>টিম পূর্ণ হয়েছে</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoinAsBuddy(p.id)}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    <span>বাডি হিসেবে যুক্ত হন</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 text-xs">
            <h3 className="font-black text-base text-slate-900 mb-1">
              নিয়মিত থ্যালাসেমিয়া রোগী নিবন্ধন
            </h3>
            <p className="text-slate-500 mb-4">
              বাচ্চাদের দীর্ঘমেয়াদী রক্ত সংকট নিরসনে স্থায়ী বাডি সার্কেল গড়ে তুলতে তথ্য দিন।
            </p>

            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">শিশুর পূর্ণ নাম</label>
                <input
                  type="text"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="যেমন: আরিয়ান আহমেদ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বয়স (বছর)</label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={newAge}
                    onChange={(e) => setNewAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
                  <select
                    value={newBloodGroup}
                    onChange={(e) => setNewBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">রক্তের ব্যবধান (দিন)</label>
                  <input
                    type="number"
                    min="15"
                    max="60"
                    value={newInterval}
                    onChange={(e) => setNewInterval(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">জেলা</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {BARISHAL_DIVISION_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">হাসপাতাল</label>
                <input
                  type="text"
                  value={newHospital}
                  onChange={(e) => setNewHospital(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">অভিভাবকের মোবাইল নম্বর</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="০১৭১২-৩৪৫৬৭৮"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition"
                >
                  নিবন্ধন করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
