import React from 'react';
import { PlayerProfile, LiveOpsEvent, Hero } from '../../types';
import { Flame, Swords, Gift, Sparkles, ChevronRight, Zap, Target } from 'lucide-react';

interface HomeScreenProps {
  profile: PlayerProfile;
  activeEvent: LiveOpsEvent;
  featuredHero?: Hero;
  onNavigateTab: (tab: any) => void;
  onClaimDailyStreak: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  activeEvent,
  featuredHero,
  onNavigateTab,
  onClaimDailyStreak,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-16 text-slate-100">
      {/* Active LiveOps Event Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 shadow-xl shadow-cyan-950/30 group">
        <img
          src={activeEvent.bannerImage}
          alt={activeEvent.title}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="bg-cyan-500/90 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
              <Flame className="w-3 h-3 text-slate-950" />
              LiveOps Event
            </span>
            <span className="bg-slate-900/80 backdrop-blur text-cyan-300 font-mono text-[10px] px-2 py-0.5 rounded border border-cyan-800">
              {activeEvent.goldMultiplier}x Gold | {activeEvent.xpMultiplier}x XP
            </span>
          </div>

          <div>
            <h2 className="text-lg font-black text-white tracking-wide leading-tight drop-shadow">
              {activeEvent.title}
            </h2>
            <p className="text-xs text-cyan-200 font-medium line-clamp-1 mt-0.5">
              {activeEvent.subtitle}
            </p>

            <div className="flex items-center justify-between mt-2.5">
              <div className="text-[11px] text-slate-300">
                Reward: <span className="text-amber-400 font-bold">Titan Shards + Gems</span>
              </div>
              <button
                onClick={() => onNavigateTab('events')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-lg shadow-cyan-500/30 transition-all active:scale-95"
              >
                <span>Enter Event</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Battle Play Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-950/50">
            <Swords className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-100">Tactical Stage 1-2</div>
            <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Cost: 10 Stamina Energy</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('battle')}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1 transition-all active:scale-95"
        >
          <span>BATTLE</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Daily Login Reward & Pass Progress Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Daily Streak Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" />
              Daily Bonus
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Day {profile.dailyLoginStreak}/7
            </span>
          </div>
          <div className="my-2">
            <div className="text-xs font-bold text-slate-200">
              Claim +100 Gems & 5,000 Gold
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Refreshes every 24h</div>
          </div>
          <button
            onClick={onClaimDailyStreak}
            className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs py-1.5 rounded-lg border border-amber-500/30 transition-colors flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Claim Streak</span>
          </button>
        </div>

        {/* Season Battle Pass Progress */}
        <div
          onClick={() => onNavigateTab('pass')}
          className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 cursor-pointer rounded-2xl p-3 flex flex-col justify-between transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              Season 4 Pass
            </span>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
              Tier 3
            </span>
          </div>

          <div className="my-2">
            <div className="text-xs text-slate-300 font-medium">Next Reward:</div>
            <div className="text-xs font-bold text-amber-300 truncate">50x Cyber Gems</div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-cyan-400 h-full w-[65%]" />
            </div>
          </div>

          <span className="text-[10px] text-cyan-400 font-bold flex items-center gap-0.5 justify-end">
            <span>View Pass Tiers</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* Featured Hero Showcase */}
      {featuredHero && (
        <div
          onClick={() => onNavigateTab('squad')}
          className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/60 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:border-cyan-500/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-cyan-500/40 flex items-center justify-center text-2xl shadow">
              {featuredHero.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-slate-100">{featuredHero.name}</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/40">
                  {featuredHero.rarity}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Level {featuredHero.level} | Power {featuredHero.power.toLocaleString()}
              </div>
            </div>
          </div>

          <button className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2.5 py-1.5 rounded-lg border border-cyan-800">
            Upgrade
          </button>
        </div>
      )}
    </div>
  );
};
