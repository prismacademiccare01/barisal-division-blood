import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/index.js';
import { api, getStoredToken, setStoredToken, removeStoredToken } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, pin: string) => Promise<{ success: boolean; message?: string }>;
  adminLogin: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  adminFirstSetup: (payload: { username: string; password: string; name: string; phone?: string }) => Promise<{ success: boolean; message?: string }>;
  register: (payload: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isDonor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        removeStoredToken();
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (phone: string, pin: string) => {
    const res = await api.login(phone, pin);
    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setUser(res.data.user);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'লগইন ব্যর্থ হয়েছে' };
  };

  const adminLogin = async (username: string, pin: string) => {
    const res = await api.adminLogin(username, pin);
    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setUser(res.data.user);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'অ্যাডমিন লগইন ব্যর্থ হয়েছে' };
  };

  const adminFirstSetup = async (payload: { username: string; password: string; name: string; phone?: string }) => {
    const res = await api.adminFirstSetup(payload);
    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setUser(res.data.user);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'অ্যাকাউন্ট তৈরি ব্যর্থ হয়েছে' };
  };

  const register = async (payload: any) => {
    const res = await api.register(payload);
    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setUser(res.data.user);
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে' };
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {}
    removeStoredToken();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';
  const isDonor = user?.role === 'donor' || !!user?.blood_group;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        adminLogin,
        adminFirstSetup,
        register,
        logout,
        refreshUser,
        isAdmin,
        isSuperAdmin,
        isDonor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
