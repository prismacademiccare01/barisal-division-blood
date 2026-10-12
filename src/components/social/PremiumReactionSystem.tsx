import React, { useState } from 'react';
import { SocialReactionType } from '../../types/index.js';
import { Heart, Droplet, Sparkles } from 'lucide-react';

interface PremiumReactionSystemProps {
  reactions: {
    support: number;
    lifesaver: number;
    respect: number;
    hero: number;
    congratulations: number;
  };
  currentReaction?: SocialReactionType;
  onSelectReaction: (type: SocialReactionType) => void;
}

const REACTION_CONFIG: Record<
  SocialReactionType,
  { label: string; emoji: string; color: string; bg: string }
> = {
  support: {
    label: 'Support',
    emoji: '❤️',
    color: 'text-rose-600',
    bg: 'bg-rose-50 border-rose-200',
  },
  lifesaver: {
    label: 'Lifesaver',
    emoji: '🩸',
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200',
  },
  respect: {
    label: 'Respect',
    emoji: '🙏',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
  },
  hero: {
    label: 'Hero',
    emoji: '💪',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
  },
  congratulations: {
    label: 'Congrats',
    emoji: '🎉',
    color: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-200',
  },
};

export const PremiumReactionSystem: React.FC<PremiumReactionSystemProps> = ({
  reactions,
  currentReaction,
  onSelectReaction,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const totalReactions =
    (reactions.support || 0) +
    (reactions.lifesaver || 0) +
    (reactions.respect || 0) +
    (reactions.hero || 0) +
    (reactions.congratulations || 0);

  const activeMeta = currentReaction ? REACTION_CONFIG[currentReaction] : null;

  return (
    <div className="relative inline-block">
      {/* Floating Reaction Selector on Hover / Click */}
      {showPicker && (
        <div
          onMouseLeave={() => setShowPicker(false)}
          className="absolute -top-14 left-0 bg-white shadow-2xl border border-slate-200/90 rounded-full px-3 py-1.5 flex items-center gap-2 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          {(Object.keys(REACTION_CONFIG) as SocialReactionType[]).map((type) => {
            const meta = REACTION_CONFIG[type];
            const isSelected = currentReaction === type;
            return (
              <button
                key={type}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectReaction(type);
                  setShowPicker(false);
                }}
                className={`flex flex-col items-center group/btn transition-transform hover:scale-130 active:scale-95 cursor-pointer p-1 rounded-full ${
                  isSelected ? 'bg-red-50 scale-110' : ''
                }`}
                title={meta.label}
              >
                <span className="text-xl leading-none transition-transform group-hover/btn:-translate-y-1">
                  {meta.emoji}
                </span>
                <span className="text-[9px] font-bold text-slate-500 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Reaction Trigger Button */}
      <button
        onClick={() => {
          if (currentReaction) {
            // Already reacted, cycle or trigger picker
            setShowPicker(!showPicker);
          } else {
            // Default to lifesaver reaction
            onSelectReaction('lifesaver');
          }
        }}
        onMouseEnter={() => setShowPicker(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
          activeMeta
            ? `${activeMeta.bg} ${activeMeta.color} shadow-xs font-black`
            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
        }`}
      >
        <span className="text-sm">
          {activeMeta ? activeMeta.emoji : '🩸'}
        </span>
        <span>
          {activeMeta ? activeMeta.label : 'লাইফসেভার'}
        </span>
        {totalReactions > 0 && (
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/5 text-[10px]">
            {totalReactions}
          </span>
        )}
      </button>
    </div>
  );
};
