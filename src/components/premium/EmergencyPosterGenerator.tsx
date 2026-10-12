import React, { useState, useRef } from 'react';
import { BloodRequest, BloodGroup } from '../../types/index.js';
import { BLOOD_GROUPS, BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  Building2,
  Phone,
  Droplet,
  MapPin,
  Calendar,
  Image,
} from 'lucide-react';

interface EmergencyPosterGeneratorProps {
  initialRequest?: BloodRequest | null;
  onOpenCreateRequest?: () => void;
}

export const EmergencyPosterGenerator: React.FC<EmergencyPosterGeneratorProps> = ({
  initialRequest,
  onOpenCreateRequest,
}) => {
  const [patientName, setPatientName] = useState(initialRequest?.patient_name || 'রহিম উদ্দিন');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(initialRequest?.blood_group || 'O+');
  const [units, setUnits] = useState(initialRequest?.units_needed || 2);
  const [hospital, setHospital] = useState(initialRequest?.hospital_name || 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল');
  const [district, setDistrict] = useState(initialRequest?.district || 'বরিশাল');
  const [upazila, setUpazila] = useState(initialRequest?.upazila || 'বরিশাল সদর');
  const [phone, setPhone] = useState(initialRequest?.contact_phone || '০১৭১২-৩৪৫৬৭৮');
  const [altPhone, setAltPhone] = useState('০১৮১২-৯৮৭৬৫৪');
  const [urgency, setUrgency] = useState<'critical' | 'urgent' | 'standard'>('critical');
  const [neededDate, setNeededDate] = useState(new Date().toISOString().split('T')[0]);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate Canvas Poster
  const generateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions (Square 1080x1080 for Facebook & WhatsApp post)
    canvas.width = 1080;
    canvas.height = 1080;

    // Background Gradient (Crimson Red / Dark Maroon)
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, '#7f1d1d');
    gradient.addColorStop(0.5, '#991b1b');
    gradient.addColorStop(1, '#450a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Subtle Grid pattern / accents
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 1080; i += 40) {
      ctx.fillRect(i, 0, 1, 1080);
      ctx.fillRect(0, i, 1080, 1);
    }

    // Top Header Banner
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(60, 50, 960, 90, 24);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('জরুরি রক্তের আবেদন · বরিশাল বিভাগীয় নেটওয়ার্ক', 540, 108);

    // Giant Blood Group Badge
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(380, 180, 320, 200, 36);
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#fee2e2';
    ctx.stroke();

    ctx.fillStyle = '#b91c1c';
    ctx.font = '900 130px sans-serif';
    ctx.fillText(bloodGroup, 540, 325);

    ctx.fillStyle = '#7f1d1d';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`${toBengaliDigits(units)} ব্যাগ রক্ত প্রয়োজন`, 540, 365);

    // Patient & Hospital Info Card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.beginPath();
    ctx.roundRect(60, 420, 960, 420, 32);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`রোগীর নাম: ${patientName}`, 110, 490);

    ctx.fillStyle = '#334155';
    ctx.font = 'normal 30px sans-serif';
    ctx.fillText(`হাসপাতাল: ${hospital}`, 110, 555);

    ctx.fillText(`অবস্থান: ${upazila}, ${district}`, 110, 620);
    ctx.fillText(`প্রয়োজনের তারিখ: ${neededDate} (${urgency === 'critical' ? 'খুব জরুরি' : 'জরুরি'})`, 110, 685);

    // Emergency Contact Box inside Card
    ctx.fillStyle = '#fef2f2';
    ctx.beginPath();
    ctx.roundRect(100, 720, 880, 95, 20);
    ctx.fill();
    ctx.strokeStyle = '#fecaca';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#b91c1c';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(`যোগাযোগ: ${phone}  |  ${altPhone}`, 140, 780);

    // Footer Branding & Developer Credit
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fecaca';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('barishal-Blood (বরিশাল রক্ত) · ২৪ ঘণ্টা জরুরি রক্ত সহায়তা নেটওয়ার্ক', 540, 930);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('প্ল্যাটফর্ম সফটওয়্যার আর্কিটেক্ট: MD. SAIDUL ISLAM', 540, 975);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'normal 18px sans-serif';
    ctx.fillText('শেয়ার করুন এবং দ্রুত রক্ত সংগ্রহে সহায়তা করুন', 540, 1020);
  };

  // Download Handler
  const handleDownload = () => {
    setDownloading(true);
    generateCanvas();
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setDownloading(false);
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `blood-request-${bloodGroup}-${patientName}.png`;
      a.click();
      setDownloading(false);
    }, 200);
  };

  // Copy Text Format for WhatsApp / Facebook
  const handleCopyText = () => {
    const text = `🚨 জরুরি রক্তের আবেদন! 🚨\n\n🩸 রক্তের গ্রুপ: ${bloodGroup} (${toBengaliDigits(units)} ব্যাগ)\n👤 রোগী: ${patientName}\n🏥 হাসপাতাল: ${hospital}\n📍 অবস্থান: ${upazila}, ${district}\n📅 সময়: ${neededDate} (${urgency === 'critical' ? 'জরুরি ভিত্তিতে' : 'প্রয়োজন'})\n\n📞 সরাসরি যোগাযোগ:\n📱 ${phone}\n📱 ${altPhone}\n\nপোস্টার প্রস্তুতকারক: barishal-Blood (বরিশাল রক্ত)\nচিফ ইঞ্জিনিয়ার: MD. SAIDUL ISLAM\nদয়া করে দ্রুত শেয়ার করে জীবন বাঁচাতে সাহায্য করুন!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Image className="w-4 h-4" />
            <span>ফিচার ১: ডিজিটাল ব্যানার ও সোশ্যাল পোস্টার মেকার</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            জরুরি রক্তের পোস্টার জেনারেটর
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ফেসবুক, হোয়াটসঅ্যাপ এবং সোশ্যাল মিডিয়ায় প্রচারের জন্য ১-ক্লিকে এইচডি পোস্টার তৈরি করুন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'টেক্সট কপি হয়েছে!' : 'মেসেজ কপি করুন'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'ডাউনলোড হচ্ছে...' : 'পোস্টার ডাউনলোড'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">রোগীর নাম</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              placeholder="রোগীর নাম লিখুন"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ব্যাগ সংখ্যা</label>
              <input
                type="number"
                min="1"
                max="10"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">হাসপাতালের নাম</label>
            <input
              type="text"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              placeholder="হাসপাতাল ও ওয়ার্ড নম্বর"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">জেলা</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                {BARISHAL_DIVISION_DISTRICTS.map((d) => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">উপজেলা / এলাকা</label>
              <input
                type="text"
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">জরুরি মোবাইল নম্বর</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">বিকল্প নম্বর</label>
              <input
                type="text"
                value={altPhone}
                onChange={(e) => setAltPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">প্রয়োজনের সময়সীমা</label>
            <input
              type="date"
              value={neededDate}
              onChange={(e) => setNeededDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
            />
          </div>
        </div>

        {/* Live Visual Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-xl border-4 border-slate-800 bg-gradient-to-br from-red-900 via-rose-950 to-slate-950 text-white p-5 text-center relative">
            {/* Top Tag */}
            <div className="bg-red-600 text-white text-[11px] font-black py-1 px-3 rounded-full inline-block mb-3 uppercase tracking-wider">
              জরুরি রক্তের আবেদন · বরিশাল বিভাগ
            </div>

            {/* Blood Group */}
            <div className="bg-white text-red-700 w-28 h-28 rounded-2xl mx-auto flex flex-col items-center justify-center shadow-lg border-2 border-red-200 mb-3">
              <span className="text-4xl font-black">{bloodGroup}</span>
              <span className="text-[10px] font-bold text-slate-600">{toBengaliDigits(units)} ব্যাগ</span>
            </div>

            {/* Info */}
            <div className="bg-white text-slate-900 rounded-2xl p-4 text-left space-y-1.5 shadow-sm text-xs mb-3">
              <div className="font-extrabold text-sm text-red-700 line-clamp-1">
                রোগী: {patientName}
              </div>
              <div className="text-slate-700 font-semibold line-clamp-1">
                🏥 {hospital}
              </div>
              <div className="text-slate-500 text-[11px]">
                📍 {upazila}, {district} · {neededDate}
              </div>
              <div className="p-2 rounded-xl bg-red-50 text-red-700 font-mono font-bold text-xs border border-red-200">
                📞 {phone} / {altPhone}
              </div>
            </div>

            {/* Developer Trust Badge */}
            <div className="text-[10px] text-red-200">
              <span>চিফ ইঞ্জিনিয়ার: </span>
              <strong className="text-white">MD. SAIDUL ISLAM</strong>
              <span className="block text-[9px] text-slate-300 mt-0.5">বরিশাল রক্ত ডিজিটাল নেটওয়ার্ক</span>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};
