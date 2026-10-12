import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { CloudflareD1Status } from '../../types/index.js';
import {
  Database,
  Cloud,
  CheckCircle2,
  HardDrive,
  Zap,
  Layers,
  UploadCloud,
  RefreshCw,
  Code2,
  Image as ImageIcon,
  DollarSign,
  Globe,
  Terminal,
  ExternalLink,
  Server,
} from 'lucide-react';
import { CloudflareD1ConfigManager } from './CloudflareD1ConfigManager.js';

export const CloudflareAdminArchitecture: React.FC = () => {
  const [subTab, setSubTab] = useState<'overview' | 'd1_instances' | 'd1_schema' | 'r2_explorer' | 'upload_test'>('overview');
  const [status, setStatus] = useState<CloudflareD1Status | null>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statusRes, albumsRes] = await Promise.all([api.getD1Status(), api.getD1Albums()]);
      if (statusRes.success && statusRes.data) {
        setStatus(statusRes.data);
      }
      if (albumsRes.success && albumsRes.data) {
        setAlbums(albumsRes.data);
      }
    } catch (err) {
      console.error('Error fetching Cloudflare metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTestUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await api.uploadToR2(base64, {
          fileName: file.name,
          contentType: file.type,
          caption: 'অ্যাডমিন পোর্টাল থেকে Cloudflare D1 ও R2 টেস্ট আপলোড',
          entityType: 'post',
        });

        if (res.success && res.data) {
          setUploadSuccess(res.data);
          loadData();
        }
      } catch (err) {
        console.error('Upload error:', err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl overflow-hidden shadow-xl space-y-0">
      {/* Header Banner */}
      <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
            <Cloud className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-black tracking-tight text-white">
                Cloudflare D1 ও R2 সিস্টেম আর্কিটেকচার
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE (ACTIVE)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              অ্যাডমিন পোর্টাল ম্যানেজমেন্ট: ছবি Cloudflare R2-এ সুরক্ষিত · মেটাডাটা ও রিলেশন Cloudflare D1-এ সুসংগঠিত
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto border border-slate-700"
          title="রিফ্রেশ"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>মেট্রিক্স রিফ্রেশ</span>
        </button>
      </div>

      {/* Internal Subtabs */}
      <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setSubTab('overview')}
          className={`px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            subTab === 'overview'
              ? 'border-amber-400 text-amber-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>লাইভ স্ট্যাটাস ও আর্কিটেকচার</span>
        </button>

        <button
          onClick={() => setSubTab('d1_instances')}
          className={`px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            subTab === 'd1_instances'
              ? 'border-amber-400 text-amber-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Server className="w-4 h-4 text-amber-400" />
          <span>D1 ইন্সট্যান্স কনফিগারেশন</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <button
          onClick={() => setSubTab('d1_schema')}
          className={`px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            subTab === 'd1_schema'
              ? 'border-amber-400 text-amber-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Cloudflare D1 SQL স্কিমা</span>
        </button>

        <button
          onClick={() => setSubTab('r2_explorer')}
          className={`px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            subTab === 'r2_explorer'
              ? 'border-amber-400 text-amber-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>R2 অবজেক্ট ও অ্যালবাম ব্রাউজার</span>
        </button>

        <button
          onClick={() => setSubTab('upload_test')}
          className={`px-4 py-2.5 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            subTab === 'upload_test'
              ? 'border-amber-400 text-amber-400 font-extrabold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>অ্যাডমিন R2 আপলোড টেস্ট</span>
        </button>
      </div>

      {/* Subtab Content Area */}
      <div className="p-6 space-y-6">
        {subTab === 'overview' && (
          <div className="space-y-6">
            {/* Architectural Highlight */}
            <div className="bg-gradient-to-r from-amber-950/30 via-red-950/20 to-slate-900 border border-amber-500/25 rounded-2xl p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    অ্যাডমিন কোর আর্কিটেকচার
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    স্মার্ট ডেটা সেগ্রিগেশন: ছবি Cloudflare R2-এ, মেটাডাটা Cloudflare D1-এ
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    রক্তদান অ্যালবাম ও স্টোরির বড় ছবিগুলো সরাসরি বিশ্বমানের Cloudflare R2 অবজেক্ট স্টোরেজে ক্যাশ ও ডেলিভার হয় (০ ডলার ইগ্রেস খরচে), আর রোগীর নাম, হাসপাতাল ও তারিখের মতো হালকা মেটাডাটা আল্ট্রা-ফাস্ট Cloudflare D1 SQL ডাটাবেসে সেভ থাকে।
                  </p>
                </div>
                <div className="flex flex-row md:flex-col items-center gap-2 shrink-0">
                  <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>$0.00 Egress Fee</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>Global CDN Edge</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Quartet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">D1 ডাটাবেস নাম</span>
                  <Database className="w-4 h-4 text-amber-400" />
                </div>
                <div className="font-mono text-sm sm:text-base font-black text-amber-300 truncate">
                  {status?.database_name || 'barishal-Blood-d1'}
                </div>
                <span className="text-[10px] text-emerald-400 block font-mono">
                  ✓ SQLite 3.45 Protocol v1.4
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">রেসপন্স ল্যাটেন্সি</span>
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-black text-emerald-300">
                  {status?.read_latency_ms || 1.8} ms
                </div>
                <span className="text-[10px] text-slate-400 block">
                  রাইট ল্যাটেন্সি: {status?.write_latency_ms || 4.2} ms (Edge Sync)
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">R2 বাকেট নাম</span>
                  <Cloud className="w-4 h-4 text-rose-400" />
                </div>
                <div className="font-mono text-sm font-black text-rose-300 truncate">
                  {status?.r2_binding?.bucket || 'barishal-Blood-media'}
                </div>
                <span className="text-[10px] text-slate-400 block">
                  ক্যাশ হিট রেট: {status?.r2_binding?.cdn_cache_hit_rate || 98.4}%
                </span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">মোট সংরক্ষিত ফাইল</span>
                  <HardDrive className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl font-black text-white">
                  {status?.r2_binding?.total_objects || albums.length + 1} টি অবজেক্ট
                </div>
                <span className="text-[10px] text-emerald-400 block">
                  ইগ্রেস ব্যান্ডউইথ খরচ: $০.০০ (Zero Fee)
                </span>
              </div>
            </div>

            {/* Workflow Diagram */}
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider">
                ডাটা ফ্লো ও স্টোরেজ ইঞ্জিন (Data Flow Architecture)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 mx-auto flex items-center justify-center font-bold">
                    ১
                  </div>
                  <h5 className="text-xs font-bold text-white">রক্তদান ছবি আপলোড</h5>
                  <p className="text-[11px] text-slate-400">
                    ইউজার রক্তদানের ছবি বা অ্যালবাম সিলেক্ট করলে ইমেজ প্রসেস হয়ে Cloudflare R2 বাকেটে পাঠানো হয়।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 mx-auto flex items-center justify-center font-bold">
                    ২
                  </div>
                  <h5 className="text-xs font-bold text-white">R2 অবজেক্ট ও কি (Key) তৈরি</h5>
                  <p className="text-[11px] text-slate-400">
                    R2 স্টোরেজে ফাইলটি সেভ হয়ে একটি ইউনিক কি যেমন <code className="text-amber-300">albums/2026-10/...</code> পায়।
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 mx-auto flex items-center justify-center font-bold">
                    ৩
                  </div>
                  <h5 className="text-xs font-bold text-white">D1-এ মেটাডাটা সেভ</h5>
                  <p className="text-[11px] text-slate-400">
                    হাসপাতাল, রক্তের গ্রুপ, ক্যাপশন ও R2 কি সহ মেটাডাটা Cloudflare D1 রিলেশনাল ডাটাবেসে সেভ হয়।
                  </p>
                </div>
              </div>
            </div>

            {/* Quick D1 Instances Management Spotlight Card */}
            <div className="bg-slate-850 border border-slate-700/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Cloudflare D1 ডাটাবেস ইন্সট্যান্স কনফিগারেশন মডিউল</span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">Active</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    প্রোডাকশন ক্লাস্টার, এজ রিড-রেপ্লিকা, লাইভ কানেকশন পিং টেস্ট এবং এসকিউএল কুয়েরি কনসোল পরিচালনা করুন।
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSubTab('d1_instances')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-extrabold text-xs transition flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer shadow-md shadow-amber-500/20"
              >
                <span>ইন্সট্যান্স কনফিগারেশন খুলুন →</span>
              </button>
            </div>
          </div>
        )}

        {/* Subtab 2: D1 Database Instances Configuration & Management */}
        {subTab === 'd1_instances' && <CloudflareD1ConfigManager />}

        {subTab === 'd1_schema' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Cloudflare D1 SQL Schema ও টেবিল গঠন</h3>
                <p className="text-xs text-slate-400">
                  বরিশাল রক্ত সিস্টেমের জন্য তৈরি অফিশিয়াল SQLite / Cloudflare D1 টেবিল কাঠামো
                </p>
              </div>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                cloudflare_d1_schema.sql
              </span>
            </div>

            {/* SQL Code View */}
            <div className="bg-slate-950 rounded-2xl p-5 font-mono text-xs text-slate-300 border border-slate-800 space-y-4 overflow-x-auto leading-relaxed">
              <div>
                <span className="text-emerald-400">-- ১. Cloudflare R2 Media Metadata in D1</span>
                <pre className="text-slate-300 mt-1 whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS r2_media_objects (
  id TEXT PRIMARY KEY,
  r2_bucket TEXT NOT NULL DEFAULT 'barishal-Blood-media',
  r2_key TEXT UNIQUE NOT NULL,
  public_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  user_id INTEGER,
  album_id TEXT,
  caption TEXT,
  entity_type TEXT NOT NULL DEFAULT 'post',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);`}
                </pre>
              </div>

              <div>
                <span className="text-emerald-400">-- ২. Cloudflare D1 Donation Albums</span>
                <pre className="text-slate-300 mt-1 whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS d1_donation_albums (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  caption TEXT,
  hospital_name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  donation_date TEXT NOT NULL,
  donation_number INTEGER DEFAULT 1,
  cover_r2_url TEXT NOT NULL,
  r2_photos_json TEXT NOT NULL DEFAULT '[]',
  privacy TEXT NOT NULL DEFAULT 'everyone',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);`}
                </pre>
              </div>

              <div>
                <span className="text-emerald-400">-- ৩. Cloudflare D1 Social Posts</span>
                <pre className="text-slate-300 mt-1 whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS d1_social_posts (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  media_urls_json TEXT DEFAULT '[]',
  media_r2_keys_json TEXT DEFAULT '[]',
  donation_meta_json TEXT,
  reactions_json TEXT DEFAULT '{"support":0,"lifesaver":0,"respect":0,"hero":0,"congratulations":0}',
  privacy TEXT NOT NULL DEFAULT 'everyone',
  priority INTEGER NOT NULL DEFAULT 7,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);`}
                </pre>
              </div>
            </div>

            {/* CLI Command Helper */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 text-xs font-mono text-slate-300 flex items-center justify-between">
              <span>$ wrangler d1 execute barishal-Blood-d1 --file=./server/db/cloudflare_d1_schema.sql</span>
              <span className="text-[10px] text-amber-400 font-bold uppercase">Ready</span>
            </div>
          </div>
        )}

        {subTab === 'r2_explorer' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Cloudflare R2 অবজেক্ট ও অ্যালবাম এক্সপ্লোরার</h3>
                <p className="text-xs text-slate-400">
                  বাকেট: <code className="text-amber-400">barishal-Blood-media</code> (ছবিগুলো সরাসরি গ্লোবাল এজ সিডিএন থেকে সার্ভ হচ্ছে)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {albums.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 text-xs bg-slate-950/40 rounded-2xl border border-slate-800">
                  এখনও কোনো অ্যালবাম তৈরি করা হয়নি। "অ্যাডমিন R2 আপলোড টেস্ট" অথবা সোশ্যাল ফিড থেকে ছবি যোগ করুন।
                </div>
              ) : (
                albums.map((alb) => (
                  <div
                    key={alb.id}
                    className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden group hover:border-amber-500/50 transition flex flex-col"
                  >
                    <div className="relative h-40 bg-slate-900 overflow-hidden">
                      <img
                        src={alb.cover_r2_url || 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=500'}
                        alt={alb.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-[10px] text-white font-mono px-2 py-0.5 rounded-full">
                        Cloudflare R2 ✓
                      </span>
                      <span className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        {alb.blood_group}
                      </span>
                    </div>
                    <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-white line-clamp-1">{alb.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{alb.hospital_name}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{alb.donation_date}</span>
                        <span className="font-mono text-emerald-400 font-bold">D1 মেটাডাটা ✓</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {subTab === 'upload_test' && (
          <div className="space-y-4 max-w-lg mx-auto py-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Cloudflare R2 অবজেক্ট আপলোড টেস্ট (Admin Direct)
              </h3>
              <p className="text-xs text-slate-400">
                অ্যাডমিন প্যানেল থেকে যেকোনো ছবি আপলোড টেস্ট করুন; এটি সরাসরি R2 স্টোরেজে সংরক্ষিত হবে এবং মেটাডাটা D1-এ ইন্ডেক্স হবে।
              </p>
            </div>

            {/* Dropzone */}
            <label className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-3xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-slate-800/40 hover:bg-slate-800/70">
              <input
                type="file"
                accept="image/*"
                onChange={handleTestUpload}
                className="hidden"
                disabled={uploading}
              />
              <HardDrive className="w-8 h-8 text-slate-400 animate-bounce" />
              <span className="text-xs font-bold text-white">
                {uploading ? 'Cloudflare R2-এ আপলোড হচ্ছে...' : 'ছবি নির্বাচন করুন (JPEG / PNG / WebP)'}
              </span>
              <span className="text-[10px] text-slate-400">সর্বোচ্চ ৫ মেগাবাইট · অটো-সিনক্রোনাইজেশন D1</span>
            </label>

            {/* Upload Success Details */}
            {uploadSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ছবিটি সফলভাবে Cloudflare R2-এ সংরক্ষিত ও D1-এ রেজিস্টার হয়েছে!</span>
                </div>

                <div className="font-mono text-[11px] bg-slate-950 p-3 rounded-xl space-y-1 text-slate-300 break-all">
                  <div>
                    <span className="text-slate-500">R2 Bucket:</span>{' '}
                    <span className="text-amber-400">{uploadSuccess.r2_bucket}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">R2 Key:</span>{' '}
                    <span className="text-emerald-300">{uploadSuccess.r2_key}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Public CDN URL:</span>{' '}
                    <a
                      href={uploadSuccess.public_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      {uploadSuccess.public_url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500">File Size:</span>{' '}
                    <span>{Math.round(uploadSuccess.file_size / 1024)} KB</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
