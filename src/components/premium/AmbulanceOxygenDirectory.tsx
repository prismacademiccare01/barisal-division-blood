import React, { useState } from 'react';
import { BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Phone,
  Truck,
  Wind,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface EmergencyVehicle {
  id: number;
  name: string;
  type: 'icu_ambulance' | 'ac_ambulance' | 'standard_ambulance' | 'oxygen_cylinder';
  provider: string;
  phone: string;
  district: string;
  upazila: string;
  availableHours: string;
  isVerified: boolean;
  notes: string;
}

export const AmbulanceOxygenDirectory: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const directory: EmergencyVehicle[] = [
    {
      id: 1,
      name: 'শেরেবাংলা মেডিকেল আইসিইউ অ্যাম্বুলেন্স সার্ভিস',
      type: 'icu_ambulance',
      provider: 'বরিশাল সেন্ট্রাল অ্যাম্বুলেন্স সিন্ডিকেট',
      phone: '০১৭০১-১২৩৪৫৬',
      district: 'বরিশাল',
      upazila: 'বরিশাল সদর',
      availableHours: '২৪ ঘণ্টা লাইভ',
      isVerified: true,
      notes: 'লাইফ সাপোর্ট, ভেন্টিলেটর এবং অক্সিজেন সুবিধাযুক্ত। ঢাকা রেফার্ড রোগীর বিশেষ ব্যবস্থা।',
    },
    {
      id: 2,
      name: 'আল-শেফা এসি অ্যাম্বুলেন্স সার্ভিস বরিশাল',
      type: 'ac_ambulance',
      provider: 'আল-শেফা ক্লিনিক',
      phone: '০১৮১৮-২৩৪৫৬৭',
      district: 'বরিশাল',
      upazila: 'বরিশাল সদর',
      availableHours: '২৪ ঘণ্টা',
      isVerified: true,
      notes: 'সেন্ট্রাল অক্সিজেন ও দক্ষ প্যারামেডিক সহকারীসহ।',
    },
    {
      id: 3,
      name: 'পটুয়াখালী জেলা জরুরি অ্যাম্বুলেন্স স্কোয়াড',
      type: 'ac_ambulance',
      provider: 'পটুয়াখালী রেড ক্রিসেন্ট ইউনিট',
      phone: '০১৯১৯-৩৪৫৬৭৮',
      district: 'পটুয়াখালী',
      upazila: 'পটুয়াখালী সদর',
      availableHours: '২৪ ঘণ্টা',
      isVerified: true,
      notes: 'পটুয়াখালী মেডিকেল থেকে বরিশাল শেরেবাংলা মেডিকেলে দ্রুত রোগী স্থানান্তর।',
    },
    {
      id: 4,
      name: 'ভোলা সেন্ট্রাল মেডিকেল অক্সিজেন ব্যাংক',
      type: 'oxygen_cylinder',
      provider: 'ভোলা মানবিক অক্সিজেন সেবা ফোরাম',
      phone: '০১৬১৬-৪৫৬৭৮৯',
      district: 'ভোলা',
      upazila: 'ভোলা সদর',
      availableHours: '২৪ ঘণ্টা জরুরি ডেলিভারি',
      isVerified: true,
      notes: 'বাসায় ও হাসপাতালে ফ্রি ফ্লোমিটারসহ অক্সিজেন সিলিন্ডার সরবরাহ।',
    },
    {
      id: 5,
      name: 'পিরোজপুর উপকূলীয় অক্সিজেন ও অ্যাম্বুলেন্স পুল',
      type: 'oxygen_cylinder',
      provider: 'পিরোজপুর যুব ব্লাড সোসাইটি',
      phone: '০১৭৭৭-৫৬৭৮৯০',
      district: 'পিরোজপুর',
      upazila: 'পিরোজপুর সদর',
      availableHours: '২৪ ঘণ্টা',
      isVerified: true,
      notes: 'সিলিন্ডার রিফিল এবং জরুরি সাপোর্ট টিম।',
    },
    {
      id: 6,
      name: 'বরগুনা সী-কোস্ট ইমার্জেন্সি অ্যাম্বুলেন্স',
      type: 'standard_ambulance',
      provider: 'বরগুনা জেলা সমাজকল্যাণ পরিষদ',
      phone: '০১৮৮৮-৬৭৮৯০১',
      district: 'বরগুনা',
      upazila: 'বরগুনা সদর',
      availableHours: '২৪ ঘণ্টা',
      isVerified: true,
      notes: 'আমতলী, পাথরঘাটা ও সদর এলাকায় দ্রুত সার্ভিস।',
    },
    {
      id: 7,
      name: 'ঝালকাঠি এক্সপ্রেস রোগী পরিবহন সেবা',
      type: 'standard_ambulance',
      provider: 'ঝালকাঠি হেলথ সার্ভিসেস',
      phone: '০১৯৯৯-৭৮৯০১২',
      district: 'ঝালকাঠি',
      upazila: 'ঝালকাঠি সদর',
      availableHours: '২৪ ঘণ্টা',
      isVerified: true,
      notes: 'নলছিটি ও রাজাপুর সহ বিভাগের সকল রুটে ২৪/৭ সার্ভিস।',
    },
  ];

  const filtered = directory.filter((item) => {
    const matchesDistrict = selectedDistrict === 'all' || item.district === selectedDistrict;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.upazila.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesType && matchesSearch;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'icu_ambulance':
        return { label: 'আইসিইউ অ্যাম্বুলেন্স', icon: Truck, color: 'text-red-700 bg-red-50' };
      case 'ac_ambulance':
        return { label: 'এসি অ্যাম্বুলেন্স', icon: Truck, color: 'text-blue-700 bg-blue-50' };
      case 'standard_ambulance':
        return { label: 'নন-এসি অ্যাম্বুলেন্স', icon: Truck, color: 'text-slate-700 bg-slate-100' };
      case 'oxygen_cylinder':
        return { label: 'মেডিকেল অক্সিজেন', icon: Wind, color: 'text-emerald-700 bg-emerald-50' };
      default:
        return { label: 'জরুরি সেবা', icon: Truck, color: 'text-slate-700 bg-slate-100' };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>ফিচার ২: ২৪/৭ জরুরি পরিবহন ও অক্সিজেন ডিরেক্টরি</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            অ্যাম্বুলেন্স ও অক্সিজেন সার্ভিস ডিরেক্টরি
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            বরিশাল বিভাগের ৬টি জেলার ভেরিফাইড আইসিইউ অ্যাম্বুলেন্স ও লাইভ অক্সিজেন সিলিন্ডার হটলাইন
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          মোট তালিকাভুক্ত: {toBengaliDigits(directory.length)} টি
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="সার্ভিস বা এলাকার নাম দিয়ে খুঁজুন..."
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

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
        >
          <option value="all">সকল সেবা ধরন</option>
          <option value="icu_ambulance">আইসিইউ অ্যাম্বুলেন্স (ICU)</option>
          <option value="ac_ambulance">এসি অ্যাম্বুলেন্স</option>
          <option value="standard_ambulance">নন-এসি অ্যাম্বুলেন্স</option>
          <option value="oxygen_cylinder">মেডিকেল অক্সিজেন সিলিন্ডার</option>
        </select>
      </div>

      {/* Grid of Vehicles & Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const typeInfo = getTypeLabel(item.type);
          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200 hover:border-red-200 hover:shadow-xs transition bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1 ${typeInfo.color}`}>
                    <typeInfo.icon className="w-3.5 h-3.5" />
                    <span>{typeInfo.label}</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {item.availableHours}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                  {item.name}
                </h4>

                <p className="text-xs text-slate-600 mb-2 font-medium">
                  পরিচালক: {item.provider}
                </p>

                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                  {item.notes}
                </p>

                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.upazila}, {item.district}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-slate-700">
                  {item.phone}
                </span>

                <a
                  href={`tel:${item.phone}`}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>কল করুন</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
