import React, { useState } from 'react';
import { EconomyConfig } from '../../types';
import { Calculator, Zap, Gem, Coins, Play, Sparkles } from 'lucide-react';

interface EconomySandboxProps {
  economy: EconomyConfig;
  onUpdateEconomy: (newEconomy: EconomyConfig) => void;
}

export const EconomySandbox: React.FC<EconomySandboxProps> = ({
  economy,
  onUpdateEconomy,
}) => {
  const [legRate, setLegRate] = useState(economy.gachaRates.legendary);
  const [epicRate, setEpicRate] = useState(economy.gachaRates.epic);
  const [regenMinutes, setRegenMinutes] = useState(economy.staminaRegenMinutes);

  // Monte Carlo Simulation state
  const [simResults, setSimResults] = useState<{
    totalPulls: number;
    legendariesCount: number;
    epicsCount: number;
    raresCount: number;
    gemsSpent: number;
    averagePullCostFor5Star: number;
  } | null>(null);

  const handleApplyConfig = () => {
    const rareRate = Math.max(0, 100 - legRate - epicRate);
    const updated: EconomyConfig = {
      ...economy,
      staminaRegenMinutes: Number(regenMinutes),
      gachaRates: {
        legendary: Number(legRate),
        epic: Number(epicRate),
        rare: Math.round(rareRate * 10) / 10,
      },
    };
    onUpdateEconomy(updated);
  };

  const handleRunMonteCarlo = () => {
    const PULLS = 1000;
    let legs = 0;
    let epics = 0;
    let rares = 0;
    let pityTracker = 0;

    for (let i = 0; i < PULLS; i++) {
      pityTracker++;
      const rand = Math.random() * 100;

      if (rand < legRate) {
        legs++;
        pityTracker = 0;
      } else if (rand < legRate + epicRate || pityTracker >= 10) {
        epics++;
        pityTracker = 0;
      } else {
        rares++;
      }
    }

    const gemsSpent = PULLS * 135; // average cost with 10x discount
    const averageCost = legs > 0 ? Math.round(gemsSpent / legs) : gemsSpent;

    setSimResults({
      totalPulls: PULLS,
      legendariesCount: legs,
      epicsCount: epics,
      raresCount: rares,
      gemsSpent,
      averagePullCostFor5Star: averageCost,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Calculator className="w-5 h-5 text-cyan-400" />
        <div>
          <h3 className="font-extrabold text-base text-white">Economy & Gacha Balancing Sandbox</h3>
          <p className="text-xs text-slate-400">
            Simulate currency faucets, energy regeneration rates, and test 1,000 Gacha pulls to evaluate monetization fairness.
          </p>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Legendary Rate Slider */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-amber-300">5★ Legendary Drop Rate</span>
            <span className="font-mono text-amber-400">{legRate}%</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10.0"
            step="0.5"
            value={legRate}
            onChange={(e) => setLegRate(parseFloat(e.target.value))}
            className="w-full accent-amber-400"
          />
          <div className="text-[10px] text-slate-400">Industry Standard: 2.0% - 3.0%</div>
        </div>

        {/* Epic Rate Slider */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-cyan-300">4★ Epic Drop Rate</span>
            <span className="font-mono text-cyan-400">{epicRate}%</span>
          </div>
          <input
            type="range"
            min="5.0"
            max="30.0"
            step="1.0"
            value={epicRate}
            onChange={(e) => setEpicRate(parseFloat(e.target.value))}
            className="w-full accent-cyan-400"
          />
          <div className="text-[10px] text-slate-400">Rare Rate calculated: {(100 - legRate - epicRate).toFixed(1)}%</div>
        </div>

        {/* Stamina Regen Time */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-300">Stamina Regen Pace</span>
            <span className="font-mono text-emerald-400">1 Energy / {regenMinutes}m</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={regenMinutes}
            onChange={(e) => setRegenMinutes(parseInt(e.target.value))}
            className="w-full accent-emerald-400"
          />
          <div className="text-[10px] text-slate-400">Full refill (100 energy): {regenMinutes * 100} mins</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleApplyConfig}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow"
        >
          Apply Economy Tuning Live
        </button>

        <button
          onClick={handleRunMonteCarlo}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow flex items-center gap-1.5"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>RUN 1,000 PULL MONTE-CARLO SIMULATION</span>
        </button>
      </div>

      {/* Monte Carlo Results Display */}
      {simResults && (
        <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/40 space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-bold border-b border-slate-800 pb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Monte-Carlo 1,000 Pull Gacha Analytics Output</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-300">
            <div>
              <div className="text-[10px] text-slate-400">5-Star Legendaries Acquired</div>
              <div className="text-base font-extrabold text-amber-400">{simResults.legendariesCount}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">4-Star Epics Acquired</div>
              <div className="text-base font-extrabold text-cyan-400">{simResults.epicsCount}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Total Virtual Gems Cost</div>
              <div className="text-base font-extrabold text-emerald-400">{simResults.gemsSpent.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">Avg Gems per 5★ Legendary</div>
              <div className="text-base font-extrabold text-rose-400">{simResults.averagePullCostFor5Star.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
