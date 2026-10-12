import React from 'react';
import { Donor } from '../../types/index.js';
import { toBengaliDigits, getDaysSinceLastDonation, formatDateBengali } from '../../utils/formatters.js';
import {
  X,
  MapPin,
  CheckCircle2,
  Phone,
  Heart,
  Calendar,
  User,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface DonorProfileModalProps {
  donor: Donor | null;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const DonorProfileModal: React.FC<DonorProfileModalProps> = ({
  donor,
  onClose,
  onOpenAuth,
}) => {
  if (!donor) return null;

  const donationStatus = getDaysSinceLastDonation(donor.last_donation_date);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-black/10 hover:bg-black/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white text-red-600 flex flex-col items-center justify-center font-black shadow-lg">
              <span className="text-2xl leading-none">{donor.blood_group}</span>
              <span className="text-[10px] font-bold text-red-400">রক্তের গ্রুপ</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{donor.name}</h2>
                {donor.is_verified === 1 && (
                  <CheckCircle2 className="w-4 h-4 text-white fill-blue-500" />
                )}
              </div>
              <p className="text-red-100 text-xs mt-0.5">
                {donor.upazila}, {donor.district}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1">মোট রক্তদান</span>
              <span className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-red-500" />
                {toBengaliDigits(donor.total_donations)} বার
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 block mb-1">প্রস্তুতি স্ট্যাটাস</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
                  donor.is_available === 1 && donationStatus.eligible
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {donor.is_available === 1 && donationStatus.eligible
                  ? 'রক্তদানে প্রস্তুত'
                  : 'আপাতত অনুপলব্ধ'}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> সর্বশেষ রক্তদানের তারিখ:
              </span>
              <span className="font-semibold">{formatDateBengali(donor.last_donation_date)}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> লিঙ্গ ও বয়স:
              </span>
              <span className="font-semibold">
                {donor.gender === 'female' ? 'মহিলা' : 'পুরুষ'}
                {donor.age ? `, ${toBengaliDigits(donor.age)} বছর` : ''}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> ঠিকানা:
              </span>
              <span className="font-semibold text-right max-w-56 truncate">
                {donor.address || donor.area || `${donor.upazila}, ${donor.district}`}
              </span>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            {donor.canDirectCall ? (
              <a
                href={`tel:${donor.phone}`}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold shadow-md shadow-emerald-600/20 transition active:scale-98"
              >
                <Phone className="w-4 h-4" />
                <span>সরাসরি কল করুন ({donor.phone})</span>
              </a>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl font-bold shadow-md shadow-red-600/20 transition active:scale-98"
              >
                <Lock className="w-4 h-4" />
                <span>ফোন নম্বর দেখতে লগইন করুন ({donor.phone})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
