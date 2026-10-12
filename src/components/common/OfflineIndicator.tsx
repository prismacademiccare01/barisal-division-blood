import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus.js';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-xs font-medium text-white shadow-xl animate-bounce">
      <WifiOff className="w-3.5 h-3.5" />
      <span>অফলাইন মোড — ক্যাশ করা তথ্য দেখানো হচ্ছে</span>
    </div>
  );
};
