import React, { useState } from 'react';
import {
  Ship,
  Phone,
  Compass,
  AlertTriangle,
  Clock,
  ShieldCheck,
  MapPin,
  Waves,
  Sun,
  Moon,
  CloudFog,
  Navigation,
  PhoneCall,
} from 'lucide-react';
import { toBengaliDigits } from '../../utils/formatters.js';

interface WaterAmbulance {
  id: number;
  name: string;
  route: string;
  type: 'speed_boat' | 'trawler_ambulance' | 'gov_water_vessel';
  contactPerson: string;
  phone: string;
  baseStation: string;
  responseTime: string;
  oxygenEquipped: boolean;
  notes: string;
}

const WATER_AMBULANCES: WaterAmbulance[] = [
  {
    id: 1,
    name: 'লাহারহাট – ভেদুরিয়া জরুরি ওয়াটার অ্যাম্বুলেন্স',
    route: 'বরিশাল সদর ⇄ ভোলা ভেদুরিয়া ফেরিঘাট',
    type: 'speed_boat',
    contactPerson: 'ক্যাপ্টেন সোবহান',
    phone: '০১৭৫১-১২৩৪৫৬',
    baseStation: 'লাহারহাট ঘাট, বরিশাল',
    responseTime: '১৫-২০ মিনিট',
    oxygenEquipped: true,
    notes: 'রাতেও মুমূর্ষু রোগী পারাপারের জন্য বিশেষ হাই-পাওয়ার স্পিডবোট প্রস্তুত থাকে।',
  },
  {
    id: 2,
    name: 'মনপুরা – তজুমদ্দিন কোস্টাল রেসকিউ অ্যাম্বুলেন্স',
    route: 'মনপুরা দ্বীপ ⇄ তজুমদ্দিন ⇄ ভোলা সদর',
    type: 'gov_water_vessel',
    contactPerson: 'নজরুল ইসলাম',
    phone: '০১৮১২-৯৮৭৬৫৪',
    baseStation: 'রামনেওয়াজ ঘাট, মনপুরা',
    responseTime: '৩০-৪০ মিনিট',
    oxygenEquipped: true,
    notes: 'মেঘনা নদীর উত্তাল ঢেউয়ের মধ্যেও রোগী পরিবহনে উপযুক্ত হেভি বডি নৌযান।',
  },
  {
    id: 3,
    name: 'কুয়াকাটা – রাঙ্গাবালী ওয়াটার লাইফবোট',
    route: 'রাঙ্গাবালী চরাঞ্চল ⇄ কলাপাড়া ⇄ পটুয়াখালী',
    type: 'speed_boat',
    contactPerson: 'মো. রফিক সর্দার',
    phone: '০১৯১২-৩৩৪৪৫৫',
    baseStation: 'ছোটবাইশদিয়া ঘাট, রাঙ্গাবালী',
    responseTime: '২০-২৫ মিনিট',
    oxygenEquipped: true,
    notes: 'চর এলাকার প্রসূতি ও জরুরি রক্তক্ষরণ রোগীদের দ্রুত হাসপাতালে আনার জন্য।',
  },
  {
    id: 4,
    name: 'হরিণঘাটা – পাথরঘাটা মোহনা লাইফসেভার বোট',
    route: 'পাথরঘাটা ⇄ বরগুনা সদর ⇄ পায়রা নদী রুট',
    type: 'trawler_ambulance',
    contactPerson: 'আবু বকর মাঝি',
    phone: '০১৬১১-৭৭৮৮৯৯',
    baseStation: 'পাথরঘাটা কেআই ঘাট, বরগুনা',
    responseTime: '২৫ মিনিট',
    oxygenEquipped: false,
    notes: 'বঙ্গোপসাগর মোহনার নিকটবর্তী চরাঞ্চলের জেলে ও রোগীদের জন্য সার্বক্ষণিক প্রস্তুত।',
  },
  {
    id: 5,
    name: 'কাউনিয়া – মেহেন্দীগঞ্জ ইলিশা নদী এক্সপ্রেস অ্যাম্বুলেন্স',
    route: 'মেহেন্দীগঞ্জ (পাতারহাট) ⇄ বরিশাল ডিসি ঘাট',
    type: 'speed_boat',
    contactPerson: 'মনির হোসেন',
    phone: '০১৭২২-৯৯০৮৮৭',
    baseStation: 'কাউনিয়া ঘাট, বরিশাল',
    responseTime: '২০ মিনিট',
    oxygenEquipped: true,
    notes: 'কীর্তনখোলা ও গজারিয়া নদী হয়ে শেরেবাংলা মেডিকেলে রোগী পৌঁছাতে দ্রুততম।',
  },
];

export const RiverWaterAmbulanceGuide: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = WATER_AMBULANCES.filter((w) => {
    if (filterType === 'all') return true;
    return w.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-900 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-cyan-800/60">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-xs font-bold border border-cyan-400/30 text-cyan-200">
            <Waves className="w-3.5 h-3.5" />
            <span>বরিশাল বিভাগীয় উপকূল ও নদীপথ নেটওয়ার্ক</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            নদীপথ ও ওয়াটার অ্যাম্বুলেন্স জরুরি গাইড
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
            ভোলা, বরগুনা, পটুয়াখালীর চরাঞ্চল ও দ্বীপ উপজেলা থেকে মুমূর্ষু রোগীদের কীর্তনখোলা নদী পাড় হয়ে শেরেবাংলা মেডিকেল কলেজ হাসপাতালে স্থানান্তরের জন্য ডেডিকেটেড স্পিডবোট ও সরকারি ওয়াটার অ্যাম্বুলেন্স ডিরেক্টরি।
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-cyan-300" />
              <span>নৌ পুলিশ কেন্দ্রীয় নিয়ন্ত্রণ কক্ষ: ০৯৬১২-১১৯৯৯৯</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-amber-300" />
              <span>রাতের জরুরি ফেরি হটলাইন: ০৪৩১-৬৪০৬০</span>
            </div>
          </div>
        </div>
      </div>

      {/* Critical River Safety Advisory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5">
          <div className="flex items-center gap-2 font-black text-xs text-amber-800">
            <CloudFog className="w-4 h-4 text-amber-600" />
            <span>কুয়াশা ও রাতের নেভিগেশন প্রটোকল</span>
          </div>
          <p className="text-[11px] text-amber-900 leading-relaxed">
            শীতকালে বা ঘন কুয়াশায় রাতে নদী পারাপারের পূর্বে অবশ্যই স্পিডবোটের সার্চলাইট ও ফগ হর্ন সক্রিয় কিনা যাচাই করুন। ঘাটের মাস্টারকে জরুরি রোগী সম্পর্কে অবগত করুন।
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1.5">
          <div className="flex items-center gap-2 font-black text-xs text-blue-800">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>অক্সিজেন ও লাইফ জ্যাকেট প্রস্তুতি</span>
          </div>
          <p className="text-[11px] text-blue-900 leading-relaxed">
            নদীতে উঠানোর পূর্বে রোগীর সাথে পোর্টেবল অক্সিজেন সিলিন্ডার নিশ্চিত করুন। রোগী ও রক্তদাতা উভয়ের জন্য লাইফ জ্যাকেট পরিধান করা আইনি ও সুরক্ষামূলক বাধ্যবাধকতা।
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1.5">
          <div className="flex items-center gap-2 font-black text-xs text-emerald-800">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span>পায়রা ও বেকুটিয়া সেতুর রোড বিকল্প</span>
          </div>
          <p className="text-[11px] text-emerald-900 leading-relaxed">
            পটুয়াখালী ও পিরোজপুর থেকে সড়কপথে পায়রা সেতু ও বঙ্গমাতা ফজিলাতুন্নেছা মুজিব সেতু হয়ে এখন সরাসরি অ্যাম্বুলেন্স প্রবেশ করতে পারে। নদী পারাপার কেবল ভোলার জন্য জরুরি।
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
            filterType === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          সকল ওয়াটার অ্যাম্বুলেন্স ({toBengaliDigits(WATER_AMBULANCES.length)})
        </button>
        <button
          onClick={() => setFilterType('speed_boat')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
            filterType === 'speed_boat'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          হাই-স্পিড বোট অ্যাম্বুলেন্স
        </button>
        <button
          onClick={() => setFilterType('gov_water_vessel')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer ${
            filterType === 'gov_water_vessel'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          সরকারি নৌ অ্যাম্বুলেন্স
        </button>
      </div>

      {/* Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:border-blue-300 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {item.type === 'speed_boat'
                        ? 'স্পিডবোট'
                        : item.type === 'gov_water_vessel'
                        ? 'সরকারি ভেসেল'
                        : 'ট্রলার'}
                    </span>
                    {item.oxygenEquipped && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        অক্সিজেন সমৃদ্ধ
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1.5">
                    {item.name}
                  </h3>
                </div>

                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
                  <Ship className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="font-semibold text-slate-800">{item.route}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>ঘাট: {item.baseStation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>প্রস্তুতি সময়: {item.responseTime}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                {item.notes}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px]">চালক / দায়িত্বপ্রাপ্ত:</span>
                <span className="font-bold text-slate-700">{item.contactPerson}</span>
              </div>

              <a
                href={`tel:${item.phone}`}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>সরাসরি কল দিন</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
