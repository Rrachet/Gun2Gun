import React from 'react';
import { BattlePass, PlayerProfile } from '../../types';
import { Medal, Sparkles, Lock, CheckCircle2, Crown, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BattlePassScreenProps {
  pass: BattlePass;
  profile: PlayerProfile;
  onClaimTier: (tierNumber: number, isPremium: boolean) => void;
  onUnlockPremiumPass: () => void;
}

export const BattlePassScreen: React.FC<BattlePassScreenProps> = ({
  pass,
  profile,
  onClaimTier,
  onUnlockPremiumPass,
}) => {
  const currentXpInTier = pass.currentXp % pass.xpPerLevel;

  const handleClaim = (tier: number, isPremium: boolean) => {
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    onClaimTier(tier, isPremium);
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-16 text-slate-100">
      {/* Season Pass Hero Header */}
      <div className="bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-2xl p-3.5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <Medal className="w-3.5 h-3.5" />
              Season {pass.seasonNumber}
            </div>
            <h2 className="text-base font-black text-white">{pass.seasonName}</h2>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-cyan-300">
              Tier {pass.currentTier} / {pass.maxTier}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {currentXpInTier}/{pass.xpPerLevel} Pass XP
            </div>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (currentXpInTier / pass.xpPerLevel) * 100)}%` }}
          />
        </div>

        {/* Premium Pass Unlock Banner */}
        {!pass.isPremiumUnlocked && (
          <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 rounded-xl p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-amber-300">Unlock VIP Cyber Pass</div>
                <div className="text-[10px] text-slate-300">Get 20x Premium Rewards + 5★ Shards!</div>
              </div>
            </div>

            <button
              onClick={onUnlockPremiumPass}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow transition-all active:scale-95"
            >
              500 Gems
            </button>
          </div>
        )}
      </div>

      {/* Tiers Scroll Track */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between px-1">
          <span>Pass Rewards Track</span>
          <span className="text-[10px] text-cyan-400">Scroll down for higher tiers</span>
        </div>

        <div className="space-y-2">
          {pass.tiers.map((tier) => {
            const isReached = tier.tier <= pass.currentTier;

            return (
              <div
                key={tier.tier}
                className={`bg-slate-900 border ${
                  isReached ? 'border-cyan-500/40' : 'border-slate-800/80'
                } rounded-2xl p-2.5 flex items-center gap-2`}
              >
                {/* Tier Number Badge */}
                <div
                  className={`w-10 h-10 rounded-xl font-black text-sm flex flex-col items-center justify-center shrink-0 ${
                    isReached
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  <span className="text-[9px] font-medium leading-none">TIER</span>
                  <span className="text-sm leading-tight">{tier.tier}</span>
                </div>

                {/* Free & Premium Rewards Row */}
                <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                  {/* Free Track Box */}
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Free Track</div>
                      <div className="font-bold text-slate-200 text-[11px] truncate mt-0.5">
                        {tier.freeReward.label}
                      </div>
                    </div>

                    <button
                      disabled={!isReached || tier.freeClaimed}
                      onClick={() => handleClaim(tier.tier, false)}
                      className={`mt-1 text-[10px] font-extrabold py-1 rounded-lg border transition-all ${
                        tier.freeClaimed
                          ? 'bg-slate-800/50 text-slate-500 border-slate-800'
                          : isReached
                          ? 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {tier.freeClaimed ? 'Claimed' : isReached ? 'CLAIM' : 'Locked'}
                    </button>
                  </div>

                  {/* Premium Track Box */}
                  <div
                    className={`p-2 rounded-xl border flex flex-col justify-between ${
                      pass.isPremiumUnlocked
                        ? 'bg-amber-950/20 border-amber-500/40'
                        : 'bg-slate-950 border-slate-800 opacity-80'
                    }`}
                  >
                    <div>
                      <div className="text-[9px] font-bold text-amber-400 uppercase flex items-center justify-between">
                        <span>VIP Premium</span>
                        {!pass.isPremiumUnlocked && <Lock className="w-2.5 h-2.5 text-slate-500" />}
                      </div>
                      <div className="font-bold text-amber-200 text-[11px] truncate mt-0.5">
                        {tier.premiumReward.label}
                      </div>
                    </div>

                    <button
                      disabled={!isReached || !pass.isPremiumUnlocked || tier.premiumClaimed}
                      onClick={() => handleClaim(tier.tier, true)}
                      className={`mt-1 text-[10px] font-extrabold py-1 rounded-lg border transition-all ${
                        tier.premiumClaimed
                          ? 'bg-slate-800/50 text-slate-500 border-slate-800'
                          : isReached && pass.isPremiumUnlocked
                          ? 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {tier.premiumClaimed
                        ? 'Claimed'
                        : isReached && pass.isPremiumUnlocked
                        ? 'CLAIM'
                        : 'VIP Lock'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
