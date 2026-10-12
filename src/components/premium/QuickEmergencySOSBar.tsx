import React, { useState } from 'react';
import {
  PhoneCall,
  Flame,
  AlertTriangle,
  X,
  HeartHandshake,
  ShieldAlert,
  ChevronUp,
  Radio,
} from 'lucide-react';

interface QuickEmergencySOSBarProps {
  onOpenCreateRequest: () => void;
  onOpenRadar: () => void;
}

export const QuickEmergencySOSBar: React.FC<QuickEmergencySOSBarProps> = ({
  onOpenCreateRequest,
  onOpenRadar,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      aria-label="জরুরি রক্তদান সহায়তা"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 transition-all duration-300"
    >
      {/* Expanded Quick SOS Drawer */}
      {isExpanded && (
        <div className="mb-3 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-red-500/40 text-white rounded-3xl p-4 shadow-2xl animate-fade-in space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-red-400">
                জরুরি রেসপন্স হটলাইন
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300">
            রক্তের আশু প্রয়োজনে তাৎক্ষণিক কল করুন বা সরাসরি আবেদন পোস্ট করুন:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <a
              href="tel:01711223344"
              className="p-2.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 flex flex-col items-center justify-center text-center transition"
            >
              <PhoneCall className="w-4 h-4 text-red-400 mb-1" />
              <span className="font-bold text-[11px]">SBMCH হটলাইন</span>
              <span className="text-[9px] text-slate-400">01711-223344</span>
            </a>

            <a
              href="tel:999"
              className="p-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 flex flex-col items-center justify-center text-center transition"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400 mb-1" />
              <span className="font-bold text-[11px]">জাতীয় জরুরি ৯৯৯</span>
              <span className="text-[9px] text-slate-400">টোল ফ্রি সেবা</span>
            </a>
          </div>

          <div className="pt-1 space-y-2">
            <button
              onClick={() => {
                setIsExpanded(false);
                onOpenCreateRequest();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 font-black text-xs text-white shadow-lg flex items-center justify-center gap-1.5 transition"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>জরুরি রক্তের আবেদন করুন</span>
            </button>

            <button
              onClick={() => {
                setIsExpanded(false);
                onOpenRadar();
              }}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-[11px] text-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              <span>লাইভ ব্লাড রাডার দেখুন</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Pill */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-extrabold text-xs shadow-xl shadow-red-700/40 border border-red-400/40 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <div className="relative">
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-ping" />
        </div>
        <span className="tracking-wide">জরুরি এসওএস</span>
        <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px] font-mono">
          HOTLINE
        </span>
      </button>
    </aside>
  );
};
