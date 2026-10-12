import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useAuth } from '../../hooks/useAuth.js';
import { AdminStats, Donor, ReportItem, AuditLog, BloodRequest } from '../../types/index.js';
import { toBengaliDigits, formatDateBengali } from '../../utils/formatters.js';
import { CloudflareAdminArchitecture } from './CloudflareAdminArchitecture.js';
import {
  Users,
  Heart,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Shield,
  Send,
  Activity,
  Trash2,
  Search,
  Filter,
  Check,
  X,
  Volume2,
  Cloud,
  Database,
  Ban,
  AlertOctagon,
  Download,
  Flame,
  Siren,
  Plus,
  RefreshCw,
  FileText,
  UserCheck,
  UserX,
  PhoneCall,
  Clock,
  Sparkles,
  Lock,
  Layers,
  BarChart3,
  HelpCircle,
  Eye,
  Smartphone,
} from 'lucide-react';

interface AdminDashboardProps {
  onExitAdmin?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  const { user, isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'stats' | 'donors' | 'requests' | 'hospitals' | 'broadcast' | 'reports' | 'backup' | 'cloudflare' | 'logs'
  >('stats');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Donors Tab State
  const [donors, setDonors] = useState<Donor[]>([]);
  const [donorSearch, setDonorSearch] = useState('');
  const [donorBloodGroup, setDonorBloodGroup] = useState('all');
  const [donorDistrict, setDonorDistrict] = useState('all');
  const [donorLoading, setDonorLoading] = useState(false);

  // Blood Requests Tab State
  const [requests, setRequests] = useState<any[]>([]);
  const [requestFilter, setRequestFilter] = useState('all');
  const [requestSearch, setRequestSearch] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

  // Hospitals Tab State
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [hospitalLoading, setHospitalLoading] = useState(false);
  const [showAddHospitalModal, setShowAddHospitalModal] = useState(false);
  const [selectedHospitalStocks, setSelectedHospitalStocks] = useState<{ id: number; name: string; stocks: Record<string, number> } | null>(null);

  // Reports Tab State
  const [reports, setReports] = useState<ReportItem[]>([]);

  // Broadcast & Emergency Banner Tab State
  const [bTitle, setBTitle] = useState('');
  const [bMessage, setBMessage] = useState('');
  const [bTarget, setBTarget] = useState('all');
  const [bStatus, setBStatus] = useState('');
  const [systemConfig, setSystemConfig] = useState<{
    emergency_broadcast_active: boolean;
    emergency_broadcast_message: string;
    emergency_broadcast_level: string;
    maintenance_mode: boolean;
  }>({
    emergency_broadcast_active: false,
    emergency_broadcast_message: '',
    emergency_broadcast_level: 'critical',
    maintenance_mode: false,
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Strict Disciplinary Action Modals
  const [banModalDonor, setBanModalDonor] = useState<{ id: number; name: string; phone: string } | null>(null);
  const [banReason, setBanReason] = useState('শৃঙ্খলা ভঙ্গ ও মিথ্যা তথ্যের কারণে অ্যাকাউন্ট স্থায়ীভাবে ব্যান');
  const [warnModalDonor, setWarnModalDonor] = useState<{ id: number; name: string } | null>(null);
  const [warnMessage, setWarnMessage] = useState('');
  const [warnLevel, setWarnLevel] = useState<'mild' | 'moderate' | 'strict'>('strict');

  // New Hospital Form
  const [newHospitalData, setNewHospitalData] = useState({
    name: '',
    district: 'বরিশাল',
    upazila: 'বরিশাল সদর',
    address: '',
    phone: '',
    emergency_contact: '',
    has_blood_bank: true,
  });

  // Notification Toast for Dashboard
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setActionAlert({ type, message });
    setTimeout(() => setActionAlert(null), 4000);
  };

  // 1. Fetch Stats
  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch {}
    setLoading(false);
  };

  // 2. Fetch Donors
  const fetchDonors = async () => {
    setDonorLoading(true);
    try {
      const res = await api.getAdminDonors({
        search: donorSearch,
        blood_group: donorBloodGroup,
        district: donorDistrict,
      });
      if (res.success && res.data) {
        setDonors(res.data.donors);
      }
    } catch {}
    setDonorLoading(false);
  };

  // 3. Fetch Requests
  const fetchRequests = async () => {
    setRequestLoading(true);
    try {
      const res = await api.getAdminRequests({
        status: requestFilter !== 'all' ? requestFilter : undefined,
        search: requestSearch,
      });
      if (res.success && res.data) {
        setRequests(res.data);
      }
    } catch {}
    setRequestLoading(false);
  };

  // 4. Fetch Hospitals
  const fetchHospitals = async () => {
    setHospitalLoading(true);
    try {
      const res = await api.getAdminHospitals();
      if (res.success && res.data) {
        setHospitals(res.data);
      }
    } catch {}
    setHospitalLoading(false);
  };

  // 5. Fetch Reports
  const fetchReports = async () => {
    try {
      const res = await api.getAdminReports();
      if (res.success && res.data) {
        setReports(res.data);
      }
    } catch {}
  };

  // 6. Fetch System Config
  const fetchSystemConfig = async () => {
    try {
      const res = await api.getSystemConfig();
      if (res.success && res.data) {
        setSystemConfig(res.data);
      }
    } catch {}
  };

  // 7. Fetch Audit Logs
  const fetchLogs = async () => {
    try {
      const res = await api.getAuditLogs();
      if (res.success && res.data) {
        setAuditLogs(res.data);
      }
    } catch {}
  };

  useEffect(() => {
    fetchStats();
    fetchSystemConfig();
  }, []);

  useEffect(() => {
    if (activeTab === 'donors') fetchDonors();
    if (activeTab === 'requests') fetchRequests();
    if (activeTab === 'hospitals') fetchHospitals();
    if (activeTab === 'reports') fetchReports();
    if (activeTab === 'broadcast') fetchSystemConfig();
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab]);

  // Strict Action Handlers
  const handleExecuteBan = async () => {
    if (!banModalDonor) return;
    try {
      const res = await api.donorStrictAction(banModalDonor.id, 'ban', banReason);
      if (res.success) {
        showAlert(res.message || 'অ্যাকাউন্ট সফলভাবে ব্যান করা হয়েছে।');
        setBanModalDonor(null);
        fetchDonors();
        fetchStats();
      } else {
        showAlert(res.message || 'ব্যান করতে সমস্যা হয়েছে', 'error');
      }
    } catch {
      showAlert('সার্ভার এরর', 'error');
    }
  };

  const handleUnbanDonor = async (id: number, name: string) => {
    try {
      const res = await api.donorStrictAction(id, 'unban', 'অ্যাডমিন কর্তৃক নিষেধাজ্ঞা প্রত্যাহার');
      if (res.success) {
        showAlert(res.message || `'${name}' এর নিষেধাজ্ঞা প্রত্যাহার করা হয়েছে।`);
        fetchDonors();
        fetchStats();
      }
    } catch {
      showAlert('আনব্যান করতে সমস্যা হয়েছে', 'error');
    }
  };

  const handleExecuteWarning = async () => {
    if (!warnModalDonor) return;
    try {
      const res = await api.donorStrictAction(warnModalDonor.id, 'warn', warnMessage, warnLevel);
      if (res.success) {
        showAlert(res.message || 'সতর্কবার্তা প্রেরণ সম্পন্ন হয়েছে।');
        setWarnModalDonor(null);
        setWarnMessage('');
      } else {
        showAlert(res.message || 'ব্যর্থ হয়েছে', 'error');
      }
    } catch {
      showAlert('সার্ভার এরর', 'error');
    }
  };

  const handleToggleVerify = async (id: number, currentVerified: number) => {
    const action = currentVerified === 1 ? 'unverify' : 'verify';
    try {
      const res = await api.donorStrictAction(id, action);
      if (res.success) {
        showAlert(res.message || 'ভেরিফিকেশন স্ট্যাটাস আপডেট হয়েছে।');
        fetchDonors();
        fetchStats();
      }
    } catch {}
  };

  const handleDeleteDonor = async (id: number, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে '${name}' এর ডোনার প্রোফাইল স্থায়ীভাবে মুছে ফেলতে চান?`)) return;
    try {
      const res = await api.donorStrictAction(id, 'delete');
      if (res.success) {
        showAlert('রক্তদাতার প্রোফাইল মুছে ফেলা হয়েছে।');
        fetchDonors();
        fetchStats();
      }
    } catch {}
  };

  // Request Strict Action Handlers
  const handleRequestStrictAction = async (id: number, action: 'fraud_takedown' | 'emergency_siren' | 'status_update' | 'delete', newStatus?: string) => {
    try {
      const res = await api.requestStrictAction(id, action, 'অ্যাডমিন ডিসিপ্লিনারি অ্যাকশন', newStatus);
      if (res.success) {
        showAlert(res.message || 'অনুরোধের ব্যবস্থা গ্রহণ করা হয়েছে।');
        fetchRequests();
        fetchStats();
      }
    } catch {
      showAlert('অ্যাকশন সম্পন্ন করতে সমস্যা হয়েছে', 'error');
    }
  };

  // Emergency Banner Switch Handler
  const handleToggleEmergencyBanner = async (active: boolean) => {
    try {
      const res = await api.updateSystemConfig({
        emergency_broadcast_active: active,
        emergency_broadcast_message: systemConfig.emergency_broadcast_message || '🚨 বরিশাল বিভাগে রক্তের জরুরি চাহিদা চলছে! প্রস্তুত রক্তদাতাগণ অবিলম্বে নিকটস্থ ব্লাড ব্যাংকে যোগাযোগ করুন।',
        emergency_broadcast_level: 'critical',
      });
      if (res.success) {
        setSystemConfig((prev) => ({ ...prev, emergency_broadcast_active: active }));
        showAlert(active ? '🚨 সাইট-ওয়াইড রেড অ্যালার্ট সক্রিয় করা হয়েছে!' : 'রেড অ্যালার্ট ব্যানার বন্ধ করা হয়েছে।');
      }
    } catch {}
  };

  // Send Broadcast SMS / Push
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle || !bMessage) return;
    setBStatus('পাঠানো হচ্ছে...');
    try {
      const res = await api.sendBroadcast(bTitle, bMessage, bTarget);
      if (res.success) {
        showAlert(res.message || 'ব্রডকাস্ট সফলভাবে প্রেরিত হয়েছে!');
        setBStatus('');
        setBTitle('');
        setBMessage('');
      } else {
        setBStatus('ব্যর্থ হয়েছে');
      }
    } catch {
      setBStatus('সার্ভার এরর');
    }
  };

  // Create Hospital
  const handleCreateHospital = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createAdminHospital(newHospitalData);
      if (res.success) {
        showAlert('নতুন হাসপাতাল যুক্ত করা হয়েছে।');
        setShowAddHospitalModal(false);
        setNewHospitalData({
          name: '',
          district: 'বরিশাল',
          upazila: 'বরিশাল সদর',
          address: '',
          phone: '',
          emergency_contact: '',
          has_blood_bank: true,
        });
        fetchHospitals();
        fetchStats();
      }
    } catch {
      showAlert('হাসপাতাল যুক্ত করতে সমস্যা হয়েছে', 'error');
    }
  };

  // Save Hospital Stocks
  const handleSaveHospitalStocks = async () => {
    if (!selectedHospitalStocks) return;
    try {
      const res = await api.updateAdminHospitalStocks(selectedHospitalStocks.id, selectedHospitalStocks.stocks);
      if (res.success) {
        showAlert('রক্তের মজুত সফলভাবে আপডেট করা হয়েছে।');
        setSelectedHospitalStocks(null);
      }
    } catch {
      showAlert('স্টক আপডেট ব্যর্থ হয়েছে', 'error');
    }
  };

  // Export Full Backup ("এডমিন পোর্টালে সকল তথ্য সংরক্ষিত থাকবে")
  const handleExportBackup = async () => {
    try {
      const res = await api.exportSystemBackup();
      if (res.success && res.data) {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `barishal-Blood-backup-${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showAlert('সম্পূর্ণ সিস্টেমের ডাটা ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে!');
      }
    } catch {
      showAlert('ব্যাকআপ এক্সপোর্ট করতে সমস্যা হয়েছে', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-20 text-slate-100">
      {/* Action Toast Alert */}
      {actionAlert && (
        <div className={`fixed top-20 right-4 sm:right-8 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border animate-bounce ${
          actionAlert.type === 'success'
            ? 'bg-emerald-950 border-emerald-600 text-emerald-100'
            : 'bg-red-950 border-red-600 text-red-100'
        }`}>
          {actionAlert.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-bold">{actionAlert.message}</span>
        </div>
      )}

      {/* Top Header Command Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-950">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  সেন্ট্রাল অ্যাডমিন কমান্ড পোর্টাল · barishal-Blood
                </h1>
                <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Control
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                barishal-Blood সিস্টেমের পূর্ণ তথ্য সংরক্ষণ, লাইভ পর্যবেক্ষণ ও যেকোনো সময়ে কঠোর প্রশাসনিক ব্যবস্থা
              </p>
            </div>
          </div>
        </div>

        {/* Top Controls: Admin Profile, Emergency Red Alert, Backup, Exit */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Emergency Alert Switch Button */}
          <button
            onClick={() => handleToggleEmergencyBanner(!systemConfig.emergency_broadcast_active)}
            className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer border ${
              systemConfig.emergency_broadcast_active
                ? 'bg-red-600 border-red-500 text-white animate-pulse shadow-lg shadow-red-950'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
            title="সাইট-ওয়াইড রেড অ্যালার্ট ব্যানার সুইচ"
          >
            <Siren className="w-4 h-4 text-red-400" />
            <span>
              {systemConfig.emergency_broadcast_active ? 'রেড অ্যালার্ট চালু 🚨' : 'জরুরি রেড অ্যালার্ট বন্ধ'}
            </span>
          </button>

          {/* Backup Snapshot Download */}
          <button
            onClick={handleExportBackup}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            title="সম্পূর্ণ ডাটা সংরক্ষণ ও ডাউনলোড"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">ডাটা ব্যাকআপ (JSON)</span>
          </button>

          {/* Logged in Admin Badge */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">{user?.name}</span>
            <span className="text-[10px] bg-red-600/30 border border-red-500/40 text-red-300 font-extrabold px-1.5 py-0.5 rounded uppercase">
              {isSuperAdmin ? 'Super Admin' : 'Admin'}
            </span>
          </div>

          {onExitAdmin && (
            <button
              onClick={onExitAdmin}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
            >
              মূল সাইটে ফিরুন ✕
            </button>
          )}
        </div>
      </div>

      {/* Modern Horizontal Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'stats', label: 'ওভারভিউ ও অ্যানালিটিক্স', icon: BarChart3 },
          { id: 'donors', label: 'রক্তদাতা নিয়ন্ত্রণ ও কঠোর ব্যবস্থা', icon: Users, badge: stats?.summary?.totalDonors },
          { id: 'requests', label: 'জরুরি রক্তের আবেদন ও ফ্রড কন্ট্রোল', icon: Siren, badge: stats?.summary?.emergencyRequests },
          { id: 'hospitals', label: 'হাসপাতাল ও ব্লাড স্টক এডিটর', icon: Building2, badge: stats?.summary?.totalHospitals },
          { id: 'broadcast', label: 'জরুরি ব্রডকাস্ট ও সাইট অ্যালার্ট', icon: Send },
          { id: 'reports', label: 'অভিযোগ ও রিপোর্ট বক্স', icon: AlertTriangle, badge: stats?.summary?.pendingReports },
          { id: 'backup', label: 'ডাটা সংরক্ষণ ও নিরাপত্তা', icon: Database },
          { id: 'cloudflare', label: 'Cloudflare D1 & R2 আর্কিটেকচার', icon: Cloud },
          { id: 'logs', label: 'অডিট ট্রেইল ও অ্যাকশন হিস্ট্রি', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-white text-red-600' : 'bg-slate-800 text-slate-300'
                }`}>
                  {toBengaliDigits(tab.badge)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {/* ========================================================= */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold">মোট রক্তদাতা</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {toBengaliDigits(stats?.summary?.totalDonors || 0)}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>সক্রিয় প্রস্তুত: {toBengaliDigits(stats?.summary?.activeDonors || 0)} জন</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold">ভেরিফাইড রক্তদাতা</span>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {toBengaliDigits(stats?.summary?.verifiedDonors || 0)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                যাচাইকৃত বিশ্বস্ত লাইফসেভার
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold">জরুরি রক্তের আবেদন</span>
                <Siren className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-red-400">
                {toBengaliDigits(stats?.summary?.totalRequests || 0)}
              </div>
              <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>ক্রিটিক্যাল: {toBengaliDigits(stats?.summary?.emergencyRequests || 0)} টি</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold">সফল রক্তদান সম্পন্ন</span>
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-400">
                {toBengaliDigits(stats?.summary?.fulfilledRequests || 0)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                সংরক্ষিত জীবন ও কেস ক্লোজড
              </div>
            </div>
          </div>

          {/* Blood Group and District Distributions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Blood Group Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-red-500" />
                  <span>রক্তের গ্রুপভিত্তিক পরিসংখ্যান (Barishal Blood Inventory)</span>
                </h3>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {(stats?.bloodGroupDist || []).map((bg: any) => (
                  <div key={bg.blood_group} className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-center">
                    <span className="font-black text-lg text-red-400 block">{bg.blood_group}</span>
                    <span className="text-xs font-bold text-white">{toBengaliDigits(bg.count)} জন</span>
                  </div>
                ))}
              </div>
            </div>

            {/* District Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>বরিশাল বিভাগের জেলাভিত্তিক রক্তদাতা বন্টন</span>
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {(stats?.districtDist || []).map((dst: any) => (
                  <div key={dst.district} className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-300 block truncate">{dst.district}</span>
                    <span className="text-base font-black text-amber-400">{toBengaliDigits(dst.count)} জন</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Audit Activities */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>সাম্প্রতিক প্রশাসনিক অ্যাকশন স্ট্রিম (Security Audit Trail)</span>
              </h3>
              <button
                onClick={() => setActiveTab('logs')}
                className="text-xs font-bold text-red-400 hover:text-red-300"
              >
                সব লগ দেখুন →
              </button>
            </div>

            <div className="divide-y divide-slate-800 text-xs">
              {(stats?.recentAuditLogs || []).slice(0, 5).map((log: any) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-400 bg-red-950/50 px-2 py-0.5 rounded border border-red-900/50">
                      {log.action}
                    </span>
                    <span className="text-slate-300">
                      পরিচালক: <strong>{log.user_name || 'সিস্টেম অ্যাডমিন'}</strong>
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {formatDateBengali(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile App & Flutter 3.x API Gateway Telemetry */}
          <div className="bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-cyan-900/50 rounded-3xl p-5 sm:p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span>Flutter ৩.x মোবাইল অ্যাপ ও API গেটওয়ে স্ট্যাটাস</span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                      ONLINE
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Android APK ও iOS Flutter ক্লায়েন্টের রিয়েলটাইম এন্ডপয়েন্ট সিঙ্ক
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]">
                  ভেন্ডর: com.barishalblood.app
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/40">
                  v1.0.0 Stable
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[11px] block">মোবাইল এন্ডপয়েন্টস</span>
                <strong className="text-white text-sm">/api/v1/donors, /requests</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[11px] block">অ্যাডমিন অ্যাক্সেস মেথড</span>
                <strong className="text-white text-sm">গোপন ৫-ট্যাপ ইস্টার-এগ সিঙ্কড</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[11px] block">রিলিজ প্যাকেজিং</span>
                <strong className="text-emerald-400 text-sm">Flutter APK / AAB রেডি</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DONORS MANAGEMENT & STRICT ACTIONS */}
      {/* ========================================================= */}
      {activeTab === 'donors' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-red-500" />
                  <span>রক্তদাতা পরিচালনা ও তাৎক্ষণিক কঠোর ব্যবস্থা</span>
                </h3>
                <p className="text-xs text-slate-400">
                  যেকোনো প্রোফাইল ব্যান, সতর্কবার্তা প্রেরণ, ভেরিফিকেশন মঞ্জুর বা স্থায়ী অপসারন করুন
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchDonors}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                  title="রিফ্রেশ করুন"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="নাম, ফোন বা এলাকা দিয়ে খুঁজুন..."
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchDonors()}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <select
                value={donorBloodGroup}
                onChange={(e) => {
                  setDonorBloodGroup(e.target.value);
                  setTimeout(fetchDonors, 50);
                }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="all">সকল রক্তের গ্রুপ</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>

              <select
                value={donorDistrict}
                onChange={(e) => {
                  setDonorDistrict(e.target.value);
                  setTimeout(fetchDonors, 50);
                }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="all">সকল জেলা</option>
                {['বরিশাল', 'পটুয়াখালী', 'ভোলা', 'পিরোজপুর', 'বরগুনা', 'ঝালকাঠি'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Donors List with Strict Action Controls */}
          {donorLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm">লোড হচ্ছে...</div>
          ) : donors.length === 0 ? (
            <div className="bg-slate-900 rounded-3xl p-10 text-center text-slate-500 border border-slate-800">
              কোনো রক্তদাতা পাওয়া যায়নি।
            </div>
          ) : (
            <div className="space-y-3">
              {donors.map((d: any) => {
                const isSuspended = d.user_status === 'suspended';
                return (
                  <div
                    key={d.id}
                    className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isSuspended ? 'border-red-900/60 bg-red-950/20' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center font-black text-lg text-red-400 shrink-0">
                        {d.blood_group}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-sm sm:text-base text-white">{d.name}</h4>
                          {d.is_verified === 1 && (
                            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              ভেরিফাইড
                            </span>
                          )}
                          {isSuspended && (
                            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1 animate-pulse">
                              <Ban className="w-3 h-3" />
                              ব্যানকৃত / নিষিদ্ধ
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                          <span className="font-mono text-slate-300">{d.phone}</span>
                          <span>•</span>
                          <span>{d.district}, {d.upazila}</span>
                          <span>•</span>
                          <span>দান করেছেন: {toBengaliDigits(d.total_donations || 0)} বার</span>
                        </div>
                      </div>
                    </div>

                    {/* Strict Action Buttons Group */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {/* Verify Badge Toggle */}
                      <button
                        onClick={() => handleToggleVerify(d.id, d.is_verified)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer border ${
                          d.is_verified === 1
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                        title="ভেরিফাইড ব্যাজ অনুমোদন বা প্রত্যাহার"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{d.is_verified === 1 ? 'ভেরিফাইড বাতিল' : 'ভেরিফাই করুন'}</span>
                      </button>

                      {/* Issue Strict Warning Notice */}
                      <button
                        onClick={() => {
                          setWarnModalDonor({ id: d.id, name: d.name });
                          setWarnMessage('');
                        }}
                        className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-700/60 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="কঠোর সতর্কবার্তা পাঠান"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>সতর্কবার্তা</span>
                      </button>

                      {/* Strict Ban / Unban */}
                      {isSuspended ? (
                        <button
                          onClick={() => handleUnbanDonor(d.id, d.name)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>আনব্যান ও সচল করুন</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setBanModalDonor({ id: d.id, name: d.name, phone: d.phone });
                            setBanReason('শৃঙ্খলা ভঙ্গ ও মিথ্যা তথ্যের কারণে অ্যাকাউন্ট স্থায়ীভাবে ব্যান');
                          }}
                          className="px-3.5 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-md shadow-red-950"
                          title="অ্যাকাউন্ট নিষিদ্ধ ও স্থায়ী ব্যান"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>কঠোর ব্যান</span>
                        </button>
                      )}

                      {/* Permanent Delete */}
                      <button
                        onClick={() => handleDeleteDonor(d.id, d.name)}
                        className="p-1.5 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-xl transition cursor-pointer"
                        title="প্রোফাইল মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: BLOOD REQUESTS & FRAUD CONTROL */}
      {/* ========================================================= */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Siren className="w-5 h-5 text-red-500" />
                  <span>জরুরি রক্তের আবেদন পরিচালনা ও ফ্রড কন্ট্রোল</span>
                </h3>
                <p className="text-xs text-slate-400">
                  ভুয়া আবেদন অবিলম্বে বাতিল, রেড সাইরেন অনুমোদন এবং আবেদন নিষ্পত্তি করুন
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={requestFilter}
                  onChange={(e) => {
                    setRequestFilter(e.target.value);
                    setTimeout(fetchRequests, 50);
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                >
                  <option value="all">সকল আবেদন</option>
                  <option value="pending">অপেক্ষমান (Pending)</option>
                  <option value="active">সক্রিয় (Active)</option>
                  <option value="fulfilled">সম্পন্ন (Fulfilled)</option>
                  <option value="cancelled">বাতিলকৃত (Cancelled)</option>
                </select>
              </div>
            </div>
          </div>

          {requestLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm">অনুরোধ তালিকা লোড হচ্ছে...</div>
          ) : requests.length === 0 ? (
            <div className="bg-slate-900 rounded-3xl p-10 text-center text-slate-500 border border-slate-800">
              কোনো রক্তের আবেদন পাওয়া যায়নি।
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((r: any) => (
                <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/40 text-red-300 font-black flex items-center justify-center text-xs">
                        {r.blood_group}
                      </span>
                      <h4 className="font-extrabold text-sm sm:text-base text-white">
                        রোগী: {r.patient_name} ({toBengaliDigits(r.bags_needed || 1)} ব্যাগ)
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.emergency_level === 'critical'
                          ? 'bg-red-500/30 text-red-300 border border-red-500 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {r.emergency_level === 'critical' ? '🚨 অতি-জরুরি' : 'জরুরি'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {r.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                      <span>হাসপাতাল: <strong className="text-slate-200">{r.hospital_name}</strong></span>
                      <span>•</span>
                      <span>যোগাযোগ: <strong className="text-emerald-400 font-mono">{r.contact_number}</strong></span>
                      <span>•</span>
                      <span>তারিখ: {formatDateBengali(r.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions on Request */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Trigger Red Siren Push */}
                    <button
                      onClick={() => handleRequestStrictAction(r.id, 'emergency_siren')}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="ম্যাচিং ডোনারদের কাছে রেড সাইরেন পুশ নোটিফিকেশন পাঠান"
                    >
                      <Siren className="w-3.5 h-3.5" />
                      <span>রেড সাইরেন পুশ</span>
                    </button>

                    {/* Fraud Takedown */}
                    <button
                      onClick={() => handleRequestStrictAction(r.id, 'fraud_takedown')}
                      className="px-3 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="ভুয়া বা স্প্যাম হিসেবে বাতিল করুন"
                    >
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>ভুয়া/বাতিল</span>
                    </button>

                    {/* Mark Fulfilled */}
                    <button
                      onClick={() => handleRequestStrictAction(r.id, 'status_update', 'fulfilled')}
                      className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>সম্পন্ন</span>
                    </button>

                    {/* Delete Request */}
                    <button
                      onClick={() => handleRequestStrictAction(r.id, 'delete')}
                      className="p-1.5 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-xl transition cursor-pointer"
                      title="আবেদন মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: HOSPITALS & BLOOD STOCKS */}
      {/* ========================================================= */}
      {activeTab === 'hospitals' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>হাসপাতাল ডিরেক্টরি ও ব্লাড স্টক নিয়ন্ত্রণ</span>
              </h3>
              <p className="text-xs text-slate-400">
                বরিশাল বিভাগের সকল মেডিকেল কলেজ ও হাসপাতালের ব্লাড ব্যাগ স্টক রিয়েলটাইমে হালনাগাদ করুন
              </p>
            </div>

            <button
              onClick={() => setShowAddHospitalModal(true)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-950"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন হাসপাতাল যুক্ত করুন</span>
            </button>
          </div>

          {hospitalLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm">হাসপাতাল তালিকা লোড হচ্ছে...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hospitals.map((h: any) => (
                <div key={h.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-white">{h.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{h.address}, {h.district}</p>
                    </div>
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                      {h.district}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 font-mono">
                    <span>হটলাইন: <strong className="text-emerald-400">{h.phone}</strong></span>
                    {h.emergency_contact && <span>জরুরি: {h.emergency_contact}</span>}
                  </div>

                  {/* Stock Editor Button */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => {
                        // Open stock editor for this hospital
                        setSelectedHospitalStocks({
                          id: h.id,
                          name: h.name,
                          stocks: { 'A+': 10, 'A-': 5, 'B+': 14, 'B-': 4, 'AB+': 6, 'AB-': 2, 'O+': 20, 'O-': 8 },
                        });
                      }}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>রক্তের মজুত/স্টক সমন্বয় করুন</span>
                    </button>

                    <button
                      onClick={async () => {
                        if (confirm(`'${h.name}' ডিলিট করতে চান?`)) {
                          await api.deleteAdminHospital(h.id);
                          fetchHospitals();
                        }
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400"
                      title="হাসপাতাল মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: BROADCAST & EMERGENCY ALERT */}
      {/* ========================================================= */}
      {activeTab === 'broadcast' && (
        <div className="space-y-5">
          {/* Site-wide Banner Alert Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Siren className="w-5 h-5 text-red-500" />
                  <span>সাইট-ওয়াইড রেড অ্যালার্ট ব্যানার কনফিগারেশন</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  সক্রিয় থাকলে মূল ওয়েবসাইটের প্রতিটি পেজের শীর্ষে লাল সতর্কবার্তা প্রদর্শিত হবে
                </p>
              </div>

              <button
                onClick={() => handleToggleEmergencyBanner(!systemConfig.emergency_broadcast_active)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer border ${
                  systemConfig.emergency_broadcast_active
                    ? 'bg-red-600 border-red-500 text-white animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {systemConfig.emergency_broadcast_active ? 'সক্রিয় (চালু আছে)' : 'নিষ্ক্রিয় (বন্ধ আছে)'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                জরুরি সাইট ব্যানার বার্তা:
              </label>
              <textarea
                rows={2}
                value={systemConfig.emergency_broadcast_message}
                onChange={(e) => setSystemConfig({ ...systemConfig, emergency_broadcast_message: e.target.value })}
                placeholder="যেমন: বরিশাল বিভাগে রক্তের জরুরি চাহিদা চলছে..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              />
              <button
                onClick={async () => {
                  await api.updateSystemConfig({
                    emergency_broadcast_message: systemConfig.emergency_broadcast_message,
                  });
                  showAlert('ব্যানার বার্তা সংরক্ষণ করা হয়েছে।');
                }}
                className="mt-2 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                বার্তা সংরক্ষণ করুন
              </button>
            </div>
          </div>

          {/* Mass Broadcast Notification Sender */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-red-500" />
              <h3 className="font-extrabold text-base text-white">
                পুশ নোটিফিকেশন ও এসএমএস ব্রডকাস্ট প্রেরণ
              </h3>
            </div>

            {bStatus && (
              <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs rounded-xl font-bold">
                {bStatus}
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">বার্তা শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    value={bTitle}
                    onChange={(e) => setBTitle(e.target.value)}
                    placeholder="e.g. শের-ই-বাংলা মেডিকেলে জরুরি O- রক্ত প্রয়োজন"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">প্রাপক গ্রুপ *</label>
                  <select
                    value={bTarget}
                    onChange={(e) => setBTarget(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    <option value="all">সকল নিবন্ধিত ব্যবহারকারী</option>
                    <option value="donors">সকল রক্তদাতা</option>
                    <option value="blood_group_O+">শুধুমাত্র O+ রক্তদাতা</option>
                    <option value="blood_group_O-">শুধুমাত্র O- রক্তদাতা (রেয়ার)</option>
                    <option value="blood_group_A+">শুধুমাত্র A+ রক্তদাতা</option>
                    <option value="blood_group_B+">শুধুমাত্র B+ রক্তদাতা</option>
                    <option value="blood_group_AB+">শুধুমাত্র AB+ রক্তদাতা</option>
                    <option value="blood_group_AB-">শুধুমাত্র AB- রক্তদাতা</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">বিস্তারিত বার্তা *</label>
                <textarea
                  rows={3}
                  required
                  value={bMessage}
                  onChange={(e) => setBMessage(e.target.value)}
                  placeholder="সম্পূর্ণ বার্তা লিখুন..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={!bTitle || !bMessage}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-red-950"
              >
                <Send className="w-4 h-4" />
                <span>তাত্ক্ষণিক ব্রডকাস্ট পাঠান</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: REPORTS & COMPLAINTS BOX */}
      {/* ========================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>ব্যবহারকারী অভিযোগ ও রিপোর্ট বক্স (Disciplinary Grievance Desk)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ভুয়া ডোনার, অসদাচরণ বা অনিয়মের বিরুদ্ধে প্রেরিত রিপোর্ট পর্যবেক্ষণ ও অবিলম্বে ব্যবস্থা গ্রহণ
            </p>
          </div>

          {reports.length === 0 ? (
            <div className="bg-slate-900 rounded-3xl p-10 text-center text-slate-500 border border-slate-800">
              কোনো অনিষ্পন্ন অভিযোগ নেই। সিস্টেম সম্পূর্ণ পরিষ্কার।
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r: any) => (
                <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-900/60 uppercase">
                        {r.reported_type} #{r.reported_id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === 'resolved' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {r.status === 'resolved' ? 'নিষ্পন্ন' : 'অপেক্ষমান'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-200">{r.reason}</p>
                    <div className="text-xs text-slate-500">
                      রিপোর্টার: <strong>{r.reporter_name || 'Anonymous'}</strong> ({r.reporter_phone || 'N/A'})
                    </div>
                  </div>

                  {/* Actions on Report */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={async () => {
                        const res = await api.reportStrictAction(r.id, 'ban_target', 'রিপোর্টের ভিত্তিতে ব্যান');
                        if (res.success) {
                          showAlert(res.message || 'অভিযুক্তকে ব্যান করা হয়েছে।');
                          fetchReports();
                        }
                      }}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>অভিযুক্তকে ব্যান করুন</span>
                    </button>

                    <button
                      onClick={async () => {
                        const res = await api.reportStrictAction(r.id, 'resolve', 'মীমাংসা সম্পন্ন');
                        if (res.success) {
                          showAlert('রিপোর্টটি নিষ্পত্তি করা হয়েছে।');
                          fetchReports();
                        }
                      }}
                      className="px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      মীমাংসা করুন
                    </button>

                    <button
                      onClick={async () => {
                        const res = await api.reportStrictAction(r.id, 'dismiss', 'খারিজ');
                        if (res.success) {
                          showAlert('রিপোর্টটি খারিজ করা হয়েছে।');
                          fetchReports();
                        }
                      }}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs transition cursor-pointer"
                    >
                      খারিজ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: DATA PERSISTENCE & BACKUP EXPORT */}
      {/* ========================================================= */}
      {activeTab === 'backup' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  সম্পূর্ণ সিস্টেম ডাটা সংরক্ষণ ও নিরাপদ ব্যাকআপ
                </h3>
                <p className="text-xs text-slate-400">
                  "এডমিন পোর্টালে সকল তথ্য সংরক্ষিত থাকবে" - এক ক্লিকে সম্পূর্ণ ডাটাবেস এক্সপোর্ট ও আর্কাইভ করুন
                </p>
              </div>
            </div>

            <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs text-slate-300">
              <h4 className="font-bold text-white text-sm">সংরক্ষিত তথ্যের বিবরণী:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>সকল নিবন্ধিত রক্তদাতার তালিকা, ঠিকানা ও রক্তদানের ইতিহাস</li>
                <li>জরুরি রক্তের সকল আবেদন ও জীবনরক্ষার কেস রেকর্ড</li>
                <li>হাসপাতাল, ব্লাড ব্যাংক ও অ্যাম্বুলেন্স ডিরেক্টরি</li>
                <li>নিরাপত্তা ব্ল্যাকলিস্ট ও প্রশাসনিক অডিট লগ</li>
              </ul>
            </div>

            <button
              onClick={handleExportBackup}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-950 transition"
            >
              <Download className="w-4 h-4" />
              <span>সম্পূর্ণ ডাটাবেস ব্যাকআপ ডাউনলোড করুন (Full JSON Backup)</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 8: CLOUDFLARE D1 & R2 ARCHITECTURE */}
      {/* ========================================================= */}
      {activeTab === 'cloudflare' && (
        <CloudflareAdminArchitecture />
      )}

      {/* ========================================================= */}
      {/* TAB 9: AUDIT LOGS */}
      {/* ========================================================= */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-500" />
              <span>নিরাপত্তা অডিট লগ ও প্রশাসনিক কঠোর ব্যবস্থার ইতিহাস</span>
            </h3>
            <button
              onClick={fetchLogs}
              className="p-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-800 text-xs font-mono">
            {auditLogs.map((log: any) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-900">
                      {log.action}
                    </span>
                    <span className="text-slate-300 font-sans">
                      অ্যাডমিন: <strong>{log.user_name || 'সুপার অ্যাডমিন'}</strong>
                    </span>
                  </div>
                  {log.details && (
                    <div className="text-[11px] text-slate-400 font-mono truncate max-w-xl">
                      {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                    </div>
                  )}
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <div>{formatDateBengali(log.created_at)}</div>
                  {log.ip_address && <div className="text-slate-600">IP: {log.ip_address}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STRICT BAN MODAL */}
      {/* ========================================================= */}
      {banModalDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-red-800/80 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <Ban className="w-6 h-6 shrink-0" />
              <h3 className="font-black text-lg text-white">কঠোর ব্যবস্থা: অ্যাকাউন্ট ব্যান ও লক</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              আপনি <strong>{banModalDonor.name}</strong> ({banModalDonor.phone}) কে স্থায়ীভাবে নিষিদ্ধ করতে যাচ্ছেন। এতে করে তিনি আর লগইন করতে পারবেন না এবং তার সমস্ত অ্যাক্সেস তাৎক্ষণিক বিচ্ছিন্ন হবে।
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                ব্যান করার সুনির্দিষ্ট কারণ *
              </label>
              <textarea
                rows={3}
                required
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="ব্যানের কারণ লিপিবদ্ধ করুন..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setBanModalDonor(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleExecuteBan}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-xs cursor-pointer shadow-lg shadow-red-950"
              >
                স্থায়ীভাবে ব্যান নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STRICT WARNING MODAL */}
      {/* ========================================================= */}
      {warnModalDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-amber-800/80 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-black text-lg text-white">প্রশাসনিক সতর্কবার্তা প্রেরণ</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>{warnModalDonor.name}</strong> এর প্রোফাইলে অফিশিয়াল সতর্কবার্তা পাঠানো হবে।
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">সতর্কতার তীব্রতা</label>
              <select
                value={warnLevel}
                onChange={(e) => setWarnLevel(e.target.value as any)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              >
                <option value="mild">মৃদু সতর্কবার্তা (Mild Warning)</option>
                <option value="moderate">মধ্যম সতর্কবার্তা (Moderate Notice)</option>
                <option value="strict">কঠোর চূড়ান্ত সতর্কবার্তা (Strict Final Warning)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">সতর্কবার্তার বিবরণী</label>
              <textarea
                rows={3}
                value={warnMessage}
                onChange={(e) => setWarnMessage(e.target.value)}
                placeholder="সতর্কবার্তা লিখুন (যেমন: নিয়ম ভঙ্গের কারণে সতর্ক করা হচ্ছে)..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setWarnModalDonor(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleExecuteWarning}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl text-xs cursor-pointer shadow-lg shadow-amber-950"
              >
                সতর্কবার্তা পাঠান
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD HOSPITAL MODAL */}
      {/* ========================================================= */}
      {showAddHospitalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>নতুন হাসপাতাল বা ব্লাড ব্যাংক যুক্ত করুন</span>
              </h3>
              <button onClick={() => setShowAddHospitalModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHospital} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">হাসপাতালের নাম *</label>
                <input
                  type="text"
                  required
                  value={newHospitalData.name}
                  onChange={(e) => setNewHospitalData({ ...newHospitalData, name: e.target.value })}
                  placeholder="e.g. রূপাতলী জেনারেল হাসপাতাল"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">জেলা *</label>
                  <select
                    value={newHospitalData.district}
                    onChange={(e) => setNewHospitalData({ ...newHospitalData, district: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  >
                    {['বরিশাল', 'পটুয়াখালী', 'ভোলা', 'পিরোজপুর', 'বরগুনা', 'ঝালকাঠি'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">উপজেলা</label>
                  <input
                    type="text"
                    value={newHospitalData.upazila}
                    onChange={(e) => setNewHospitalData({ ...newHospitalData, upazila: e.target.value })}
                    placeholder="e.g. বরিশাল সদর"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">ঠিকানা</label>
                <input
                  type="text"
                  value={newHospitalData.address}
                  onChange={(e) => setNewHospitalData({ ...newHospitalData, address: e.target.value })}
                  placeholder="e.g. রূপাতলী বাস স্ট্যান্ড সংলগ্ন"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">হটলাইন ফোন *</label>
                  <input
                    type="text"
                    required
                    value={newHospitalData.phone}
                    onChange={(e) => setNewHospitalData({ ...newHospitalData, phone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">জরুরি যোগাযোগ</label>
                  <input
                    type="text"
                    value={newHospitalData.emergency_contact}
                    onChange={(e) => setNewHospitalData({ ...newHospitalData, emergency_contact: e.target.value })}
                    placeholder="018XXXXXXXX"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddHospitalModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-red-950"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* HOSPITAL BLOOD STOCKS EDITOR MODAL */}
      {/* ========================================================= */}
      {selectedHospitalStocks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-white">রক্তের ব্যাগ স্টক রিয়েলটাইম এডিটর</h3>
                <p className="text-xs text-amber-400 font-semibold">{selectedHospitalStocks.name}</p>
              </div>
              <button onClick={() => setSelectedHospitalStocks(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <div key={bg} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                  <span className="font-black text-sm text-red-400 block mb-1">{bg}</span>
                  <input
                    type="number"
                    min="0"
                    value={selectedHospitalStocks.stocks[bg] ?? 0}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      setSelectedHospitalStocks({
                        ...selectedHospitalStocks,
                        stocks: { ...selectedHospitalStocks.stocks, [bg]: val },
                      });
                    }}
                    className="w-full text-center bg-slate-900 border border-slate-700 rounded-lg p-1 text-xs font-bold text-white focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">ব্যাগ</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedHospitalStocks(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleSaveHospitalStocks}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-emerald-950"
              >
                স্টক হালনাগাদ সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
