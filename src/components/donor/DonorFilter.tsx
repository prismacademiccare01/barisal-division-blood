import React from 'react';
import {
  BARISHAL_DIVISION_DISTRICTS,
  BLOOD_GROUPS,
  getUpazilasForDistrict,
} from '../../utils/locations.js';
import { Search, MapPin, Filter, CheckCircle2 } from 'lucide-react';

interface DonorFilterProps {
  selectedBloodGroup: string;
  onSelectBloodGroup: (bg: string) => void;
  selectedDistrict: string;
  onSelectDistrict: (dist: string) => void;
  selectedUpazila: string;
  onSelectUpazila: (up: string) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onlyAvailable: boolean;
  onToggleOnlyAvailable: () => void;
  onlyVerified: boolean;
  onToggleOnlyVerified: () => void;
}

export const DonorFilter: React.FC<DonorFilterProps> = ({
  selectedBloodGroup,
  onSelectBloodGroup,
  selectedDistrict,
  onSelectDistrict,
  selectedUpazila,
  onSelectUpazila,
  searchTerm,
  onSearchTermChange,
  onlyAvailable,
  onToggleOnlyAvailable,
  onlyVerified,
  onToggleOnlyVerified,
}) => {
  const upazilas = selectedDistrict ? getUpazilasForDistrict(selectedDistrict) : [];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 mb-6">
      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          placeholder="রক্তদাতার নাম, এলাকা বা উপজেলা দিয়ে খুঁজুন..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-red-500 focus:ring-2 focus:ring-red-100 transition"
        />
      </div>

      {/* Blood Group Selector (Horizontal scrolling pills) */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          রক্তের গ্রুপ নির্বাচন করুন:
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            onClick={() => onSelectBloodGroup('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedBloodGroup === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            সকল গ্রুপ
          </button>
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              onClick={() => onSelectBloodGroup(bg)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition ${
                selectedBloodGroup === bg
                  ? 'bg-red-600 text-white shadow-xs scale-105'
                  : 'bg-slate-100 text-slate-800 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* District & Upazila Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-500" /> জেলা
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => {
              onSelectDistrict(e.target.value);
              onSelectUpazila('all');
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-white"
          >
            <option value="all">বরিশাল বিভাগের সকল জেলা</option>
            {BARISHAL_DIVISION_DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.enName})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">উপজেলা / থানা</label>
          <select
            value={selectedUpazila}
            onChange={(e) => onSelectUpazila(e.target.value)}
            disabled={!selectedDistrict || selectedDistrict === 'all'}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-white disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="all">সকল উপজেলা</option>
            {upazilas.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters Toggle: Available only & Verified only */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={onToggleOnlyAvailable}
            className="w-4 h-4 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
          />
          <span className="font-semibold text-slate-700">শুধুমাত্র প্রস্তুত রক্তদাতা</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={onlyVerified}
            onChange={onToggleOnlyVerified}
            className="w-4 h-4 rounded text-red-600 focus:ring-red-500 accent-red-600 cursor-pointer"
          />
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> ভেরিফাইড রক্তদাতা
          </span>
        </label>
      </div>
    </div>
  );
};
