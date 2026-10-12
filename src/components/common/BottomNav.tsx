import React from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import {
  Home,
  Search,
  HeartHandshake,
  Building2,
  Sparkles,
  BookOpen,
  Compass,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAuth: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenAuth,
}) => {
  const { user } = useAuth();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg sm:hidden safe-area-bottom">
      <div className="grid grid-cols-6 h-16 max-w-md mx-auto items-center">
        {/* 1. Home */}
        <button
          onClick={() => onTabChange('landing')}
          className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
            activeTab === 'landing'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'landing' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[9px] mt-1">হোম</span>
        </button>

        {/* 2. Find Blood */}
        <button
          onClick={() => onTabChange('search')}
          className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
            activeTab === 'search'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className={`w-5 h-5 ${activeTab === 'search' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[9px] mt-1">খুঁজুন</span>
        </button>

        {/* 3. Emergency Requests */}
        <button
          onClick={() => onTabChange('requests')}
          className={`flex flex-col items-center justify-center py-1 transition relative cursor-pointer ${
            activeTab === 'requests'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <HeartHandshake
            className={`w-5 h-5 ${activeTab === 'requests' ? 'stroke-[2.5]' : ''}`}
          />
          <span className="text-[9px] mt-1">জরুরি</span>
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
        </button>

        {/* 4. Community Feed */}
        <button
          onClick={() => onTabChange('feed')}
          className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
            activeTab === 'feed'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'feed' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[9px] mt-1">ফিড</span>
        </button>

        {/* 5. Hospitals & Stocks */}
        <button
          onClick={() => onTabChange('hospitals')}
          className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
            activeTab === 'hospitals'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2
            className={`w-5 h-5 ${activeTab === 'hospitals' ? 'stroke-[2.5]' : ''}`}
          />
          <span className="text-[9px] mt-1">হাসপাতাল</span>
        </button>

        {/* 6. User Portal */}
        <button
          onClick={() => onTabChange('portal')}
          className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
            activeTab === 'portal'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles
            className={`w-5 h-5 ${
              activeTab === 'portal' ? 'stroke-[2.5] text-amber-500' : 'text-amber-500'
            }`}
          />
          <span className="text-[9px] mt-1">পোর্টাল</span>
        </button>
      </div>
    </div>
  );
};
