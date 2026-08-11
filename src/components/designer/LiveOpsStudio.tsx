import React, { useState } from 'react';
import { LiveOpsEvent } from '../../types';
import { Flame, Calendar, Zap, Sparkles, Send, Check } from 'lucide-react';

interface LiveOpsStudioProps {
  activeEvent: LiveOpsEvent;
  onUpdateEvent: (updatedEvent: LiveOpsEvent) => void;
}

export const LiveOpsStudio: React.FC<LiveOpsStudioProps> = ({
  activeEvent,
  onUpdateEvent,
}) => {
  const [eventTitle, setEventTitle] = useState(activeEvent.title);
  const [subtitle, setSubtitle] = useState(activeEvent.subtitle);
  const [goldMult, setGoldMult] = useState(activeEvent.goldMultiplier);
  const [xpMult, setXpMult] = useState(activeEvent.xpMultiplier);
  const [status, setStatus] = useState(activeEvent.status);
  const [isSaved, setIsSaved] = useState(false);

  const handlePublishLive = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: LiveOpsEvent = {
      ...activeEvent,
      title: eventTitle,
      subtitle,
      goldMultiplier: Number(goldMult),
      xpMultiplier: Number(xpMult),
      status,
    };
    onUpdateEvent(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="font-extrabold text-base text-white">LiveOps Event Scheduler & Publisher</h3>
            <p className="text-xs text-slate-400">
              Configure active live service event multipliers and publish updates directly to players in real-time.
            </p>
          </div>
        </div>

        <span className="bg-emerald-500/20 text-emerald-300 font-mono text-xs px-2.5 py-1 rounded-full border border-emerald-500/40">
          ● Live Service Sync Active
        </span>
      </div>

      <form onSubmit={handlePublishLive} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Event Main Title</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Event Subtitle / Tagline</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Multipliers & Status */}
        <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Gold Multiplier</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={goldMult}
                onChange={(e) => setGoldMult(parseFloat(e.target.value))}
                className="w-full accent-amber-400"
              />
              <span className="font-mono text-xs font-bold text-amber-300 min-w-[36px]">{goldMult}x</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">XP Multiplier</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={xpMult}
                onChange={(e) => setXpMult(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="font-mono text-xs font-bold text-cyan-300 min-w-[36px]">{xpMult}x</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Event State</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
            >
              <option value="active">Active (Live Now)</option>
              <option value="scheduled">Scheduled</option>
              <option value="ended">Ended</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all"
        >
          {isSaved ? <Check className="w-4 h-4 text-slate-950" /> : <Send className="w-4 h-4 text-slate-950" />}
          <span>{isSaved ? 'PUBLISHED TO LIVE GAME!' : 'PUBLISH LIVEOPS UPDATE'}</span>
        </button>
      </form>
    </div>
  );
};
