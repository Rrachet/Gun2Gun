import React, { useState } from 'react';
import { Quest } from '../../types';
import { ScrollText, CheckCircle2, Gift, Sparkles, Trophy, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuestsScreenProps {
  quests: Quest[];
  onClaimQuest: (questId: string) => void;
  onClaimAllQuests: () => void;
}

export const QuestsScreen: React.FC<QuestsScreenProps> = ({
  quests,
  onClaimQuest,
  onClaimAllQuests,
}) => {
  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'event'>('all');

  const filteredQuests = quests.filter(
    (q) => filter === 'all' || q.category === filter
  );

  const unclaimedCount = quests.filter(
    (q) => q.currentProgress >= q.targetProgress && !q.isClaimed
  ).length;

  const handleClaimSingle = (id: string) => {
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
    onClaimQuest(id);
  };

  const handleClaimAll = () => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.7 } });
    onClaimAllQuests();
  };

  const getMotivationBadge = (type: string) => {
    switch (type) {
      case 'Achiever':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Competitor':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Explorer':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Socializer':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-16 text-slate-100">
      {/* Header & Claim All Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-sm text-slate-100 flex items-center gap-1.5">
            <ScrollText className="w-4 h-4 text-cyan-400" />
            Tactical Mission Objectives
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {unclaimedCount > 0 ? `${unclaimedCount} missions ready to claim!` : 'Complete daily objectives to gain Pass XP'}
          </p>
        </div>

        {unclaimedCount > 0 && (
          <button
            onClick={handleClaimAll}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1 animate-bounce"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>CLAIM ALL</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
        {(['all', 'daily', 'weekly', 'event'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-1 py-1.5 rounded-lg capitalize transition-colors ${
              filter === cat
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quests List */}
      <div className="space-y-2">
        {filteredQuests.map((q) => {
          const isReady = q.currentProgress >= q.targetProgress && !q.isClaimed;
          return (
            <div
              key={q.id}
              className={`bg-slate-900 border ${
                isReady
                  ? 'border-amber-500/50 shadow-md shadow-amber-950/30'
                  : q.isClaimed
                  ? 'border-slate-800/60 opacity-60'
                  : 'border-slate-800'
              } rounded-2xl p-3 flex flex-col gap-2 transition-all`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-100">{q.title}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${getMotivationBadge(
                        q.motivationType
                      )}`}
                    >
                      [{q.motivationType}]
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{q.description}</p>
                </div>

                <button
                  disabled={!isReady || q.isClaimed}
                  onClick={() => handleClaimSingle(q.id)}
                  className={`text-xs font-black px-3.5 py-1.5 rounded-xl border transition-all ${
                    q.isClaimed
                      ? 'bg-slate-800/40 text-slate-500 border-slate-800'
                      : isReady
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {q.isClaimed ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Done
                    </span>
                  ) : isReady ? (
                    'CLAIM'
                  ) : (
                    `${q.currentProgress}/${q.targetProgress}`
                  )}
                </button>
              </div>

              {/* Progress & Rewards Row */}
              <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-800/80">
                <div className="w-32 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (q.currentProgress / q.targetProgress) * 100)}%`,
                    }}
                  />
                </div>

                <div className="flex items-center gap-2 text-slate-300 font-sans">
                  {q.rewards.gold && <span className="text-amber-300 font-bold">+{q.rewards.gold} Gold</span>}
                  {q.rewards.gems && <span className="text-cyan-300 font-bold">+{q.rewards.gems} Gems</span>}
                  {q.rewards.passXp && <span className="text-emerald-300 font-bold">+{q.rewards.passXp} XP</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
