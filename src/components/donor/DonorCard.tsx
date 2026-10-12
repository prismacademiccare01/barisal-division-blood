import React from 'react';
import { Donor } from '../../types/index.js';
import { toBengaliDigits, getDaysSinceLastDonation } from '../../utils/formatters.js';
import {
  MapPin,
  CheckCircle2,
  Phone,
  Clock,
  Heart,
  AlertTriangle,
  Lock,
  Award,
} from 'lucide-react';

interface DonorCardProps {
  donor: Donor;
  onCallClick: (donor: Donor) => void;
  onReportClick: (donor: Donor) => void;
  onViewProfile: (donor: Donor) => void;
  onViewCertificate?: (donor: Donor) => void;
}

export const DonorCard: React.FC<DonorCardProps> = ({
  donor,
  onCallClick,
  onReportClick,
  onViewProfile,
  onViewCertificate,
}) => {
  const donationStatus = getDaysSinceLastDonation(donor.last_donation_date);
  const isReady = donor.is_available === 1 && donationStatus.eligible;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Donor Identity & Status Indicator */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5">
            {/* Bold Blood Group Monogram */}
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200/60 flex flex-col items-center justify-center text-red-600 shrink-0">
              <span className="text-lg font-black leading-none">{donor.blood_group}</span>
              <span className="text-[8px] font-bold text-red-400 mt-0.5 tracking-wider">
                গ্রুপ
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3
                  onClick={() => onViewProfile(donor)}
                  className="font-bold text-slate-900 text-base hover:text-red-600 cursor-pointer transition-colors"
                >
                  {donor.name}
                </h3>
                {donor.is_verified === 1 && (
                  <span title="বরিশাল রক্ত ভেরিফাইড রক্তদাতা">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  </span>
                )}
              </div>

              {/* Location as Clean Unboxed Text */}
              <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  {donor.upazila}, {donor.district}
                  {donor.area ? ` · ${donor.area}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Availability Status: Quiet Dot + Text (No Clunky Pills) */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isReady ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
            <span className={`font-semibold text-[11px] ${isReady ? 'text-emerald-700' : 'text-slate-500'}`}>
              {isReady ? 'প্রস্তুত' : 'অনুপলব্ধ'}
            </span>
          </div>
        </div>

        {/* Quiet Metadata Row with Typographic Separator */}
        <div className="py-2.5 px-3 bg-slate-50/80 rounded-xl text-xs text-slate-600 border border-slate-100/80 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-slate-500">মোট দান:</span>
            <span className="font-bold text-slate-900 tabular-nums">
              {toBengaliDigits(donor.total_donations)} বার
            </span>
          </div>

          <span className="text-slate-300">·</span>

          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-600 truncate text-[11px]">
              {donor.last_donation_date ? donationStatus.message : 'পূর্বে দান করেননি'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onReportClick(donor)}
            className="text-slate-400 hover:text-red-500 p-2 rounded-lg transition-colors"
            title="রিপোর্ট করুন"
            aria-label="রিপোর্ট করুন"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>

          {onViewCertificate && (
            <button
              onClick={() => onViewCertificate(donor)}
              className="text-slate-400 hover:text-amber-600 p-2 rounded-lg transition-colors"
              title="ডিজিটাল সম্মাননা সনদ দেখুন"
              aria-label="ডিজিটাল সম্মাননা সনদ দেখুন"
            >
              <Award className="w-4 h-4 text-amber-500" />
            </button>
          )}
        </div>

        <button
          onClick={() => onCallClick(donor)}
          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all"
        >
          {donor.canDirectCall ? (
            <>
              <Phone className="w-3.5 h-3.5" />
              <span className="tabular-nums">যোগাযোগ: {donor.phone}</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-red-200" />
              <span>নম্বর দেখতে লগইন করুন ({donor.phone})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
