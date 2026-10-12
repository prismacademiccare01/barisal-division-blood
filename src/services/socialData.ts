import { SocialPost, ShortStory, ChatConversation, ChatMessage, DonorReputationProfile, BloodGroup } from '../types/index.js';

const INITIAL_STORIES: ShortStory[] = [
  {
    id: 'story-1',
    user_id: 101,
    user_name: 'আব্দুর রহিম',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    user_badge: '🩸 ১২তম রক্তদান',
    blood_group: 'O+',
    story_type: 'donation',
    media_url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
    caption: 'আজ শেরেবাংলা মেডিকেলে ১২তম বার রক্তদান সম্পন্ন করলাম! রক্ত দিন, জীবন বাঁচান।',
    location: 'বরিশাল সদর',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    has_unseen: true,
  },
  {
    id: 'story-2',
    user_id: 102,
    user_name: 'করিম হোসেন',
    user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    user_badge: '🚨 জরুরি সেবক',
    blood_group: 'B+',
    story_type: 'emergency',
    media_url: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&auto=format&fit=crop&q=80',
    caption: 'জরুরি রক্তের ডাকে সাড়া দিয়ে ঝালকাঠি থেকে রাতেই বরিশালে এলাম। রোগী এখন শঙ্কামুক্ত!',
    location: 'ঝালকাঠি - বরিশাল',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    has_unseen: true,
  },
  {
    id: 'story-3',
    user_id: 103,
    user_name: 'সুমাইয়া আক্তার',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    user_badge: '❤️ গোল্ডেন ডোনার',
    blood_group: 'A+',
    story_type: 'awareness',
    media_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80',
    caption: 'নারীদের রক্তদানের সচেতনতা বাড়াতে বরিশাল বিএম কলেজে আমাদের ছোট্ট ক্যাম্পেইন!',
    location: 'বিএম কলেজ, বরিশাল',
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    has_unseen: false,
  },
  {
    id: 'story-4',
    user_id: 201,
    user_name: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল',
    user_avatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&auto=format&fit=crop&q=80',
    user_badge: '🏥 ভেরিফাইড ব্লাড ব্যাংক',
    blood_group: 'AB+',
    story_type: 'camp',
    media_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=80',
    caption: 'আজকের ব্লাড ব্যাংকে প্লেটলেট অ্যাফেরেটিক্স ইউনিট সফলভাবে প্রসেস করা হয়েছে।',
    location: 'SBMCH ব্লাড ব্যাংক',
    created_at: new Date(Date.now() - 11 * 3600000).toISOString(),
    has_unseen: false,
  },
];

const INITIAL_POSTS: SocialPost[] = [
  // Priority 1: Critical Emergency Post
  {
    id: 'post-101',
    author_id: 110,
    author_name: 'তানভীর আহমেদ',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    author_blood_group: 'B+',
    author_district: 'বরিশাল',
    author_upazila: 'বরিশাল সদর',
    is_verified_donor: false,
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
    post_type: 'emergency',
    category: 'emergency',
    title: 'জরুরি বি পজিটিভ (B+) রক্ত প্রয়োজন - ২ ইউনিট',
    content: 'আমার বাবার অ্যাপেন্ডিসাইটিস অপারেশনের জন্য আজ রাতের মধ্যেই জরুরি ২ ব্যাগ B+ রক্ত প্রয়োজন। শেরেবাংলা মেডিকেল কলেজ হাসপাতাল সার্জারি ওয়ার্ডে ভর্তি আছেন। কোনো রক্তদাতা ভাই বরিশাল শহরে থাকলে দ্রুত যোগাযোগ করার অনুরোধ করছি।',
    emergency_meta: {
      blood_group: 'B+',
      hospital: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল (SBMCH), বরিশাল',
      units: 2,
      urgency: 'critical',
      contact_protected: true,
      request_id: 1,
    },
    reactions: {
      support: 28,
      lifesaver: 42,
      respect: 15,
      hero: 12,
      congratulations: 2,
    },
    comments_count: 9,
    shares_count: 34,
    privacy: 'everyone',
    priority: 1,
    comments: [
      {
        id: 'c-1',
        author_name: 'মাহমুদুল হাসান',
        author_badge: 'রক্তদাতা O+',
        author_blood_group: 'O+',
        content: 'আমি রূপাতলী আছি, জরুরি হলে জানালে আমি ২০ মিনিটের মধ্যে হাসপাতালে আসতে পারব ভাই।',
        created_at: new Date(Date.now() - 15 * 60000).toISOString(),
        likes: 8,
      },
      {
        id: 'c-2',
        author_name: 'বরিশাল রক্ত ভলান্টিয়ার টিম',
        author_badge: 'টিম কো-অর্ডিনেটর',
        content: 'আমাদের সদর এলাকার ডোনার গ্রুপে পোস্টটি শিয়ার করা হয়েছে। যোগাযোগ বজায় রাখুন।',
        created_at: new Date(Date.now() - 10 * 60000).toISOString(),
        likes: 5,
      },
    ],
  },

  // Priority 2: Verified Hospital Update (Priority 3 in Smart Feed)
  {
    id: 'post-102',
    author_id: 501,
    author_name: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল ব্লাড ব্যাংক',
    author_role: 'অফিসিয়াল ব্লাড ব্যাংক অথরিটি',
    author_avatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&auto=format&fit=crop&q=80',
    author_district: 'বরিশাল',
    author_upazila: 'বরিশাল সদর',
    is_verified_institution: true,
    created_at: new Date(Date.now() - 90 * 60000).toISOString(),
    post_type: 'announcement',
    category: 'hospital',
    title: '✓ অফিসিয়াল বিজ্ঞপ্তি: ডেঙ্গু মৌসুমের জন্য ও-নেগেটিভ (O-) ও প্লেটলেট রক্তের আগাম আবেদন',
    content: 'সম্মানিত বরিশালবাসী ও স্বেচ্ছাসেবী রক্তদাতাগণ, বর্তমান সময়ে ডেঙ্গু রোগীর চাপ বৃদ্ধি পাওয়ায় আমাদের সেন্ট্রাল ব্লাড ব্যাংকে O- ও A- গ্রুপের মজুত হ্রাস পেয়েছে। নিয়মিত রক্তদাতাদের আগামী ৩ দিনের মধ্যে স্বেচ্ছায় রক্তদানের উদাত্ত আহ্বান জানানো হচ্ছে। রক্তের ক্রস-ম্যাচিং সম্পূর্ণ বিনামূল্যে করা হবে।',
    images: ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80'],
    reactions: {
      support: 84,
      lifesaver: 95,
      respect: 67,
      hero: 41,
      congratulations: 19,
    },
    comments_count: 14,
    shares_count: 58,
    privacy: 'everyone',
    priority: 3,
  },

  // Priority 4: Premium Donation Story (বিশেষ Donation Story)
  {
    id: 'post-103',
    author_id: 101,
    author_name: 'মো. সাইদ ইসলাম',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    author_blood_group: 'O+',
    author_district: 'বরিশাল',
    author_upazila: 'বরিশাল সদর',
    is_verified_donor: true,
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    post_type: 'donation_story',
    category: 'donation',
    title: '🩸 আজ ১২তম বার রক্তদান করলাম',
    content: 'আলহামদুলিল্লাহ! আজ বরিশাল সদর হাসপাতালে এক থ্যালাসেমিয়া আক্রান্ত শিশুর জন্য ১২তম বারের মতো O+ রক্তদান সম্পন্ন করলাম। একটি নিষ্পাপ হাসির চেয়ে দামি উপহার এই পৃথিবীতে আর কিছুই হতে পারে না। একজন মানুষের বিপদে পাশে দাঁড়াতে পেরে পরম শান্তি পাচ্ছি। বরিশাল রক্তের ভলান্টিয়ারদের অক্লান্ত সহযোগিতার জন্য কৃতজ্ঞতা।',
    donation_meta: {
      donation_number: 12,
      hospital: 'বরিশাল জেনারেল (সদর) হাসপাতাল',
      blood_group: 'O+',
      is_verified: true,
      patient_case: 'থ্যালাসেমিয়া নিয়মিত রক্ত পরিসঞ্চালন',
    },
    images: [
      'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
    ],
    reactions: {
      support: 124,
      lifesaver: 215,
      respect: 143,
      hero: 98,
      congratulations: 87,
    },
    comments_count: 26,
    shares_count: 41,
    privacy: 'everyone',
    priority: 4,
    comments: [
      {
        id: 'c-3',
        author_name: 'ডা. নাজমুল সাকিব',
        author_badge: 'মেডিকেল অফিসার',
        content: 'মাশাআল্লাহ ভাই! আপনার মতো নিয়মিত রক্তদাতাই আমাদের শক্তি। অনেক শুভকামনা।',
        created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
        likes: 19,
      },
      {
        id: 'c-4',
        author_name: 'ফারহানা ইয়াসমিন',
        author_badge: 'ভেরিফাইড ডোনার',
        content: 'অসাধারণ অনুপ্রেরণা ভাই! পরবর্তী ক্যাম্পে আমিও রক্তদান করব ইনশাআল্লাহ।',
        created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
        likes: 12,
      },
    ],
  },

  // Priority 5: Photo + Album System Post
  {
    id: 'post-104',
    author_id: 105,
    author_name: 'কাজী আরিফুল ইসলাম',
    author_avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    author_blood_group: 'A+',
    author_district: 'বরিশাল',
    author_upazila: 'বাবুগঞ্জ',
    is_verified_donor: true,
    created_at: new Date(Date.now() - 10 * 3600000).toISOString(),
    post_type: 'album',
    category: 'donation',
    title: '📸 ডোনেশন অ্যালবাম: My 10th Blood Donation Milestone',
    content: '১০ম রক্তদান মাইলফলক উদযাপন! বাবুগঞ্জ ও বরিশাল সদরের বন্ধুদের সঙ্গে নিয়ে এই রক্তদান যাত্রা। প্রতিটি রক্তের ফোঁটায় জীবনের স্পন্দন থাকুক।',
    album: {
      title: 'My 10th Blood Donation',
      hospital: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল, বরিশাল',
      date: '১০ অক্টোবর ২০২৬',
      blood_group: 'A+',
      donation_number: 10,
      photos: [
        'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
      ],
    },
    reactions: {
      support: 92,
      lifesaver: 110,
      respect: 76,
      hero: 64,
      congratulations: 58,
    },
    comments_count: 18,
    shares_count: 22,
    privacy: 'everyone',
    priority: 4,
  },

  // Priority 6: Education & Awareness Post
  {
    id: 'post-105',
    author_id: 301,
    author_name: 'বরিশাল রক্ত এডুকেশন সেল',
    author_role: 'মেডিকেল ইনফরমেশন বোর্ড',
    author_avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    author_district: 'বরিশাল',
    is_verified_institution: true,
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    post_type: 'education',
    category: 'education',
    title: '📚 ব্লাড ফ্যাক্টস: রক্তদানের পূর্বে ও পরে কী খাবেন?',
    content: '১. রক্তদানের আগের রাতে পর্যাপ্ত ঘুম ও অন্তত ৫০০ মি.লি পানি পান করুন।\n২. খালি পেটে রক্তদান করবেন না—হালকা পুষ্টিকর নাশতা খান।\n৩. রক্তদানের পর আধা ঘণ্টা বিশ্রাম ও মিষ্টি ফলের জুস বা পানি গ্রহণ করুন।\n৪. আয়রন সমৃদ্ধ খাবার যেমন পালংশাক, কচুশাক, ডালিম ও ডিম নিয়মিত আহারে রাখুন।',
    images: ['https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80'],
    reactions: {
      support: 65,
      lifesaver: 45,
      respect: 80,
      hero: 22,
      congratulations: 15,
    },
    comments_count: 8,
    shares_count: 49,
    privacy: 'everyone',
    priority: 6,
  },
];

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    participant_id: 110,
    participant_name: 'তানভীর আহমেদ (রোগীর স্বজন)',
    participant_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    participant_blood_group: 'B+',
    participant_online: true,
    participant_typing: false,
    is_emergency: true,
    emergency_details: {
      blood_group: 'B+',
      hospital: 'শেরেবাংলা মেডিকেল কলেজ হাসপাতাল',
      units: 2,
      urgency: 'Critical',
    },
    last_message: 'ভাইয়া আপনি কখন আসতে পারবেন? ডাক্তার রক্ত ক্রস-ম্যাচের জন্য চেয়েছেন।',
    last_message_time: '১০ মিনিট আগে',
    unread_count: 1,
    type: 'emergency',
  },
  {
    id: 'conv-2',
    participant_id: 101,
    participant_name: 'আব্দুর রহিম (রক্তদাতা)',
    participant_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    participant_blood_group: 'O+',
    participant_online: false,
    participant_typing: false,
    is_emergency: false,
    last_message: 'ইনশাআল্লাহ আগামী রবিবারে আমি ফ্রি আছি, যোগাযোগ করবেন।',
    last_message_time: '২ ঘণ্টা আগে',
    unread_count: 0,
    type: 'direct',
  },
  {
    id: 'conv-3',
    participant_id: 501,
    participant_name: 'SBMCH সেন্ট্রাল ব্লাড ব্যাংক সাপোর্ট',
    participant_avatar: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=150&auto=format&fit=crop&q=80',
    participant_blood_group: 'AB+',
    participant_online: true,
    participant_typing: false,
    is_emergency: false,
    last_message: 'আপনার রক্তদানের ডিজিটাল ভেরিফিকেশন সার্টিফিকেট রেডি হয়েছে।',
    last_message_time: 'গতকাল',
    unread_count: 0,
    type: 'hospital',
  },
  {
    id: 'conv-4',
    participant_id: 801,
    participant_name: 'বরিশাল সদর O+ ডোনার স্কোয়াড (গ্রুপ)',
    participant_avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80',
    participant_blood_group: 'O+',
    participant_online: true,
    is_emergency: false,
    last_message: 'আসন্ন শুক্রবারে রূপাতলী বাসস্ট্যান্ডে রক্তদান সচেতনতা সভা।',
    last_message_time: '৩ ঘণ্টা আগে',
    unread_count: 3,
    type: 'group',
  },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm-1',
      conversation_id: 'conv-1',
      sender_id: 110,
      sender_name: 'তানভীর আহমেদ',
      text: 'আসসালামু আলাইকুম ভাই, বরিশাল রক্ত অ্যাপ থেকে আপনার নম্বর ও প্রোফাইল দেখে নক দিয়েছি।',
      created_at: new Date(Date.now() - 30 * 60000).toISOString(),
      is_delivered: true,
      is_read: true,
    },
    {
      id: 'm-2',
      conversation_id: 'conv-1',
      sender_id: 'current_user',
      sender_name: 'আমি',
      text: 'ওয়ালাইকুম আসসালাম। রোগীর অবস্থা কেমন? কোন ওয়ার্ডে আছেন?',
      created_at: new Date(Date.now() - 22 * 60000).toISOString(),
      is_delivered: true,
      is_read: true,
    },
    {
      id: 'm-3',
      conversation_id: 'conv-1',
      sender_id: 110,
      sender_name: 'তানভীর আহমেদ',
      text: 'শেরেবাংলা মেডিকেলের সার্জারি ওয়ার্ড ৪ তলায়। রাত ৯টায় জরুরি রক্ত দিতে হবে।',
      created_at: new Date(Date.now() - 15 * 60000).toISOString(),
      is_delivered: true,
      is_read: true,
    },
    {
      id: 'm-4',
      conversation_id: 'conv-1',
      sender_id: 110,
      sender_name: 'তানভীর আহমেদ',
      text: 'ভাইয়া আপনি কখন আসতে পারবেন? ডাক্তার রক্ত ক্রস-ম্যাচের জন্য চেয়েছেন।',
      created_at: new Date(Date.now() - 10 * 60000).toISOString(),
      is_delivered: true,
      is_read: false,
    },
  ],
};

const SAMPLE_REPUTATION: DonorReputationProfile = {
  id: 101,
  name: 'মো. সাইদ ইসলাম (MD. SAID)',
  blood_group: 'O+',
  district: 'বরিশাল',
  upazila: 'বরিশাল সদর',
  is_verified_donor: true,
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  cover_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  bio: 'রক্তদান মানবতার সেরা ইবাদত। বরিশালের যেকোনো জরুরি প্রয়োজনে মানুষের পাশে দাঁড়াতে প্রস্তুত।',
  impact_score: 860,
  total_donations: 12,
  emergency_responses: 4,
  people_reached: 320,
  badges_count: 8,
  posts_count: 38,
  following_count: 142,
  followers_count: 489,
  level: 'Golden',
  badges: [
    { id: 'b-1', name: 'First Donation', icon: '🩸', description: 'প্রথমবার স্বেচ্ছায় রক্তদান সম্পন্ন', unlocked_at: '২০২১-০৫-১২' },
    { id: 'b-2', name: 'Community Supporter', icon: '❤️', description: 'কমিউনিটির সক্রিয় সহমর্মী ডোনার', unlocked_at: '২০২২-০১-১০' },
    { id: 'b-3', name: 'Emergency Responder', icon: '🚨', description: '৪টি সংকটকালীন জরুরি ডাকে তাৎক্ষণিক রক্তদান', unlocked_at: '২০২২-০৮-১৫' },
    { id: 'b-4', name: 'Hospital Hero', icon: '🏥', description: 'মেডিকেল সেন্টারে সর্বোচ্চ অবদানকারী', unlocked_at: '২০২৩-০৩-২২' },
    { id: 'b-5', name: 'Blood Educator', icon: '📚', description: 'নতুন ৫০+ ডোনারকে উদ্বুদ্ধ করেছেন', unlocked_at: '২০২৩-১১-০৪' },
    { id: 'b-6', name: 'Community Builder', icon: '🤝', description: 'রক্তদান নেটওয়ার্ক গড়ে তুলতে সক্রিয় নেতৃত্ব', unlocked_at: '২০২৪-০২-১৯' },
    { id: 'b-7', name: 'Verified Donor', icon: '⭐', description: 'মেডিকেল সার্টিফিকেট দ্বারা যাচাইকৃত ডোনার', unlocked_at: '২০২৪-০৬-৩০' },
    { id: 'b-8', name: 'Regular Donor', icon: '🏆', description: 'টানা ৩ বছর প্রতি ৯০ দিনে রক্তদান', unlocked_at: '২০২৬-০৮-১২' },
  ],
};

export class SocialStorageService {
  private static POSTS_KEY = 'barishal_rokto_posts_v2';
  private static STORIES_KEY = 'barishal_rokto_stories_v2';
  private static CONVS_KEY = 'barishal_rokto_convs_v2';
  private static MSGS_KEY = 'barishal_rokto_msgs_v2';
  private static REPUTATION_KEY = 'barishal_rokto_reputation_v2';

  static getPosts(): SocialPost[] {
    try {
      const data = localStorage.getItem(this.POSTS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(this.POSTS_KEY, JSON.stringify(INITIAL_POSTS));
    return INITIAL_POSTS;
  }

  static savePosts(posts: SocialPost[]): void {
    try {
      localStorage.setItem(this.POSTS_KEY, JSON.stringify(posts));
    } catch {}
  }

  static getStories(): ShortStory[] {
    try {
      const data = localStorage.getItem(this.STORIES_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(this.STORIES_KEY, JSON.stringify(INITIAL_STORIES));
    return INITIAL_STORIES;
  }

  static getConversations(): ChatConversation[] {
    try {
      const data = localStorage.getItem(this.CONVS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(this.CONVS_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
    return INITIAL_CONVERSATIONS;
  }

  static saveConversations(convs: ChatConversation[]): void {
    try {
      localStorage.setItem(this.CONVS_KEY, JSON.stringify(convs));
    } catch {}
  }

  static getMessages(convId: string): ChatMessage[] {
    try {
      const data = localStorage.getItem(`${this.MSGS_KEY}_${convId}`);
      if (data) return JSON.parse(data);
    } catch {}
    const initial = INITIAL_MESSAGES[convId] || [];
    localStorage.setItem(`${this.MSGS_KEY}_${convId}`, JSON.stringify(initial));
    return initial;
  }

  static saveMessages(convId: string, messages: ChatMessage[]): void {
    try {
      localStorage.setItem(`${this.MSGS_KEY}_${convId}`, JSON.stringify(messages));
    } catch {}
  }

  static getReputation(): DonorReputationProfile {
    try {
      const data = localStorage.getItem(this.REPUTATION_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    localStorage.setItem(this.REPUTATION_KEY, JSON.stringify(SAMPLE_REPUTATION));
    return SAMPLE_REPUTATION;
  }
}
