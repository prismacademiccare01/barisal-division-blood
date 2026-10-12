import React, { useState, useEffect } from 'react';
import { Hospital } from '../../types/index.js';
import { api } from '../../services/api.js';
import { BARISHAL_DIVISION_DISTRICTS } from '../../utils/locations.js';
import {
  Building2,
  MapPin,
  Phone,
  CheckCircle2,
  Search,
  Plus,
  AlertTriangle,
} from 'lucide-react';

export const HospitalDirectory: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New hospital form state
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newDistrict, setNewDistrict] = useState('বরিশাল');
  const [newUpazila, setNewUpazila] = useState('বরিশাল সদর');
  const [newPhone, setNewPhone] = useState('');
  const [newEmergency, setNewEmergency] = useState('');
  const [formMsg, setFormMsg] = useState('');

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const res = await api.getHospitals({
        district: selectedDistrict,
        search: searchTerm,
      });
      if (res.success && res.data) {
        setHospitals(res.data);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchHospitals();
  }, [selectedDistrict]);

  const handleAddHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAddress || !newPhone) return;

    try {
      const res = await api.createHospital({
        name: newName,
        address: newAddress,
        district: newDistrict,
        upazila: newUpazila,
        phone: newPhone,
        emergency_contact: newEmergency,
      });
      if (res.success) {
        setFormMsg(res.message || 'হাসপাতাল সংরক্ষিত হয়েছে');
        setTimeout(() => {
          setShowAddModal(false);
          setFormMsg('');
          fetchHospitals();
        }, 1200);
      }
    } catch {
      setFormMsg('সংরক্ষণ ব্যর্থ হয়েছে');
    }
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Header and Filter */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-red-600" />
              বরিশাল বিভাগের হাসপাতাল ডিরেক্টরি
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              জরুরি মুহূর্তে রক্তের জন্য সরাসরি হাসপাতালের ব্লাড ব্যাংক ও হটলাইনে যোগাযোগ করুন
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>হাসপাতাল যুক্ত করুন</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchHospitals()}
              placeholder="হাসপাতালের নাম বা এলাকা..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
            />
          </div>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
          >
            <option value="all">সকল জেলা</option>
            {BARISHAL_DIVISION_DISTRICTS.map((d) => (
              <option key={d.name} value={d.name}>
                {d.name} ({d.enName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hospital Cards */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">লোড হচ্ছে...</div>
      ) : hospitals.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
          কোনো হাসপাতাল খুঁজে পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospitals.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{h.name}</span>
                  </h3>
                  {h.is_verified === 1 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" /> ভেরিফাইড
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {h.address}, {h.upazila}, {h.district}
                  </span>
                </p>
              </div>

              {/* Contact Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`tel:${h.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>ফোন: {h.phone}</span>
                </a>

                {h.emergency_contact && (
                  <a
                    href={`tel:${h.emergency_contact}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-red-600" />
                    <span>জরুরি: {h.emergency_contact}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Hospital Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
            <h3 className="text-lg font-bold text-slate-900 mb-1">নতুন হাসপাতাল যুক্ত করুন</h3>
            <p className="text-xs text-slate-500 mb-4">
              যথাযথ তথ্য প্রদান করুন, তথ্য যাচাই করে তা পাবলিক ডিরেক্টরিতে যুক্ত করা হবে
            </p>

            {formMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl mb-3">
                {formMsg}
              </div>
            )}

            <form onSubmit={handleAddHospital} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">হাসপাতালের নাম *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: রূপাতলী সেবা ক্লিনিক"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ঠিকানা *</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="যেমন: রূপাতলী হাউজিং মোড়"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">জেলা</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {BARISHAL_DIVISION_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">উপজেলা</label>
                  <input
                    type="text"
                    value={newUpazila}
                    onChange={(e) => setNewUpazila(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ফোন নম্বর *</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">জরুরি হটলাইন</label>
                  <input
                    type="tel"
                    value={newEmergency}
                    onChange={(e) => setNewEmergency(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
