import React, { useState } from 'react';
import { BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import {
  Users,
  MapPin,
  Phone,
  ShieldCheck,
  Building2,
  HeartHandshake,
  Search,
  ExternalLink,
  Award,
} from 'lucide-react';

interface VolunteerClub {
  id: number;
  name: string;
  campus: string;
  district: string;
  coordinator: string;
  phone: string;
  established: string;
  activeVolunteers: string;
  focus: string;
}

export const VolunteerClubsDirectory: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const clubs: VolunteerClub[] = [
    {
      id: 1,
      name: 'সন্ধানী (Sandhani) - শেরেবাংলা মেডিকেল কলেজ ইউনিট',
      campus: 'শেরেবাংলা মেডিকেল কলেজ, বরিশাল',
      district: 'বরিশাল',
      coordinator: 'ডা. ফারহান আহমেদ (সাধারণ সম্পাদক)',
      phone: '০১৭১১-১১২২৩৩',
      established: '১৯৭৭',
      activeVolunteers: '২৫০+ জন',
      focus: 'বিনামূল্যে রক্তের গ্রুপ নির্ণয়, জরুরি ট্রান্সফিউশন ও মরণোত্তর চক্ষুদান ক্যাম্পেইন।',
    },
    {
      id: 2,
      name: 'বাঁধন (Badhan) - বিএম কলেজ পরিবার',
      campus: 'সরকারি ব্রজমোহন (বিএম) কলেজ, বরিশাল',
      district: 'বরিশাল',
      coordinator: 'মাহমুদুল হাসান (সভাপতি)',
      phone: '০১৮১২-২২৩৩৪৪',
      established: '১৯৯৭',
      activeVolunteers: '৩০০+ জন',
      focus: 'ছাত্র-যুবকদের রক্তদানে উদ্বুদ্ধকরণ এবং বরিশাল সদর এলাকার তাৎক্ষণিক ডোনার সাপোর্ট।',
    },
    {
      id: 3,
      name: 'বাংলাদেশ রেড ক্রিসেন্ট সোসাইটি - বরিশাল জেলা ইউনিট',
      campus: 'রেড ক্রিসেন্ট ভবন, সদর রোড, বরিশাল',
      district: 'বরিশাল',
      coordinator: 'যুব রেড ক্রিসেন্ট লিডার',
      phone: '০১৯১৩-৩৩৪৪৫৫',
      established: '১৯৭১',
      activeVolunteers: '৪৫০+ জন',
      focus: 'উপকূলীয় দুর্যোগ ব্যবস্থাপনা, জরুরি রক্তের সেল ও ফার্স্ট এইড রেসপন্স।',
    },
    {
      id: 4,
      name: 'পটুয়াখালী ব্লাড ডোনার্স ক্লাব (PBDC)',
      campus: 'পটুয়াখালী সরকারি কলেজ ও পটুয়াখালী মেডিকেল',
      district: 'পটুয়াখালী',
      coordinator: 'তানভীর আহমেদ রনি',
      phone: '০১৬১৪-৪৪৫৫৬৬',
      established: '২০১৪',
      activeVolunteers: '২০০+ জন',
      focus: 'পটুয়াখালী সদর, গলাচিপা ও বাউফলে নদী ও চরাঞ্চল এলাকায় রক্তের জরুরি জোগান।',
    },
    {
      id: 5,
      name: 'দ্বীপজেলা ভোলা যুব ব্লাড সোসাইটি',
      campus: 'ভোলা সরকারি কলেজ প্রাঙ্গণ',
      district: 'ভোলা',
      coordinator: 'সাকিব মাহমুদ',
      phone: '০১৭১৫-৫৫৬৬৭৭',
      established: '২০১৬',
      activeVolunteers: '১৮০+ জন',
      focus: 'বিচ্ছিন্ন দ্বীপ চরফ্যাশন ও দৌলতখানে জরুরি থ্যালাসেমিয়া ও প্রসূতি মায়ের রক্ত সহায়তা।',
    },
    {
      id: 6,
      name: 'পিরোজপুর রক্তযোদ্ধা পরিবার',
      campus: 'পিরোজপুর সরকারি সোহরাওয়ার্দী কলেজ',
      district: 'পিরোজপুর',
      coordinator: 'আশরাফুল ইসলাম',
      phone: '০১৮১৬-৬৬৭৭৮৮',
      established: '২০১৫',
      activeVolunteers: '১৬০+ জন',
      focus: 'নেছারাবাদ, কাউখালী ও মঠবাড়িয়ায় বিনামূল্যে ব্লাড গ্রুপিং ও জরুরি ডোনার সরবরাহ।',
    },
  ];

  const filtered = clubs.filter((c) => {
    const matchesDist = selectedDistrict === 'all' || c.district === selectedDistrict;
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.campus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.coordinator.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDist && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span>ফিচার ৮: দক্ষিণাঞ্চলের স্বেচ্ছাসেবী নেটওয়ার্ক</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            স্বেচ্ছাসেবী টিম ও ব্লাড ডোনার ক্লাবস ডিরেক্টরি
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            সন্ধানী, বাঁধন, রেড ক্রিসেন্ট ও বরিশাল বিভাগের শীর্ষস্থানীয় যুব রক্তদাতা সংগঠনের কো-অর্ডিনেটর হটলাইন
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          মোট সংযুক্ত ক্লাব: {clubs.length} টি
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="সংগঠন বা ক্যাম্পাসের নাম দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white transition"
          />
        </div>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
        >
          <option value="all">সকল জেলা (৬টি জেলা)</option>
          {BARISHAL_DIVISION_DISTRICTS.map((d) => (
            <option key={d.name} value={d.name}>{d.name} জেলা</option>
          ))}
        </select>
      </div>

      {/* Grid of Clubs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-red-200 hover:shadow-xs transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                  প্রতিষ্ঠা: {c.established}
                </span>
                <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                  {c.activeVolunteers} সক্রিয় সদস্য
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                {c.name}
              </h4>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{c.campus}</span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                {c.focus}
              </p>

              <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                <div>সমন্বয়ক: <strong>{c.coordinator}</strong></div>
                <div className="font-mono text-red-700 font-bold">হেল্পলাইন: {c.phone}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{c.district} জেলা</span>
              </span>

              <a
                href={`tel:${c.phone}`}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>হটলাইনে কল</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
