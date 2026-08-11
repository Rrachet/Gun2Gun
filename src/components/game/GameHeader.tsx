import React from 'react';
import { PlayerProfile } from '../../types';
import { Zap, Coins, Gem, ShieldAlert, Award, PlusCircle } from 'lucide-react';

interface GameHeaderProps {
  profile: PlayerProfile;
  onOpenStaminaRefill: () => void;
  onOpenShop: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  profile,
  onOpenStaminaRefill,
  onOpenShop,
}) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur border-b border-slate-800 p-2.5 px-3 flex flex-col gap-2 z-40">
      {/* Top Row: Commander Info & Currencies */}
      <div className="flex items-center justify-between gap-2">
        {/* Commander Badge */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-md shadow-cyan-950">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-cyan-400 text-sm">
                L{profile.level}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1 rounded-full border border-slate-900 shadow">
              VIP {profile.vipLevel}
            </span>
          </div>
          <div>
            <div className="font-bold text-xs text-slate-100 truncate max-w-[110px]">
              {profile.name}
            </div>
            <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1 border border-slate-700">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (profile.currentXp / profile.maxXp) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Currencies Pills */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {/* Gold Pill */}
          <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-amber-500/30 text-amber-300">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{profile.gold.toLocaleString()}</span>
          </div>

          {/* Gems Pill */}
          <button
            onClick={onOpenShop}
            className="flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition-colors"
          >
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold">{profile.gems.toLocaleString()}</span>
            <PlusCircle className="w-3 h-3 text-cyan-400 opacity-80 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Second Row: Stamina Energy & Event Tokens */}
      <div className="flex items-center justify-between text-xs font-mono">
        {/* Stamina Energy Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-[210px] bg-slate-950/90 px-2.5 py-1 rounded-lg border border-amber-500/40">
          <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
          <div className="flex-1">
            <div className="flex justify-between text-[10px] text-amber-200 font-sans font-bold">
              <span>Energy</span>
              <span>
                {profile.stamina}/{profile.maxStamina}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-0.5">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (profile.stamina / profile.maxStamina) * 100)}%`,
                }}
              />
            </div>
          </div>
          <button
            onClick={onOpenStaminaRefill}
            className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 transition-colors"
            title="Refill Stamina Energy"
          >
            <PlusCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Event Tokens */}
        <div className="flex items-center gap-1.5 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/40 text-cyan-300">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-bold">{profile.eventTokens} Tokens</span>
        </div>
      </div>
    </div>
  );
};
