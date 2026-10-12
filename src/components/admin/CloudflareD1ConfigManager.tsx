import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { CloudflareD1Instance, D1QueryResult } from '../../types/index.js';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Server,
  Plus,
  RefreshCw,
  Trash2,
  Play,
  Copy,
  Check,
  Shield,
  Layers,
  Terminal,
  Activity,
  Globe,
  Radio,
  ExternalLink,
  Edit2,
  X,
  FileCode,
} from 'lucide-react';

export const CloudflareD1ConfigManager: React.FC = () => {
  const [instances, setInstances] = useState<CloudflareD1Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal for Add / Edit Instance
  const [showModal, setShowModal] = useState(false);
  const [editingInstance, setEditingInstance] = useState<CloudflareD1Instance | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    database_id: '',
    account_id: 'c7a8b9e0123456789abcdef012345678',
    api_token: '',
    binding_name: 'DB',
    region: 'APAC / Singapore (SIN - Edge)',
    environment: 'production' as 'production' | 'staging' | 'replica' | 'backup',
    replication_mode: 'primary' as 'primary' | 'read_replica' | 'standby',
    is_primary: 0,
  });
  const [savingInstance, setSavingInstance] = useState(false);

  // SQL Console State
  const [queryInput, setQueryInput] = useState('SELECT count(*) as total_donors, blood_group FROM donors GROUP BY blood_group;');
  const [queryRunning, setQueryRunning] = useState(false);
  const [queryResult, setQueryResult] = useState<D1QueryResult | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [copiedWrangler, setCopiedWrangler] = useState(false);

  // Fetch Instances
  const loadInstances = async () => {
    setLoading(true);
    try {
      const res = await api.getD1Instances();
      if (res.success && res.data) {
        setInstances(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load D1 instances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstances();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Preset Auto-fill
  const handleApplyPreset = (preset: 'prod_replica' | 'staging' | 'dr_failover') => {
    const randomHex = Math.random().toString(36).substring(2, 10);
    if (preset === 'prod_replica') {
      setFormData({
        name: `barishal-Blood-edge-${randomHex}`,
        database_id: `b4c89012-34ef-56a7-8901-${randomHex}1234`,
        account_id: 'c7a8b9e0123456789abcdef012345678',
        api_token: 'cf_d1_sec_edge_token_live',
        binding_name: 'DB_REPLICA',
        region: 'South Asia / Dhaka (DAC - Local Edge)',
        environment: 'production',
        replication_mode: 'read_replica',
        is_primary: 0,
      });
    } else if (preset === 'staging') {
      setFormData({
        name: `barishal-Blood-staging-${randomHex}`,
        database_id: `33d45ef6-78ab-90cd-ef12-${randomHex}5678`,
        account_id: 'c7a8b9e0123456789abcdef012345678',
        api_token: 'cf_d1_sec_staging_token_qa',
        binding_name: 'DB_STAGING',
        region: 'Western Europe / Frankfurt (FRA)',
        environment: 'staging',
        replication_mode: 'standby',
        is_primary: 0,
      });
    } else {
      setFormData({
        name: `barishal-Blood-dr-${randomHex}`,
        database_id: `88f12a34-99bc-11de-33aa-${randomHex}9999`,
        account_id: 'c7a8b9e0123456789abcdef012345678',
        api_token: 'cf_d1_sec_disaster_recovery_token',
        binding_name: 'DB_BACKUP',
        region: 'North America / N. Virginia (IAD)',
        environment: 'backup',
        replication_mode: 'standby',
        is_primary: 0,
      });
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingInstance(null);
    setFormData({
      name: '',
      database_id: '',
      account_id: 'c7a8b9e0123456789abcdef012345678',
      api_token: '',
      binding_name: 'DB',
      region: 'APAC / Singapore (SIN - Edge)',
      environment: 'production',
      replication_mode: 'primary',
      is_primary: 0,
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (inst: CloudflareD1Instance) => {
    setEditingInstance(inst);
    setFormData({
      name: inst.name,
      database_id: inst.database_id,
      account_id: inst.account_id,
      api_token: inst.api_token,
      binding_name: inst.binding_name,
      region: inst.region,
      environment: inst.environment,
      replication_mode: inst.replication_mode,
      is_primary: inst.is_primary,
    });
    setShowModal(true);
  };

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.database_id) {
      showToast('ডাটাবেসের নাম এবং ক্লাউডফ্লেয়ার ডাটাবেস আইডি আবশ্যক', 'error');
      return;
    }

    setSavingInstance(true);
    try {
      if (editingInstance) {
        const res = await api.updateD1Instance(editingInstance.id, formData);
        if (res.success) {
          showToast(`ইন্সট্যান্স '${formData.name}' সফলভাবে আপডেট করা হয়েছে`);
          setShowModal(false);
          loadInstances();
        } else {
          showToast(res.error || 'আপডেট ব্যর্থ হয়েছে', 'error');
        }
      } else {
        const res = await api.createD1Instance(formData);
        if (res.success) {
          showToast(`নতুন Cloudflare D1 ইন্সট্যান্স '${formData.name}' সফলভাবে সংযুক্ত করা হয়েছে`);
          setShowModal(false);
          loadInstances();
        } else {
          showToast(res.error || 'সংযুক্তিকরণ ব্যর্থ হয়েছে', 'error');
        }
      }
    } catch (err: any) {
      showToast(err.message || 'অপারেশন ব্যর্থ হয়েছে', 'error');
    } finally {
      setSavingInstance(false);
    }
  };

  // Set Primary Instance
  const handleSetPrimary = async (id: string, name: string) => {
    try {
      const res = await api.setPrimaryD1Instance(id);
      if (res.success) {
        showToast(`'${name}' এখন সক্রিয় প্রাইমারি D1 ডাটাবেস`);
        loadInstances();
      }
    } catch (err: any) {
      showToast(err.message || 'প্রাইমারি পরিবর্তন ব্যর্থ হয়েছে', 'error');
    }
  };

  // Test Connection / Ping
  const handleTestConnection = async (id: string) => {
    setTestingId(id);
    setTestResult(null);
    try {
      const res = await api.testD1Instance(id);
      if (res.success && res.data) {
        setTestResult(res.data);
        showToast(`কানেকশন সফল! রেসপন্স ল্যাটেন্সি: ${res.data.latencyMs} ms`);
        loadInstances();
      } else {
        showToast(res.error || 'পিং ব্যর্থ হয়েছে', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'কানেকশন পরীক্ষা ব্যর্থ হয়েছে', 'error');
    } finally {
      setTestingId(null);
    }
  };

  // Sync Schema
  const handleSyncInstance = async (id: string) => {
    setSyncingId(id);
    try {
      const res = await api.syncD1Instance(id);
      if (res.success) {
        showToast('D1 SQL স্কিমা ও টেবিল সফলভাবে সিঙ্ক হয়েছে!');
        loadInstances();
      } else {
        showToast(res.error || 'সিঙ্ক ব্যর্থ হয়েছে', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'সিঙ্ক ব্যর্থ হয়েছে', 'error');
    } finally {
      setSyncingId(null);
    }
  };

  // Delete Instance
  const handleDeleteInstance = async (id: string, name: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে '${name}' D1 ইন্সট্যান্স কনফিগারেশন মুছে ফেলতে চান?`)) return;
    try {
      const res = await api.deleteD1Instance(id);
      if (res.success) {
        showToast(`ইন্সট্যান্স '${name}' মুছে ফেলা হয়েছে`);
        loadInstances();
      } else {
        showToast(res.error || 'মুছে ফেলা যায়নি', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'মুছে ফেলা যায়নি', 'error');
    }
  };

  // Run Query in D1 SQL Console
  const handleRunQuery = async () => {
    if (!queryInput.trim()) return;
    setQueryRunning(true);
    setQueryError(null);
    setQueryResult(null);
    try {
      const res = await api.executeD1Query(queryInput);
      if (res.success && res.data) {
        setQueryResult(res.data);
      } else {
        setQueryError(res.error || 'কুয়েরি এক্সিকিউশন ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      setQueryError(err.message || 'কুয়েরি এক্সিকিউশন ব্যর্থ হয়েছে');
    } finally {
      setQueryRunning(false);
    }
  };

  // Generate wrangler.toml snippet
  const generateWranglerConfig = () => {
    let toml = `# Cloudflare D1 Database Bindings (Auto-Generated for Barishal Blood)\n`;
    toml += `name = "barishal-Blood-worker"\nmain = "src/index.ts"\ncompatibility_date = "2026-10-10"\n\n`;
    instances.forEach((inst) => {
      toml += `[[d1_databases]]\n`;
      toml += `binding = "${inst.binding_name}"\n`;
      toml += `database_name = "${inst.name}"\n`;
      toml += `database_id = "${inst.database_id}"\n\n`;
    });
    return toml;
  };

  const handleCopyWrangler = () => {
    navigator.clipboard.writeText(generateWranglerConfig());
    setCopiedWrangler(true);
    setTimeout(() => setCopiedWrangler(false), 2500);
  };

  const primaryInstance = instances.find((i) => i.is_primary === 1) || instances[0];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in transition ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/80 border border-red-500/40 text-red-300'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-400" />
              <span>Cloudflare D1 ডাটাবেস ইন্সট্যান্স কনফিগারেশন হাব</span>
            </h3>
            <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
              {instances.length} টি কনফিগারেশন
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            প্রোডাকশন, এজ রিড-রেপ্লিকা এবং স্টেজ ক্লাস্টারসমূহ পরিচালনা করুন। ক্লাউডফ্লেয়ার গ্লোবাল এজে শূন্য ডাউনটাইমে প্রাইমারি ইন্সট্যান্স পরিবর্তন ও পিং টেস্ট পরিচালনা করুন।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadInstances}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="রিফ্রেশ"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-xs font-extrabold transition flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন D1 ইন্সট্যান্স যুক্ত করুন</span>
          </button>
        </div>
      </div>

      {/* Active Primary Instance Spotlight */}
      {primaryInstance && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/40 p-5 sm:p-6 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  সক্রিয় প্রাইমারি ইন্সট্যান্স (LIVE PRODUCTION)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  Binding: {primaryInstance.binding_name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                  {primaryInstance.environment.toUpperCase()}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                {primaryInstance.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Cloudflare Database ID</span>
                  <span className="text-amber-300 font-mono font-bold truncate block" title={primaryInstance.database_id}>
                    {primaryInstance.database_id}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Edge Region</span>
                  <span className="text-slate-200 font-bold block truncate" title={primaryInstance.region}>
                    {primaryInstance.region}
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Read / Write Latency</span>
                  <span className="text-emerald-300 font-bold font-mono block">
                    {primaryInstance.read_latency_ms} ms / {primaryInstance.write_latency_ms} ms
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">Tables & Storage</span>
                  <span className="text-white font-bold block">
                    {primaryInstance.tables_count} টি টেবিল · {(primaryInstance.storage_bytes / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons for Primary */}
            <div className="flex flex-row lg:flex-col gap-2 shrink-0">
              <button
                onClick={() => handleTestConnection(primaryInstance.id)}
                disabled={testingId === primaryInstance.id}
                className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 ${testingId === primaryInstance.id ? 'animate-spin' : ''}`} />
                <span>{testingId === primaryInstance.id ? 'টেস্টিং...' : 'লাইভ পিং টেস্ট'}</span>
              </button>

              <button
                onClick={() => handleSyncInstance(primaryInstance.id)}
                disabled={syncingId === primaryInstance.id}
                className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-slate-700 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingId === primaryInstance.id ? 'animate-spin' : ''}`} />
                <span>{syncingId === primaryInstance.id ? 'সিঙ্ক হচ্ছে...' : 'স্কিমা সিঙ্ক'}</span>
              </button>
            </div>
          </div>

          {/* Test Result Live Banner */}
          {testResult && testResult.instanceId === primaryInstance.id && (
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{testResult.pingStatus} · Latency: {testResult.latencyMs} ms · {testResult.protocolVersion}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Location: {testResult.edgeLocation} · {new Date(testResult.timestamp).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Configured D1 Database Instances Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>সকল নিবন্ধিত D1 ডাটাবেস ক্লাস্টার</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            মাল্টি-রিজিওন রেপ্লিকা ও ব্যাকআপ সাপোর্ট
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instances.map((inst) => {
            const isPrimary = inst.is_primary === 1;
            return (
              <div
                key={inst.id}
                className={`rounded-2xl p-4.5 border transition flex flex-col justify-between space-y-4 ${
                  isPrimary
                    ? 'bg-slate-850 border-amber-500/40 shadow-lg'
                    : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                        inst.replication_mode === 'primary'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : inst.replication_mode === 'read_replica'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      {inst.replication_mode === 'primary'
                        ? 'Primary (R/W)'
                        : inst.replication_mode === 'read_replica'
                        ? 'Edge Read-Replica'
                        : 'Standby Failover'}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                      env: {inst.environment}
                    </span>
                  </div>

                  <div>
                    <h5 className="font-mono font-black text-sm text-white truncate" title={inst.name}>
                      {inst.name}
                    </h5>
                    <p className="font-mono text-[11px] text-slate-400 truncate mt-0.5">
                      Binding: <span className="text-amber-300 font-bold">{inst.binding_name}</span>
                    </p>
                  </div>

                  <div className="space-y-1.5 text-[11px] bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Database ID:</span>
                      <span className="text-slate-300 truncate max-w-[150px]" title={inst.database_id}>
                        {inst.database_id.substring(0, 14)}...
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <span>Region:</span>
                      <span className="text-slate-300 truncate max-w-[150px]">{inst.region.split('(')[0]}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-400">
                      <span>Latency:</span>
                      <span className="text-emerald-400 font-bold">{inst.read_latency_ms} ms</span>
                    </div>
                  </div>
                </div>

                {/* Instance Actions */}
                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTestConnection(inst.id)}
                      disabled={testingId === inst.id}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-800 text-xs font-bold transition cursor-pointer"
                      title="পিং টেস্ট"
                    >
                      <Zap className={`w-3.5 h-3.5 ${testingId === inst.id ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleSyncInstance(inst.id)}
                      disabled={syncingId === inst.id}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition cursor-pointer"
                      title="স্কিমা সিঙ্ক"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingId === inst.id ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(inst)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition cursor-pointer"
                      title="কনফিগারেশন সম্পাদনা"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {!isPrimary && (
                      <button
                        onClick={() => handleDeleteInstance(inst.id, inst.name)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-red-950/60 text-slate-400 hover:text-red-400 border border-slate-800 text-xs font-bold transition cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {!isPrimary ? (
                    <button
                      onClick={() => handleSetPrimary(inst.id, inst.name)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition cursor-pointer"
                    >
                      প্রাইমারি করুন
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
                      <Check className="w-3.5 h-3.5" /> প্রাইমারি
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* D1 SQL Live Query Console */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Cloudflare D1 লাইভ এসকিউএল কনসোল (Query Runner)</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              সক্রিয় D1 ইন্সট্যান্সে সরাসরি SQL কুয়েরি চালান (SELECT, PRAGMA, EXPLAIN QUERY PLAN)
            </p>
          </div>

          {/* Quick Query Templates */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() =>
                setQueryInput('SELECT count(*) as total_donors, blood_group FROM donors GROUP BY blood_group;')
              }
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-800 shrink-0 cursor-pointer"
            >
              Donor Stats
            </button>
            <button
              onClick={() => setQueryInput('SELECT id, name, database_id, region, is_primary FROM d1_database_instances;')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-800 shrink-0 cursor-pointer"
            >
              D1 Instances
            </button>
            <button
              onClick={() => setQueryInput('PRAGMA table_info(d1_donation_albums);')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-800 shrink-0 cursor-pointer"
            >
              Schema Info
            </button>
          </div>
        </div>

        {/* Query Input Box */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              rows={3}
              placeholder="SELECT * FROM table LIMIT 10;"
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-500/60 transition resize-y"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Target: <span className="text-slate-300 font-bold">{primaryInstance?.name || 'barishal-Blood-d1'}</span> (SQLite 3.45 Edge)
            </span>

            <button
              onClick={handleRunQuery}
              disabled={queryRunning}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shadow-md shadow-emerald-600/20"
            >
              <Play className={`w-3.5 h-3.5 ${queryRunning ? 'animate-spin' : ''}`} />
              <span>{queryRunning ? 'চলছে...' : 'এক্সিকিউট করুন (Run SQL)'}</span>
            </button>
          </div>
        </div>

        {/* Query Error */}
        {queryError && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 font-mono text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{queryError}</span>
          </div>
        )}

        {/* Query Results Table */}
        {queryResult && (
          <div className="space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>
                ফলাফল: <span className="text-emerald-400 font-bold">{queryResult.rows.length}</span> টি রো পাওয়া গেছে
                {queryResult.changes ? ` (Changes: ${queryResult.changes})` : ''}
              </span>
              <span className="text-amber-300">এক্সিকিউশন সময়: {queryResult.executionTimeMs} ms</span>
            </div>

            <div className="overflow-x-auto max-h-60 rounded-xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left font-mono text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0 border-b border-slate-800">
                  <tr>
                    {queryResult.columns.map((col, idx) => (
                      <th key={idx} className="p-2.5 font-bold whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {queryResult.rows.length === 0 ? (
                    <tr>
                      <td colSpan={queryResult.columns.length || 1} className="p-4 text-center text-slate-500">
                        কোনো ডেটা পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    queryResult.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-800/40 transition">
                        {queryResult.columns.map((col, colIdx) => (
                          <td key={colIdx} className="p-2.5 whitespace-nowrap text-slate-200">
                            {row[col] !== null && row[col] !== undefined
                              ? String(row[col])
                              : <span className="text-slate-600 italic">NULL</span>}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Cloudflare Wrangler CLI & Config Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>Cloudflare wrangler.toml কনফিগারেশন জেনারেটর</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              আপনার কনফিগার করা সমস্ত D1 বাইন্ডিংয়ের জন্য এক ক্লিকে টমল কনফিগ ফাইল কপি করুন
            </p>
          </div>

          <button
            onClick={handleCopyWrangler}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700 self-start sm:self-auto"
          >
            {copiedWrangler ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedWrangler ? 'কপি সম্পন্ন হয়েছে!' : 'Wrangler Config কপি করুন'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed">
          {generateWranglerConfig()}
        </pre>

        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-xs font-mono text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>CLI Test: wrangler d1 info {primaryInstance?.name || 'barishal-Blood-d1'}</span>
          <span className="text-[10px] text-amber-400 font-bold uppercase">Cloudflare Edge Driver</span>
        </div>
      </div>

      {/* Modal: Add or Edit D1 Instance */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 text-white shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base text-white">
                  {editingInstance ? 'D1 ইন্সট্যান্স কনফিগারেশন সম্পাদনা' : 'নতুন Cloudflare D1 ইন্সট্যান্স যুক্ত করুন'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets Bar (Only on New) */}
            {!editingInstance && (
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 block font-bold">কুইক প্রিসেট টেমপ্লেট:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('prod_replica')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer"
                  >
                    + এজ রেপ্লিকা (ঢাকা এজ)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('staging')}
                    className="px-2.5 py-1 rounded-lg bg-blue-950/50 hover:bg-blue-900/50 text-blue-300 border border-blue-500/30 text-[11px] font-bold cursor-pointer"
                  >
                    + স্টেজিং টেস্ট DB
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('dr_failover')}
                    className="px-2.5 py-1 rounded-lg bg-amber-950/50 hover:bg-amber-900/50 text-amber-300 border border-amber-500/30 text-[11px] font-bold cursor-pointer"
                  >
                    + ডিজাস্টার রিকভারি ব্যাকআপ
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">ডাটাবেসের নাম (Database Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. barishal-Blood-prod-d1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Cloudflare Database ID (UUID) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9f1a23b4-56c7-88d9-0e1f-23456789abcd"
                  value={formData.database_id}
                  onChange={(e) => setFormData({ ...formData, database_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Binding Name</label>
                  <input
                    type="text"
                    required
                    placeholder="DB / DB_REPLICA"
                    value={formData.binding_name}
                    onChange={(e) => setFormData({ ...formData, binding_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Environment</label>
                  <select
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="production">Production</option>
                    <option value="staging">Staging</option>
                    <option value="replica">Replica</option>
                    <option value="backup">Backup / DR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Replication Mode</label>
                  <select
                    value={formData.replication_mode}
                    onChange={(e) => setFormData({ ...formData, replication_mode: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="primary">Primary (Read/Write)</option>
                    <option value="read_replica">Read-Replica (Edge Cache)</option>
                    <option value="standby">Standby Failover</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Region / Edge</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="APAC / Singapore (SIN - Edge)">APAC / Singapore (SIN)</option>
                    <option value="South Asia / Dhaka (DAC - Local Edge)">South Asia / Dhaka (DAC)</option>
                    <option value="Western Europe / Frankfurt (FRA)">Western Europe / Frankfurt (FRA)</option>
                    <option value="North America / N. Virginia (IAD)">North America / N. Virginia (IAD)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Cloudflare Account ID</label>
                <input
                  type="text"
                  placeholder="32 character account id"
                  value={formData.account_id}
                  onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Cloudflare API Token (Optional / Live)</label>
                <input
                  type="password"
                  placeholder="Bearer token with D1:Edit permission"
                  value={formData.api_token}
                  onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={savingInstance}
                  className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold transition cursor-pointer disabled:opacity-50"
                >
                  {savingInstance ? 'সংরক্ষণ হচ্ছে...' : editingInstance ? 'আপডেট করুন' : 'ইন্সট্যান্স যুক্ত করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
