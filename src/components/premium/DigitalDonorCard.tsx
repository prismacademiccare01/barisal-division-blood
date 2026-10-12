import React, { useRef } from 'react';
import { User, Donor } from '../../types/index.js';
import { toBengaliDigits, formatDateBengali } from '../../utils/formatters.js';
import { useToast } from '../../hooks/useToast.js';
import {
  ShieldCheck,
  Droplet,
  Heart,
  QrCode,
  Award,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
} from 'lucide-react';

interface DigitalDonorCardProps {
  user: User | null;
  donor?: Donor | null;
  onOpenCertificate?: () => void;
}

export const DigitalDonorCard: React.FC<DigitalDonorCardProps> = ({
  user,
  donor,
  onOpenCertificate,
}) => {
  const { showToast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  const totalDonations = donor?.total_donations || user.total_donations || 0;
  const livesSaved = totalDonations * 3;
  const bloodGroup = donor?.blood_group || user.blood_group || 'O+';
  const district = donor?.district || user.district || 'বরিশাল';
  const upazila = donor?.upazila || user.upazila || 'বরিশাল সদর';
  const isVerified = donor?.is_verified === 1 || user.is_verified === 1;

  // Donor Tier
  let tierName = 'ব্রোঞ্জ লাইফ-সেভার (Bronze)';
  let tierBadge = '🥉';
  let tierGradient = 'from-amber-700 via-amber-800 to-amber-950';
  let tierBorder = 'border-amber-500/40';

  if (totalDonations >= 15) {
    tierName = 'ডায়মন্ড চ্যাম্পিয়ন (Diamond)';
    tierBadge = '💎';
    tierGradient = 'from-sky-700 via-indigo-900 to-slate-950';
    tierBorder = 'border-sky-400/60 shadow-sky-500/20';
  } else if (totalDonations >= 8) {
    tierName = 'গোল্ড লাইফ-সেভার (Gold)';
    tierBadge = '🥇';
    tierGradient = 'from-yellow-600 via-amber-700 to-slate-950';
    tierBorder = 'border-yellow-400/60 shadow-yellow-500/20';
  } else if (totalDonations >= 4) {
    tierName = 'সিলভার লাইফ-সেভার (Silver)';
    tierBadge = '🥈';
    tierGradient = 'from-slate-600 via-slate-700 to-slate-900';
    tierBorder = 'border-slate-300/40';
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `বরিশাল রক্ত - ${user.name}-এর রক্তদাতা কার্ড`,
          text: `আমি বরিশাল রক্তের একজন গর্বিত রক্তদাতা (${bloodGroup})। রক্তের প্রয়োজনে পাশে আছি!`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard?.writeText(
        `বরিশাল রক্ত ভেরিফাইড ডোনার: ${user.name} | ব্লাড গ্রুপ: ${bloodGroup} | মোট রক্তদান: ${totalDonations} বার`
      );
      showToast('রক্তদাতা কার্ডের তথ্য কপি করা হয়েছে!', 'success');
    }
  };

  return (
    <div className="space-y-4">
      {/* Smart Card Visual */}
      <div
        ref={cardRef}
        className={`relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-3xl p-6 text-white shadow-2xl bg-gradient-to-br ${tierGradient} border ${tierBorder} overflow-hidden select-none`}
      >
        {/* Holographic Watermark / Ambient Lights */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-red-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-xs">
              <Droplet className="w-5 h-5 fill-red-500 text-red-500" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight block leading-none">
                বরিশাল<span className="text-red-400"> Blood</span>
              </span>
              <span className="text-[9px] text-white/70 tracking-widest uppercase font-semibold">
                barishal-Blood • DONOR ID
              </span>
            </div>
          </div>

          {/* Tier Pill */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold">
            <span>{tierBadge}</span>
            <span className="tracking-wide">{tierName.split(' ')[0]}</span>
          </div>
        </div>

        {/* Card Middle: Blood Group Relief & Donor Details */}
        <div className="relative z-10 my-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {user.name}
              </h3>
              {isVerified && (
                <CheckCircle2 className="w-4 h-4 text-sky-400 fill-white" />
              )}
            </div>
            <p className="text-xs text-white/80 font-medium mt-0.5">
              {upazila}, {district}
            </p>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-white/90">
              <span className="bg-white/15 px-2 py-0.5 rounded-md font-semibold">
                মোট দান: {toBengaliDigits(totalDonations)} বার
              </span>
              <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md font-bold">
                জীবন রক্ষিত: {toBengaliDigits(livesSaved)}+ জন
              </span>
            </div>
          </div>

          {/* Blood Group Luxury Badge */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 border border-white/40 flex flex-col items-center justify-center font-black shadow-xl shadow-red-950/40 shrink-0">
            <span className="text-2xl leading-none">{bloodGroup}</span>
            <span className="text-[9px] uppercase tracking-wider text-red-100 font-bold mt-0.5">
              GROUP
            </span>
          </div>
        </div>

        {/* Card Footer: Chip / QR Code & Barcode aesthetic */}
        <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-white/70">
          <div>
            <span className="block font-mono tracking-widest text-white/90">
              BR-{String(user.id).padStart(6, '0')}
            </span>
            <span className="text-[9px] text-white/60">
              নিবন্ধিত: {formatDateBengali(user.created_at)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded-md bg-white/15 border border-white/20 text-[9px] font-mono text-white/90">
              VERIFIED LIFESAVER
            </div>
            <QrCode className="w-6 h-6 text-white/80" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {onOpenCertificate && (
          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-md transition"
          >
            <Award className="w-3.5 h-3.5 text-amber-200" />
            <span>সম্মাননা সনদ দেখুন</span>
          </button>
        )}

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>স্মার্ট কার্ড শেয়ার</span>
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md hover:bg-red-700 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>প্রিন্ট / সেভ</span>
        </button>
      </div>

      <div className="text-center text-[11px] text-slate-400">
        ডিজিটাল আর্কিটেকচার ও সিস্টেম ভেরিফিকেশন: <strong className="text-slate-700">MD. SAIDUL ISLAM</strong>
      </div>
    </div>
  );
};
