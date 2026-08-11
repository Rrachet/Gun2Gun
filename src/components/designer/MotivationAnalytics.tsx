import React from 'react';
import { ActionTelemetry, TelemetryLog, MotivationType } from '../../types';
import {
  calculateBartleScores,
  calculateSDTScores,
  getDominantArchetype,
  getPersonalizedInsights,
} from '../../utils/telemetry';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { Target, Activity, Lightbulb, Users, Shield, Zap } from 'lucide-react';

interface MotivationAnalyticsProps {
  telemetry: ActionTelemetry;
  logs: TelemetryLog[];
}

export const MotivationAnalytics: React.FC<MotivationAnalyticsProps> = ({
  telemetry,
  logs,
}) => {
  const bartleScores = calculateBartleScores(telemetry);
  const sdtScores = calculateSDTScores(telemetry);
  const dominantType = getDominantArchetype(bartleScores);
  const insights = getPersonalizedInsights(dominantType);

  const radarData = [
    { archetype: 'Achiever', score: bartleScores.Achiever },
    { archetype: 'Competitor', score: bartleScores.Competitor },
    { archetype: 'Explorer', score: bartleScores.Explorer },
    { archetype: 'Socializer', score: bartleScores.Socializer },
  ];

  const retentionData = [
    { day: 'D0', retention: 100 },
    { day: 'D1', retention: 58 },
    { day: 'D3', retention: 42 },
    { day: 'D7', retention: 34 },
    { day: 'D14', retention: 26 },
    { day: 'D30', retention: 21 },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Activity className="w-5 h-5 text-cyan-400" />
        <div>
          <h3 className="font-extrabold text-base text-white">Player Motivation Telemetry & Bartle Archetype Engine</h3>
          <p className="text-xs text-slate-400">
            Real-time behavioral telemetry mapping live gameplay actions into player psychology profiles and retention curves.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Radar Chart: Bartle Taxonomy */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-cyan-400" />
              Bartle Taxonomy Radar Profile
            </h4>
            <span className="text-xs font-black text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/40">
              Dominant: {dominantType}
            </span>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="archetype" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                <Radar name="Player Motivation" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-1 text-center font-mono text-xs text-slate-300">
            <div className="bg-slate-900 p-1.5 rounded">Achiever: {bartleScores.Achiever}%</div>
            <div className="bg-slate-900 p-1.5 rounded">Competitor: {bartleScores.Competitor}%</div>
            <div className="bg-slate-900 p-1.5 rounded">Explorer: {bartleScores.Explorer}%</div>
            <div className="bg-slate-900 p-1.5 rounded">Socializer: {bartleScores.Socializer}%</div>
          </div>
        </div>

        {/* Self-Determination Theory (SDT) & Retention Curve */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* SDT Gauges */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Self-Determination Theory (SDT) Health
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-mono mb-0.5">
                  <span className="text-cyan-300 font-bold">Autonomy (Choice & Control)</span>
                  <span>{sdtScores.Autonomy}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full" style={{ width: `${sdtScores.Autonomy}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono mb-0.5">
                  <span className="text-emerald-300 font-bold">Competence (Mastery & Progression)</span>
                  <span>{sdtScores.Competence}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: `${sdtScores.Competence}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono mb-0.5">
                  <span className="text-amber-300 font-bold">Relatedness (Community Connection)</span>
                  <span>{sdtScores.Relatedness}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${sdtScores.Relatedness}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Retention Projection Graph */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Projected F2P Retention Curve (D1/D7/D30)
            </h4>

            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={retentionData}>
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                  <Line type="monotone" dataKey="retention" stroke="#38bdf8" strokeWidth={2.5} dot={{ fill: '#38bdf8' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Insights Box */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/40 p-4 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>LiveOps Dynamic Targeting Recommendation</span>
        </div>
        <div className="font-extrabold text-sm text-white">{insights?.title}</div>
        <p className="text-xs text-slate-300 leading-relaxed">{insights?.recommendation}</p>
        <div className="text-xs font-mono text-cyan-300 font-bold pt-1">
          Recommended Offer Injection: <span className="text-amber-300">{insights?.suggestedOffer}</span>
        </div>
      </div>

      {/* Telemetry Action Feed */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
        <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
          Live Telemetry Event Log Stream
        </h4>

        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="bg-slate-900 p-2 rounded border border-slate-800/80 flex justify-between items-center text-[11px]">
              <div>
                <span className="text-cyan-400 font-bold">{log.action}</span>
                <span className="text-slate-400 ml-2">{log.details}</span>
              </div>
              <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
