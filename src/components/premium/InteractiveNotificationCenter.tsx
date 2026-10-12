import React, { useState } from 'react';
import {
  Bell,
  Volume2,
  VolumeX,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Heart,
  Droplet,
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters.js';

interface PushAlert {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'critical' | 'match' | 'system';
  isRead: boolean;
}

export const InteractiveNotificationCenter: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'match'>('all');

  const [alerts, setAlerts] = useState<PushAlert[]>([
    {
      id: 1,
      title: '🚨 অত্যন্ত জরুরি: O- নেগেটিভ রক্ত প্রয়োজন',
      message: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল। রোগী: সুমাইয়া (আইসিইউ)। দ্রুত ২ ব্যাগ প্রয়োজন।',
      time: '১০ মিনিট আগে',
      type: 'critical',
      isRead: false,
    },
    {
      id: 2,
      title: '🩸 আপনার এলাকায় নতুন রক্তের অনুরোধ',
      message: 'বরিশাল সদর রোড ক্লিনিকে B+ গ্রুপের ১ ব্যাগ রক্তের আবেদন পোস্ট করা হয়েছে।',
      time: '৪৫ মিনিট আগে',
      type: 'match',
      isRead: false,
    },
    {
      id: 3,
      title: '🎖️ অভিনন্দন! আপনার নতুন রক্তদাতা ব্যাজ আনলক হয়েছে',
      message: 'আপনি সফলভাবে ৩ বার রক্তদানের সিলভার ডিফেন্ডার মাইলস্টোন অর্জন করেছেন।',
      time: '২ ঘণ্টা আগে',
      type: 'system',
      isRead: true,
    },
  ]);

  // Play Sound Chime using Web Audio API
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);

      // Trigger mobile vibration if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch {}
  };

  const handleTestChime = () => {
    playChime();
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  };

  const filtered = alerts.filter((a) => (filterType === 'all' ? true : a.type === filterType));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>ফিচার ১৭: স্মার্ট পুশ ও সাউন্ড নোটিফিকেশন সেন্টার</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            রিয়েল-টাইম জরুরি বার্তা ও অডিও অ্যালার্ট হাব
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            বরিশাল বিভাগের নিকটস্থ রোগীদের জরুরি রক্তের আবেদন তাৎক্ষণিক সাউন্ড ও ভাইব্রেশনের সাথে নোটিফাই করুন
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleTestChime}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
            title="পরীক্ষামূলক সাউন্ড শুনুন"
          >
            <Volume2 className="w-3.5 h-3.5 text-red-600" />
            <span>সাউন্ড টেস্ট</span>
          </button>

          <button
            onClick={markAllAsRead}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
          >
            সব পঠিত করুন
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition ${
            filterType === 'all' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
          }`}
        >
          সকল বার্তা ({toBengaliDigits(alerts.length)})
        </button>

        <button
          onClick={() => setFilterType('critical')}
          className={`px-3 py-1.5 rounded-xl font-bold transition ${
            filterType === 'critical' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
          }`}
        >
          অত্যন্ত জরুরি (Critical)
        </button>

        <button
          onClick={() => setFilterType('match')}
          className={`px-3 py-1.5 rounded-xl font-bold transition ${
            filterType === 'match' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
          }`}
        >
          ম্যাচিং গ্রুপ
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              !alert.isRead
                ? 'bg-red-50/50 border-red-200 shadow-xs'
                : 'bg-white border-slate-200 opacity-80'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                alert.type === 'critical'
                  ? 'bg-red-600 text-white'
                  : alert.type === 'match'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                <Bell className="w-4 h-4" />
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900">
                  {alert.title}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {alert.message}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {alert.time}
                </span>
              </div>
            </div>

            {!alert.isRead && (
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0 self-start sm:self-center" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
