import React, { useState } from 'react';
import {
  PlayerProfile,
  LiveOpsEvent,
  Quest,
  EconomyConfig,
  ActionTelemetry,
  TelemetryLog,
} from '../../types';
import { LiveOpsStudio } from './LiveOpsStudio';
import { QuestDesigner } from './QuestDesigner';
import { EconomySandbox } from './EconomySandbox';
import { MotivationAnalytics } from './MotivationAnalytics';
import { AiGddGenerator } from './AiGddGenerator';
import { Flame, ScrollText, Calculator, Activity, Bot, Award, Sparkles } from 'lucide-react';

interface DesignerDashboardProps {
  activeEvent: LiveOpsEvent;
  economy: EconomyConfig;
  telemetry: ActionTelemetry;
  logs: TelemetryLog[];
  onUpdateEvent: (event: LiveOpsEvent) => void;
  onAddQuest: (quest: Quest) => void;
  onUpdateEconomy: (economy: EconomyConfig) => void;
}

export const DesignerDashboard: React.FC<DesignerDashboardProps> = ({
  activeEvent,
  economy,
  telemetry,
  logs,
  onUpdateEvent,
  onAddQuest,
  onUpdateEconomy,
}) => {
  const [activeTab, setActiveTab] = useState<
    'liveops' | 'quests' | 'economy' | 'motivation' | 'ai'
  >('motivation');

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 text-slate-100">
      {/* Top EA Portfolio Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xs px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
              EA Game Designer Candidate Workbench
            </span>
            <span className="text-xs font-mono text-cyan-400">F2P Mobile LiveOps Suite</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-wide">
            Mobile Free-To-Play Live Service & Content Design Portfolio
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            A production-grade workbench proving proficiency in Mobile F2P core loops, event progression design, quest balancing, Bartle player motivation telemetry, and AI-driven LiveOps design documents.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs font-mono">
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-slate-300 font-bold">Target EA Competency:</div>
            <div className="text-cyan-400 font-extrabold text-[11px]">LiveOps, Quests & Motivation</div>
          </div>
        </div>
      </div>

      {/* Studio Workbench Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('motivation')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'motivation'
              ? 'bg-cyan-500 text-slate-950 font-black shadow'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Player Motivation & Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('liveops')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'liveops'
              ? 'bg-cyan-500 text-slate-950 font-black shadow'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>LiveOps Event Publisher</span>
        </button>

        <button
          onClick={() => setActiveTab('quests')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'quests'
              ? 'bg-cyan-500 text-slate-950 font-black shadow'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <ScrollText className="w-4 h-4" />
          <span>Quest & Challenge Designer</span>
        </button>

        <button
          onClick={() => setActiveTab('economy')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'economy'
              ? 'bg-cyan-500 text-slate-950 font-black shadow'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Economy & Gacha Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === 'ai'
              ? 'bg-cyan-500 text-slate-950 font-black shadow'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>EA AI Copilot (Gemini)</span>
        </button>
      </div>

      {/* Selected Studio View */}
      <div>
        {activeTab === 'motivation' && (
          <MotivationAnalytics telemetry={telemetry} logs={logs} />
        )}

        {activeTab === 'liveops' && (
          <LiveOpsStudio activeEvent={activeEvent} onUpdateEvent={onUpdateEvent} />
        )}

        {activeTab === 'quests' && <QuestDesigner onAddQuest={onAddQuest} />}

        {activeTab === 'economy' && (
          <EconomySandbox economy={economy} onUpdateEconomy={onUpdateEconomy} />
        )}

        {activeTab === 'ai' && (
          <AiGddGenerator
            currentContext={{
              activeEventTitle: activeEvent.title,
              telemetryActions: telemetry,
              economyConfig: economy,
            }}
          />
        )}
      </div>
    </div>
  );
};
