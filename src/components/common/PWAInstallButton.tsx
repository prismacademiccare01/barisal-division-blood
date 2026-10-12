import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall.js';
import { Download, Share, PlusSquare, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed as standalone PWA/APK, don't show
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 font-medium rounded-lg bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-95 transition-all ${
          compact ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'
        }`}
        title="অ্যাপ ইনস্টল করুন"
      >
        <Download className="w-4 h-4" />
        <span>অ্যাপ ইনস্টল</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 font-medium transition ${
            compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
          }`}
          title="আইফোনে ইনস্টল করুন"
        >
          <Download className="w-3.5 h-3.5" />
          <span>iOS এ ইনস্টল</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl relative text-left">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-gray-900 mb-2">আইফোনে বরিশাল রক্ত ইনস্টল করুন</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                অ্যাপের মতো ব্যবহার করতে নিচের সহজ ধাপ অনুসরণ করুন:
              </p>
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl text-sm text-gray-700 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 font-bold text-xs shrink-0">
                    ১
                  </span>
                  <span>সাফারি ব্রাউজারে নিচে <Share className="inline w-4 h-4 text-blue-600 mx-1" /> <strong>Share</strong> বাটনে চাপুন।</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 font-bold text-xs shrink-0">
                    ২
                  </span>
                  <span>মেন্যু থেকে <PlusSquare className="inline w-4 h-4 text-slate-800 mx-1" /> <strong>Add to Home Screen</strong> চাপুন।</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 font-bold text-xs shrink-0">
                    ৩
                  </span>
                  <span>উপরে ডানপাশে <strong>Add</strong> বাটনে ট্যাপ করলেই হোমস্ক্রিনে চলে আসবে!</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition"
              >
                বুঝেছি, ধন্যবাদ
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
