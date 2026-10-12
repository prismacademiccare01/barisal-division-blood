import React, { useState, useEffect } from 'react';
import { ShortStory } from '../../types/index.js';
import { X, ChevronLeft, ChevronRight, Heart, Droplet, Sparkles, MapPin, ShieldCheck, Clock } from 'lucide-react';

interface BloodStoriesViewerProps {
  stories: ShortStory[];
  initialStoryIndex: number;
  onClose: () => void;
  onReact?: (storyId: string) => void;
}

export const BloodStoriesViewer: React.FC<BloodStoriesViewerProps> = ({
  stories,
  initialStoryIndex,
  onClose,
  onReact,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.max(0, Math.min(initialStoryIndex, Math.max(0, stories.length - 1)))
  );
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reacted, setReacted] = useState(false);

  // Sync with initialStoryIndex if it changes
  useEffect(() => {
    if (stories.length > 0) {
      setCurrentIndex(Math.max(0, Math.min(initialStoryIndex, stories.length - 1)));
      setProgress(0);
      setReacted(false);
    }
  }, [initialStoryIndex, stories.length]);

  // Reset progress when index changes
  useEffect(() => {
    setProgress(0);
    setReacted(false);
  }, [currentIndex]);

  // Progress timer: completely pure updater without nested setState
  useEffect(() => {
    if (isPaused || stories.length === 0) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 2; // 5 seconds total
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, stories.length]);

  // Effect to advance story or close when progress reaches 100
  useEffect(() => {
    if (progress >= 100) {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onClose();
      }
    }
  }, [progress, currentIndex, stories.length, onClose]);

  if (!stories || stories.length === 0) {
    return null;
  }

  const currentStory = stories[currentIndex] || stories[0];
  if (!currentStory) {
    return null;
  }

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((c) => c + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
    }
  };

  const storyTypeBadge = {
    donation: { label: 'রক্তদান অভিজ্ঞতা', color: 'bg-red-600' },
    emergency: { label: 'জরুরি রেসপন্স', color: 'bg-rose-700' },
    awareness: { label: 'সচেতনতা ক্যাম্পেইন', color: 'bg-emerald-600' },
    achievement: { label: 'মাইলফলক অর্জন', color: 'bg-amber-600' },
    camp: { label: 'ব্লাড ব্যাংক আপডেট', color: 'bg-blue-600' },
  }[currentStory?.story_type || 'donation'];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none">
      {/* Background click to close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition z-50 cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Story Container (Mobile frame aspect ratio) */}
      <div
        className="relative w-full max-w-md h-[90vh] sm:h-[85vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Background Image */}
        <div className="absolute inset-0">
          <img
            src={currentStory.media_url}
            alt={currentStory.caption}
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />
        </div>

        {/* Progress Bars */}
        <div className="relative z-10 px-3 pt-3 flex items-center gap-1.5">
          {stories.map((st, i) => (
            <div key={st.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                style={{
                  width:
                    i < currentIndex
                      ? '100%'
                      : i === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="relative z-10 px-4 pt-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentStory.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentStory.user_name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500"
              />
              {currentStory.blood_group && (
                <span className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[9px] font-black px-1 rounded-full">
                  {currentStory.blood_group}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white">
                  {currentStory.user_name}
                </span>
                <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${storyTypeBadge.color}`}>
                  {storyTypeBadge.label}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-white/70">
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-red-400" />
                  {currentStory.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  ২৪ ঘণ্টা স্টোরি
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Story Navigation Tap Areas */}
        <div className="absolute inset-0 z-0 flex">
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={handlePrev}
            title="আগের স্টোরি"
          />
          <div
            className="w-2/3 h-full cursor-pointer"
            onClick={handleNext}
            title="পরের স্টোরি"
          />
        </div>

        {/* Story Footer & Caption */}
        <div className="relative z-10 p-5 text-white space-y-3">
          <div className="bg-black/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <p className="text-sm font-medium leading-relaxed drop-shadow-md">
              {currentStory.caption}
            </p>
          </div>

          {/* Quick Reaction Bar */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex-1 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 text-xs text-white/80">
              উত্তর বা সাধুবাদ পাঠান...
            </div>

            <button
              onClick={() => {
                setReacted(true);
                if (onReact) onReact(currentStory.id);
              }}
              className={`p-2.5 rounded-full backdrop-blur-md border transition cursor-pointer ${
                reacted
                  ? 'bg-red-600 text-white border-red-500 scale-110'
                  : 'bg-white/20 text-white hover:bg-white/30 border-white/20'
              }`}
              title="লাইফসেভার সাপোর্ট"
            >
              <Droplet className="w-5 h-5 fill-current text-white animate-bounce" />
            </button>
            <button
              onClick={() => {
                setReacted(true);
                if (onReact) onReact(currentStory.id);
              }}
              className={`p-2.5 rounded-full backdrop-blur-md border transition cursor-pointer ${
                reacted
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-white/20 text-white hover:bg-white/30 border-white/20'
              }`}
              title="শ্রদ্ধা"
            >
              <Heart className="w-5 h-5 fill-current text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
