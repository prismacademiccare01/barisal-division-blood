import React, { useState } from 'react';
import { BloodGroup } from '../../types/index.js';
import { BLOOD_GROUPS } from '../../utils/locations.js';
import { Heart, ArrowRight, ShieldCheck, CheckCircle2, Info, Search } from 'lucide-react';

// Compatibility database
const COMPATIBILITY_DATA: Record<
  BloodGroup,
  {
    canGiveTo: BloodGroup[];
    canReceiveFrom: BloodGroup[];
    isUniversalDonor?: boolean;
    isUniversalRecipient?: boolean;
    note: string;
  }
> = {
  'O-': {
    canGiveTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    canReceiveFrom: ['O-'],
    isUniversalDonor: true,
    note: 'সার্বজনীন দাতা (Universal Donor) — যে কোনো গ্রুপের মুমূর্ষু রোগীকে তাৎক্ষণিকভাবে রক্ত দিতে পারেন। তবে নিজের প্রয়োজনে শুধুমাত্র O- রক্ত নিতে পারেন।',
  },
  'O+': {
    canGiveTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    note: 'সবচেয়ে বেশি ব্যবহৃত রক্তের গ্রুপ। সকল পজিটিভ গ্রুপের রোগীকে রক্ত দিতে সক্ষম।',
  },
  'A-': {
    canGiveTo: ['A+', 'A-', 'AB+', 'AB-'],
    canReceiveFrom: ['A-', 'O-'],
    note: 'বিরল নেগেটিভ গ্রুপের রক্ত। A ও AB উভয় গ্রুপের রোগীদের রক্ত দিতে পারেন।',
  },
  'A+': {
    canGiveTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    note: 'A+ ও AB+ রোগীদের রক্ত দিতে পারেন এবং ৪টি গ্রুপ থেকে রক্ত গ্রহণ করতে পারেন।',
  },
  'B-': {
    canGiveTo: ['B+', 'B-', 'AB+', 'AB-'],
    canReceiveFrom: ['B-', 'O-'],
    note: 'বিরল নেগেটিভ রক্তের গ্রুপ। B ও AB উভয় গ্রুপের রোগীদের রক্ত দিতে সক্ষম।',
  },
  'B+': {
    canGiveTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    note: 'বাংলাদেশে অন্যতম প্রচলিত গ্রুপ। B+ ও AB+ রোগীদের রক্ত দিতে পারেন।',
  },
  'AB-': {
    canGiveTo: ['AB+', 'AB-'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    note: 'অত্যন্ত বিরল রক্তের গ্রুপ। সকল নেগেটিভ রক্তের গ্রুপ থেকে রক্ত গ্রহণ করতে পারেন।',
  },
  'AB+': {
    canGiveTo: ['AB+'],
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    isUniversalRecipient: true,
    note: 'সার্বজনীন গ্রহীতা (Universal Recipient) — যে কোনো গ্রুপের রক্ত গ্রহণ করতে পারেন। তবে রক্ত দিতে পারেন শুধুমাত্র AB+ রোগীকে।',
  },
};

interface BloodCompatibilityMatrixProps {
  onSearchGroup?: (group: BloodGroup) => void;
}

export const BloodCompatibilityMatrix: React.FC<BloodCompatibilityMatrixProps> = ({
  onSearchGroup,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O+');
  const info = COMPATIBILITY_DATA[selectedGroup];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            রক্তের গ্রুপ মেলবন্ধন ও ম্যাচিং ক্যালকুলেটর
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            নিখুঁত বৈজ্ঞানিক নিয়মে জেনে নিন কে কাকে রক্ত দিতে এবং কার থেকে রক্ত নিতে পারে
          </p>
        </div>

        {info.isUniversalDonor && (
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-red-100 text-red-700 font-extrabold text-xs">
            🌟 সার্বজনীন রক্তদাতা (Universal Donor)
          </span>
        )}
        {info.isUniversalRecipient && (
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
            🌟 সার্বজনীন রক্তগ্রহীতা (Universal Recipient)
          </span>
        )}
      </div>

      {/* Select Group Pills */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          গ্রুপ নির্বাচন করুন:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`py-3 rounded-2xl font-black text-sm transition-all ${
                selectedGroup === bg
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105 ring-2 ring-red-400'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Compatibility Visualization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Can Give Blood To */}
        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{selectedGroup} রক্ত দিতে পারবে যাদেরকে:</span>
          </div>

          <div className="flex flex-wrap gap-2 my-3">
            {info.canGiveTo.map((bg) => (
              <span
                key={bg}
                className="px-3 py-1.5 rounded-xl bg-white text-emerald-800 border border-emerald-200 font-black text-xs shadow-xs"
              >
                {bg}
              </span>
            ))}
          </div>

          <p className="text-xs text-emerald-700">
            মোট {info.canGiveTo.length} টি গ্রুপের রোগীকে রক্ত প্রদান করা সম্ভব।
          </p>
        </div>

        {/* Can Receive Blood From */}
        <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200/80">
          <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm mb-2">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            <span>{selectedGroup} রক্ত নিতে পারবে যাদের কাছ থেকে:</span>
          </div>

          <div className="flex flex-wrap gap-2 my-3">
            {info.canReceiveFrom.map((bg) => (
              <span
                key={bg}
                className="px-3 py-1.5 rounded-xl bg-white text-rose-800 border border-rose-200 font-black text-xs shadow-xs"
              >
                {bg}
              </span>
            ))}
          </div>

          <p className="text-xs text-rose-700">
            মোট {info.canReceiveFrom.length} টি গ্রুপের রক্তদাতার কাছ থেকে রক্ত গ্রহণ নিরাপদ।
          </p>
        </div>
      </div>

      {/* Scientific Note & Action */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2 text-slate-600">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{info.note}</p>
        </div>

        {onSearchGroup && (
          <button
            onClick={() => onSearchGroup(selectedGroup)}
            className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{selectedGroup} রক্তদাতা খুঁজুন</span>
          </button>
        )}
      </div>
    </div>
  );
};
