import React, { useState } from 'react';
import { Hospital, BloodGroup } from '../../types/index.js';
import {
  Building2,
  ShieldCheck,
  PhoneCall,
  Clock,
  MapPin,
  Flame,
  CheckCircle2,
  Droplet,
  FileText,
  Share2,
  Activity,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface HospitalCommunityPageProps {
  onOpenCreateRequest: () => void;
}

export const HospitalCommunityPage: React.FC<HospitalCommunityPageProps> = ({
  onOpenCreateRequest,
}) => {
  const [selectedHospital, setSelectedHospital] = useState('sbmch');

  const hospitalsData = [
    {
      id: 'sbmch',
      name: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)',
      type: 'সরকারি টারশিয়ারি মেডিকেল কলেজ ও সেন্ট্রাল ব্লাড ব্যাংক',
      address: 'বান্দ রোড, বরিশাল সদর, বরিশাল',
      emergencyPhone: '01712-000000',
      bloodBankPhone: '0431-2173555',
      verified: true,
      services: ['২৪/৭ সেন্ট্রাল ব্লাড ব্যাংক', 'হোল ব্লাড স্ক্রিনিং', 'প্লেটলেট অ্যাফেরেটিক্স', 'ফ্রি ক্রস-ম্যাচিং', 'থ্যালাসেমিয়া ডে-কেয়ার সেন্টার'],
      stockStatus: [
        { group: 'A+', units: 14, status: 'sufficient' },
        { group: 'A-', units: 3, status: 'low' },
        { group: 'B+', units: 22, status: 'sufficient' },
        { group: 'B-', units: 4, status: 'low' },
        { group: 'O+', units: 18, status: 'sufficient' },
        { group: 'O-', units: 2, status: 'critical' },
        { group: 'AB+', units: 8, status: 'moderate' },
        { group: 'AB-', units: 1, status: 'critical' },
      ],
      recentAnnouncements: [
        {
          id: 'h-ann-1',
          title: '✓ অফিসিয়াল বিজ্ঞপ্তি: ডেঙ্গু মৌসুমের জন্য ও-নেগেটিভ (O-) রক্তের জরুরি আহ্বান',
          date: '১০ অক্টোবর ২০২৬',
          content: 'আমাদের সেন্ট্রাল ব্লাড ব্যাংকে O- এবং AB- গ্রুপের রক্তের মজুত সংকটাপন্ন। বরিশাল ও পার্শ্ববর্তী এলাকার ও-নেগেটিভ রক্তদাতাদের দ্রুত সেন্ট্রাল ব্লাড ব্যাংকে এসে রক্তদানের অনুরোধ করা হচ্ছে।',
          verifiedBadge: true,
        },
        {
          id: 'h-ann-2',
          title: 'থ্যালাসেমিয়া রোগীদের জন্য বিনামূল্যে ক্রস-ম্যাচিং ও স্ক্রিনিং সেবা চালু',
          date: '৫ অক্টোবর ২০২৬',
          content: 'হাসপাতালের বহির্বিভাগে নিবন্ধিত থ্যালাসেমিয়া আক্রান্ত শিশুদের জন্য রক্তের ক্রস-ম্যাচ ও ব্যাগিং সম্পূর্ণ বিনামূল্যে নিশ্চিত করা হচ্ছে।',
          verifiedBadge: true,
        },
      ],
    },
    {
      id: 'general',
      name: 'বরিশাল জেনারেল (সদর) হাসপাতাল',
      type: '২৫০ শয্যাবিশিষ্ট জেলা সদর সরকারি হাসপাতাল',
      address: 'হাসপাতাল রোড, বরিশাল সদর',
      emergencyPhone: '0431-64111',
      bloodBankPhone: '0431-64222',
      verified: true,
      services: ['ইমার্জেন্সি ব্লাড ট্রান্সফিউশন', 'ম্যাটার্নিটি ব্লাড সাপোর্ট', '২৪/৭ জরুরি বিভাগ'],
      stockStatus: [
        { group: 'A+', units: 8, status: 'moderate' },
        { group: 'B+', units: 11, status: 'sufficient' },
        { group: 'O+', units: 9, status: 'moderate' },
        { group: 'AB+', units: 4, status: 'low' },
      ],
      recentAnnouncements: [
        {
          id: 'h-ann-3',
          title: '✓ প্রসূতি ওয়ার্ডের জন্য জরুরী রক্তদাতা তালিকা হালনাগাদ',
          date: '৮ অক্টোবর ২০২৬',
          content: 'জরুরি সিজারিয়ান অপারেশনের জন্য তাৎক্ষণিক রক্ত সরবরাহ নিশ্চিত করতে বরিশাল রক্তের সাথে সমন্বয় কার্যক্রম চলছে।',
          verifiedBadge: true,
        },
      ],
    },
  ];

  const currentHospital = hospitalsData.find((h) => h.id === selectedHospital) || hospitalsData[0];

  return (
    <div className="space-y-6">
      {/* Hospital selector tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {hospitalsData.map((h) => (
          <button
            key={h.id}
            onClick={() => setSelectedHospital(h.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              selectedHospital === h.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4 text-red-500" />
            <span>{h.name}</span>
          </button>
        ))}
      </div>

      {/* Hospital Profile Card Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
        {/* Cover banner */}
        <div className="h-36 bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 relative p-6 flex flex-col justify-end text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ✓ Verified Institution (সরকারি স্বীকৃতিপ্রাপ্ত)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">{currentHospital.name}</h2>
          <p className="text-xs text-white/70">{currentHospital.type}</p>
        </div>

        {/* Info & contacts */}
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-4 h-4 text-red-500" />
                {currentHospital.address}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${currentHospital.bloodBankPhone}`}
                className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1.5 transition border border-red-200"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-600" />
                ব্লাড ব্যাংক হেল্পলাইন
              </a>
              <button
                onClick={onOpenCreateRequest}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5" />
                এখানে রক্তের আবেদন
              </button>
            </div>
          </div>

          {/* Blood Bank Live Stock Snapshot */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-red-600" />
                ব্লাড ব্যাংক মজুত স্ট্যাটাস (লাইভ মনিটরিং)
              </h4>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                আজকের আপডেট
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {currentHospital.stockStatus.map((item) => {
                const badgeColor =
                  item.status === 'sufficient'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : item.status === 'moderate'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-300 font-black animate-pulse';

                return (
                  <div
                    key={item.group}
                    className={`p-3 rounded-2xl border text-center ${badgeColor}`}
                  >
                    <span className="text-sm font-black block">{item.group}</span>
                    <span className="text-xs font-bold block mt-0.5">{item.units} ব্যাগ</span>
                    <span className="text-[9px] uppercase tracking-wider block mt-1">
                      {item.status === 'critical' ? 'সংকট' : item.status === 'low' ? 'কম' : 'পর্যাপ্ত'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available Services */}
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-2">সেবাসমূহ ও সুযোগ-সুবিধা</h4>
            <div className="flex flex-wrap gap-2">
              {currentHospital.services.map((srv, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {srv}
                </span>
              ))}
            </div>
          </div>

          {/* Verified Official Announcements */}
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ভেরিফাইড অফিসিয়াল পোস্ট ও বিজ্ঞপ্তি (Verified Announcements)
            </h4>

            <div className="space-y-3">
              {currentHospital.recentAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-emerald-700 flex items-center gap-1 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                      ✓ Verified Hospital Announcement
                    </span>
                    <span className="text-[11px] text-slate-400">{ann.date}</span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-900">{ann.title}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
