import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useAuth } from '../../hooks/useAuth.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Building2,
  AlertCircle,
  CheckCircle2,
  Phone,
  RefreshCw,
  Droplet,
  Edit2,
  Check,
} from 'lucide-react';

export const HospitalLiveStockBoard: React.FC<{ onDonateClick?: (group: string) => void }> = ({
  onDonateClick,
}) => {
  const { isAdmin } = useAuth();
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editUnits, setEditUnits] = useState<number>(0);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await api.getBloodStocks();
      if (res.success && res.data) {
        setStocks(res.data);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleSaveStock = async (item: any) => {
    try {
      await api.updateBloodStock(item.hospital_id, item.blood_group, editUnits);
      setEditingId(null);
      fetchStocks();
    } catch {}
  };

  // Group stocks by hospital
  const groupedByHospital = stocks.reduce((acc: Record<string, any[]>, curr: any) => {
    const key = curr.hospital_name || 'অন্যান্য';
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-red-600" />
            হাসপাতাল ব্লাড ব্যাংক লাইভ স্টক ট্র্যাকার
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            বরিশাল শের-ই-বাংলা মেডিকেল ও জেলা সদর হাসপাতালসমূহে রক্ত মজুদের রিয়েলটাইম অবস্থা
          </p>
        </div>

        <button
          onClick={fetchStocks}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs">স্টক ডাটা লোড হচ্ছে...</div>
      ) : Object.keys(groupedByHospital).length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">কোনো স্টক তথ্য পাওয়া যায়নি</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByHospital).map(([hName, groupStocks]) => {
            const first = groupStocks[0];
            return (
              <div
                key={hName}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{hName}</h4>
                    <p className="text-[11px] text-slate-500">
                      {first?.upazila}, {first?.district} • ব্লাড ব্যাংক হটলাইন: {first?.phone}
                    </p>
                  </div>

                  <a
                    href={`tel:${first?.phone}`}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow-xs shrink-0"
                  >
                    <Phone className="w-3 h-3" />
                    <span>কল ব্লাড ব্যাংক</span>
                  </a>
                </div>

                {/* Stock Grid by Blood Group */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-1">
                  {groupStocks.map((item: any) => {
                    const isCritical = item.status === 'critical' || item.units <= 1;
                    const isLow = item.status === 'low' || (item.units > 1 && item.units <= 4);

                    return (
                      <div
                        key={item.id}
                        className={`p-2.5 rounded-xl border flex flex-col justify-between transition ${
                          isCritical
                            ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-200'
                            : isLow
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-xs text-slate-900">
                            {item.blood_group}
                          </span>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isCritical ? 'bg-red-600 animate-ping' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                        </div>

                        {editingId === item.id ? (
                          <div className="flex items-center gap-1 mt-1">
                            <input
                              type="number"
                              min="0"
                              value={editUnits}
                              onChange={(e) => setEditUnits(Number(e.target.value))}
                              className="w-12 px-1 py-0.5 text-xs font-bold border rounded bg-white"
                            />
                            <button
                              onClick={() => handleSaveStock(item)}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <span className="text-base font-extrabold text-slate-800 block">
                              {toBengaliDigits(item.units)}{' '}
                              <span className="text-[10px] font-normal text-slate-400">ব্যাগ</span>
                            </span>

                            <span
                              className={`text-[9px] font-bold block mt-0.5 ${
                                isCritical
                                  ? 'text-red-700'
                                  : isLow
                                  ? 'text-amber-700'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {isCritical ? 'তীব্র সংকট' : isLow ? 'স্বল্প মজুদ' : 'পর্যাপ্ত'}
                            </span>
                          </div>
                        )}

                        {isAdmin && editingId !== item.id && (
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditUnits(item.units);
                            }}
                            className="mt-1 text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-0.5"
                          >
                            <Edit2 className="w-2.5 h-2.5" /> এডিট
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
