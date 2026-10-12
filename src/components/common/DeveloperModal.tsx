import React from 'react';
import {
  Code2,
  Sparkles,
  ShieldCheck,
  Heart,
  Globe,
  Terminal,
  Cpu,
  Layers,
  X,
  Award,
  ExternalLink,
  Smartphone,
  Database,
  Cloud,
  Bot,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800">
        {/* Header Ribbon with Gradient */}
        <div className="relative bg-gradient-to-r from-red-600 via-rose-600 to-red-800 text-white p-6 sm:p-7">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-red-200 uppercase tracking-widest mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>সফটওয়্যার আর্কিটেক্ট ও লিড ইঞ্জিনিয়ার</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>MD. SAIDUL ISLAM</span>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs ring-2 ring-white">
              ✓
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-red-100 mt-1 font-medium">
            Lead Software Architect · Senior Full Stack Engineer · System Designer
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Mission & Purpose */}
          <div className="bg-red-50/60 rounded-2xl p-4 border border-red-100/80">
            <h3 className="font-extrabold text-sm text-red-950 flex items-center gap-2 mb-1.5">
              <Heart className="w-4 h-4 text-red-600 fill-red-600" />
              প্ল্যাটফর্ম ভিশন ও সামাজিক লক্ষ্য
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              "বরিশাল বিভাগের ৬টি জেলা ও প্রত্যন্ত উপজেলার রোগীদের জীবন বাঁচাতে এক সেকেন্ডও যেন অপচয় না হয়—এই অঙ্গীকার নিয়ে আধুনিক, সুরক্ষিত এবং অফলাইন-সক্ষম ব্লাড ডোনার ম্যানেজমেন্ট প্ল্যাটফর্ম হিসেবে <strong className="text-slate-900">“বরিশাল রক্ত”</strong> নিখুঁত প্রকৌশল দক্ষতায় তৈরি করা হয়েছে।"
            </p>
          </div>

          {/* Core Architecture Highlights (8 Pillars) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>প্রফেশনাল সফটওয়্যার আর্কিটেকচার</span>
              <span className="text-[10px] text-emerald-600 font-mono font-bold">100% PRODUCTION-GRADE</span>
            </h4>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <Cloud className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Cloudflare D1 & R2</span>
                  <span className="text-[11px] text-slate-500">ছবি R2 বাকেটে, মেটাডাটা D1-এ</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">PWA & Mobile Ready</span>
                  <span className="text-[11px] text-slate-500">Service Worker, অ্যান্ড্রয়েড ক্যাপাবল</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <Bot className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">রক্ত সহায়ক AI Assistant</span>
                  <span className="text-[11px] text-slate-500">২৪/৭ মেডিকেল ট্রায়াজ ও পরামর্শ</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">নিরাপদ REST API v1</span>
                  <span className="text-[11px] text-slate-500">Node/Express + RBAC Auth</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Controlled Contact</span>
                  <span className="text-[11px] text-slate-500">নম্বর সুরক্ষা ও অডিট লগিং</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">রিয়েল-টাইম সোশ্যাল ফিড</span>
                  <span className="text-[11px] text-slate-500">স্টোরি, রিঅ্যাকশন ও মেসেঞ্জার</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm">প্রজেক্ট আর্কিটেক্ট ও নির্মাতা</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                VERIFIED AUTHOR
              </span>
            </div>
            <p className="text-xs text-slate-300">
              নাম: <strong className="text-white font-bold">MD. SAIDUL ISLAM</strong>
            </p>
            <p className="text-xs text-slate-400">
              প্ল্যাটফর্ম: barishal-Blood (বরিশাল রক্ত ডিজিটাল প্ল্যাটফর্ম)
            </p>
            <p className="text-[11px] text-slate-400 pt-1 border-t border-white/10 flex items-center justify-between">
              <span>কারিগরি সহায়তা ও অ্যাপ কাস্টমাইজেশনের জন্য সার্বক্ষণিক প্রস্তুত।</span>
              <span className="text-amber-300 font-mono">v1.5.0 Stable</span>
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
            >
              ধন্যবাদ, বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
