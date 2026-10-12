import React, { useState } from 'react';
import { api } from '../../services/api.js';
import { useToast } from '../../hooks/useToast.js';
import {
  BARISHAL_DIVISION_DISTRICTS,
  BLOOD_GROUPS,
  getUpazilasForDistrict,
} from '../../utils/locations.js';
import { BloodGroup, EmergencyLevel } from '../../types/index.js';
import { X, AlertCircle, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { showToast } = useToast();
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [unitsNeeded, setUnitsNeeded] = useState(1);
  const [hospitalName, setHospitalName] = useState('শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)');
  const [district, setDistrict] = useState('বরিশাল');
  const [upazila, setUpazila] = useState('বরিশাল সদর');
  const [locationDetails, setLocationDetails] = useState('');
  const [neededDate, setNeededDate] = useState(new Date().toISOString().split('T')[0]);
  const [neededTime, setNeededTime] = useState('যত দ্রুত সম্ভব');
  const [contactPhone, setContactPhone] = useState('');
  const [emergencyLevel, setEmergencyLevel] = useState<EmergencyLevel>('urgent');
  const [caseInfo, setCaseInfo] = useState('জরুরি অপারেশন');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const upazilas = getUpazilasForDistrict(district);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!patientName.trim()) {
      setError('রোগীর নাম লিখুন');
      return;
    }
    if (!contactPhone.trim() || !/^01[3-9]\d{8}$/.test(contactPhone.trim())) {
      setError('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)');
      return;
    }
    if (!hospitalName.trim()) {
      setError('হাসপাতালের নাম লিখুন');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createRequest({
        patient_name: patientName.trim(),
        blood_group: bloodGroup,
        units_needed: unitsNeeded,
        hospital_name: hospitalName.trim(),
        district,
        upazila,
        location_details: locationDetails.trim(),
        needed_date: neededDate,
        needed_time: neededTime,
        contact_phone: contactPhone.trim(),
        emergency_level: emergencyLevel,
        case_info: caseInfo,
        additional_notes: additionalNotes.trim(),
      });

      if (res.success) {
        setSuccess(true);
        showToast('জরুরি রক্তের অনুরোধ সফলভাবে প্রকাশিত হয়েছে!', 'success');
        setTimeout(() => {
          setSuccess(false);
          onCreated();
          onClose();
        }, 1200);
      } else {
        setError(res.message || 'অনুরোধ তৈরি ব্যর্থ হয়েছে');
      }
    } catch {
      setError('সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-8 relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">রক্তের জরুরি অনুরোধ পোস্ট করুন</h2>
              <p className="text-xs text-red-100">রক্তদাতাদের তাৎক্ষণিক বিজ্ঞপ্তি পাঠানো হবে</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>রক্তের অনুরোধ সফলভাবে পোস্ট করা হয়েছে!</span>
            </div>
          )}

          {/* Emergency Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              প্রয়োজনের মাত্রা (Emergency Level) *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEmergencyLevel('critical')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition ${
                  emergencyLevel === 'critical'
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🚨 অতি জরুরি (Critical)
              </button>
              <button
                type="button"
                onClick={() => setEmergencyLevel('urgent')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition ${
                  emergencyLevel === 'urgent'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ⚠️ জরুরি (Urgent)
              </button>
              <button
                type="button"
                onClick={() => setEmergencyLevel('standard')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition ${
                  emergencyLevel === 'standard'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ℹ️ সাধারণ (Standard)
              </button>
            </div>
          </div>

          {/* Blood Group & Units Needed */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                রক্তের গ্রুপ *
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-red-600 bg-white"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                রক্তের পরিমাণ (ব্যাগ) *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={unitsNeeded}
                onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                required
              />
            </div>
          </div>

          {/* Patient Name & Contact Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                রোগীর নাম *
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                যোগাযোগের মোবাইল নম্বর *
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                required
              />
            </div>
          </div>

          {/* Hospital Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              হাসপাতালের নাম ও ঠিকানা *
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="যেমন: শের-ই-বাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH)"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
              required
            />
          </div>

          {/* District & Upazila */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">জেলা</label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setUpazila(getUpazilasForDistrict(e.target.value)[0] || 'সদর');
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
              >
                {BARISHAL_DIVISION_DISTRICTS.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">উপজেলা</label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
              >
                {upazilas.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location details (Ward/Bed) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ওয়ার্ড / কেবিন / বেড নম্বর (ঐচ্ছিক)
            </label>
            <input
              type="text"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
              placeholder="যেমন: পুরুষ সার্জারি ওয়ার্ড, বেড নং ১০"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                কবে রক্ত প্রয়োজন? *
              </label>
              <input
                type="date"
                value={neededDate}
                onChange={(e) => setNeededDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                কোন সময়? *
              </label>
              <input
                type="text"
                value={neededTime}
                onChange={(e) => setNeededTime(e.target.value)}
                placeholder="যেমন: সকাল ১০:০০"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                required
              />
            </div>
          </div>

          {/* Case Info */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">রোগের বিবরণ</label>
            <select
              value={caseInfo}
              onChange={(e) => setCaseInfo(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
            >
              <option value="জরুরি অপারেশন">জরুরি অপারেশন</option>
              <option value="সড়ক দুর্ঘটনা">সড়ক দুর্ঘটনা</option>
              <option value="ডেলিভারি / সিজারিয়ান">ডেলিভারি / সিজারিয়ান</option>
              <option value="থ্যালাসেমিয়া">থ্যালাসেমিয়া</option>
              <option value="ডেঙ্গু প্লাটিলেট">ডেঙ্গু প্লাটিলেট</option>
              <option value="ক্যান্সার / কেমোথেরাপি">ক্যান্সার / কেমোথেরাপি</option>
              <option value="অন্যান্য">অন্যান্য</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              অতিরিক্ত কোনো তথ্য (ঐচ্ছিক)
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="যেমন: রক্তদাতার যাতায়াত খরচ প্রদান করা হবে..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white py-3 rounded-2xl font-bold shadow-lg shadow-red-600/20 transition disabled:opacity-50"
            >
              {loading ? 'অনুরোধ পোস্ট হচ্ছে...' : 'রক্তের অনুরোধ নিশ্চিত করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
