import React, { useState, useEffect } from 'react';
import { BloodRequest, RequestResponse } from '../../types/index.js';
import { api } from '../../services/api.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import { useAuth } from '../../hooks/useAuth.js';
import {
  X,
  Phone,
  Building2,
  Calendar,
  Clock,
  Heart,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MapPin,
  Check,
} from 'lucide-react';

interface RequestDetailModalProps {
  request: BloodRequest | null;
  onClose: () => void;
  onRefresh: () => void;
  onOpenAuth: () => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  onClose,
  onRefresh,
  onOpenAuth,
}) => {
  const { user, isDonor } = useAuth();
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [responseStatus, setResponseStatus] = useState<'accepted' | 'declined' | 'maybe'>('accepted');
  const [responseMessage, setResponseMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadDetails = async () => {
    if (!request) return;
    setLoading(true);
    try {
      const res = await api.getRequestById(request.id);
      if (res.success && res.data) {
        setDetails(res.data);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (request) {
      loadDetails();
    }
  }, [request]);

  if (!request) return null;

  const handleRespond = async (status: 'accepted' | 'declined' | 'maybe') => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.respondRequest(request.id, status, responseMessage);
      if (res.success) {
        setFeedback('আপনার প্রতিক্রিয়া সংরক্ষিত হয়েছে!');
        setTimeout(() => setFeedback(''), 3000);
        loadDetails();
        onRefresh();
      }
    } catch {
      setFeedback('প্রতিক্রিয়া পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await api.updateRequestStatus(request.id, newStatus);
      if (res.success) {
        loadDetails();
        onRefresh();
      }
    } catch {}
  };

  const isOwnerOrAdmin =
    user && (user.id === request.user_id || user.role === 'admin' || user.role === 'super_admin');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-6 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-red-600 font-black flex flex-col items-center justify-center shadow-md">
              <span className="text-xl leading-none">{request.blood_group}</span>
              <span className="text-[9px] uppercase font-bold text-red-400">রক্ত</span>
            </div>
            <div>
              <h2 className="text-lg font-bold">{request.patient_name}-এর জন্য রক্ত প্রয়োজন</h2>
              <span className="text-xs text-red-100 block">
                {request.hospital_name} ({request.district})
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {feedback && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
              {feedback}
            </div>
          )}

          {/* Key Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">রক্তের পরিমাণ</span>
              <span className="text-sm font-bold text-slate-800">
                {toBengaliDigits(request.units_needed)} ব্যাগ
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">জরুরি মাত্রা</span>
              <span className="text-sm font-bold text-red-600">
                {request.emergency_level === 'critical'
                  ? '🚨 অতি জরুরি'
                  : request.emergency_level === 'urgent'
                  ? '⚠️ জরুরি'
                  : 'ℹ️ সাধারণ'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">তারিখ ও সময়</span>
              <span className="text-xs font-semibold text-slate-800 block">
                {request.needed_date} ({request.needed_time})
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">যোগাযোগ</span>
              <a
                href={`tel:${request.contact_phone}`}
                className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline"
              >
                <Phone className="w-3.5 h-3.5" /> {request.contact_phone}
              </a>
            </div>
          </div>

          {/* Hospital & Location */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Building2 className="w-4 h-4 text-red-500" /> {request.hospital_name}
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {request.upazila}, {request.district}
            </div>
            {request.location_details && (
              <p className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60 mt-1">
                <strong>ওয়ার্ড/স্থান:</strong> {request.location_details}
              </p>
            )}
            {request.additional_notes && (
              <p className="text-slate-600 italic pt-1">"{request.additional_notes}"</p>
            )}
          </div>

          {/* Mark as Fulfilled / Cancelled for owner or admin */}
          {isOwnerOrAdmin && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center justify-between">
              <span className="font-bold text-amber-900">অনুরোধ ব্যবস্থাপনা:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange('fulfilled')}
                  className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition"
                >
                  রক্ত পাওয়া গেছে (সম্পন্ন)
                </button>
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition"
                >
                  বাতিল করুন
                </button>
              </div>
            </div>
          )}

          {/* Donor Response Action Box */}
          <div className="border border-red-100 bg-red-50/50 p-4 rounded-2xl">
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-2 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-600 fill-red-600" />
              আপনি কি এই রোগীকে রক্তদান করতে পারবেন?
            </h4>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => handleRespond('accepted')}
                disabled={submitting}
                className="py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> হ্যাঁ, পারবো
              </button>
              <button
                onClick={() => handleRespond('maybe')}
                disabled={submitting}
                className="py-2.5 px-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" /> পরে জানাবো
              </button>
              <button
                onClick={() => handleRespond('declined')}
                disabled={submitting}
                className="py-2.5 px-2 bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" /> পারবো না
              </button>
            </div>
          </div>

          {/* Responses List from Other Donors */}
          <div>
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider mb-2.5">
              রক্তদাতাদের সম্মতি তালিকা ({toBengaliDigits(details?.responses?.length || 0)})
            </h4>

            {loading ? (
              <div className="py-4 text-center text-xs text-slate-400">তথ্য লোড হচ্ছে...</div>
            ) : !details?.responses || details.responses.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                এখনো কোনো রক্তদাতা প্রতিক্রিয়া জানাননি। আপনিই প্রথম সম্মতি জানাতে পারেন!
              </div>
            ) : (
              <div className="space-y-2">
                {details.responses.map((resp: RequestResponse) => (
                  <div
                    key={resp.id}
                    className="p-3 rounded-xl border border-slate-100 bg-white flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span>{resp.donor_name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-red-100 text-red-700 font-extrabold">
                          {resp.blood_group}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {resp.upazila}, {resp.district}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          resp.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : resp.status === 'maybe'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {resp.status === 'accepted' ? 'সম্মত' : resp.status === 'maybe' ? 'সম্ভাব্য' : 'অসম্মত'}
                      </span>

                      {user && resp.donor_phone && (
                        <a
                          href={`tel:${resp.donor_phone}`}
                          className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition"
                          title="কল করুন"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
