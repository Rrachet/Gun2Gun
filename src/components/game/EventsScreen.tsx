import React from 'react';
import { LiveOpsEvent, PlayerProfile } from '../../types';
import { Flame, Trophy, ShieldAlert, Zap, ChevronRight, Award, CheckCircle2 } from 'lucide-react';

interface EventsScreenProps {
  event: LiveOpsEvent;
  profile: PlayerProfile;
  onPlayEventStage: (stage: any) => void;
  onClaimEventQuest: (questId: string) => void;
}

export const EventsScreen: React.FC<EventsScreenProps> = ({
  event,
  profile,
  onPlayEventStage,
  onClaimEventQuest,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-16 text-slate-100">
      {/* Event Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/50 shadow-xl">
        <img src={event.bannerImage} alt={event.title} className="w-full h-36 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-3 flex flex-col justify-end">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="bg-cyan-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3" />
              Live Event
            </span>
            <span className="text-[10px] text-cyan-300 font-mono">
              Ends in: 12 days 14 hours
            </span>
          </div>

          <h2 className="text-lg font-black text-white">{event.title}</h2>
          <p className="text-xs text-slate-300 line-clamp-1">{event.description}</p>
        </div>
      </div>

      {/* Multiplier Perks */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 flex items-center justify-around text-xs font-mono text-cyan-300">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>{event.goldMultiplier}x Gold Drops</span>
        </div>
        <div className="w-px h-4 bg-slate-800" />
        <div className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-cyan-400" />
          <span>{event.xpMultiplier}x Commander XP</span>
        </div>
      </div>

      {/* Event Stages Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          Event Campaign Stages
        </h3>

        <div className="space-y-2">
          {event.stages.map((stage) => (
            <div
              key={stage.id}
              className={`bg-slate-900 border ${
                stage.isCleared ? 'border-emerald-500/40' : 'border-slate-800'
              } rounded-2xl p-3 flex items-center justify-between shadow`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl font-black text-sm flex items-center justify-center ${
                    stage.isCleared
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {stage.isCleared ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : stage.stageNumber}
                </div>

                <div>
                  <div className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                    <span>{stage.title}</span>
                    {stage.rewards.firstClearGachaTicket && !stage.isCleared && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 rounded border border-amber-500/40">
                        1x Ticket Reward
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Boss: <span className="text-rose-400 font-semibold">{stage.bossName}</span> | Rec: {stage.recommendedPower}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onPlayEventStage(stage)}
                className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow transition-all active:scale-95"
              >
                <span>Battle</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Event Missions */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          Event Challenge Missions
        </h3>

        <div className="space-y-2">
          {event.eventMissions.map((q) => {
            const isReady = q.currentProgress >= q.targetProgress && !q.isClaimed;
            return (
              <div
                key={q.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between"
              >
                <div className="space-y-1 max-w-[220px]">
                  <div className="font-bold text-xs text-slate-200">{q.title}</div>
                  <div className="text-[11px] text-slate-400 leading-tight">{q.description}</div>
                  <div className="w-36 bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full"
                      style={{
                        width: `${Math.min(100, (q.currentProgress / q.targetProgress) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  disabled={!isReady || q.isClaimed}
                  onClick={() => onClaimEventQuest(q.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                    q.isClaimed
                      ? 'bg-slate-800/50 text-slate-500 border-slate-800'
                      : isReady
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-400 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {q.isClaimed ? 'Claimed' : isReady ? 'CLAIM' : `${q.currentProgress}/${q.targetProgress}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
