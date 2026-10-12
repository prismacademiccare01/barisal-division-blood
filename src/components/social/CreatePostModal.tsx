import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import { SocialPost, BloodGroup, PostPrivacy, PostCategory } from '../../types/index.js';
import { BARISHAL_DIVISION_DISTRICTS, BLOOD_GROUPS, getUpazilasForDistrict } from '../../utils/locations.js';
import { api } from '../../services/api.js';
import {
  X,
  Image,
  Droplet,
  AlertCircle,
  Building2,
  Lock,
  Globe,
  Users,
  Eye,
  CheckCircle2,
  FolderPlus,
  Plus,
  Calendar,
  MapPin,
  Sparkles,
  Cloud,
  Upload,
  HardDrive,
} from 'lucide-react';

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (post: Omit<SocialPost, 'id' | 'created_at' | 'reactions' | 'comments_count' | 'shares_count'>) => void;
  initialType?: 'general' | 'donation_story' | 'album' | 'emergency' | 'announcement';
}

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  onClose,
  onSubmit,
  initialType = 'general',
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [postType, setPostType] = useState<'general' | 'donation_story' | 'album' | 'emergency' | 'announcement'>(initialType);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [privacy, setPrivacy] = useState<PostPrivacy>('everyone');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  // Donation story fields
  const [donationNumber, setDonationNumber] = useState<number>(user?.total_donations ? user.total_donations + 1 : 1);
  const [hospitalName, setHospitalName] = useState('শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(user?.blood_group || 'O+');
  const [patientCase, setPatientCase] = useState('থ্যালাসেমিয়া / জরুরি সার্জারি রোগী');
  const [isVerifiedDonation, setIsVerifiedDonation] = useState(true);

  // Album fields
  const [albumTitle, setAlbumTitle] = useState('My 10th Blood Donation Milestone');
  const [albumDate, setAlbumDate] = useState(new Date().toISOString().split('T')[0]);

  // Emergency fields
  const [emergencyUnits, setEmergencyUnits] = useState(2);
  const [emergencyUrgency, setEmergencyUrgency] = useState<'critical' | 'urgent' | 'moderate'>('critical');
  const [contactProtected, setContactProtected] = useState(true);

  // Cloudflare R2 Upload State
  const [isUploadingToR2, setIsUploadingToR2] = useState(false);
  const [r2UploadedCount, setR2UploadedCount] = useState(0);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingToR2(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            const res = await api.uploadToR2(base64, {
              fileName: file.name,
              contentType: file.type,
              caption: title || albumTitle || 'রক্তদান ছবি',
              entityType: postType === 'album' ? 'album' : 'donation_story',
            });
            if (res.success && res.data?.public_url) {
              newUrls.push(res.data.public_url);
              setR2UploadedCount((c) => c + 1);
            }
          } catch (err) {
            console.error('[R2 Upload Error]:', err);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    if (newUrls.length > 0) {
      setSelectedPhotos((prev) => [...prev, ...newUrls]);
      showToast(`${newUrls.length}টি ছবি Cloudflare R2 বাকেটে আপলোড ও D1-এ ইন্ডেক্স হয়েছে!`, 'success', 'R2 আপলোড সম্পন্ন');
    }
    setIsUploadingToR2(false);
  };

  const handleTogglePhoto = (url: string) => {
    if (selectedPhotos.includes(url)) {
      setSelectedPhotos(selectedPhotos.filter((p) => p !== url));
    } else {
      setSelectedPhotos([...selectedPhotos, url]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !title.trim() && postType !== 'donation_story') return;

    let category: PostCategory = 'general';
    let priority = 7;

    if (postType === 'emergency') {
      category = 'emergency';
      priority = emergencyUrgency === 'critical' ? 1 : 2;
    } else if (postType === 'donation_story' || postType === 'album') {
      category = 'donation';
      priority = 4;
    } else if (postType === 'announcement') {
      category = 'hospital';
      priority = 3;
    }

    const postPayload: Omit<SocialPost, 'id' | 'created_at' | 'reactions' | 'comments_count' | 'shares_count'> = {
      author_id: user?.id || 1,
      author_name: user?.name || 'স্বেচ্ছাসেবী রক্তদাতা',
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      author_blood_group: bloodGroup,
      author_district: user?.district || 'বরিশাল',
      author_upazila: user?.upazila || 'বরিশাল সদর',
      is_verified_donor: user?.is_verified === 1 || isVerifiedDonation,
      is_verified_institution: postType === 'announcement',
      post_type: postType,
      category,
      title: title || (postType === 'donation_story' ? `🩸 আজ ${donationNumber}তম বার রক্তদান করলাম` : undefined),
      content: content || 'মানবতার সেবায় রক্তদান করে জীবন বাঁচাই।',
      images: selectedPhotos.length > 0 ? selectedPhotos : undefined,
      privacy,
      priority,
    };

    if (postType === 'donation_story') {
      postPayload.donation_meta = {
        donation_number: donationNumber,
        hospital: hospitalName,
        blood_group: bloodGroup,
        is_verified: isVerifiedDonation,
        patient_case: patientCase,
      };
      if (selectedPhotos.length === 0) {
        postPayload.images = [SAMPLE_PHOTO_PRESETS[0]];
      }
    }

    if (postType === 'album') {
      const albumPhotos = selectedPhotos.length > 0 ? selectedPhotos : [SAMPLE_PHOTO_PRESETS[0], SAMPLE_PHOTO_PRESETS[1]];
      postPayload.album = {
        title: albumTitle,
        hospital: hospitalName,
        date: albumDate,
        blood_group: bloodGroup,
        donation_number: donationNumber,
        photos: albumPhotos,
      };

      // Save album metadata in Cloudflare D1
      api.createD1Album({
        title: albumTitle,
        caption: content,
        hospital_name: hospitalName,
        blood_group: bloodGroup,
        donation_date: albumDate,
        donation_number: donationNumber,
        cover_r2_url: albumPhotos[0],
        r2_photos: albumPhotos.map((url, i) => ({
          key: `albums/${albumDate}/photo_${i + 1}.webp`,
          url,
          caption: `${albumTitle} - ছবি ${i + 1}`,
        })),
        privacy,
      }).catch((err) => console.error('[D1 Album Save Error]:', err));
    }

    if (postType === 'emergency') {
      postPayload.emergency_meta = {
        blood_group: bloodGroup,
        hospital: hospitalName,
        units: emergencyUnits,
        urgency: emergencyUrgency,
        contact_protected: contactProtected,
      };
    }

    onSubmit(postPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              ✍️
            </span>
            <h3 className="font-extrabold text-base text-slate-900">
              {postType === 'donation_story'
                ? 'রক্তদান অভিজ্ঞতা শেয়ার করুন'
                : postType === 'album'
                ? 'ডোনেশন অ্যালবাম তৈরি করুন'
                : postType === 'emergency'
                ? 'জরুরি রক্তের আবেদন পোস্ট'
                : postType === 'announcement'
                ? 'হাসপাতাল অফিসিয়াল বিজ্ঞপ্তি'
                : 'পোস্ট তৈরি করুন'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post Type Selector Tabs */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 p-2 bg-slate-100/70 border-b border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setPostType('general')}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
              postType === 'general' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Image className="w-4 h-4 text-blue-500" />
            <span className="text-[10px]">সাধারণ</span>
          </button>
          <button
            type="button"
            onClick={() => setPostType('donation_story')}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
              postType === 'donation_story' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Droplet className="w-4 h-4 text-red-600 fill-red-600" />
            <span className="text-[10px]">Donation Story</span>
          </button>
          <button
            type="button"
            onClick={() => setPostType('album')}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
              postType === 'album' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <FolderPlus className="w-4 h-4 text-amber-500" />
            <span className="text-[10px]">Photo Album</span>
          </button>
          <button
            type="button"
            onClick={() => setPostType('emergency')}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
              postType === 'emergency' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span className="text-[10px]">Emergency</span>
          </button>
          <button
            type="button"
            onClick={() => setPostType('announcement')}
            className={`hidden sm:flex py-2 px-1 rounded-xl font-bold flex-col items-center gap-1 cursor-pointer transition ${
              postType === 'announcement' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-4 h-4 text-purple-600" />
            <span className="text-[10px]">Hospital</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Author info & Privacy Setting Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-sm">
                {user?.name ? user.name[0] : 'ব'}
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">{user?.name || 'স্বেচ্ছাসেবী রক্তদাতা'}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span>{user?.district || 'বরিশাল'}</span>
                  <span>•</span>
                  <span className="font-bold text-red-600">{user?.blood_group || bloodGroup}</span>
                </div>
              </div>
            </div>

            {/* Privacy Selector dropdown (Who can see?) */}
            <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl px-2.5 py-1 border border-slate-200 text-xs">
              <Lock className="w-3 h-3 text-slate-500" />
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value as PostPrivacy)}
                className="bg-transparent text-slate-700 font-bold text-[11px] focus:outline-hidden cursor-pointer"
              >
                <option value="everyone">🌐 Everyone (সকল)</option>
                <option value="followers">👥 Followers (অনুসারী)</option>
                <option value="community">🩸 Community (কমিউনিটি)</option>
                <option value="only_me">🔒 Only Me (ব্যক্তিগত)</option>
              </select>
            </div>
          </div>

          {/* Donation Story Specific Fields */}
          {postType === 'donation_story' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-red-700 flex items-center gap-1">
                  <Droplet className="w-4 h-4 fill-red-600" />
                  বিশেষ ডোনেশন স্টোরি কার্ড
                </span>
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={isVerifiedDonation}
                    onChange={(e) => setIsVerifiedDonation(e.target.checked)}
                    className="rounded-sm text-red-600 focus:ring-red-500"
                  />
                  <span>✓ Verified Donation ব্যাজ</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">কততম রক্তদান?</label>
                  <input
                    type="number"
                    value={donationNumber}
                    onChange={(e) => setDonationNumber(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">রক্তের গ্রুপ</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">হাসপাতাল / কেন্দ্র</label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                    placeholder="উদা: SBMCH, বরিশাল"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Album Specific Fields */}
          {postType === 'album' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 space-y-3">
              <span className="text-xs font-black text-amber-800 flex items-center gap-1">
                <FolderPlus className="w-4 h-4 text-amber-600" />
                রক্তদান ফটো অ্যালবাম তথ্য
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">অ্যালবামের নাম</label>
                  <input
                    type="text"
                    value={albumTitle}
                    onChange={(e) => setAlbumTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                    placeholder="My Blood Donation Milestone"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">তারিখ</label>
                  <input
                    type="date"
                    value={albumDate}
                    onChange={(e) => setAlbumDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Emergency Request Specific Fields */}
          {postType === 'emergency' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200/80 space-y-3">
              <span className="text-xs font-black text-rose-800 flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                জরুরি রক্তের দ্রুত আবেদন ফর্ম
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">গ্রুপ</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">ব্যাগ সংখ্যা</label>
                  <input
                    type="number"
                    value={emergencyUnits}
                    onChange={(e) => setEmergencyUnits(Number(e.target.value))}
                    min={1}
                    max={6}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">জরুরিতা</label>
                  <select
                    value={emergencyUrgency}
                    onChange={(e) => setEmergencyUrgency(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="critical">🚨 Critical</option>
                    <option value="urgent">⚡ Urgent</option>
                    <option value="moderate">⏳ Moderate</option>
                  </select>
                </div>
              </div>

              {/* Controlled Contact Privacy info */}
              <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-rose-100 text-xs">
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">Controlled Contact System</p>
                  <p className="text-[10px] text-slate-500">ফোন নম্বর গোপন থাকবে, ভেরিফাইড ডোনারদের মেসেঞ্জারে সরাসরি কল করা যাবে।</p>
                </div>
                <input
                  type="checkbox"
                  checked={contactProtected}
                  onChange={(e) => setContactProtected(e.target.checked)}
                  className="rounded-sm text-red-600"
                />
              </div>
            </div>
          )}

          {/* Title (Optional for general, default for others) */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                postType === 'donation_story'
                  ? `আজ ${donationNumber}তম বার রক্তদান করলাম`
                  : postType === 'emergency'
                  ? `জরুরি ${bloodGroup} রক্ত প্রয়োজন`
                  : 'পোস্টের শিরোনাম বা ক্যাপশন (ঐচ্ছিক)'
              }
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Main Content Area */}
          <div>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                postType === 'donation_story'
                  ? 'একজন মানুষের প্রয়োজনে পাশে দাঁড়াতে পেরে ভালো লাগছে... আপনার অনুভূতি লিখুন...'
                  : postType === 'emergency'
                  ? 'রোগীর অবস্থা, সঠিক ওয়ার্ড ও কেবিন নম্বর, রক্তগ্রহণের সময়সূচি ইত্যাদি উল্লেখ করুন...'
                  : 'আপনার চিন্তা বা বরিশালের রক্তদান অভিজ্ঞতা লিখুন...'
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:outline-hidden focus:ring-2 focus:ring-red-500 leading-relaxed"
            />
          </div>

          {/* Photo Gallery Selector / Cloudflare R2 Uploader */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-slate-500" />
                ছবি সংযুক্ত করুন ({selectedPhotos.length}টি নির্বাচিত)
              </span>
              <div className="flex items-center gap-1 text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Cloud className="w-3 h-3 text-amber-600" />
                <span>Cloudflare R2 Storage</span>
              </div>
            </div>

            {/* Device file upload trigger */}
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 hover:border-red-400 rounded-2xl cursor-pointer transition text-xs font-bold text-slate-700 group">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploadingToR2}
                  className="hidden"
                />
                <Upload className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                <span>
                  {isUploadingToR2 ? 'Cloudflare R2-এ আপলোড হচ্ছে...' : 'ডিভাইস থেকে আসল ছবি নির্বাচন করুন'}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  (R2 বাকেটে সেভ হবে)
                </span>
              </label>
            </div>

            {/* Preset Samples & Uploaded Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {/* If user uploaded custom photos, show them first */}
              {selectedPhotos.map((photoUrl, idx) => (
                <div
                  key={`sel-${idx}`}
                  onClick={() => handleTogglePhoto(photoUrl)}
                  className="relative rounded-xl overflow-hidden aspect-video sm:aspect-square cursor-pointer border-2 border-red-600 ring-2 ring-red-300 transition group"
                >
                  <img src={photoUrl} alt="Selected" className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-[8px] text-white font-mono px-1 rounded-sm">
                    R2 ✓
                  </span>
                </div>
              ))}

              {/* Sample presets */}
              {SAMPLE_PHOTO_PRESETS.filter((p) => !selectedPhotos.includes(p)).map((photoUrl, idx) => (
                <div
                  key={`preset-${idx}`}
                  onClick={() => handleTogglePhoto(photoUrl)}
                  className="relative rounded-xl overflow-hidden aspect-video sm:aspect-square cursor-pointer border-2 border-transparent hover:opacity-80 transition"
                >
                  <img src={photoUrl} alt="Sample" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">✓ D1 ও R2 গ্যারান্টি:</span>
              ছবি Cloudflare R2 অবজেক্টে থাকবে, D1-এ শুধু মেটাডাটা সংরক্ষিত হবে।
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>পোস্ট করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
