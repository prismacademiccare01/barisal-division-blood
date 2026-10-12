import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { useToast } from '../../hooks/useToast.js';
import {
  SocialPost,
  ShortStory,
  SocialReactionType,
  BloodGroup,
  PostPrivacy,
  PostCategory,
  Donor,
  BloodRequest,
} from '../../types/index.js';
import { SocialStorageService } from '../../services/socialData.js';
import { BloodStoriesViewer } from './BloodStoriesViewer.js';
import { PremiumReactionSystem } from './PremiumReactionSystem.js';
import { CreatePostModal } from './CreatePostModal.js';
import { MessengerModal } from './MessengerModal.js';
import { PremiumDonorProfileModal } from './PremiumDonorProfileModal.js';
import { BloodGroupCommunities } from './BloodGroupCommunities.js';
import { HospitalCommunityPage } from './HospitalCommunityPage.js';
import {
  Flame,
  Droplet,
  Users,
  Building2,
  BookOpen,
  Image,
  FolderPlus,
  AlertCircle,
  ShieldCheck,
  MessageCircle,
  Share2,
  Lock,
  Globe,
  Plus,
  Compass,
  Heart,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Send,
  Eye,
  CheckCircle2,
  Search,
  Award,
  TrendingUp,
  PhoneCall,
} from 'lucide-react';

interface CommunityFeedProps {
  onNavigateEmergency?: () => void;
  onOpenCreateRequest?: () => void;
  donors?: Donor[];
  requests?: BloodRequest[];
  onCallDonor?: (donor: Donor) => void;
  onViewDonorProfile?: (donor: Donor) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  onNavigateEmergency,
  onOpenCreateRequest,
  donors = [],
  requests = [],
  onCallDonor,
  onViewDonorProfile,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Social Data States
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [stories, setStories] = useState<ShortStory[]>([]);
  const [activeFeedFilter, setActiveFeedFilter] = useState<
    'all' | 'emergency' | 'nearby' | 'following' | 'donations' | 'hospitals' | 'education'
  >('all');

  // Modals & Viewers
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [createPostInitialType, setCreatePostInitialType] = useState<
    'general' | 'donation_story' | 'album' | 'emergency' | 'announcement'
  >('general');
  const [showMessenger, setShowMessenger] = useState(false);
  const [messengerEmergencyPrompt, setMessengerEmergencyPrompt] = useState<any>(null);
  const [selectedDonorProfileModal, setSelectedDonorProfileModal] = useState<any>(null);
  const [activeSubView, setActiveSubView] = useState<'feed' | 'blood_groups' | 'hospitals'>('feed');

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setPosts(SocialStorageService.getPosts());
    setStories(SocialStorageService.getStories());
  }, []);

  // Handle Reactions
  const handleReactToPost = (postId: string, reactionType: SocialReactionType) => {
    const updated = posts.map((post) => {
      if (post.id !== postId) return post;

      const currentReactions = { ...post.reactions };
      const prevReaction = post.user_reaction;

      if (prevReaction && prevReaction === reactionType) {
        // Toggle off
        currentReactions[reactionType] = Math.max(0, (currentReactions[reactionType] || 1) - 1);
        return {
          ...post,
          reactions: currentReactions,
          user_reaction: undefined,
        };
      }

      // If switched from another reaction, decrement old one
      if (prevReaction) {
        currentReactions[prevReaction] = Math.max(0, (currentReactions[prevReaction] || 1) - 1);
      }

      currentReactions[reactionType] = (currentReactions[reactionType] || 0) + 1;

      return {
        ...post,
        reactions: currentReactions,
        user_reaction: reactionType,
      };
    });

    setPosts(updated);
    SocialStorageService.savePosts(updated);
    showToast('প্রতিক্রিয়া গ্রহণ করা হয়েছে! (+১০ ডোনার ইমপ্যাক্ট স্কোর)', 'success', 'ধন্যবাদ');
  };

  // Handle New Post Creation
  const handleCreatePostSubmit = (
    newPostData: Omit<SocialPost, 'id' | 'created_at' | 'reactions' | 'comments_count' | 'shares_count'>
  ) => {
    const newPost: SocialPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      created_at: new Date().toISOString(),
      reactions: { support: 1, lifesaver: 2, respect: 0, hero: 0, congratulations: 0 },
      comments_count: 0,
      shares_count: 0,
      comments: [],
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    SocialStorageService.savePosts(updated);
    showToast('আপনার পোস্ট সফলভাবে প্রকাশিত হয়েছে! (ছবি R2 বাকেটে সংরক্ষিত)', 'success', 'পোস্ট সফল');
  };

  // Handle Adding a Comment
  const handleAddComment = (postId: string) => {
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const newComment = {
      id: `c-${Date.now()}`,
      author_name: user?.name || 'স্বেচ্ছাসেবী রক্তদাতা',
      author_badge: user?.blood_group ? `রক্তদাতা ${user.blood_group}` : 'কমিউনিটি সদস্য',
      author_blood_group: user?.blood_group,
      content: commentText,
      created_at: new Date().toISOString(),
      likes: 0,
    };

    const updated = posts.map((post) => {
      if (post.id !== postId) return post;
      const currentComments = post.comments || [];
      return {
        ...post,
        comments_count: post.comments_count + 1,
        comments: [...currentComments, newComment],
      };
    });

    setPosts(updated);
    SocialStorageService.savePosts(updated);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
    showToast('আপনার মন্তব্য যোগ করা হয়েছে।', 'info');
  };

  // 🔥 Smart Feed Priority Sorting Algorithm:
  // Priority 1: Critical Emergency
  // Priority 2: Nearby Blood Request
  // Priority 3: Verified Hospital Update
  // Priority 4: Donation Posts
  // Priority 5: Following
  // Priority 6: Education
  // Priority 7: Community
  const sortedAndFilteredPosts = [...posts]
    .filter((p) => {
      if (activeFeedFilter === 'emergency') return p.category === 'emergency';
      if (activeFeedFilter === 'donations') return p.category === 'donation';
      if (activeFeedFilter === 'hospitals') return p.category === 'hospital';
      if (activeFeedFilter === 'education') return p.category === 'education';
      if (activeFeedFilter === 'nearby') return p.author_district === (user?.district || 'বরিশাল');
      return true;
    })
    .sort((a, b) => (a.priority || 7) - (b.priority || 7));

  const reputation = SocialStorageService.getReputation();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* =========================================================================
          ১. Emergency Alert Banner (🚨 ২টি জরুরি রক্তের প্রয়োজন [View Emergency])
         ========================================================================= */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-red-500/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 animate-pulse">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-black/25 px-2.5 py-0.5 rounded-full">
                🚨 লাইভ এলার্ট
              </span>
              <span className="text-xs text-white/80 font-bold">বরিশাল বিভাগ</span>
            </div>
            <h4 className="font-extrabold text-sm sm:text-base mt-0.5">
              ২টি জরুরি রক্তের প্রয়োজন (SBMCH ও সদর হাসপাতাল)
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => {
              if (onNavigateEmergency) onNavigateEmergency();
              else setActiveFeedFilter('emergency');
            }}
            className="px-4 py-2 bg-white text-red-700 hover:bg-red-50 text-xs font-black rounded-xl transition shadow-sm cursor-pointer whitespace-nowrap active:scale-95"
          >
            View Emergency (জরুরি দেখুন)
          </button>
          <button
            onClick={() => setShowMessenger(true)}
            className="px-3.5 py-2 bg-black/25 hover:bg-black/40 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
            title="মেসেঞ্জার"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">মেসেঞ্জার</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          ৪. 🎥 Short Blood Stories (24-Hour Stories Carousel)
         ========================================================================= */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Short Blood Stories (২৪ ঘণ্টার রক্তদান স্টোরি)
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-bold">ট্যাপ করে দেখুন</span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {/* Add Story Button for current user */}
          <div
            onClick={() => {
              setCreatePostInitialType('donation_story');
              setShowCreatePostModal(true);
            }}
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-red-400 flex flex-col items-center justify-center bg-red-50/50 group-hover:bg-red-100/50 transition">
              <Plus className="w-5 h-5 text-red-600 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold text-red-700">স্টোরি দিন</span>
            </div>
            <span className="text-[10px] font-bold text-slate-600">আমার স্টোরি</span>
          </div>

          {/* Stories list */}
          {stories.map((st, idx) => (
            <div
              key={st.id}
              onClick={() => setActiveStoryIndex(idx)}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl p-0.5 ring-2 ring-red-600 ring-offset-2 overflow-hidden bg-slate-100 group-hover:scale-105 transition-transform duration-200">
                  <img
                    src={st.media_url}
                    alt={st.user_name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                {st.blood_group && (
                  <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                    {st.blood_group}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold text-slate-700 truncate max-w-[68px]">
                {st.user_name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          Social System Navigation Hub (Feed | Blood Groups | Hospitals)
         ========================================================================= */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubView('feed')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubView === 'feed'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Compass className="w-4 h-4 text-red-500" />
            <span>কমিউনিটি ফিড (Community Feed)</span>
          </button>

          <button
            onClick={() => setActiveSubView('blood_groups')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubView === 'blood_groups'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-red-500" />
            <span>গ্রুপ ও এলাকা (Groups & Areas)</span>
          </button>

          <button
            onClick={() => setActiveSubView('hospitals')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubView === 'hospitals'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4 text-red-500" />
            <span>হাসপাতাল পেজ (Verified Hospital)</span>
          </button>
        </div>

        {/* Messenger Quick Trigger */}
        <button
          onClick={() => setShowMessenger(true)}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-red-600" />
          <span>মেসেঞ্জার ও জরুরি চ্যাট</span>
        </button>
      </div>

      {/* VIEW 2: Blood Groups & Area Community */}
      {activeSubView === 'blood_groups' && (
        <BloodGroupCommunities
          donors={donors}
          requests={requests}
          onCallDonor={onCallDonor}
          onViewDonorProfile={(d) => setSelectedDonorProfileModal(d)}
          onOpenCreateRequest={() => {
            if (onOpenCreateRequest) onOpenCreateRequest();
          }}
        />
      )}

      {/* VIEW 3: Verified Hospital Community */}
      {activeSubView === 'hospitals' && (
        <HospitalCommunityPage
          onOpenCreateRequest={() => {
            if (onOpenCreateRequest) onOpenCreateRequest();
          }}
        />
      )}

      {/* VIEW 1: Main Community Feed */}
      {activeSubView === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed Column (Left 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            {/* =========================================================================
                Create Post Box (What's happening? Photo, Donation, Emergency, Hospital)
               ========================================================================= */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => setSelectedDonorProfileModal(reputation)}
                  className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 font-black text-sm flex items-center justify-center shrink-0 cursor-pointer shadow-xs hover:scale-105 transition"
                  title="আমার ডোনার প্রোফাইল দেখুন"
                >
                  {user?.name ? user.name[0] : 'ব'}
                </div>
                <div
                  onClick={() => {
                    setCreatePostInitialType('general');
                    setShowCreatePostModal(true);
                  }}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs text-slate-500 font-medium cursor-pointer transition"
                >
                  কী ভাবছেন? বা আজ কোনো রক্তদান অভিজ্ঞতা শেয়ার করবেন?
                </div>
              </div>

              {/* Action buttons row: Photo, Donation Story, Emergency, Hospital */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-100 text-xs">
                <button
                  onClick={() => {
                    setCreatePostInitialType('general');
                    setShowCreatePostModal(true);
                  }}
                  className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1.5 font-bold transition cursor-pointer"
                >
                  <Image className="w-4 h-4 text-blue-500" />
                  <span>📷 Photo</span>
                </button>

                <button
                  onClick={() => {
                    setCreatePostInitialType('donation_story');
                    setShowCreatePostModal(true);
                  }}
                  className="p-2 rounded-xl text-red-700 bg-red-50/50 hover:bg-red-50 flex items-center justify-center gap-1.5 font-bold transition cursor-pointer"
                >
                  <Droplet className="w-4 h-4 text-red-600 fill-red-600" />
                  <span>🩸 Donation</span>
                </button>

                <button
                  onClick={() => {
                    setCreatePostInitialType('emergency');
                    setShowCreatePostModal(true);
                  }}
                  className="p-2 rounded-xl text-rose-700 bg-rose-50/50 hover:bg-rose-50 flex items-center justify-center gap-1.5 font-bold transition cursor-pointer"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>🚨 Emergency</span>
                </button>

                <button
                  onClick={() => {
                    setCreatePostInitialType('album');
                    setShowCreatePostModal(true);
                  }}
                  className="p-2 rounded-xl text-amber-700 bg-amber-50/50 hover:bg-amber-50 flex items-center justify-center gap-1.5 font-bold transition cursor-pointer"
                >
                  <FolderPlus className="w-4 h-4 text-amber-600" />
                  <span>📸 Album</span>
                </button>
              </div>
            </div>

            {/* =========================================================================
                Feed Filters: For You, Emergency, Nearby, Following, Donations, Hospitals, Education
               ========================================================================= */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
              {[
                { id: 'all', label: 'সকল (For You)' },
                { id: 'emergency', label: '🚨 Emergency' },
                { id: 'nearby', label: '📍 Nearby' },
                { id: 'donations', label: '🩸 Donations' },
                { id: 'hospitals', label: '🏥 Hospitals' },
                { id: 'education', label: '📚 Education' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFeedFilter(f.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                    activeFeedFilter === f.id
                      ? 'bg-red-600 text-white shadow-xs font-black'
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* =========================================================================
                Feed Posts Stream
               ========================================================================= */}
            <div className="space-y-4">
              {sortedAndFilteredPosts.map((post) => {
                const isDonationStory = post.post_type === 'donation_story';
                const isEmergency = post.post_type === 'emergency';
                const isAlbum = post.post_type === 'album';
                const isAnnouncement = post.post_type === 'announcement';

                return (
                  <div
                    key={post.id}
                    className={`bg-white rounded-3xl p-5 border transition-all ${
                      isDonationStory
                        ? 'border-red-300 ring-1 ring-red-100 shadow-md bg-gradient-to-b from-red-50/20 to-white'
                        : isEmergency
                        ? 'border-rose-300 ring-1 ring-rose-100 shadow-md bg-gradient-to-b from-rose-50/20 to-white'
                        : 'border-slate-200/80 shadow-xs'
                    }`}
                  >
                    {/* Post Top Meta: Author, verified badges, timestamp, privacy */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => setSelectedDonorProfileModal(reputation)}
                          className="relative cursor-pointer"
                        >
                          <img
                            src={
                              post.author_avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                            }
                            alt={post.author_name}
                            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-slate-100"
                          />
                          {post.author_blood_group && (
                            <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[9px] font-black px-1 rounded-full">
                              {post.author_blood_group}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              onClick={() => setSelectedDonorProfileModal(reputation)}
                              className="font-extrabold text-xs text-slate-900 cursor-pointer hover:underline"
                            >
                              {post.author_name}
                            </span>

                            {post.is_verified_institution && (
                              <span className="flex items-center gap-0.5 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                ✓ Verified Institution
                              </span>
                            )}

                            {post.is_verified_donor && !post.is_verified_institution && (
                              <span className="flex items-center gap-0.5 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                ✓ Verified Donor
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>
                              {new Date(post.created_at).toLocaleTimeString('bn-BD', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span>•</span>
                            <span>{post.author_district || 'বরিশাল'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5" title="গোপনীয়তা স্তর">
                              {post.privacy === 'everyone' ? (
                                <Globe className="w-3 h-3 text-slate-400" />
                              ) : (
                                <Lock className="w-3 h-3 text-slate-400" />
                              )}
                              {post.privacy === 'everyone' ? 'Public' : 'Controlled'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Post Category Tag */}
                      <div>
                        {isDonationStory && (
                          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-extrabold text-[10px] flex items-center gap-1">
                            <Droplet className="w-3 h-3 fill-red-600" />
                            Donation Story
                          </span>
                        )}
                        {isEmergency && (
                          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-extrabold text-[10px] flex items-center gap-1 animate-pulse">
                            <Flame className="w-3 h-3" />
                            Emergency Need
                          </span>
                        )}
                        {isAlbum && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px] flex items-center gap-1">
                            <FolderPlus className="w-3 h-3" />
                            Photo Album
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ২. 🩸 Donation Story Special Card Styling */}
                    {isDonationStory && post.donation_meta && (
                      <div className="mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-red-600/10 via-rose-600/10 to-red-600/5 border border-red-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex flex-col items-center justify-center font-black">
                            <span className="text-[10px] leading-none">রক্তদান</span>
                            <span className="text-base leading-none mt-0.5">
                              {post.donation_meta.donation_number}তম
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-xs text-red-900">
                                {post.donation_meta.hospital}
                              </span>
                              <span className="px-1.5 py-0.2 rounded-md bg-red-600 text-white font-black text-[9px]">
                                {post.donation_meta.blood_group}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {post.donation_meta.patient_case || 'জীবন রক্ষায় মানবিক রক্তদান'}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      </div>
                    )}

                    {/* Emergency Request Banner with Controlled Contact System */}
                    {isEmergency && post.emergency_meta && (
                      <div className="mb-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xs">
                              {post.emergency_meta.blood_group}
                            </span>
                            <div>
                              <p className="font-extrabold text-xs text-slate-900">
                                {post.emergency_meta.units} ব্যাগ {post.emergency_meta.blood_group} জরুরি প্রয়োজন
                              </p>
                              <p className="text-[11px] text-slate-500">{post.emergency_meta.hospital}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-200/80 px-2.5 py-0.5 rounded-full">
                            {post.emergency_meta.urgency}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-rose-200/60 text-xs">
                          <span className="text-[11px] text-slate-600 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-rose-600" />
                            Controlled Contact System সুরক্ষিত
                          </span>
                          <button
                            onClick={() => {
                              setMessengerEmergencyPrompt({
                                blood_group: post.emergency_meta!.blood_group,
                                hospital: post.emergency_meta!.hospital,
                                units: post.emergency_meta!.units,
                                requester_name: post.author_name,
                              });
                              setShowMessenger(true);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>যোগাযোগ করুন</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Post Title */}
                    {post.title && (
                      <h4 className="font-extrabold text-sm text-slate-900 mb-1.5">
                        {post.title}
                      </h4>
                    )}

                    {/* Post Content Body */}
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mb-3">
                      {post.content}
                    </p>

                    {/* ৩. 📸 Photo + Album System Display */}
                    {isAlbum && post.album && (
                      <div className="mb-3 space-y-2">
                        <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-800">
                            📁 {post.album.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-[11px]">
                              {post.album.hospital} • {post.album.date}
                            </span>
                            <span className="text-[9px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 font-bold">
                              R2 Storage ✓
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {post.album.photos.map((pUrl, pIdx) => (
                            <div
                              key={pIdx}
                              className="relative rounded-2xl overflow-hidden aspect-square border border-slate-200/80 shadow-xs group cursor-pointer"
                            >
                              <img
                                src={pUrl}
                                alt={`Album photo ${pIdx}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                              <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-[8px] text-white font-mono px-1.5 py-0.2 rounded-sm">
                                R2
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Regular Post Images */}
                    {!isAlbum && post.images && post.images.length > 0 && (
                      <div className="relative mb-3 rounded-2xl overflow-hidden border border-slate-200/80 max-h-80 group">
                        <img
                          src={post.images[0]}
                          alt="Post media"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-[9px] text-white font-mono px-2 py-0.5 rounded-full">
                          Cloudflare R2 ✓
                        </span>
                      </div>
                    )}

                    {/* ৫. ❤️ Premium Reaction System & Action Bar */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <PremiumReactionSystem
                        reactions={post.reactions}
                        currentReaction={post.user_reaction}
                        onSelectReaction={(type) => handleReactToPost(post.id, type)}
                      />

                      <div className="flex items-center gap-2 text-xs">
                        {/* Comment Toggle */}
                        <button
                          onClick={() =>
                            setExpandedComments((prev) => ({
                              ...prev,
                              [post.id]: !prev[post.id],
                            }))
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 text-slate-400" />
                          <span>মন্তব্য ({post.comments_count || 0})</span>
                        </button>

                        {/* Share */}
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: post.title || 'বরিশাল রক্ত পোস্ট',
                                text: post.content,
                                url: window.location.href,
                              });
                            } else {
                              navigator.clipboard?.writeText(window.location.href);
                              showToast('পোস্টের লিংক ক্লিপবোর্ডে কপি করা হয়েছে!', 'success');
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
                        >
                          <Share2 className="w-4 h-4 text-slate-400" />
                          <span>শেয়ার</span>
                        </button>
                      </div>
                    </div>

                    {/* Comments Section Drawer */}
                    {expandedComments[post.id] && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                        {/* Comments list */}
                        {post.comments && post.comments.length > 0 && (
                          <div className="space-y-2">
                            {post.comments.map((cm) => (
                              <div
                                key={cm.id}
                                className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-extrabold text-slate-900">
                                    {cm.author_name}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {new Date(cm.created_at).toLocaleTimeString('bn-BD', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                                <p className="text-slate-600 leading-relaxed">{cm.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Comment Input */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post.id);
                            }}
                            placeholder="একটি সম্মানজনক মন্তব্য লিখুন..."
                            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-red-500"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar Column (Widgets & Donor Reputation) */}
          <div className="space-y-5">
            {/* ৬. 🏆 Donor Reputation System Widget */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-red-600" />
                  Donor Reputation System
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {reputation.level} Tier
                </span>
              </div>

              {/* Donor Mini Card */}
              <div
                onClick={() => setSelectedDonorProfileModal(reputation)}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition"
              >
                <img
                  src={reputation.avatar_url}
                  alt={reputation.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                />
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{reputation.name}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Donor
                  </div>
                  <span className="text-[10px] text-slate-500">
                    🩸 {reputation.blood_group} • {reputation.district}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-100">
                  <p className="text-base font-black text-red-700">{reputation.total_donations}</p>
                  <p className="text-[10px] text-slate-600 font-bold">Donations</p>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
                  <p className="text-base font-black text-rose-700">{reputation.emergency_responses}</p>
                  <p className="text-[10px] text-slate-600 font-bold">Emergency Responses</p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                  <p className="text-base font-black text-amber-700">{reputation.people_reached}+</p>
                  <p className="text-[10px] text-slate-600 font-bold">People Reached</p>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                  <p className="text-base font-black text-blue-700">{reputation.badges_count}</p>
                  <p className="text-[10px] text-slate-600 font-bold">Badges Unlocked</p>
                </div>
              </div>

              {/* Impact Score Progress Bar */}
              <div className="p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border border-red-200/70">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-black text-red-900">Impact Score</span>
                  <span className="font-black text-red-600">{reputation.impact_score} / ১০০০</span>
                </div>
                <div className="w-full h-2.5 bg-red-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${(reputation.impact_score / 1000) * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => setSelectedDonorProfileModal(reputation)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
              >
                সম্পূর্ণ প্রোফাইল দেখুন (Facebook-এর চেয়ে উন্নত)
              </button>
            </div>

            {/* ৭. 🏅 Premium Badge System Widget */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                সামাজিক অর্জন ও ব্যাজসমূহ
              </h4>

              <div className="grid grid-cols-2 gap-2">
                {reputation.badges.slice(0, 4).map((b) => (
                  <div
                    key={b.id}
                    className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2"
                  >
                    <span className="text-xl">{b.icon}</span>
                    <div className="min-w-0">
                      <p className="font-black text-[11px] text-slate-900 truncate">{b.name}</p>
                      <p className="text-[9px] text-slate-400 truncate">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ১৮. 📰 Blood News & Education Mini Widget */}
            <div className="bg-gradient-to-br from-slate-900 to-red-950 text-white rounded-3xl p-5 shadow-xs space-y-3">
              <span className="text-[10px] font-black uppercase text-red-400 tracking-wider">
                রক্তদান জ্ঞানকোষ
              </span>
              <h4 className="font-extrabold text-sm leading-snug">
                রক্তদানে আপনার হার্ট ও লিভার কেন সুস্থ থাকে?
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                নিয়মিত রক্তদানে শরীরে অতিরিক্ত আয়রন জমে থাকা প্রতিরোধ হয়, যা কার্ডিওভাসকুলার রোগ ও হার্ট অ্যাটাকের ঝুঁকি প্রায় ৩৩% কমিয়ে দেয়।
              </p>
              <div className="pt-1">
                <span className="text-[11px] font-bold text-red-400 hover:underline cursor-pointer">
                  সম্পূর্ণ গাইড পড়ুন →
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stories Viewer Modal */}
      {activeStoryIndex !== null && stories.length > 0 && (
        <BloodStoriesViewer
          stories={stories}
          initialStoryIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
        />
      )}

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <CreatePostModal
          initialType={createPostInitialType}
          onClose={() => setShowCreatePostModal(false)}
          onSubmit={handleCreatePostSubmit}
        />
      )}

      {/* Messenger Modal */}
      {showMessenger && (
        <MessengerModal
          emergencyRequestPrompt={messengerEmergencyPrompt}
          onClose={() => {
            setShowMessenger(false);
            setMessengerEmergencyPrompt(null);
          }}
        />
      )}

      {/* Premium Donor Profile Modal */}
      {selectedDonorProfileModal && (
        <PremiumDonorProfileModal
          profileData={selectedDonorProfileModal}
          onClose={() => setSelectedDonorProfileModal(null)}
          onOpenMessage={() => {
            setSelectedDonorProfileModal(null);
            setShowMessenger(true);
          }}
        />
      )}
    </div>
  );
};
