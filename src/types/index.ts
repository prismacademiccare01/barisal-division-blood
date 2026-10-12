export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'visitor' | 'donor' | 'requester' | 'hospital' | 'admin' | 'super_admin';

export type EmergencyLevel = 'critical' | 'urgent' | 'standard';

export type RequestStatus = 'pending' | 'active' | 'fulfilled' | 'cancelled' | 'expired';

export interface User {
  id: number;
  phone: string;
  name: string;
  role: UserRole;
  status: 'active' | 'suspended' | 'pending';
  avatar?: string;
  donor_id?: number;
  blood_group?: BloodGroup;
  district?: string;
  upazila?: string;
  is_available?: number;
  is_verified?: number;
  total_donations?: number;
  admin_level?: 'admin' | 'super_admin';
  admin_permissions?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Donor {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  blood_group: BloodGroup;
  gender: 'male' | 'female' | 'other';
  age?: number;
  district: string;
  upazila: string;
  area?: string;
  address?: string;
  last_donation_date?: string;
  total_donations: number;
  is_available: number;
  is_verified: number;
  verification_notes?: string;
  avatar?: string;
  canDirectCall?: boolean;
}

export interface BloodRequest {
  id: number;
  user_id?: number;
  patient_name: string;
  blood_group: BloodGroup;
  units_needed: number;
  hospital_name: string;
  district: string;
  upazila: string;
  location_details?: string;
  needed_date: string;
  needed_time: string;
  contact_phone: string;
  emergency_level: EmergencyLevel;
  case_info?: string;
  additional_notes?: string;
  status: RequestStatus;
  created_at: string;
  accepted_count?: number;
  total_responses?: number;
  my_response?: 'accepted' | 'declined' | 'maybe';
  my_message?: string;
}

export interface RequestResponse {
  id: number;
  request_id: number;
  donor_id: number;
  donor_name: string;
  donor_phone: string;
  blood_group: BloodGroup;
  district: string;
  upazila: string;
  is_verified: number;
  total_donations: number;
  status: 'accepted' | 'declined' | 'maybe';
  donor_message?: string;
  created_at: string;
}

export interface Hospital {
  id: number;
  name: string;
  address: string;
  district: string;
  upazila: string;
  phone: string;
  emergency_contact?: string;
  is_verified: number;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'system' | 'blood_request' | 'emergency' | 'accepted' | 'broadcast';
  is_read: number;
  metadata_json?: string;
  created_at: string;
}

export interface ReportItem {
  id: number;
  reporter_id?: number;
  reporter_name?: string;
  reporter_phone?: string;
  reported_type: 'donor' | 'request' | 'hospital';
  reported_id: number;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  admin_notes?: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  user_name?: string;
  action: string;
  target_type?: string;
  target_id?: number;
  details_json?: string;
  ip?: string;
  created_at: string;
}

export interface AdminStats {
  summary: {
    totalDonors: number;
    activeDonors: number;
    verifiedDonors: number;
    totalRequests: number;
    emergencyRequests: number;
    fulfilledRequests: number;
    totalHospitals: number;
    pendingReports: number;
    totalUsers: number;
  };
  bloodGroupDist: { blood_group: BloodGroup; count: number }[];
  districtDist: { district: string; count: number }[];
  requestStatusDist: { status: string; count: number }[];
  recentAuditLogs: AuditLog[];
}

// ==========================================
// 🩸 BARISHAL-BLOOD - PREMIUM SOCIAL SYSTEM
// ==========================================

export type SocialReactionType = 'support' | 'lifesaver' | 'respect' | 'hero' | 'congratulations';
export type PostPrivacy = 'everyone' | 'followers' | 'community' | 'only_me';
export type PostCategory = 'emergency' | 'donation' | 'hospital' | 'community' | 'education' | 'general';

export interface SocialComment {
  id: string;
  author_name: string;
  author_avatar?: string;
  author_badge?: string;
  author_blood_group?: BloodGroup;
  content: string;
  created_at: string;
  likes: number;
  user_liked?: boolean;
}

export interface SocialAlbum {
  title: string;
  hospital: string;
  date: string;
  blood_group: BloodGroup;
  donation_number?: number;
  photos: string[];
}

export interface SocialPost {
  id: string;
  author_id: string | number;
  author_name: string;
  author_role?: string;
  author_avatar?: string;
  author_blood_group?: BloodGroup;
  author_district?: string;
  author_upazila?: string;
  is_verified_donor?: boolean;
  is_verified_institution?: boolean;
  created_at: string;
  post_type: 'general' | 'donation_story' | 'album' | 'emergency' | 'announcement' | 'education';
  category: PostCategory;
  title?: string;
  content: string;
  images?: string[];
  album?: SocialAlbum;
  donation_meta?: {
    donation_number: number;
    hospital: string;
    blood_group: BloodGroup;
    is_verified: boolean;
    patient_case?: string;
  };
  emergency_meta?: {
    blood_group: BloodGroup;
    hospital: string;
    units: number;
    urgency: 'critical' | 'urgent' | 'moderate';
    contact_protected: boolean;
    request_id?: number;
  };
  reactions: {
    support: number;
    lifesaver: number;
    respect: number;
    hero: number;
    congratulations: number;
  };
  user_reaction?: SocialReactionType;
  comments_count: number;
  comments?: SocialComment[];
  shares_count: number;
  privacy: PostPrivacy;
  priority: number; // 1 (Critical Emergency) to 7 (Community)
}

export interface ShortStory {
  id: string;
  user_id: string | number;
  user_name: string;
  user_avatar?: string;
  user_badge: string;
  blood_group?: BloodGroup;
  story_type: 'donation' | 'emergency' | 'awareness' | 'achievement' | 'camp';
  media_url: string;
  caption: string;
  location: string;
  created_at: string;
  has_unseen: boolean;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string | number;
  sender_name: string;
  text: string;
  media_url?: string;
  voice_duration?: number;
  created_at: string;
  is_delivered: boolean;
  is_read: boolean;
  is_pinned?: boolean;
  is_emergency?: boolean;
  reply_to?: { id: string; text: string; sender_name: string };
}

export interface ChatConversation {
  id: string;
  participant_id: string | number;
  participant_name: string;
  participant_avatar?: string;
  participant_blood_group?: BloodGroup;
  participant_online?: boolean;
  participant_typing?: boolean;
  is_emergency: boolean;
  emergency_details?: {
    blood_group: BloodGroup;
    hospital: string;
    units: number;
    urgency: string;
  };
  last_message: string;
  last_message_time: string;
  unread_count: number;
  type: 'direct' | 'emergency' | 'group' | 'hospital';
}

export interface DonorReputationProfile {
  id: string | number;
  name: string;
  blood_group: BloodGroup;
  district: string;
  upazila: string;
  is_verified_donor: boolean;
  avatar_url?: string;
  cover_url?: string;
  bio?: string;
  impact_score: number;
  total_donations: number;
  emergency_responses: number;
  people_reached: number;
  badges_count: number;
  posts_count: number;
  following_count: number;
  followers_count: number;
  level: 'Bronze' | 'Silver' | 'Golden' | 'Platinum';
  badges: {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlocked_at: string;
  }[];
}

export interface CloudflareR2Object {
  id: string;
  r2_bucket: string;
  r2_key: string;
  public_url: string;
  file_name: string;
  content_type: string;
  file_size: number;
  user_id?: number | string;
  album_id?: string;
  caption?: string;
  entity_type?: 'donation_story' | 'album' | 'post' | 'avatar' | 'verification_doc';
  created_at: string;
}

export interface CloudflareD1Album {
  id: string;
  user_id: number | string;
  user_name?: string;
  title: string;
  caption?: string;
  hospital_name: string;
  blood_group: BloodGroup;
  donation_date: string;
  donation_number?: number;
  cover_r2_url: string;
  r2_photos: { key: string; url: string; caption?: string }[];
  privacy: PostPrivacy;
  created_at: string;
}

export interface CloudflareD1Status {
  database_name: string;
  region: string;
  version: string;
  tables_count: number;
  total_records: number;
  storage_size_kb: number;
  read_latency_ms: number;
  write_latency_ms: number;
  sync_state: 'synced' | 'pending' | 'replicating';
  r2_binding: {
    bucket: string;
    total_objects: number;
    storage_mb: number;
    egress_cost_usd: number;
    cdn_cache_hit_rate: number;
  };
}

export interface CloudflareD1Instance {
  id: string;
  name: string;
  database_id: string;
  account_id: string;
  api_token: string;
  binding_name: string;
  region: string;
  environment: 'production' | 'staging' | 'replica' | 'backup';
  replication_mode: 'primary' | 'read_replica' | 'standby';
  is_primary: number;
  status: 'active' | 'standby' | 'syncing' | 'error';
  read_latency_ms: number;
  write_latency_ms: number;
  storage_bytes: number;
  tables_count: number;
  last_ping_at: string;
  last_synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface D1QueryResult {
  columns: string[];
  rows: any[];
  executionTimeMs: number;
  changes?: number;
  query: string;
}
