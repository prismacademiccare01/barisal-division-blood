import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import { PWAInstallButton } from './PWAInstallButton.js';
import { api } from '../../services/api.js';
import { NotificationItem } from '../../types/index.js';
import { toBengaliDigits } from '../../utils/formatters.js';
import {
  Droplet,
  Bell,
  User,
  PlusCircle,
  X,
  Code2,
  Sparkles,
  Bot,
  FileText,
  Search,
  HeartHandshake,
  Building2,
  BookOpen,
  HelpCircle,
  Menu,
  MessageCircle,
  Cloud,
  Smartphone,
} from 'lucide-react';

interface HeaderNavbarProps {
  onOpenAuth: () => void;
  onOpenCreateRequest: () => void;
  onOpenDeveloperModal?: () => void;
  onOpenAiAssistant?: () => void;
  onOpenFlutterHub?: () => void;
  onOpenRequisitionModal?: () => void;
  onOpenMessenger?: () => void;
  onTriggerAdminPortal?: () => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  onOpenAuth,
  onOpenCreateRequest,
  onOpenDeveloperModal,
  onOpenAiAssistant,
  onOpenFlutterHub,
  onOpenRequisitionModal,
  onOpenMessenger,
  onTriggerAdminPortal,
  onTabChange,
  activeTab,
}) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Hidden 5-tap on বরিশাল রক্ত emoji to open Admin Portal
  const [emojiTapCount, setEmojiTapCount] = useState(0);
  const lastTapTimeRef = React.useRef<number>(0);
  const tapResetTimerRef = React.useRef<any>(null);

  const handleEmojiTap = (e: React.MouseEvent) => {
    const now = Date.now();
    const isConsecutive = now - lastTapTimeRef.current < 2500;
    lastTapTimeRef.current = now;

    const nextCount = isConsecutive ? emojiTapCount + 1 : 1;
    setEmojiTapCount(nextCount);

    if (tapResetTimerRef.current) clearTimeout(tapResetTimerRef.current);
    tapResetTimerRef.current = setTimeout(() => {
      setEmojiTapCount(0);
    }, 2500);

    if (nextCount >= 5) {
      setEmojiTapCount(0);
      if (onTriggerAdminPortal) {
        onTriggerAdminPortal();
      }
    } else if (nextCount === 1) {
      onTabChange('landing');
    }
  };

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const res = await api.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch {}
  };

  useEffect(() => {
    if (user) {
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 20000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsAsRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
  };

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'search', label: 'রক্ত খুঁজুন' },
    { id: 'requests', label: 'জরুরি রক্ত' },
    { id: 'feed', label: 'কমিউনিটি ফিড' },
    { id: 'hospitals', label: 'হাসপাতাল ও ব্লাড ব্যাংক' },
    { id: 'learn', label: 'রক্ত সম্পর্কে জানুন' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand (5-taps on বরিশাল রক্ত emoji opens Admin Portal) */}
        <div
          onClick={handleEmojiTap}
          title="বরিশাল রক্ত"
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0 relative active:scale-95 transition-transform"
        >
          <div className="relative">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-all duration-200 ${
              emojiTapCount > 1 ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-white animate-pulse' : ''
            }`}>
              <Droplet className="w-5 h-5 fill-white" />
            </div>

            {/* Subtle tap count indicator for admin easter-egg */}
            {emojiTapCount > 1 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-bounce">
                {emojiTapCount}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-none">
                বরিশাল<span className="text-red-600 font-black"> Blood</span>
              </span>
              <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
                · barishal-Blood
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              বরিশাল রক্ত সেবা · barishal-Blood
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links (Section 1: Home, রক্ত খুঁজুন, জরুরি রক্ত, হাসপাতাল ও ব্লাড ব্যাংক, রক্ত সম্পর্কে জানুন, FAQ) */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`transition-colors py-1 cursor-pointer ${
                activeTab === item.id
                  ? 'text-red-600 border-b-2 border-red-600 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Flutter Mobile App Pill */}
          {onOpenFlutterHub && (
            <button
              onClick={onOpenFlutterHub}
              className="px-2.5 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Flutter মোবাইল অ্যাপ ও লাইভ সিমুলেটর (Android/iOS)"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
              <span className="hidden sm:inline">Flutter অ্যাপ</span>
            </button>
          )}

          {/* AI Assistant Pill */}
          {onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="px-2.5 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="রক্ত সহায়ক এআই (২৪/৭ মেডিকেল পরামর্শ)"
            >
              <Bot className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span className="hidden sm:inline">রক্ত সহায়ক AI</span>
            </button>
          )}

          {/* Quick Create Request Button */}
          <button
            onClick={onOpenCreateRequest}
            className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>আবেদন</span>
          </button>

          {/* Notifications Button */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition relative cursor-pointer"
                title="বিজ্ঞপ্তি"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900">বিজ্ঞপ্তি</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-red-600 hover:underline font-medium"
                      >
                        সব পড়া হয়েছে চিহ্নিত করুন
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        কোনো নতুন বিজ্ঞপ্তি নেই
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl text-xs transition ${
                            n.is_read === 0
                              ? 'bg-red-50/70 border border-red-100 font-medium'
                              : 'bg-slate-50 text-slate-600'
                          }`}
                        >
                          <p className="text-slate-800 line-clamp-2">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.created_at).toLocaleTimeString('bn-BD', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Premium Messenger Button */}
          {user && onOpenMessenger && (
            <button
              onClick={onOpenMessenger}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition relative cursor-pointer"
              title="রক্তসেবা মেসেঞ্জার ও জরুরি চ্যাট"
            >
              <MessageCircle className="w-4 h-4 text-slate-700" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                ১
              </span>
            </button>
          )}

          {/* User Account / Login Button */}
          {user ? (
            <button
              onClick={() => onTabChange('portal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                activeTab === 'portal'
                  ? 'bg-red-600 text-white border-red-600 shadow-xs'
                  : 'bg-white text-slate-800 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              <span className="sm:hidden">পোর্টাল</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs active:scale-95"
            >
              <User className="w-3.5 h-3.5" />
              <span>লগইন / নিবন্ধন</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Section 1: No admin link!) */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setShowMobileMenu(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                activeTab === item.id
                  ? 'bg-red-50 text-red-600'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{item.label}</span>
              {activeTab === item.id && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              )}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => {
                onTabChange('portal');
                setShowMobileMenu(false);
              }}
              className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold text-center"
            >
              {user ? 'আমার ইউজার পোর্টাল' : 'রক্তদাতা লগইন / নিবন্ধন'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
