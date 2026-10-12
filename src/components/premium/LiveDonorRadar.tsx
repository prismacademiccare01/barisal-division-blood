import React, { useState, useEffect } from 'react';
import { Donor, BloodGroup } from '../../types/index.js';
import { BARISHAL_DIVISION_DISTRICTS, BLOOD_GROUPS } from '../../utils/locations.js';
import {
  Compass,
  Radio,
  Volume2,
  VolumeX,
  Phone,
  CheckCircle2,
  MapPin,
  X,
  Zap,
} from 'lucide-react';

interface LiveDonorRadarProps {
  donors: Donor[];
  onCallDonor: (donor: Donor) => void;
  onViewDonorProfile: (donor: Donor) => void;
}

export const LiveDonorRadar: React.FC<LiveDonorRadarProps> = ({
  donors,
  onCallDonor,
  onViewDonorProfile,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('all');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Filtered donors
  const filteredDonors = donors.filter((d) => {
    if (selectedDistrict !== 'all' && d.district !== selectedDistrict) return false;
    if (selectedBloodGroup !== 'all' && d.blood_group !== selectedBloodGroup) return false;
    return true;
  });

  // Sound generator using Web Audio API
  const playRadarBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 tone
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {}
  };

  useEffect(() => {
    if (soundEnabled) {
      const interval = setInterval(playRadarBeep, 2400);
      return () => clearInterval(interval);
    }
  }, [soundEnabled]);

  // Generate pseudo-coordinates for donors in radar circle
  const getCoordinates = (donor: Donor, index: number) => {
    const angle = ((index * 137.5) % 360) * (Math.PI / 180); // Golden angle distribution
    // Distance from center: 25% to 85%
    const radius = 25 + ((donor.id * 17) % 60);
    const x = 50 + radius * 0.45 * Math.cos(angle);
    const y = 50 + radius * 0.45 * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="text-lg sm:text-xl font-black tracking-tight">
              লাইভ ব্লাড রাডার ও প্রক্সিমিটি স্ক্যানার
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            বরিশাল বিভাগের বিভিন্ন অঞ্চলে সক্রিয় রক্তদাতাদের তাৎক্ষণিক উপস্থিতি ও সংযোগ
          </p>
        </div>

        {/* Audio Toggle & Live Count */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playRadarBeep();
            }}
            className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-red-600/30 text-red-400 border border-red-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title="রাডার বিপ শব্দ"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">রাডার অডিও</span>
          </button>

          <span className="px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-600/30 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>সক্রিয় সিগন্যাল: {filteredDonors.length} জন</span>
          </span>
        </div>
      </div>

      {/* Radar Controls: District & Blood Group Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-hidden focus:border-red-500"
        >
          <option value="all">সমগ্র বরিশাল বিভাগ</option>
          {BARISHAL_DIVISION_DISTRICTS.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name} জেলা
            </option>
          ))}
        </select>

        <select
          value={selectedBloodGroup}
          onChange={(e) => setSelectedBloodGroup(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-hidden focus:border-red-500"
        >
          <option value="all">সকল রক্তের গ্রুপ</option>
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>
              গ্রুপ: {bg}
            </option>
          ))}
        </select>
      </div>

      {/* Radar Sweep Screen */}
      <div className="relative w-full aspect-square max-w-sm sm:max-w-md mx-auto rounded-full bg-slate-950 border-2 border-red-900/60 shadow-[0_0_50px_rgba(220,38,38,0.15)] flex items-center justify-center overflow-hidden">
        {/* Concentric Radar Grid Rings */}
        <div className="absolute w-[80%] h-[80%] rounded-full border border-red-500/15" />
        <div className="absolute w-[60%] h-[60%] rounded-full border border-red-500/15" />
        <div className="absolute w-[40%] h-[40%] rounded-full border border-red-500/20" />
        <div className="absolute w-[20%] h-[20%] rounded-full border border-red-500/25" />

        {/* Crosshair Axes */}
        <div className="absolute w-full h-[1px] bg-red-500/20" />
        <div className="absolute h-full w-[1px] bg-red-500/20" />

        {/* Radar Sweeping Beam (Pure CSS Animation) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none origin-center animate-spin"
          style={{
            animationDuration: '4s',
            animationTimingFunction: 'linear',
            background:
              'conic-gradient(from 0deg at 50% 50%, rgba(220,38,38,0.4) 0deg, rgba(220,38,38,0) 60deg, transparent 360deg)',
          }}
        />

        {/* Central Pulse Center */}
        <div className="relative z-10 w-4 h-4 rounded-full bg-red-600 shadow-lg shadow-red-500 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
        </div>

        {/* Donor Blips */}
        {filteredDonors.map((donor, idx) => {
          const coords = getCoordinates(donor, idx);
          const isSelected = selectedDonor?.id === donor.id;
          return (
            <button
              key={donor.id}
              onClick={() => setSelectedDonor(donor)}
              style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-transform ${
                isSelected ? 'scale-150 z-30' : 'hover:scale-125'
              }`}
            >
              {/* Pulsing ring */}
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border border-white text-[8px] font-black items-center justify-center text-slate-950 shadow-md">
                  {donor.blood_group.replace('+', '').replace('-', '')}
                </span>
              </span>

              {/* Tooltip on hover */}
              <div className="hidden group-hover:block absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 border border-slate-700 px-2 py-1 rounded-md text-[10px] font-bold text-white shadow-xl pointer-events-none z-30">
                {donor.name} ({donor.blood_group})
              </div>
            </button>
          );
        })}
      </div>

      {/* Floating Selected Donor HUD Overlay */}
      {selectedDonor && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-red-500/40 animate-in fade-in slide-in-from-bottom-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-600 font-black text-xl flex items-center justify-center text-white shrink-0">
              {selectedDonor.blood_group}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-sm text-white">{selectedDonor.name}</h4>
                {selectedDonor.is_verified === 1 && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-red-400" />
                {selectedDonor.upazila}, {selectedDonor.district}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDonorProfile(selectedDonor)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              প্রোফাইল
            </button>

            <button
              onClick={() => onCallDonor(selectedDonor)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-md shadow-emerald-950"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>কল করুন</span>
            </button>

            <button
              onClick={() => setSelectedDonor(null)}
              className="p-2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
