import React, { useState } from 'react';
import { Hero, PlayerProfile } from '../../types';
import { Users, Shield, Zap, Sparkles, ChevronUp, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroRosterScreenProps {
  heroes: Hero[];
  profile: PlayerProfile;
  onUpgradeHero: (heroId: string) => void;
}

export const HeroRosterScreen: React.FC<HeroRosterScreenProps> = ({
  heroes,
  profile,
  onUpgradeHero,
}) => {
  const [selectedHero, setSelectedHero] = useState<Hero>(heroes[0]);

  const handleUpgrade = (id: string) => {
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    onUpgradeHero(id);
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-16 text-slate-100">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
        <h2 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-cyan-400" />
          Squad Roster & Tactics
        </h2>
        <span className="text-xs text-slate-400 font-mono">
          Unlocked: {heroes.filter((h) => h.isUnlocked).length}/{heroes.length}
        </span>
      </div>

      {/* Selected Hero Inspector View */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/40 rounded-2xl p-3.5 space-y-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 border-2 border-cyan-500/60 flex items-center justify-center text-4xl shadow-lg">
            {selectedHero.avatar}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-white">{selectedHero.name}</h3>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                {selectedHero.rarity}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{selectedHero.title}</div>
            <div className="text-xs font-mono text-cyan-300 mt-1 font-bold">
              Level {selectedHero.level} / {selectedHero.maxLevel} | Power: {selectedHero.power.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800 text-center font-mono text-xs">
          <div>
            <div className="text-[9px] text-slate-400">HP</div>
            <div className="font-bold text-emerald-400">{selectedHero.hp.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400">ATK</div>
            <div className="font-bold text-rose-400">{selectedHero.atk.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400">DEF</div>
            <div className="font-bold text-amber-400">{selectedHero.def.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-400">SPD</div>
            <div className="font-bold text-cyan-400">{selectedHero.spd}</div>
          </div>
        </div>

        {/* Upgrade Hero Action Button */}
        {selectedHero.isUnlocked ? (
          <button
            onClick={() => handleUpgrade(selectedHero.id)}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <ChevronUp className="w-4 h-4 text-slate-950" />
            <span>UPGRADE LEVEL (3,000 Gold)</span>
          </button>
        ) : (
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Unlock via Gacha Supply Drops or Event Shards ({selectedHero.shardsCurrent}/{selectedHero.shardsNeeded})</span>
          </div>
        )}
      </div>

      {/* Hero Grid Selection */}
      <div className="grid grid-cols-2 gap-2">
        {heroes.map((h) => (
          <div
            key={h.id}
            onClick={() => setSelectedHero(h)}
            className={`bg-slate-900 border ${
              selectedHero.id === h.id ? 'border-cyan-400 shadow-md shadow-cyan-950' : 'border-slate-800'
            } rounded-2xl p-2.5 flex items-center gap-2.5 cursor-pointer transition-all hover:border-slate-700`}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl shrink-0">
              {h.avatar}
            </div>

            <div className="min-w-0">
              <div className="font-bold text-xs text-slate-200 truncate">{h.name}</div>
              <div className="text-[10px] text-slate-400">
                {h.isUnlocked ? `Lvl ${h.level}` : 'Locked'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
