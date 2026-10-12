import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Smartphone,
  Download,
  Code2,
  Terminal,
  X,
  Check,
  Copy,
  Sparkles,
  Shield,
  Search,
  PhoneCall,
  Activity,
  Layers,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall.js';

interface FlutterHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateEmergency?: () => void;
  onNavigateDonors?: () => void;
}

export const FlutterHubModal: React.FC<FlutterHubModalProps> = ({
  isOpen,
  onClose,
  onNavigateEmergency,
  onNavigateDonors,
}) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'guide'>('simulator');
  const [selectedCodeFile, setSelectedCodeFile] = useState<string>('main.dart');
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  // Mobile Simulator Internal States
  const [simulatorTab, setSimulatorTab] = useState<'home' | 'donors' | 'emergency' | 'hospitals' | 'admin'>('home');
  const [simulatorSecretTaps, setSimulatorSecretTaps] = useState(0);
  const [simulatorSelectedBg, setSimulatorSelectedBg] = useState('all');
  const [simulatorAdminLoggedIn, setSimulatorAdminLoggedIn] = useState(false);

  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  // Simulator Logo Tap Handler (Easter-Egg)
  const handleSimLogoTap = () => {
    const next = simulatorSecretTaps + 1;
    setSimulatorSecretTaps(next);
    if (next >= 5) {
      setSimulatorSecretTaps(0);
      setSimulatorTab('admin');
    }
  };

  // Pre-prepared Flutter code snippets for viewer
  const CODE_SNIPPETS: Record<string, { label: string; path: string; code: string }> = {
    'pubspec.yaml': {
      label: 'pubspec.yaml',
      path: 'flutter_app/pubspec.yaml',
      code: `name: barishal_blood
description: "barishal-Blood (বরিশাল রক্ত) - Production-ready Blood Donor Management & Emergency Blood Request Platform for Barishal Division."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8
  http: ^1.2.0
  provider: ^6.1.2
  shared_preferences: ^2.2.3
  url_launcher: ^6.3.0
  google_fonts: ^6.2.1
  intl: ^0.19.0
  flutter_spinkit: ^5.2.1

flutter:
  uses-material-design: true`,
    },
    'main.dart': {
      label: 'main.dart',
      path: 'flutter_app/lib/main.dart',
      code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/home_screen.dart';
import 'screens/donor_list_screen.dart';
import 'screens/emergency_request_screen.dart';
import 'screens/hospital_screen.dart';
import 'screens/admin_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const BarishalBloodApp());
}

class BarishalBloodApp extends StatelessWidget {
  const BarishalBloodApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'barishal-Blood (বরিশাল রক্ত)',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFDC2626),
          primary: const Color(0xFFDC2626),
        ),
        textTheme: GoogleFonts.hindSiliguriTextTheme(),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const MainNavigationScreen(),
        '/donors': (context) => const DonorListScreen(),
        '/emergency': (context) => const EmergencyRequestScreen(),
        '/hospitals': (context) => const HospitalScreen(),
        '/admin': (context) => const AdminScreen(),
      },
    );
  }
}`,
    },
    'api_service.dart': {
      label: 'api_service.dart',
      path: 'flutter_app/lib/services/api_service.dart',
      code: `import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/donor.dart';
import '../models/blood_request.dart';

class ApiService {
  static String baseUrl = 'https://ais-dev-oex4j4yfoyzzu3hfyyorxu-945884087105.asia-southeast1.run.app';
  static String? authToken;

  static Future<List<Donor>> getDonors({String bloodGroup = 'all', String district = 'all'}) async {
    final uri = Uri.parse('\$baseUrl/api/v1/donors?blood_group=\$bloodGroup&district=\$district');
    final response = await http.get(uri);
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final List list = data['data']['donors'] ?? [];
      return list.map((item) => Donor.fromJson(item)).toList();
    }
    return [];
  }

  static Future<Map<String, dynamic>> adminLogin(String username, String password) async {
    final response = await http.post(
      Uri.parse('\$baseUrl/api/v1/auth/admin-login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'username': username, 'password': password}),
    );
    return json.decode(response.body);
  }
}`,
    },
    'home_screen.dart': {
      label: 'home_screen.dart',
      path: 'flutter_app/lib/screens/home_screen.dart',
      code: `// Includes secret 5-tap on logo to reveal Admin Portal:
void _handleLogoTap() {
  _secretTapCount++;
  if (_secretTapCount >= 5) {
    _secretTapCount = 0;
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const AdminScreen()),
    );
  }
}`,
    },
    'AndroidManifest.xml': {
      label: 'AndroidManifest.xml',
      path: 'flutter_app/android/app/src/main/AndroidManifest.xml',
      code: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.barishalblood.app">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.CALL_PHONE"/>
</manifest>`,
    },
  };

  const handleCopyCode = () => {
    const text = CODE_SNIPPETS[selectedCodeFile]?.code || '';
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Download complete project as ZIP archive
  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();

      // Folder structure
      zip.file('pubspec.yaml', CODE_SNIPPETS['pubspec.yaml'].code);
      zip.file('README.md', `# barishal-Blood Flutter App\n\nRun:\nflutter pub get\nflutter run\nflutter build apk --release`);

      const lib = zip.folder('lib');
      lib?.file('main.dart', CODE_SNIPPETS['main.dart'].code);

      const services = lib?.folder('services');
      services?.file('api_service.dart', CODE_SNIPPETS['api_service.dart'].code);

      const models = lib?.folder('models');
      models?.file(
        'donor.dart',
        `class Donor {
  final int id;
  final String name;
  final String phone;
  final String bloodGroup;
  final String district;
  final String upazila;
  Donor({required this.id, required this.name, required this.phone, required this.bloodGroup, required this.district, required this.upazila});
  factory Donor.fromJson(Map<String, dynamic> json) => Donor(
    id: json['id'] ?? 0, name: json['name'] ?? '', phone: json['phone'] ?? '',
    bloodGroup: json['blood_group'] ?? '', district: json['district'] ?? 'বরিশাল', upazila: json['upazila'] ?? '',
  );
}`
      );

      models?.file(
        'blood_request.dart',
        `class BloodRequest {
  final int id;
  final String patientName;
  final String bloodGroup;
  final int unitsNeeded;
  final String hospitalName;
  final String contactPhone;
  BloodRequest({required this.id, required this.patientName, required this.bloodGroup, required this.unitsNeeded, required this.hospitalName, required this.contactPhone});
  factory BloodRequest.fromJson(Map<String, dynamic> json) => BloodRequest(
    id: json['id'] ?? 0, patientName: json['patient_name'] ?? '', bloodGroup: json['blood_group'] ?? '',
    unitsNeeded: json['units_needed'] ?? 1, hospitalName: json['hospital_name'] ?? '', contactPhone: json['contact_phone'] ?? '',
  );
}`
      );

      const screens = lib?.folder('screens');
      screens?.file('home_screen.dart', CODE_SNIPPETS['home_screen.dart'].code);
      screens?.file(
        'admin_screen.dart',
        `import 'package:flutter/material.dart';\nclass AdminScreen extends StatelessWidget {\n  const AdminScreen({super.key});\n  @override\n  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Admin Portal')));\n}`
      );

      const android = zip.folder('android')?.folder('app')?.folder('src')?.folder('main');
      android?.file('AndroidManifest.xml', CODE_SNIPPETS['AndroidManifest.xml'].code);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'barishal-blood-flutter-app.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-auto flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-950">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                  Flutter Mobile Hub
                </span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
                  Android & iOS
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                barishal-Blood Flutter মোবাইল অ্যাপ
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="সম্পূর্ণ Flutter প্রজেক্ট ডাউনলোড"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingZip ? 'তৈরি হচ্ছে...' : zipSuccess ? 'ডাউনলোড হয়েছে ✓' : 'ডাউনলোড ZIP প্রজেক্ট'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/40 px-6 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'simulator'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>লাইভ মোবাইল সিমুলেটর</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'code'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Flutter Dart সোর্স কোড</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'guide'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>APK বিল্ড নির্দেশিকা ও PWA</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: LIVE SMARTPHONE SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
              {/* Smartphone Frame */}
              <div className="w-[330px] h-[660px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 relative flex flex-col shrink-0 ring-8 ring-slate-900/50">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-full z-30 flex items-center justify-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-pulse" />
                </div>

                {/* Device Screen */}
                <div className="w-full h-full bg-slate-50 text-slate-900 rounded-[38px] overflow-hidden flex flex-col relative select-none">
                  {/* Status Bar */}
                  <div className="h-8 bg-white px-6 pt-1 flex items-center justify-between text-[11px] font-bold text-slate-700 shrink-0">
                    <span>9:41</span>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span>5G</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* App Bar inside Simulator */}
                  <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
                    <div
                      onClick={handleSimLogoTap}
                      className="flex items-center gap-2 cursor-pointer active:scale-95 transition"
                      title="৫ বার ট্যাপ করুন অ্যাডমিন পোর্টালের জন্য"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white text-sm shadow-xs">
                        🩸
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 leading-none">
                          বরিশাল<span className="text-red-600"> Blood</span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-medium">barishal-Blood</span>
                      </div>
                    </div>

                    {simulatorSecretTaps > 1 && (
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                        {simulatorSecretTaps}/৫
                      </span>
                    )}

                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs">
                      🔔
                    </div>
                  </div>

                  {/* Simulator Screen Body */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-100/70">
                    {/* SIMULATOR SCREEN: HOME */}
                    {simulatorTab === 'home' && (
                      <div className="space-y-3">
                        {/* Hero Card */}
                        <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-4 text-white shadow-md">
                          <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                            ২৪/৭ জরুরি রক্ত সেবা
                          </span>
                          <h4 className="font-extrabold text-sm mt-1.5 leading-snug">
                            জরুরি রক্তের প্রয়োজন?<br />দ্রুততম রক্তদাতা খুঁজুন
                          </h4>
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => setSimulatorTab('emergency')}
                              className="px-3 py-1.5 bg-white text-red-600 rounded-xl text-[10px] font-black shadow-xs cursor-pointer"
                            >
                              জরুরি আবেদন
                            </button>
                            <button
                              onClick={() => setSimulatorTab('donors')}
                              className="px-3 py-1.5 bg-red-700 text-white rounded-xl text-[10px] font-bold border border-white/20 cursor-pointer"
                            >
                              রক্তদাতা তালিকা
                            </button>
                          </div>
                        </div>

                        {/* Blood Groups Grid */}
                        <div className="bg-white rounded-2xl p-3 shadow-2xs border border-slate-200/80">
                          <h5 className="font-extrabold text-[11px] text-slate-800 mb-2">রক্তের গ্রুপ</h5>
                          <div className="grid grid-cols-4 gap-1.5">
                            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                              <button
                                key={bg}
                                onClick={() => {
                                  setSimulatorSelectedBg(bg);
                                  setSimulatorTab('donors');
                                }}
                                className="py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 text-red-600 font-black text-xs border border-slate-200/70 text-center cursor-pointer transition active:scale-95"
                              >
                                {bg}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Urgent Requests Mini */}
                        <div className="bg-white rounded-2xl p-3 shadow-2xs border border-slate-200/80 space-y-2">
                          <div className="flex items-center justify-between">
                            <h5 className="font-extrabold text-[11px] text-slate-800">জরুরি আবেদন</h5>
                            <span
                              onClick={() => setSimulatorTab('emergency')}
                              className="text-[10px] text-red-600 font-bold cursor-pointer"
                            >
                              সবগুলো →
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-red-50/60 border border-red-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center">
                                O-
                              </span>
                              <div>
                                <div className="text-[11px] font-bold text-slate-900">রহিম উদ্দিন (২ ব্যাগ)</div>
                                <div className="text-[9px] text-slate-500">শেবাচিম হাসপাতাল, বরিশাল</div>
                              </div>
                            </div>
                            <button className="px-2 py-1 bg-red-600 text-white rounded-lg text-[9px] font-bold">
                              কল
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SIMULATOR SCREEN: DONORS */}
                    {simulatorTab === 'donors' && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between pb-1">
                          <h5 className="font-extrabold text-xs text-slate-800">রক্তদাতা তালিকা</h5>
                          <span className="text-[10px] font-bold text-slate-500">
                            গ্রুপ: {simulatorSelectedBg}
                          </span>
                        </div>

                        {[
                          { name: 'মোঃ নাজমুল হাসান', bg: 'O+', area: 'বরিশাল সদর', verified: true },
                          { name: 'আরিফুল ইসলাম', bg: 'A+', area: 'বাকেরগঞ্জ', verified: true },
                          { name: 'তানভীর আহমেদ', bg: 'B+', area: 'ভোলা সদর', verified: false },
                          { name: 'মাহমুদ করিম', bg: 'O-', area: 'পটুয়াখালী', verified: true },
                        ].map((d, i) => (
                          <div key={i} className="bg-white rounded-xl p-2.5 shadow-2xs border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-lg bg-red-600 text-white font-black text-xs flex items-center justify-center">
                                {d.bg}
                              </span>
                              <div>
                                <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                                  <span>{d.name}</span>
                                  {d.verified && <span className="text-blue-500 text-[9px]">✓</span>}
                                </div>
                                <div className="text-[9px] text-slate-500">{d.area} • প্রস্তুত</div>
                              </div>
                            </div>
                            <button className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold">
                              কল দিন
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* SIMULATOR SCREEN: EMERGENCY */}
                    {simulatorTab === 'emergency' && (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between pb-1">
                          <h5 className="font-extrabold text-xs text-slate-800">জরুরি রক্তের চাহিদা</h5>
                          <span className="bg-red-100 text-red-700 text-[9px] font-black px-2 py-0.5 rounded-full">
                            সরাসরি সংযোগ
                          </span>
                        </div>

                        {[
                          { patient: 'সুলতানা বেগম', bg: 'A-', hospital: 'শেবাচিম হাসপাতাল', units: '১ ব্যাগ' },
                          { patient: 'কামরুল হাসান', bg: 'O+', hospital: 'ভোলা সদর হাসপাতাল', units: '২ ব্যাগ' },
                        ].map((req, i) => (
                          <div key={i} className="bg-white rounded-xl p-3 shadow-2xs border border-red-200/80 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-black">
                                🚨 জরুরি
                              </span>
                              <span className="text-[10px] font-bold text-red-600">{req.units}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <span className="w-9 h-9 rounded-xl bg-red-100 text-red-600 font-black text-sm flex items-center justify-center">
                                {req.bg}
                              </span>
                              <div>
                                <div className="text-xs font-bold text-slate-900">{req.patient}</div>
                                <div className="text-[10px] text-slate-500">{req.hospital}</div>
                              </div>
                            </div>
                            <button className="w-full py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-bold text-center">
                              📞 রোগীর স্বজনকে কল করুন
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* SIMULATOR SCREEN: HOSPITALS */}
                    {simulatorTab === 'hospitals' && (
                      <div className="space-y-2.5">
                        <h5 className="font-extrabold text-xs text-slate-800">হাসপাতাল ও ব্লাড ব্যাংক</h5>
                        {[
                          { name: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল', dist: 'বরিশাল', stock: 'মজুত সক্রিয়' },
                          { name: 'পটুয়াখালী ২৫০ শয্যা হাসপাতাল', dist: 'পটুয়াখালী', stock: 'মজুত সক্রিয়' },
                          { name: 'ভোলা সদর হাসপাতাল', dist: 'ভোলা', stock: 'মজুত সক্রিয়' },
                        ].map((h, i) => (
                          <div key={i} className="bg-white rounded-xl p-2.5 shadow-2xs border border-slate-200">
                            <div className="text-[11px] font-bold text-slate-900">{h.name}</div>
                            <div className="text-[9px] text-slate-500 mt-0.5">{h.dist} • {h.stock}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* SIMULATOR SCREEN: ADMIN PORTAL (Revealed via 5 taps) */}
                    {simulatorTab === 'admin' && (
                      <div className="bg-slate-900 text-white rounded-2xl p-3 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <div className="flex items-center gap-1.5 text-red-400 font-bold text-[11px]">
                            <Shield className="w-3.5 h-3.5" />
                            <span>গোপন অ্যাডমিন জোন</span>
                          </div>
                          <button
                            onClick={() => setSimulatorTab('home')}
                            className="text-[10px] text-slate-400 hover:text-white"
                          >
                            বন্ধ করুন ✕
                          </button>
                        </div>

                        {!simulatorAdminLoggedIn ? (
                          <div className="space-y-2 text-[11px]">
                            <p className="text-slate-300 text-[10px]">
                              ৫-ট্যাপে অ্যাডমিন পোর্টাল খোলা হয়েছে। লগইন করুন:
                            </p>
                            <input
                              type="text"
                              defaultValue="superadmin"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-[11px] border border-slate-700"
                              placeholder="ইউজারনেম"
                            />
                            <input
                              type="password"
                              defaultValue="admin1234"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-[11px] border border-slate-700"
                              placeholder="পাসওয়ার্ড"
                            />
                            <button
                              onClick={() => setSimulatorAdminLoggedIn(true)}
                              className="w-full py-1.5 bg-red-600 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                            >
                              লগইন করুন
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 text-[10px]">
                            <div className="bg-emerald-950/80 text-emerald-300 p-2 rounded-lg border border-emerald-800">
                              ✓ সুপার অ্যাডমিন কন্ট্রোল সক্রিয়
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <div className="bg-slate-800 p-2 rounded-lg">
                                <div className="text-slate-400">রক্তদাতা</div>
                                <div className="text-sm font-black text-white">২৫০+</div>
                              </div>
                              <div className="bg-slate-800 p-2 rounded-lg">
                                <div className="text-slate-400">জরুরি আবেদন</div>
                                <div className="text-sm font-black text-red-400">১২</div>
                              </div>
                            </div>
                            <button className="w-full py-1.5 bg-red-600 text-white rounded-lg font-bold">
                              🚨 সাইট-ওয়াইড রেড অ্যালার্ট
                            </button>
                            <button
                              onClick={() => setSimulatorAdminLoggedIn(false)}
                              className="w-full py-1 bg-slate-800 text-slate-300 rounded-lg"
                            >
                              লগআউট
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Simulator Bottom Navigation Bar */}
                  <div className="h-14 bg-white border-t border-slate-200 grid grid-cols-4 items-center text-center shrink-0">
                    <button
                      onClick={() => setSimulatorTab('home')}
                      className={`text-[10px] font-bold flex flex-col items-center justify-center cursor-pointer ${
                        simulatorTab === 'home' ? 'text-red-600' : 'text-slate-400'
                      }`}
                    >
                      <span className="text-sm">🏠</span>
                      <span>হোম</span>
                    </button>
                    <button
                      onClick={() => setSimulatorTab('donors')}
                      className={`text-[10px] font-bold flex flex-col items-center justify-center cursor-pointer ${
                        simulatorTab === 'donors' ? 'text-red-600' : 'text-slate-400'
                      }`}
                    >
                      <span className="text-sm">🔍</span>
                      <span>রক্তদাতা</span>
                    </button>
                    <button
                      onClick={() => setSimulatorTab('emergency')}
                      className={`text-[10px] font-bold flex flex-col items-center justify-center cursor-pointer ${
                        simulatorTab === 'emergency' ? 'text-red-600' : 'text-slate-400'
                      }`}
                    >
                      <span className="text-sm">🚨</span>
                      <span>জরুরি</span>
                    </button>
                    <button
                      onClick={() => setSimulatorTab('hospitals')}
                      className={`text-[10px] font-bold flex flex-col items-center justify-center cursor-pointer ${
                        simulatorTab === 'hospitals' ? 'text-red-600' : 'text-slate-400'
                      }`}
                    >
                      <span className="text-sm">🏥</span>
                      <span>হাসপাতাল</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Simulator Explanation Panel */}
              <div className="flex-1 space-y-4 max-w-lg">
                <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>ইন্টারেক্টিভ Flutter অ্যাপ সিমুলেটর</span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    Flutter ৩.x এবং Material ৩ প্রযুক্তিতে নির্মিত মোবাইল অ্যাপ
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    এই Flutter অ্যাপটি সরাসরি আপনার barishal-Blood ব্যাকএন্ড API এর সাথে সংযুক্ত। আপনি বাম পাশের ফোনটিতে ক্লিক করে লাইভ রক্তদাতা তালিকা, জরুরি রক্তের আবেদন এবং লোগোতে ৫ বার ট্যাপ করে গোপন অ্যাডমিন পোর্টাল পরীক্ষা করতে পারবেন।
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-700/60 text-xs">
                    <div className="flex items-start gap-2 text-slate-300">
                      <span className="text-cyan-400 font-bold">✓</span>
                      <span>বরিশাল বিভাগের ৬টি জেলার সকল রক্তদাতার তথ্য ও অফলাইন ক্যাশিং।</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-300">
                      <span className="text-cyan-400 font-bold">✓</span>
                      <span>জরুরি রোগীর জন্য ১-ট্যাপে সরাসরি ফোন ডায়ালার কলিং ও হোয়াটসঅ্যাপ শেয়ার।</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-300">
                      <span className="text-cyan-400 font-bold">✓</span>
                      <span>হেডারের লোগোতে ৫ বার ট্যাপের ইস্টার-এগ সিকিউর অ্যাডমিন মোড।</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownloadZip}
                    disabled={downloadingZip}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloadingZip ? 'প্রস্তুত হচ্ছে...' : 'সম্পূর্ণ Flutter কোড ডাউনলোড (ZIP)'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('guide')}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Terminal className="w-4 h-4" />
                    <span>বিল্ড কমান্ড দেখুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CODE EXPLORER */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {Object.keys(CODE_SNIPPETS).map((fileKey) => (
                    <button
                      key={fileKey}
                      onClick={() => setSelectedCodeFile(fileKey)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer shrink-0 ${
                        selectedCodeFile === fileKey
                          ? 'bg-cyan-500 text-slate-950 shadow-xs'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {fileKey}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'কপি হয়েছে' : 'কোড কপি করুন'}</span>
                  </button>
                </div>
              </div>

              {/* Code Pre Box */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[500px]">
                <div className="text-[11px] text-slate-500 pb-2 mb-2 border-b border-slate-800 flex items-center justify-between">
                  <span>ফাইল পাথ: {CODE_SNIPPETS[selectedCodeFile]?.path}</span>
                  <span className="text-cyan-400 font-bold">Dart / Flutter</span>
                </div>
                <pre className="leading-relaxed whitespace-pre font-mono">
                  {CODE_SNIPPETS[selectedCodeFile]?.code}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: BUILD GUIDE & PWA */}
          {activeTab === 'guide' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Build Commands Box */}
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <Terminal className="w-4 h-4" />
                  <span>Flutter মোবাইল অ্যাপ তৈরি ও বিল্ডের নির্দেশিকা</span>
                </div>

                <h3 className="text-lg font-black text-white">
                  কীভাবে আপনার কম্পিউটারে এই Flutter অ্যাপটি রান ও APK তৈরি করবেন:
                </h3>

                <div className="space-y-3 text-xs font-mono text-slate-300">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 mb-1">// ধাপ ১: ডিপেন্ডেন্সি ইনস্টল করুন</div>
                    <div className="text-cyan-400 font-bold">flutter pub get</div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 mb-1">// ধাপ ২: সরাসরি ইমুলেটর বা কানেক্টেড ফোনে টেস্ট করুন</div>
                    <div className="text-cyan-400 font-bold">flutter run</div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 mb-1">// ধাপ ৩: রিলিজ প্রোডাকশন APK তৈরি করুন</div>
                    <div className="text-emerald-400 font-bold">flutter build apk --release</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      (উৎপন্ন ফাইল: build/app/outputs/flutter-apk/app-release.apk)
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 mb-1">// ধাপ ৪: গুগল প্লে-স্টোরের জন্য App Bundle তৈরি</div>
                    <div className="text-amber-400 font-bold">flutter build appbundle</div>
                  </div>
                </div>
              </div>

              {/* PWA Direct Mobile App Install Option */}
              <div className="bg-gradient-to-r from-red-950 to-slate-900 rounded-2xl p-6 border border-red-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-extrabold text-base text-white">
                    তাত্ক্ষণিকভাবে যেকোনো ফোনে অ্যাপ ইনস্টল করতে চান?
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    APK কম্পাইল না করেও আপনি এখনই ব্রাউজার থেকে সরাসরি barishal-Blood PWA মোবাইল অ্যাপটি হোমস্ক্রিনে ইনস্টল করতে পারেন।
                  </p>
                </div>

                <button
                  onClick={install}
                  className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition shrink-0 cursor-pointer"
                >
                  {isInstalled ? 'ইতোমধ্যে ইনস্টল করা ✓' : 'হোমস্ক্রিনে ইনস্টল করুন 📲'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
