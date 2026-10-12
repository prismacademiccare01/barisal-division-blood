import React from 'react';
import { BloodRequest } from '../../types/index.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  AlertCircle,
  Building2,
  Calendar,
  Clock,
  Phone,
  Heart,
  Users,
  CheckCircle,
  XCircle,
  HelpCircle,
  Share2,
} from 'lucide-react';

interface BloodRequestCardProps {
  request: BloodRequest;
  onRespondClick: (request: BloodRequest) => void;
  onViewDetails: (request: BloodRequest) => void;
  onShareClick?: (request: BloodRequest) => void;
  isLoggedIn: boolean;
}

export const BloodRequestCard: React.FC<BloodRequestCardProps> = ({
  request,
  onRespondClick,
  onViewDetails,
  onShareClick,
  isLoggedIn,
}) => {
  const isCritical = request.emergency_level === 'critical';
  const isUrgent = request.emergency_level === 'urgent';

  return (
    <div
      className={`rounded-2xl p-5 border transition-all duration-200 bg-white flex flex-col justify-between ${
        isCritical
          ? 'border-red-300 ring-1 ring-red-200/80 shadow-xs'
          : isUrgent
          ? 'border-amber-200/80 shadow-xs'
          : 'border-slate-200/80 shadow-xs'
      }`}
    >
      <div>
        {/* Header: Emergency Text Notice + Blood Units */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                isCritical
                  ? 'bg-red-600 animate-ping'
                  : isUrgent
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
            />
            <span
              className={
                isCritical
                  ? 'text-red-700 font-bold'
                  : isUrgent
                  ? 'text-amber-800 font-bold'
                  : 'text-slate-600 font-medium'
              }
            >
              {isCritical
                ? 'অতি জরুরি (Critical)'
                : isUrgent
                ? 'জরুরি প্রয়োজন (Urgent)'
                : 'সাধারণ রক্তের আবেদন'}
            </span>
            {request.case_info && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500">{request.case_info}</span>
              </>
            )}
          </div>

          <span className="text-xs font-bold text-red-600 tabular-nums">
            {toBengaliDigits(request.units_needed)} ব্যাগ প্রয়োজন
          </span>
        </div>

        {/* Main Info: Patient Name & Blood Group */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3
              onClick={() => onViewDetails(request)}
              className="text-base sm:text-lg font-bold text-slate-900 hover:text-red-600 cursor-pointer transition-colors leading-snug"
            >
              রোগী: {request.patient_name}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-800">{request.hospital_name}</span>
              <span className="text-slate-400">({request.upazila}, {request.district})</span>
            </div>
          </div>

          {/* Blood Group Monogram */}
          <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex flex-col items-center justify-center font-black shadow-xs shrink-0">
            <span className="text-xl leading-none">{request.blood_group}</span>
            <span className="text-[8px] font-bold text-red-100 tracking-wider mt-0.5">রক্ত</span>
          </div>
        </div>

        {/* Ward/Location text if available */}
        {request.location_details && (
          <p className="text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl mb-3 border border-slate-100/80">
            <span className="font-semibold text-slate-700">স্থান:</span> {request.location_details}
          </p>
        )}

        {/* Date & Time metadata */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            <span>{request.needed_date}</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{request.needed_time}</span>
          </span>
        </div>

        {/* Additional note */}
        {request.additional_notes && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 italic">
            "{request.additional_notes}"
          </p>
        )}

        {/* Responses counter & my response */}
        <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100 text-slate-600">
          <div
            onClick={() => onViewDetails(request)}
            className="flex items-center gap-1.5 hover:text-red-600 cursor-pointer font-medium"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="tabular-nums">
              {toBengaliDigits(request.accepted_count || 0)} জন রক্তদাতা সম্মত হয়েছেন
            </span>
          </div>

          {request.my_response && (
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              {request.my_response === 'accepted' ? (
                <>
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> আপনি সম্মত আছেন
                </>
              ) : request.my_response === 'declined' ? (
                <>
                  <XCircle className="w-3 h-3 text-rose-500" /> অসম্মতি দিয়েছেন
                </>
              ) : (
                <>
                  <HelpCircle className="w-3 h-3 text-amber-500" /> পরে জানাবেন
                </>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <a
          href={`tel:${request.contact_phone}`}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-50 font-bold text-xs transition"
          title="যোগাযোগ করুন"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-600" />
          <span>কল করুন</span>
        </a>

        {onShareClick && (
          <button
            onClick={() => onShareClick(request)}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="শেয়ার করুন"
            aria-label="শেয়ার করুন"
          >
            <Share2 className="w-4 h-4 text-slate-700" />
          </button>
        )}

        <button
          onClick={() => onRespondClick(request)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition"
        >
          <Heart className="w-3.5 h-3.5 fill-white" />
          <span>রক্ত দিতে ইচ্ছুক</span>
        </button>

        <button
          onClick={() => onViewDetails(request)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
        >
          বিস্তারিত
        </button>
      </div>
    </div>
  );
};
