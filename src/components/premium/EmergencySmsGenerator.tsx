import React, { useState } from 'react';
import { BloodGroup } from '../../types/index.js';
import { BLOOD_GROUPS, BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  MessageSquare,
  Copy,
  Check,
  Send,
  Share2,
  Sparkles,
  Phone,
  Droplet,
  Building2,
  MapPin,
} from 'lucide-react';

export const EmergencySmsGenerator: React.FC = () => {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('B+');
  const [patientName, setPatientName] = useState('মো. জসিম উদ্দিন');
  const [units, setUnits] = useState(2);
  const [hospital, setHospital] = useState('শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল');
  const [district, setDistrict] = useState('বরিশাল');
  const [phone, setPhone] = useState('০১৭১২-৩৪৫৬৭৮');
  const [problem, setProblem] = useState('জরুরি অস্ত্রোপচার');
  const [copied, setCopied] = useState(false);
  const [formatType, setFormatType] = useState<'sms' | 'whatsapp' | 'facebook'>('sms');

  const generateText = () => {
    if (formatType === 'sms') {
      return `[জরুরি রক্ত প্রয়োজন] গ্রুপ: ${bloodGroup} (${toBengaliDigits(units)} ব্যাগ)। রোগী: ${patientName} (${problem})। স্থান: ${hospital}, ${district}। যোগাযোগ: ${phone}। দয়া করে কল দিন বা শেয়ার করুন।`;
    } else if (formatType === 'whatsapp') {
      return `🚨 *জরুরি রক্তের আবেদন - বরিশাল বিভাগ* 🚨\n\n🩸 *রক্তের গ্রুপ:* ${bloodGroup} (${toBengaliDigits(units)} ব্যাগ)\n👤 *রোগীর নাম:* ${patientName}\n🩺 *সমস্যা:* ${problem}\n🏥 *হাসপাতাল:* ${hospital}\n📍 *জেলা:* ${district}\n\n📞 *যোগাযোগ নম্বর:* ${phone}\n\n🙏 আপনার ১ ব্যাগ রক্তে বেঁচে যেতে পারে একটি জীবন। দয়া করে দ্রুত যোগাযোগ করুন বা বিভিন্ন গ্রুপে ফরোয়ার্ড করুন।\n\n- সৌজন্যে: বরিশাল রক্ত প্ল্যাটফর্ম\nচিফ ইঞ্জিনিয়ার: MD. SAIDUL ISLAM`;
    } else {
      return `🔴 জরুরি ভিত্তিতে ${bloodGroup} গ্রুপের রক্ত প্রয়োজন 🔴\n\nরোগীর নাম: ${patientName}\nহাসপাতাল: ${hospital}, ${district}\nরক্তের পরিমাণ: ${toBengaliDigits(units)} ব্যাগ\nকারণ: ${problem}\nযোগাযোগ: ${phone}\n\n#BloodDonation #BarishalRokto #${bloodGroup} #Barishal\nপোস্টটি শেয়ার করে রোগীর পাশে দাঁড়ান।`;
    }
  };

  const currentText = generateText();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>ফিচার ১১: বাংলা জরুরি এসএমএস ও বার্তা ফরম্যাটার</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            জরুরি এসএমএস ও মেসেজ টেমপ্লেট জেনারেটর
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            মোবাইল এসএমএস, হোয়াটসঅ্যাপ এবং ফেসবুকে প্রচারের জন্য পারফেক্ট ফরমেটেড মেসেজ
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'মেসেজ কপি হয়েছে!' : '১-ক্লিকে কপি করুন'}</span>
        </button>
      </div>

      {/* Format Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setFormatType('sms')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
            formatType === 'sms'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          সাধারণ মোবাইল এসএমএস (১৬০ ক্যারেক্টার)
        </button>

        <button
          onClick={() => setFormatType('whatsapp')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
            formatType === 'whatsapp'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          হোয়াটসঅ্যাপ ও টেলিগ্রাম ফরম্যাট
        </button>

        <button
          onClick={() => setFormatType('facebook')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
            formatType === 'facebook'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          ফেসবুক পোস্ট ও হ্যাশট্যাগ
        </button>
      </div>

      {/* Grid of Inputs & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">রক্তের গ্রুপ</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold bg-white"
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
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">রোগীর নাম</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">হাসপাতাল ও ওয়ার্ড</label>
            <input
              type="text"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">রোগের বিবরণ/কারণ</label>
              <input
                type="text"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">যোগাযোগ মোবাইল নম্বর</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Live Preview (6 cols) */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>লাইভ মেসেজ প্রিভিউ</span>
            <span>মোট অক্ষর: {toBengaliDigits(currentText.length)} টি</span>
          </div>

          <pre className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed shadow-xs min-h-[160px]">
            {currentText}
          </pre>
        </div>
      </div>
    </div>
  );
};
