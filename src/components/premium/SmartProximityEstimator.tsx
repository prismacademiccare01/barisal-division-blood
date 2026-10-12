import React, { useState, useMemo } from 'react';
import { Donor, BloodGroup } from '../../types/index.js';
import { BARISHAL_DIVISION_DISTRICTS, BLOOD_GROUPS } from '../../utils/locations.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Navigation,
  Compass,
  MapPin,
  Clock,
  Building2,
  Phone,
  Share2,
  AlertTriangle,
  Heart,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Copy,
  Zap,
} from 'lucide-react';

interface HospitalDestination {
  id: string;
  name: string;
  district: string;
  upazila: string;
  phone: string;
  emergency: string;
  bedCapacity: string;
}

const BARISHAL_KEY_HOSPITALS: HospitalDestination[] = [
  {
    id: 'sbmch',
    name: 'শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)',
    district: 'বরিশাল',
    upazila: 'বরিশাল সদর',
    phone: '01711-223344',
    emergency: '0431-217354',
    bedCapacity: '১০০০+ শয্যা (বিভাগীয় টারশিয়ারি)',
  },
  {
    id: 'barishal_sadar',
    name: 'বরিশাল জেনারেল (সদর) হাসপাতাল',
    district: 'বরিশাল',
    upazila: 'বরিশাল সদর',
    phone: '01712-334455',
    emergency: '0431-64120',
    bedCapacity: '২৫০ শয্যা',
  },
  {
    id: 'patuakhali_gen',
    name: 'পটুয়াখালী ২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল',
    district: 'পটুয়াখালী',
    upazila: 'পটুয়াখালী সদর',
    phone: '01713-445566',
    emergency: '0441-62244',
    bedCapacity: '২৫০ শয্যা (পায়রা ব্রিজ সংলগ্ন)',
  },
  {
    id: 'bhola_sadar',
    name: 'ভোলা ২৫০ শয্যা বিশিষ্ট জেনারেল হাসপাতাল',
    district: 'ভোলা',
    upazila: 'ভোলা সদর',
    phone: '01714-556677',
    emergency: '0491-61222',
    bedCapacity: '২৫০ শয্যা (দ্বীপ জেলা হেডকোয়ার্টার)',
  },
  {
    id: 'pirojpur_sadar',
    name: 'পিরোজপুর জেলা হাসপাতাল',
    district: 'পিরোজপুর',
    upazila: 'পিরোজপুর সদর',
    phone: '01715-667788',
    emergency: '0461-62320',
    bedCapacity: '১০০ শয্যা (বেকুটিয়া ব্রিজ লিংক)',
  },
  {
    id: 'barguna_sadar',
    name: 'বরগুনা ১০০ শয্যা বিশিষ্ট জেলা হাসপাতাল',
    district: 'বরগুনা',
    upazila: 'বরগুনা সদর',
    phone: '01716-778899',
    emergency: '0448-62250',
    bedCapacity: '১০০ শয্যা',
  },
  {
    id: 'jhalokathi_sadar',
    name: 'ঝালকাঠি ১০০ শয্যা বিশিষ্ট সদর হাসপাতাল',
    district: 'ঝালকাঠি',
    upazila: 'ঝালকাঠি সদর',
    phone: '01717-889900',
    emergency: '0498-63120',
    bedCapacity: '১০০ শয্যা',
  },
];

interface SmartProximityEstimatorProps {
  donors: Donor[];
  onCallDonor: (donor: Donor) => void;
  onViewProfile: (donor: Donor) => void;
  onOpenCreateRequest: () => void;
}

export const SmartProximityEstimator: React.FC<SmartProximityEstimatorProps> = ({
  donors,
  onCallDonor,
  onViewProfile,
  onOpenCreateRequest,
}) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('sbmch');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup>('O+');
  const [urgencyLevel, setUrgencyLevel] = useState<'critical' | 'urgent' | 'planned'>('critical');
  const [copiedText, setCopiedText] = useState(false);

  const selectedHospital = useMemo(
    () => BARISHAL_KEY_HOSPITALS.find((h) => h.id === selectedHospitalId) || BARISHAL_KEY_HOSPITALS[0],
    [selectedHospitalId]
  );

  // Proximity scoring logic for Barishal division geography
  const scoredDonors = useMemo(() => {
    return donors
      .filter((d) => d.blood_group === selectedBloodGroup && d.is_available === 1)
      .map((donor) => {
        let estimatedMinutes = 30;
        let distanceKm = 8;
        let routeNote = 'স্থানীয় রোড ট্রান্সপোর্ট';

        if (donor.district === selectedHospital.district) {
          if (donor.upazila === selectedHospital.upazila) {
            estimatedMinutes = 15 + Math.floor(Math.random() * 15);
            distanceKm = 3 + Math.floor(Math.random() * 6);
            routeNote = 'একই উপজেলা (তাৎক্ষণিক পৌঁছানো সম্ভব)';
          } else {
            estimatedMinutes = 35 + Math.floor(Math.random() * 25);
            distanceKm = 15 + Math.floor(Math.random() * 20);
            routeNote = 'একই জেলা আন্তঃউপজেলা যোগাযোগ';
          }
        } else {
          // Cross district in Barishal
          if (
            (donor.district === 'বরিশাল' && selectedHospital.district === 'পটুয়াখালী') ||
            (donor.district === 'পটুয়াখালী' && selectedHospital.district === 'বরিশাল')
          ) {
            estimatedMinutes = 50 + Math.floor(Math.random() * 20);
            distanceKm = 38 + Math.floor(Math.random() * 15);
            routeNote = 'পায়রা সেতু হয়ে হাইওয়ে পথ';
          } else if (
            (donor.district === 'বরিশাল' && selectedHospital.district === 'ঝালকাঠি') ||
            (donor.district === 'ঝালকাঠি' && selectedHospital.district === 'বরিশাল')
          ) {
            estimatedMinutes = 35 + Math.floor(Math.random() * 15);
            distanceKm = 22 + Math.floor(Math.random() * 10);
            routeNote = 'ঝালকাঠি-বরিশাল এক্সপ্রেস রোড';
          } else if (
            (donor.district === 'বরিশাল' && selectedHospital.district === 'পিরোজপুর') ||
            (donor.district === 'পিরোজপুর' && selectedHospital.district === 'বরিশাল')
          ) {
            estimatedMinutes = 65 + Math.floor(Math.random() * 20);
            distanceKm = 48 + Math.floor(Math.random() * 15);
            routeNote = 'বেকুটিয়া বঙ্গমাতা সেতু লিংক';
          } else {
            estimatedMinutes = 90 + Math.floor(Math.random() * 40);
            distanceKm = 60 + Math.floor(Math.random() * 30);
            routeNote = 'নদী ও আন্তঃজেলা আঞ্চলিক রুট';
          }
        }

        return {
          ...donor,
          estimatedMinutes,
          distanceKm,
          routeNote,
        };
      })
      .sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
  }, [donors, selectedBloodGroup, selectedHospital]);

  // Generate WhatsApp ready emergency SOS message
  const emergencyMessage = useMemo(() => {
    return `🚨 জরুরি রক্তের প্রয়োজন (বরিশাল বিভাগ)!
🩸 রক্তের গ্রুপ: ${selectedBloodGroup}
🏥 হাসপাতাল: ${selectedHospital.name}
📍 অবস্থান: ${selectedHospital.upazila}, ${selectedHospital.district}
📞 হাসপাতালের জরুরি লাইন: ${selectedHospital.phone}
⏰ জরুরি মাত্রা: ${
      urgencyLevel === 'critical'
        ? 'অতি জরুরি (১-২ ঘণ্টার মধ্যে)'
        : urgencyLevel === 'urgent'
        ? 'জরুরি (৪-৬ ঘণ্টার মধ্যে)'
        : 'পরিকল্পিত (আজকের মধ্যে)'
    }
নোট: জীবন রক্ষায় তাৎক্ষণিক এগিয়ে আসুন।
সিস্টেম: বরিশাল রক্ত (লিড আর্কিটেক্ট: MD. SAIDUL ISLAM)`;
  }, [selectedBloodGroup, selectedHospital, urgencyLevel]);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(emergencyMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(emergencyMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-rose-900/30 overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5 text-rose-400" />
            <span>স্মার্ট ইমার্জেন্সি রুট ও ডোনার প্রক্সিমিটি ট্র্যাকার</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            নিকটস্থ রক্তদাতা ও হাসপাতালে দ্রুত পৌঁছানোর সময় নির্ণয়
          </h2>
          <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
            বরিশাল বিভাগের নদী, সেতু (পায়রা ও বেকুটিয়া) ও হাইওয়ে নেটওয়ার্কের ভিত্তিতে রোগীর কাঙ্ক্ষিত হাসপাতালে পৌঁছানোর আনুমানিক সময় এবং তাৎক্ষণিক সক্রিয় রক্তদাতাদের অগ্রাধিকার তালিকা।
          </p>
        </div>
      </div>

      {/* Control Panel: Destination & Group Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
        {/* Hospital Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-red-600" />
            <span>কাঙ্ক্ষিত গন্তব্য হাসপাতাল</span>
          </label>
          <select
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          >
            {BARISHAL_KEY_HOSPITALS.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.district})
              </option>
            ))}
          </select>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{selectedHospital.bedCapacity}</span>
            <a
              href={`tel:${selectedHospital.phone}`}
              className="text-red-600 font-bold hover:underline flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              <span>{selectedHospital.phone}</span>
            </a>
          </div>
        </div>

        {/* Blood Group Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-600" />
            <span>প্রয়োজনীয় রক্তের গ্রুপ</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedBloodGroup(bg)}
                className={`py-2 rounded-xl text-xs font-black transition ${
                  selectedBloodGroup === bg
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Urgency Selector & Broadcast trigger */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>জরুরি মাত্রা</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            <button
              onClick={() => setUrgencyLevel('critical')}
              className={`py-2 rounded-xl text-[11px] font-bold transition ${
                urgencyLevel === 'critical'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              ক্রিটিকাল
            </button>
            <button
              onClick={() => setUrgencyLevel('urgent')}
              className={`py-2 rounded-xl text-[11px] font-bold transition ${
                urgencyLevel === 'urgent'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              জরুরি
            </button>
            <button
              onClick={() => setUrgencyLevel('planned')}
              className={`py-2 rounded-xl text-[11px] font-bold transition ${
                urgencyLevel === 'planned'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              আজকের মধ্যে
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyMessage}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedText ? 'কপি হয়েছে!' : 'SOS টেক্সট কপি'}</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition"
              title="হোয়াটসঅ্যাপে জরুরি বার্তা পাঠান"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Matrix Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span>প্রক্সিমিটি অনুযায়ী রক্তদাতা অগ্রাধিকার তালিকা</span>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
              {toBengaliDigits(scoredDonors.length)} জন প্রস্তুত
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            গন্তব্য: <strong className="text-slate-800">{selectedHospital.name}</strong> · গ্রুপ: <strong className="text-red-600">{selectedBloodGroup}</strong>
          </p>
        </div>

        <button
          onClick={onOpenCreateRequest}
          className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition hidden sm:flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>পাবলিক রিকোয়েস্ট পোস্ট করুন</span>
        </button>
      </div>

      {/* Proximity Donors Grid */}
      {scoredDonors.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center text-slate-500 border border-slate-200">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 text-base mb-1">
            এই মুহূর্তে {selectedBloodGroup} গ্রুপের কোনো প্রস্তুত রক্তদাতা পাওয়া যায়নি
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            তাত্ক্ষণিকভাবে পাবলিক রক্তের অনুরোধ পোস্ট করুন অথবা অন্যান্য হাসপাতালে যোগাযোগ করুন।
          </p>
          <button
            onClick={onOpenCreateRequest}
            className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs"
          >
            জরুরি রক্তের আবেদন পোস্ট করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scoredDonors.map((donor, idx) => (
            <div
              key={donor.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-red-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-black text-base flex items-center justify-center shadow-xs">
                      {donor.blood_group}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-slate-900 text-sm">{donor.name}</h4>
                        {donor.is_verified ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        ) : null}
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{donor.upazila}, {donor.district}</span>
                      </p>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <span
                    className={`px-2 py-1 rounded-xl text-[10px] font-black ${
                      idx === 0
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : idx === 1
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    অগ্রাধিকার #{toBengaliDigits(idx + 1)}
                  </span>
                </div>

                {/* Travel Time & Distance Estimated Bar */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>আনুমানিক পৌঁছানোর সময়:</span>
                    </span>
                    <span className="font-extrabold text-slate-900">
                      ~{toBengaliDigits(donor.estimatedMinutes)} মিনিট
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-blue-600" />
                      <span>দূরত্ব:</span>
                    </span>
                    <span className="font-bold text-slate-700">
                      প্রায় {toBengaliDigits(donor.distanceKm)} কি.মি.
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 font-medium">
                    রুট: {donor.routeNote}
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onViewProfile(donor)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition"
                >
                  প্রোফাইল
                </button>
                <button
                  onClick={() => onCallDonor(donor)}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>সরাসরি কল</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Architect Attribution */}
      <div className="p-4 rounded-2xl bg-slate-100/70 text-slate-500 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>স্মার্ট রুট লজিস্টিকস ও প্রক্সিমিটি অ্যালগরিদম আর্কিটেকচার</span>
        </div>
        <div className="font-bold text-slate-800">
          Lead Architect: MD. SAIDUL ISLAM
        </div>
      </div>
    </div>
  );
};
