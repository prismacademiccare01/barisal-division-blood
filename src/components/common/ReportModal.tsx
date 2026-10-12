import React, { useState } from 'react';
import { api } from '../../services/api.js';
import { X, AlertTriangle } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'donor' | 'request' | 'hospital';
  targetId: number;
  targetName: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
}) => {
  const [reason, setReason] = useState('নম্বর বন্ধ বা কল রিসিভ করছেন না');
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = reason === 'অন্যান্য' ? customReason : reason;
    if (!finalReason.trim()) {
      setError('কারণ লিখুন');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await api.submitReport(targetType, targetId, finalReason);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      } else {
        setError(res.message || 'রিপোর্ট পাঠাতে ব্যর্থ');
      }
    } catch {
      setError('ত্রুটি হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-red-600 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-bold text-base text-slate-900">অভিযোগ / রিপোর্ট করুন</h3>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          আপনি <strong>"{targetName}"</strong> সম্পর্কে অভিযোগ জানাচ্ছেন।
        </p>

        {success ? (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-bold text-center">
            আপনার অভিযোগ নথিভুক্ত করা হয়েছে। ধন্যবাদ!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {error && (
              <div className="p-2 bg-red-50 text-red-700 rounded-lg">{error}</div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">অভিযোগের কারণ</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="নম্বর বন্ধ বা কল রিসিভ করছেন না">নম্বর বন্ধ বা কল রিসিভ করছেন না</option>
                <option value="ভুল রক্তের গ্রুপ দেওয়া আছে">ভুল রক্তের গ্রুপ দেওয়া আছে</option>
                <option value="অর্থ বা অতিরিক্ত ফি দাবি করেছেন">অর্থ বা অতিরিক্ত ফি দাবি করেছেন</option>
                <option value="অসৌজন্যমূলক আচরণ">অসৌজন্যমূলক আচরণ</option>
                <option value="ভুল ঠিকানা বা এলাকা">ভুল ঠিকানা বা এলাকা</option>
                <option value="অন্যান্য">অন্যান্য কারণ</option>
              </select>
            </div>

            {reason === 'অন্যান্য' && (
              <div>
                <textarea
                  rows={2}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="বিস্তারিত কারণ লিখুন..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition disabled:opacity-50"
              >
                {submitting ? 'পাঠানো হচ্ছে...' : 'জমা দিন'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
