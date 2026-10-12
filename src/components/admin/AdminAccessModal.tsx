import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { api } from '../../services/api.js';
import {
  Shield,
  Lock,
  User,
  Key,
  AlertCircle,
  X,
  CheckCircle2,
  ArrowRight,
  UserPlus,
  LogIn,
  Sparkles,
  Phone,
  Eye,
  EyeOff,
} from 'lucide-react';

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccessGranted: () => void;
  onOpenAuth: () => void;
}

export const AdminAccessModal: React.FC<AdminAccessModalProps> = ({
  isOpen,
  onClose,
  onAccessGranted,
}) => {
  const { user, isAdmin, adminLogin, adminFirstSetup } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'setup'>('login');
  const [canCreateFirstAccount, setCanCreateFirstAccount] = useState<boolean>(true);
  const [setupChecking, setSetupChecking] = useState<boolean>(true);

  // Login Form States
  const [loginUsername, setLoginUsername] = useState('superadmin');
  const [loginPassword, setLoginPassword] = useState('admin1234');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // First-Time Setup Form States
  const [setupUsername, setSetupUsername] = useState('');
  const [setupName, setSetupName] = useState('');
  const [setupPhone, setSetupPhone] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirmPassword, setSetupConfirmPassword] = useState('');
  const [showSetupPassword, setShowSetupPassword] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupError, setSetupError] = useState('');
  const [setupSuccess, setSetupSuccess] = useState('');

  // Check setup status when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoginError('');
      setSetupError('');
      setSetupSuccess('');

      api.checkAdminSetupStatus()
        .then((res) => {
          if (res.success && res.data) {
            setCanCreateFirstAccount(res.data.canCreateFirstAccount);
            if (res.data.canCreateFirstAccount) {
              setActiveTab('setup');
            } else {
              setActiveTab('login');
            }
          }
        })
        .catch(() => {})
        .finally(() => setSetupChecking(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await adminLogin(loginUsername.trim(), loginPassword);
      if (res.success) {
        onClose();
        onAccessGranted();
      } else {
        setLoginError(res.message || 'ভুল ইউজারনেম বা পাসওয়ার্ড!');
      }
    } catch {
      setLoginError('লগইন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');
    setSetupSuccess('');

    if (setupPassword !== setupConfirmPassword) {
      setSetupError('উভয় পাসওয়ার্ড হুবহু মিলতে হবে!');
      return;
    }

    if (setupPassword.length < 4) {
      setSetupError('পাসওয়ার্ড কমপক্ষে ৪ ডিজিট বা অক্ষরের হতে হবে।');
      return;
    }

    if (!setupUsername.trim() || !setupName.trim()) {
      setSetupError('ইউজারনেম এবং আপনার পূর্ণ নাম পূরণ করুন।');
      return;
    }

    setSetupLoading(true);

    try {
      const res = await adminFirstSetup({
        username: setupUsername.trim(),
        password: setupPassword,
        name: setupName.trim(),
        phone: setupPhone.trim() || undefined,
      });

      if (res.success) {
        setSetupSuccess('প্রথম সুপার অ্যাডমিন অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! ড্যাশবোর্ডে প্রবেশ করানো হচ্ছে...');
        setCanCreateFirstAccount(false);
        setTimeout(() => {
          onClose();
          onAccessGranted();
        }, 1200);
      } else {
        setSetupError(res.message || 'অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে।');
      }
    } catch {
      setSetupError('সার্ভার এরর: অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে।');
    } finally {
      setSetupLoading(false);
    }
  };

  const handleDirectAdminEnter = () => {
    onClose();
    onAccessGranted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto">
        {/* Header Bar */}
        <div className="relative bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border-b border-red-900/30 p-5 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[11px] font-bold text-red-400 tracking-wider uppercase mb-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <Shield className="w-4 h-4 text-red-500" />
            <span>গোপন প্রশাসনিক জোন (Easter-Egg Unlocked)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>barishal-Blood অ্যাডমিন পোর্টাল</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            বরিশাল রক্ত ইমোজিতে ৫ বার ট্যাপ করে গোপন প্রবেশদ্বার খোলা হয়েছে।
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* If already authenticated as Admin */}
          {isAdmin ? (
            <div className="bg-emerald-950/50 rounded-2xl p-5 border border-emerald-700/50 text-emerald-200 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <h4 className="font-extrabold text-sm text-emerald-100">
                  অ্যাডমিন পরিচয় নিশ্চিত হয়েছে!
                </h4>
              </div>
              <p className="text-xs text-emerald-300/90 leading-relaxed">
                আপনি <strong>{user?.name}</strong> হিসেবে অ্যাডমিন এক্সেস নিয়ে ইতিমধ্যে লগইন আছেন। আপনি এখনই পূর্ণ নিয়ন্ত্রণ প্যানেলে প্রবেশ করতে পারেন।
              </p>
              <button
                onClick={handleDirectAdminEnter}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition cursor-pointer"
              >
                <span>সরাসরি অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Tabs: Admin Login vs First-Time Setup */}
              <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>অ্যাডমিন লগইন</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('setup')}
                  className={`py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer relative ${
                    activeTab === 'setup'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>প্রথমবার অ্যাকাউন্ট তৈরি</span>
                  {canCreateFirstAccount && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-2 animate-pulse" />
                  )}
                </button>
              </div>

              {/* TAB 1: ADMIN LOGIN */}
              {activeTab === 'login' && (
                <div className="space-y-4">
                  <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <Lock className="w-4 h-4" />
                      <span>ইউজারনেম ও পাসওয়ার্ড দিয়ে লগইন</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      অনুমোদিত অ্যাডমিন ইউজারনেম ও গোপন পাসওয়ার্ড প্রদান করুন।
                    </p>
                  </div>

                  {loginError && (
                    <div className="flex items-center gap-2 p-3 bg-red-950/70 border border-red-800 text-red-200 text-xs rounded-xl">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        অ্যাডমিন ইউজারনেম (Username / Phone)
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          placeholder="যেমন: superadmin বা 01700000000"
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-700 text-white text-xs sm:text-sm focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        পাসওয়ার্ড (Password)
                      </label>
                      <div className="relative">
                        <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="অ্যাডমিন পাসওয়ার্ড লিখুন..."
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-950 rounded-xl border border-slate-700 text-white text-xs sm:text-sm font-mono tracking-wider focus:border-red-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Quick Demo Credentials Info */}
                    <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>ডেমো সুপার অ্যাডমিন:</span>
                      <span className="font-mono text-amber-300 font-bold">
                        superadmin / admin1234
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loginLoading || !loginUsername.trim() || !loginPassword}
                      className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-red-950 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{loginLoading ? 'যাচাই করা হচ্ছে...' : 'অ্যাডমিন পোর্টালে প্রবেশ করুন'}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: FIRST-TIME SETUP ("আর প্রথম একবার একাউন্ট তৈরির সুযোগ পাবে") */}
              {activeTab === 'setup' && (
                <div className="space-y-4">
                  {canCreateFirstAccount ? (
                    <>
                      <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 p-4 rounded-2xl border border-amber-800/40 text-xs text-amber-200/90 space-y-1.5">
                        <div className="flex items-center gap-2 font-bold text-amber-300">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>প্রথমবার সুপার অ্যাডমিন সেটআপ</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          আপনি প্রথমবার আপনার নিজস্ব পছন্দমতো <strong>ইউজারনেম ও পাসওয়ার্ড</strong> দিয়ে প্রধান সুপার অ্যাডমিন অ্যাকাউন্ট সুরক্ষিত করতে পারবেন। একবার তৈরি হয়ে গেলে এটি লক হয়ে যাবে।
                        </p>
                      </div>

                      {setupError && (
                        <div className="flex items-center gap-2 p-3 bg-red-950/70 border border-red-800 text-red-200 text-xs rounded-xl">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                          <span>{setupError}</span>
                        </div>
                      )}

                      {setupSuccess && (
                        <div className="flex items-center gap-2 p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs rounded-xl">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{setupSuccess}</span>
                        </div>
                      )}

                      <form onSubmit={handleSetupSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              ইউজারনেম (Username) *
                            </label>
                            <input
                              type="text"
                              required
                              value={setupUsername}
                              onChange={(e) => setSetupUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                              placeholder="e.g. admin_barishal"
                              className="w-full px-3.5 py-2 bg-slate-950 rounded-xl border border-slate-700 text-white text-xs sm:text-sm font-mono focus:border-amber-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              পূর্ণ নাম (Full Name) *
                            </label>
                            <input
                              type="text"
                              required
                              value={setupName}
                              onChange={(e) => setSetupName(e.target.value)}
                              placeholder="e.g. প্রধান নিয়ন্ত্রক"
                              className="w-full px-3.5 py-2 bg-slate-950 rounded-xl border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            মোবাইল নম্বর (ঐচ্ছিক)
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={setupPhone}
                              onChange={(e) => setSetupPhone(e.target.value)}
                              placeholder="017XXXXXXXX"
                              className="w-full pl-9 pr-3.5 py-2 bg-slate-950 rounded-xl border border-slate-700 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              নতুন পাসওয়ার্ড *
                            </label>
                            <input
                              type={showSetupPassword ? 'text' : 'password'}
                              required
                              value={setupPassword}
                              onChange={(e) => setSetupPassword(e.target.value)}
                              placeholder="কমপক্ষে ৪ সংখ্যা..."
                              className="w-full px-3.5 py-2 bg-slate-950 rounded-xl border border-slate-700 text-white text-xs sm:text-sm font-mono focus:border-amber-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              পাসওয়ার্ড নিশ্চিত করুন *
                            </label>
                            <input
                              type={showSetupPassword ? 'text' : 'password'}
                              required
                              value={setupConfirmPassword}
                              onChange={(e) => setSetupConfirmPassword(e.target.value)}
                              placeholder="পুনরায় লিখুন..."
                              className="w-full px-3.5 py-2 bg-slate-950 rounded-xl border border-slate-700 text-white text-xs sm:text-sm font-mono focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={showSetupPassword}
                              onChange={(e) => setShowSetupPassword(e.target.checked)}
                              className="rounded border-slate-700"
                            />
                            <span>পাসওয়ার্ড দেখুন</span>
                          </label>
                        </div>

                        <button
                          type="submit"
                          disabled={setupLoading || !setupUsername.trim() || !setupPassword}
                          className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-white font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-950 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>
                            {setupLoading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'মাস্টার সুপার অ্যাডমিন অ্যাকাউন্ট তৈরি করুন'}
                          </span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center mx-auto">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-sm text-white">
                        প্রথমবার অ্যাকাউন্ট তৈরির সুযোগ সম্পন্ন হয়েছে
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                        সিস্টেমের প্রধান অ্যাডমিন অ্যাকাউন্ট ইতিমধ্যে তৈরি করা হয়েছে। এখন শুধুমাত্র বিদ্যমান ইউজারনেম ও পাসওয়ার্ড দিয়ে লগইন করা যাবে।
                      </p>
                      <button
                        onClick={() => setActiveTab('login')}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                      >
                        অ্যাডমিন লগইন স্ক্রিনে ফিরে যান
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
