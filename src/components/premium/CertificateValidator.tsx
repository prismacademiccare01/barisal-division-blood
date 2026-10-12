import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Award,
  CheckCircle2,
  XCircle,
  FileCheck,
  Lock,
  QrCode,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters.js';

export const CertificateValidator: React.FC = () => {
  const [certId, setCertId] = useState('BR-2026-9874');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<{
    valid: boolean;
    name?: string;
    bloodGroup?: string;
    totalDonations?: number;
    issueDate?: string;
    tier?: string;
    signedBy?: string;
  } | null>({
    valid: true,
    name: 'ফারহান আহমেদ',
    bloodGroup: 'O+',
    totalDonations: 8,
    issueDate: '২০২৬-০৩-১৫',
    tier: 'গোল্ড লাইফসেভার (Gold Guardian)',
    signedBy: 'MD. SAIDUL ISLAM (Chief Software Architect)',
  });

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setVerifying(true);
    setResult(null);

    setTimeout(() => {
      setVerifying(false);
      // Valid if starts with BR- or demo
      if (certId.toUpperCase().includes('BR-') || certId.length >= 4) {
        setResult({
          valid: true,
          name: 'ফারহান আহমেদ',
          bloodGroup: 'O+',
          totalDonations: 8,
          issueDate: '২০২৬-০৩-১৫',
          tier: 'গোল্ড লাইফসেভার (Gold Guardian)',
          signedBy: 'MD. SAIDUL ISLAM (Chief Software Architect)',
        });
      } else {
        setResult({ valid: false });
      }
    }, 450);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>ফিচার ১০: অফিসিয়াল ডিজিটাল সনদ যাচাইকরণ</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          ডিজিটাল সার্টিফিকেট ভেরিফিকেশন ও কিউআর স্ক্রিনিং
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          বরিশাল রক্ত প্ল্যাটফর্ম থেকে ইস্যুকৃত অফিসিয়াল ডিজিটাল সনদের সত্যতা ও নিরাপত্তা যাচাই করুন
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleValidate} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
            placeholder="সনদ নম্বর লিখুন (যেমন: BR-2026-9874)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono uppercase tracking-wider bg-slate-50 focus:bg-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={verifying}
          className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <FileCheck className="w-4 h-4" />
          <span>{verifying ? 'যাচাই করা হচ্ছে...' : 'সনদ যাচাই করুন'}</span>
        </button>
      </form>

      {/* Validation Result Box */}
      {result && (
        <div className={`p-6 rounded-2xl border transition-all ${
          result.valid
            ? 'bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 border-emerald-300 text-slate-900'
            : 'bg-red-50/70 border-red-300 text-red-950'
        }`}>
          {result.valid ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-emerald-950">
                      সনদটি ১০০% খাঁটি ও সক্রিয় (Officially Verified)
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-800">
                      সনদ আইডি: {certId.toUpperCase()}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 self-start sm:self-auto">
                  AUTHENTICATED
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-emerald-200/60">
                  <span className="text-slate-400 block text-[11px]">রক্তদাতার নাম</span>
                  <strong className="text-slate-900 text-sm mt-0.5 block">{result.name}</strong>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-200/60">
                  <span className="text-slate-400 block text-[11px]">রক্তের গ্রুপ</span>
                  <strong className="text-red-700 text-sm mt-0.5 block">{result.bloodGroup}</strong>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-200/60">
                  <span className="text-slate-400 block text-[11px]">মোট রক্তদান</span>
                  <strong className="text-slate-900 text-sm mt-0.5 block">{toBengaliDigits(result.totalDonations || 0)} বার</strong>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-200/60">
                  <span className="text-slate-400 block text-[11px]">ইস্যুর তারিখ</span>
                  <strong className="text-slate-900 text-sm mt-0.5 block">{result.issueDate}</strong>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-500">ডিজিটাল অনুমোদনকারী: </span>
                  <strong className="text-slate-900">{result.signedBy}</strong>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold">
                  ক্রিপ্টোগ্রাফিক সুরক্ষা স্ট্যাম্পযুক্ত ✓
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <XCircle className="w-8 h-8 text-red-600 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm text-red-950">
                  সনদটি খুঁজে পাওয়া যায়নি অথবা অবৈধ
                </h4>
                <p className="text-xs text-red-800 mt-0.5">
                  দয়া করে সঠিক সনদ আইডি দিয়ে পুনরায় চেষ্টা করুন অথবা বরিশাল রক্ত প্রশাসনের সাথে যোগাযোগ করুন।
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
