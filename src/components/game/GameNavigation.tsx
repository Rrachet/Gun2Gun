import React from 'react';
import { Home, Swords, Flame, ScrollText, Medal, ShoppingBag, Users } from 'lucide-react';

export type GameTab = 'home' | 'battle' | 'events' | 'quests' | 'pass' | 'shop' | 'squad';

interface GameNavigationProps {
  activeTab: GameTab;
  onSelectTab: (tab: GameTab) => void;
  unclaimedQuestsCount: number;
}

export const GameNavigation: React.FC<GameNavigationProps> = ({
  activeTab,
  onSelectTab,
  unclaimedQuestsCount,
}) => {
  const tabs: Array<{ id: GameTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }> = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'battle', label: 'Battle', icon: Swords },
    { id: 'events', label: 'LiveOps', icon: Flame },
    { id: 'quests', label: 'Missions', icon: ScrollText, badge: unclaimedQuestsCount },
    { id: 'pass', label: 'Pass', icon: Medal },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'squad', label: 'Squad', icon: Users },
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur border-t border-slate-800 px-1 py-1 flex items-center justify-around z-40">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelectTab(t.id)}
            className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
              isActive
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 shadow-lg shadow-cyan-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'scale-110 text-cyan-400' : ''}`} />
            <span className="text-[10px] font-medium mt-0.5 tracking-tight">{t.label}</span>

            {/* Badge Indicator */}
            {t.badge && t.badge > 0 ? (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse border border-slate-900">
                {t.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
