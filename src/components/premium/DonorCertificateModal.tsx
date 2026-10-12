import React, { useRef } from 'react';
import { User, Donor } from '../../types/index.js';
import { toBengaliDigits, formatDateBengali } from '../../utils/formatters.js';
import { useToast } from '../../hooks/useToast.js';
import {
  Award,
  Sparkles,
  Printer,
  Share2,
  X,
  Droplet,
  QrCode,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface DonorCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  donor?: Donor | null;
}

export const DonorCertificateModal: React.FC<DonorCertificateModalProps> = ({
  isOpen,
  onClose,
  user,
  donor,
}) => {
  const { showToast } = useToast();
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || (!user && !donor)) return null;

  const recipientName = donor?.name || user?.name || 'সম্মানিত রক্তদাতা';
  const totalDonations = donor?.total_donations || user?.total_donations || 1;
  const bloodGroup = donor?.blood_group || user?.blood_group || 'O+';
  const district = donor?.district || user?.district || 'বরিশাল';
  const upazila = donor?.upazila || user?.upazila || 'বরিশাল সদর';
  const displayId = donor?.id || user?.id || 1;
  const certId = `BR-CERT-${String(displayId).padStart(5, '0')}-${new Date().getFullYear()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `আমার বরিশাল রক্ত ডিজিটাল রক্তদাতা সম্মাননা সার্টিফিকেট! আমি গর্বিত রক্তদাতা (${bloodGroup})। বরিশাল রক্ত প্ল্যাটফর্মে যুক্ত থাকুন!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'বরিশাল রক্ত - রক্তদাতা সম্মাননা সনদ',
          text,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard?.writeText(text);
      showToast('সার্টিফিকেটের লিংক কপি করা হয়েছে!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:shadow-none print:border-none print:max-w-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>অফিসিয়াল রক্তদাতা সম্মাননা সনদপত্র</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট / সেভ PDF</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              title="শেয়ার করুন"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Body */}
        <div
          ref={printAreaRef}
          className="p-6 sm:p-10 bg-gradient-to-br from-amber-50/50 via-white to-red-50/40 relative border-[12px] border-double border-amber-600/30 m-3 sm:m-4 rounded-2xl select-none"
        >
          {/* Subtle Watermark Drop */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Droplet className="w-96 h-96 text-red-600 fill-red-600" />
          </div>

          {/* Certificate Header */}
          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-md mx-auto mb-1">
              <Droplet className="w-7 h-7 fill-white" />
            </div>

            <div className="flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-widest text-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>barishal-Blood · DIGITAL LIFESAVER RECOGNITION</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              জীবন রক্ষক সম্মাননা স্মারক
            </h1>

            <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
              মানবতার কল্যাণে নিঃস্বার্থ রক্তদান করে অমূল্য জীবন রক্ষায় অসামান্য অবদানের স্বীকৃতিস্বরূপ
            </p>
          </div>

          {/* Golden Divider */}
          <div className="my-6 flex items-center justify-center gap-3">
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
            <Award className="w-6 h-6 text-amber-500 shrink-0" />
            <div className="h-0.5 w-24 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
          </div>

          {/* Recipient Details */}
          <div className="text-center space-y-4 relative z-10 py-2">
            <span className="text-xs font-semibold text-slate-400 tracking-wider block">
              এই সম্মাননা গর্বের সাথে প্রদান করা হলো
            </span>

            <div className="inline-block relative">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-red-700 tracking-tight font-serif px-6 py-1 border-b-2 border-red-200">
                {recipientName}
              </h2>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-black border border-red-200">
                রক্তের গ্রুপ: {bloodGroup}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                মোট রক্তদান: {toBengaliDigits(totalDonations)} বার
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                {upazila}, {district}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto pt-2">
              আপনার এক ব্যাগ রক্তে একটি জীবন বেঁচেছে, পরিবার পেয়েছে নতুন আশা। বরিশাল রক্ত নেটওয়ার্ক আপনার মহৎ মানবিক ত্যাগের প্রতি বিনম্র শ্রদ্ধা জ্ঞাপন করছে।
            </p>
          </div>

          {/* Certificate Footer with Signatures & QR */}
          <div className="mt-8 pt-6 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-xs">
            {/* Signature 1: Developer & Architect MD. SAIDUL ISLAM */}
            <div className="text-center sm:text-left">
              <div className="font-serif italic font-extrabold text-slate-900 text-base tracking-wider">
                Md. Saidul Islam
              </div>
              <div className="h-0.5 w-32 bg-slate-400 my-1 mx-auto sm:mx-0" />
              <span className="font-bold text-slate-800 block text-[11px]">
                MD. SAIDUL ISLAM
              </span>
              <span className="text-[10px] text-slate-500 block">
                Lead Software Architect & Developer
              </span>
            </div>

            {/* Middle Seal Badge */}
            <div className="text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 shadow-md flex items-center justify-center text-slate-950 font-black text-[9px] uppercase tracking-tighter text-center leading-tight">
                <div className="w-full h-full rounded-full border border-dashed border-amber-900/40 flex flex-col items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-amber-950 mb-0.5" />
                  <span>VERIFIED</span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 mt-1">
                {certId}
              </span>
            </div>

            {/* Signature 2: Platform Authority */}
            <div className="text-center sm:text-right">
              <div className="font-serif italic font-extrabold text-red-800 text-base tracking-wider">
                barishal-Blood Board
              </div>
              <div className="h-0.5 w-32 bg-slate-400 my-1 mx-auto sm:ml-auto" />
              <span className="font-bold text-slate-800 block text-[11px]">
                barishal-Blood কেন্দ্রীয় কমিটি
              </span>
              <span className="text-[10px] text-slate-500 block">
                তারিখ: {formatDateBengali(new Date().toISOString())}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
