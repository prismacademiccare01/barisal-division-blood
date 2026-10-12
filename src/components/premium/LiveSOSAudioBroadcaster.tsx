import React, { useState, useEffect } from 'react';
import {
  Radio,
  Volume2,
  VolumeX,
  AlertTriangle,
  Flame,
  Phone,
  Sparkles,
  Share2,
  BellRing,
  ShieldAlert,
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters.js';

export const LiveSOSAudioBroadcaster: React.FC = () => {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  const triggerSirenSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(950, ctx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);

      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 400]);
      }
    } catch {}
  };

  const handleToggleBroadcast = () => {
    if (!isBroadcasting) {
      setIsBroadcasting(true);
      setSirenActive(true);
      triggerSirenSound();
    } else {
      setIsBroadcasting(false);
      setSirenActive(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>ফিচার ১৯: অডিও-ভিজ্যুয়াল জরুরি এসওএস ব্রডকাস্টার</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            লাইভ অডিও-ভিজ্যুয়াল এসওএস ব্রডকাস্টার হাব
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            অতি জরুরি পরিস্থিতিতে ওয়েব অডিও অ্যালার্ট সাউন্ড ও ভাইব্রেশনের সাথে ব্রডকাস্ট সংকেত
          </p>
        </div>

        <button
          onClick={handleToggleBroadcast}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs shadow-md transition cursor-pointer self-start sm:self-auto ${
            isBroadcasting
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
          }`}
        >
          {isBroadcasting ? <VolumeX className="w-4 h-4" /> : <BellRing className="w-4 h-4" />}
          <span>{isBroadcasting ? 'এসওএস অ্যালার্ট বন্ধ করুন' : 'লাইভ এসওএস চালু করুন'}</span>
        </button>
      </div>

      {/* Visual Siren Pulse Box */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isBroadcasting
          ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-800 text-white shadow-xl shadow-red-500/20'
          : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              isBroadcasting ? 'bg-white/20 backdrop-blur-md text-white' : 'bg-red-100 text-red-700'
            }`}>
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isBroadcasting ? 'bg-white animate-ping' : 'bg-slate-400'
                }`} />
                <h4 className="font-extrabold text-base sm:text-lg">
                  {isBroadcasting
                    ? 'লাইভ জরুরি ব্রডকাস্ট সক্রিয়: ও-নেগেটিভ (O-) সংকট'
                    : 'স্ট্যান্ডবাই মোড: ব্রডকাস্ট চ্যানেল প্রস্তুত'}
                </h4>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${
                isBroadcasting ? 'text-red-100' : 'text-slate-500'
              }`}>
                {isBroadcasting
                  ? 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল বরিশালে রক্তের তীব্র ঘাটতিতে অটোমেটিক ব্রডকাস্ট সংকেত চলছে।'
                  : 'জরুরি রক্তের আবেদন হলে মুহূর্তে বিভাগের সকল রেজিস্টার্ড রক্তদাতার ডিভাইসে ভিজ্যুয়াল অ্যালার্ট প্রেরিত হবে।'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerSirenSound}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isBroadcasting
                  ? 'bg-white text-red-700 hover:bg-red-50'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>সাউন্ড বাজান</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
