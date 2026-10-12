import React, { useState } from 'react';
import { BloodRequest } from '../../types/index.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Phone,
  Send,
  AlertCircle,
} from 'lucide-react';

interface EmergencyShareModalProps {
  request: BloodRequest | null;
  onClose: () => void;
}

export const EmergencyShareModal: React.FC<EmergencyShareModalProps> = ({ request, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!request) return null;

  const formattedText = `🚨 জরুরি রক্তের প্রয়োজন! (barishal-Blood)
━━━━━━━━━━━━━━━━━
🩸 রক্তের গ্রুপ: ${request.blood_group}
📦 রক্তের পরিমাণ: ${toBengaliDigits(request.units_needed)} ব্যাগ
👤 রোগী: ${request.patient_name}
🏥 হাসপাতাল: ${request.hospital_name} (${request.upazila}, ${request.district})
${request.location_details ? `📍 স্থান: ${request.location_details}\n` : ''}⏰ প্রয়োজন: ${request.needed_date} (${request.needed_time})
🚨 কারণ: ${request.case_info || 'জরুরি চিকিৎসা'}
📞 সরাসরি যোগাযোগ: ${request.contact_phone}
━━━━━━━━━━━━━━━━━
জীবন বাঁচাতে অনুগ্রহ করে পোস্টটি দ্রুত শেয়ার করুন!
(barishal-Blood - বরিশাল ডিজিটাল ব্লাড নেটওয়ার্ক)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const encodedText = encodeURIComponent(formattedText);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const smsUrl = `sms:?body=${encodedText}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-red-600 mb-2">
          <Share2 className="w-5 h-5" />
          <h3 className="font-bold text-base text-slate-900">সোশ্যাল মিডিয়ায় শেয়ার করুন</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          জরুরি রক্তের পোস্টটি হোয়াটসঅ্যাপ, ফেসবুক বা এসএমএসে এক ক্লিকে ছড়িয়ে দিন
        </p>

        {/* Formatted Message Preview */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-56 overflow-y-auto mb-4 leading-relaxed">
          {formattedText}
        </div>

        {/* Share Action Buttons */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold mb-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp-এ পাঠান</span>
          </a>

          <a
            href={smsUrl}
            className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
          >
            <Phone className="w-4 h-4" />
            <span>SMS-এ পাঠান</span>
          </a>
        </div>

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>টেক্সট কপি করা হয়েছে!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>সম্পূর্ণ বার্তা কপি করুন</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
