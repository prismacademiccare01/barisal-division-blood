const TOKEN_KEY = 'barishal_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; message?: string; errors?: any; error?: string }> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || data.error || `অনুরোধ ব্যর্থ হয়েছে (${response.status})`,
        error: data.error || data.message,
        errors: data.errors,
      };
    }

    return {
      ...data,
      error: data.error,
    };
  } catch (err: any) {
    console.warn(`[API] Network error on ${endpoint}:`, err?.message);
    return {
      success: false,
      message: 'নেটওয়ার্ক সংযোগে সমস্যা হচ্ছে। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।',
    };
  }
}

export const api = {
  // Auth
  sendOtp: (phone: string, purpose = 'login') =>
    request<{ devDemoOtp?: string }>('/api/v1/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, purpose }),
    }),

  verifyOtp: (phone: string, otp: string) =>
    request('/api/v1/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    }),

  register: (payload: any) =>
    request<{ token: string; user: any }>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (phone: string, password: string) =>
    request<{ token: string; user: any }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    }),

  getMe: () => request<any>('/api/v1/auth/me'),

  resetPin: (phone: string, otp: string, newPassword: string) =>
    request('/api/v1/auth/reset-pin', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, newPassword }),
    }),

  logout: () =>
    request('/api/v1/auth/logout', {
      method: 'POST',
    }),

  // Donors
  searchDonors: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.append(k, String(v));
      }
    });
    return request<{ donors: any[]; pagination: any }>(`/api/v1/donors?${searchParams.toString()}`);
  },

  getDonorById: (id: number) => request<any>(`/api/v1/donors/${id}`),

  updateDonorProfile: (payload: any) =>
    request<any>('/api/v1/donors/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  toggleAvailability: () =>
    request<{ is_available: number }>('/api/v1/donors/toggle-availability', {
      method: 'POST',
    }),

  // Requests
  getRequests: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.append(k, String(v));
      }
    });
    return request<{ requests: any[]; pagination: any }>(`/api/v1/requests?${searchParams.toString()}`);
  },

  getRequestById: (id: number) => request<any>(`/api/v1/requests/${id}`),

  createRequest: (payload: any) =>
    request<{ id: number }>('/api/v1/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  respondRequest: (id: number, status: string, message?: string) =>
    request(`/api/v1/requests/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ status, message }),
    }),

  updateRequestStatus: (id: number, status: string) =>
    request(`/api/v1/requests/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),

  // Hospitals
  getHospitals: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.append(k, String(v));
      }
    });
    return request<any[]>(`/api/v1/hospitals?${searchParams.toString()}`);
  },

  createHospital: (payload: any) =>
    request<{ id: number }>('/api/v1/hospitals', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyHospital: (id: number, is_verified: boolean) =>
    request(`/api/v1/hospitals/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ is_verified }),
    }),

  getBloodStocks: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.append(k, String(v));
      }
    });
    return request<any[]>(`/api/v1/hospitals/stocks?${searchParams.toString()}`);
  },

  updateBloodStock: (hospitalId: number, blood_group: string, units: number) =>
    request(`/api/v1/hospitals/${hospitalId}/stocks`, {
      method: 'PUT',
      body: JSON.stringify({ blood_group, units }),
    }),

  // Notifications
  getNotifications: () =>
    request<{ notifications: any[]; unreadCount: number }>('/api/v1/notifications'),

  markNotificationAsRead: (id: number) =>
    request(`/api/v1/notifications/${id}/read`, {
      method: 'POST',
    }),

  markAllNotificationsAsRead: () =>
    request('/api/v1/notifications/read-all', {
      method: 'POST',
    }),

  // Reports
  submitReport: (reported_type: string, reported_id: number, reason: string) =>
    request('/api/v1/reports', {
      method: 'POST',
      body: JSON.stringify({ reported_type, reported_id, reason }),
    }),

  getReports: () => request<any[]>('/api/v1/reports'),

  updateReportStatus: (id: number, status: string, admin_notes?: string) =>
    request(`/api/v1/reports/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, admin_notes }),
    }),

  // Admin Auth & Setup
  checkAdminSetupStatus: () =>
    request<{ canCreateFirstAccount: boolean; setupCompleted: boolean; totalAdmins: number }>('/api/v1/auth/admin-setup-status'),

  adminFirstSetup: (payload: { username: string; password: string; name: string; phone?: string }) =>
    request<{ token: string; user: any }>('/api/v1/auth/admin-first-setup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  adminLogin: (username: string, password: string) =>
    request<{ token: string; user: any }>('/api/v1/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  // Admin Management & Strict Disciplinary Controls
  getAdminStats: () => request<any>('/api/v1/admin/stats'),

  getAdminDonors: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.append(k, String(v));
      }
    });
    return request<{ donors: any[]; total: number; page: number }>(`/api/v1/admin/donors?${searchParams.toString()}`);
  },

  donorStrictAction: (id: number, action: 'ban' | 'unban' | 'warn' | 'verify' | 'unverify' | 'delete', reason?: string, warning_level?: string) =>
    request(`/api/v1/admin/donors/${id}/strict-action`, {
      method: 'POST',
      body: JSON.stringify({ action, reason, warning_level }),
    }),

  verifyDonor: (id: number, is_verified: boolean, verification_notes?: string) =>
    request(`/api/v1/admin/donors/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ is_verified, verification_notes }),
    }),

  updateUserStatus: (id: number, status: string) =>
    request(`/api/v1/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  deleteDonor: (id: number) =>
    request(`/api/v1/admin/donors/${id}`, {
      method: 'DELETE',
    }),

  getAdminRequests: (params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        searchParams.append(k, String(v));
      }
    });
    return request<any[]>(`/api/v1/admin/requests?${searchParams.toString()}`);
  },

  requestStrictAction: (id: number, action: 'fraud_takedown' | 'emergency_siren' | 'status_update' | 'delete', reason?: string, new_status?: string) =>
    request(`/api/v1/admin/requests/${id}/strict-action`, {
      method: 'POST',
      body: JSON.stringify({ action, reason, new_status }),
    }),

  getAdminHospitals: () => request<any[]>('/api/v1/admin/hospitals'),

  createAdminHospital: (payload: any) =>
    request('/api/v1/admin/hospitals', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateAdminHospitalStocks: (id: number, stocks: Record<string, number>) =>
    request(`/api/v1/admin/hospitals/${id}/stocks`, {
      method: 'PUT',
      body: JSON.stringify({ stocks }),
    }),

  deleteAdminHospital: (id: number) =>
    request(`/api/v1/admin/hospitals/${id}`, {
      method: 'DELETE',
    }),

  getAdminReports: () => request<any[]>('/api/v1/admin/reports'),

  reportStrictAction: (id: number, action: 'resolve' | 'dismiss' | 'ban_target', admin_notes?: string) =>
    request(`/api/v1/admin/reports/${id}/strict-action`, {
      method: 'POST',
      body: JSON.stringify({ action, admin_notes }),
    }),

  getSystemConfig: () => request<any>('/api/v1/admin/system-config'),

  updateSystemConfig: (payload: any) =>
    request('/api/v1/admin/system-config', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  exportSystemBackup: () => request<any>('/api/v1/admin/export-backup'),

  sendBroadcast: (title: string, message: string, target_group = 'all') =>
    request('/api/v1/admin/broadcast', {
      method: 'POST',
      body: JSON.stringify({ title, message, target_group }),
    }),

  getAuditLogs: () => request<any[]>('/api/v1/admin/audit-logs'),

  // Rokto Shohayok AI Chat
  askAI: (message: string, conversationHistory: Array<{ role: string; text: string }> = []) =>
    request<{ reply: string; model?: string }>('/api/v1/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationHistory }),
    }),

  // Cloudflare R2 & D1 Storage
  uploadToR2: (
    dataUrl: string,
    options: {
      fileName?: string;
      contentType?: string;
      albumId?: string;
      caption?: string;
      entityType?: string;
    } = {}
  ) =>
    request<{
      id: string;
      r2_bucket: string;
      r2_key: string;
      public_url: string;
      file_name: string;
      content_type: string;
      file_size: number;
      d1_registered: boolean;
    }>('/api/v1/r2/upload', {
      method: 'POST',
      body: JSON.stringify({ dataUrl, ...options }),
    }),

  getD1Status: () => request<any>('/api/v1/d1/status'),

  getD1Albums: () => request<any[]>('/api/v1/d1/albums'),

  createD1Album: (albumData: any) =>
    request<{ id: string; title: string }>('/api/v1/d1/albums', {
      method: 'POST',
      body: JSON.stringify(albumData),
    }),

  // Cloudflare D1 Database Instances Management
  getD1Instances: () => request<any[]>('/api/v1/d1/instances'),

  createD1Instance: (instanceData: any) =>
    request<any>('/api/v1/d1/instances', {
      method: 'POST',
      body: JSON.stringify(instanceData),
    }),

  updateD1Instance: (id: string, instanceData: any) =>
    request<any>(`/api/v1/d1/instances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(instanceData),
    }),

  setPrimaryD1Instance: (id: string) =>
    request<any>(`/api/v1/d1/instances/${id}/primary`, {
      method: 'POST',
    }),

  testD1Instance: (id: string) =>
    request<any>(`/api/v1/d1/instances/${id}/test`, {
      method: 'POST',
    }),

  syncD1Instance: (id: string) =>
    request<any>(`/api/v1/d1/instances/${id}/sync`, {
      method: 'POST',
    }),

  deleteD1Instance: (id: string) =>
    request<any>(`/api/v1/d1/instances/${id}`, {
      method: 'DELETE',
    }),

  executeD1Query: (query: string) =>
    request<{
      columns: string[];
      rows: any[];
      changes: number;
      executionTimeMs: number;
      query: string;
    }>('/api/v1/d1/query', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }),
};
