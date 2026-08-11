import React, { useState } from 'react';
import { Hero, PlayerProfile, Stage } from '../../types';
import { Swords, Zap, Shield, Sparkles, Trophy, Play, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BattleScreenProps {
  heroes: Hero[];
  profile: PlayerProfile;
  stage?: Stage;
  onCompleteBattle: (victory: boolean, staminaUsed: number, rewards: any) => void;
  onOpenStaminaRefill: () => void;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  heroes,
  profile,
  stage = {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Outpost Breach',
    staminaCost: 10,
    recommendedPower: 2500,
    bossName: 'Drone Commander Alpha',
    bossHp: 8000,
    rewards: { gold: 1500, gems: 25, passXp: 100, eventTokens: 60 },
    isCleared: false,
  },
  onCompleteBattle,
  onOpenStaminaRefill,
}) => {
  const squad = heroes.filter((h) => h.isUnlocked).slice(0, 3);
  const totalPower = squad.reduce((sum, h) => sum + h.power, 0);

  const [inCombat, setInCombat] = useState(false);
  const [bossHp, setBossHp] = useState(stage.bossHp);
  const [squadHp, setSquadHp] = useState(
    squad.reduce((sum, h) => sum + h.hp, 0)
  );
  const maxSquadHp = squad.reduce((sum, h) => sum + h.hp, 0);
  const maxBossHp = stage.bossHp;

  const [combatLogs, setCombatLogs] = useState<string[]>([]);
  const [turn, setTurn] = useState(1);
  const [battleFinished, setBattleFinished] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  const handleStartBattle = () => {
    if (profile.stamina < stage.staminaCost) {
      onOpenStaminaRefill();
      return;
    }

    setInCombat(true);
    setBossHp(stage.bossHp);
    setSquadHp(maxSquadHp);
    setTurn(1);
    setBattleFinished(false);
    setCombatLogs([
      `⚔️ Battle Initiated against ${stage.bossName}!`,
      `Squad Total Power: ${totalPower.toLocaleString()}`,
    ]);
  };

  const handleAttack = (skillName?: string, damageMult: number = 1.0) => {
    if (battleFinished) return;

    // Calculate squad damage
    const baseAtk = squad.reduce((sum, h) => sum + h.atk, 0) / 3;
    const rawDamage = Math.round(baseAtk * (1 + Math.random() * 0.4) * damageMult);
    const isCrit = Math.random() > 0.6;
    const finalDamage = isCrit ? Math.round(rawDamage * 1.5) : rawDamage;

    const newBossHp = Math.max(0, bossHp - finalDamage);
    setBossHp(newBossHp);

    const attackLog = skillName
      ? `💥 ${squad[0].name} cast [${skillName}] dealing ${finalDamage.toLocaleString()} ${
          isCrit ? 'CRITICAL ' : ''
        }damage!`
      : `⚔️ Squad attacked for ${finalDamage.toLocaleString()} damage!`;

    // Boss Retaliation
    const bossDamage = Math.round((stage.recommendedPower * 0.3) * (0.8 + Math.random() * 0.4));
    const newSquadHp = Math.max(0, squadHp - bossDamage);
    setSquadHp(newSquadHp);

    const bossLog = `🛡️ ${stage.bossName} counter-attacked dealing ${bossDamage.toLocaleString()} damage.`;

    setCombatLogs((prev) => [bossLog, attackLog, ...prev.slice(0, 8)]);
    setTurn((t) => t + 1);

    // Check Win/Loss conditions
    if (newBossHp <= 0) {
      setBattleFinished(true);
      setIsVictory(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      onCompleteBattle(true, stage.staminaCost, stage.rewards);
    } else if (newSquadHp <= 0) {
      setBattleFinished(true);
      setIsVictory(false);
      onCompleteBattle(false, stage.staminaCost, stage.rewards);
    }
  };

  const handleAutoBattle = () => {
    if (profile.stamina < stage.staminaCost) {
      onOpenStaminaRefill();
      return;
    }

    // Auto calculate quick simulation
    const winRatio = totalPower / Math.max(1, stage.recommendedPower);
    const win = winRatio >= 0.85 || Math.random() < winRatio;

    setInCombat(true);
    setBattleFinished(true);
    setIsVictory(win);

    if (win) {
      setBossHp(0);
      setSquadHp(Math.round(maxSquadHp * 0.4));
      setCombatLogs([
        `🏆 VICTORY! Squad defeated ${stage.bossName} in Auto-Battle!`,
        `Dealt total ${stage.bossHp.toLocaleString()} damage.`,
      ]);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onCompleteBattle(true, stage.staminaCost, stage.rewards);
    } else {
      setSquadHp(0);
      setBossHp(Math.round(stage.bossHp * 0.3));
      setCombatLogs([
        `☠️ DEFEAT! Squad wiped out by ${stage.bossName}. Recommended Power: ${stage.recommendedPower}`,
      ]);
      onCompleteBattle(false, stage.staminaCost, stage.rewards);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-16 text-slate-100 flex flex-col justify-between">
      {/* Top Banner: Stage Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex items-center justify-between shadow">
        <div>
          <div className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
            Sector Stage {stage.stageNumber}
          </div>
          <h3 className="font-extrabold text-base text-white">{stage.title}</h3>
          <div className="text-xs text-slate-400 mt-0.5">
            Rec Power: <span className="text-cyan-300 font-bold">{stage.recommendedPower.toLocaleString()}</span> | Yours: <span className={`font-bold ${totalPower >= stage.recommendedPower ? 'text-emerald-400' : 'text-amber-400'}`}>{totalPower.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="bg-slate-950 px-2 py-1 rounded text-xs font-mono text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            -{stage.staminaCost} Stamina
          </span>
        </div>
      </div>

      {/* Combat Arena View */}
      {!inCombat ? (
        <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="my-auto space-y-3">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-red-600 to-amber-600 p-0.5 flex items-center justify-center shadow-xl shadow-red-950/50">
              <Swords className="w-10 h-10 text-slate-950" />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Target Enemy Boss
              </div>
              <h2 className="text-xl font-black text-rose-400 mt-0.5">{stage.bossName}</h2>
              <p className="text-xs text-slate-300 max-w-xs mx-auto mt-1">
                Deploy your 3 highest power heroes to assault the sector mainframe!
              </p>
            </div>

            {/* Squad Preview */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {squad.map((hero) => (
                <div
                  key={hero.id}
                  className="w-14 h-14 bg-slate-950 border border-cyan-500/40 rounded-2xl flex flex-col items-center justify-center relative shadow"
                >
                  <span className="text-xl">{hero.avatar}</span>
                  <span className="text-[9px] text-slate-300 font-bold truncate max-w-[50px]">
                    {hero.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full space-y-2 pt-3">
            <button
              onClick={handleStartBattle}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm py-3 rounded-2xl shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Swords className="w-5 h-5" />
              <span>START MANUAL COMBAT</span>
            </button>

            <button
              onClick={handleAutoBattle}
              className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs py-2.5 rounded-xl border border-cyan-800 flex items-center justify-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4 fill-cyan-400" />
              <span>INSTANT AUTO-SIMULATE</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Combat Screen */
        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between relative overflow-hidden space-y-3">
          {/* Boss Health Bar */}
          <div className="bg-slate-900 p-2.5 rounded-xl border border-rose-900/50 space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-rose-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                {stage.bossName}
              </span>
              <span className="font-mono text-slate-300">
                {bossHp.toLocaleString()} / {maxBossHp.toLocaleString()} HP
              </span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-rose-600 to-red-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, (bossHp / maxBossHp) * 100)}%` }}
              />
            </div>
          </div>

          {/* Squad Health Bar */}
          <div className="bg-slate-900 p-2.5 rounded-xl border border-cyan-900/50 space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-cyan-400 flex items-center gap-1">
                <Swords className="w-3.5 h-3.5" />
                Commander Squad (Turn {turn})
              </span>
              <span className="font-mono text-slate-300">
                {squadHp.toLocaleString()} / {maxSquadHp.toLocaleString()} HP
              </span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, (squadHp / maxSquadHp) * 100)}%` }}
              />
            </div>
          </div>

          {/* Combat Log Console */}
          <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 font-mono text-[11px] space-y-1 overflow-y-auto max-h-[160px] text-slate-300">
            {combatLogs.map((log, idx) => (
              <div key={idx} className="leading-snug">
                {log}
              </div>
            ))}
          </div>

          {/* Battle Actions or End Screen */}
          {!battleFinished ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAttack('Basic Strike', 1.0)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs py-3 rounded-xl border border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Swords className="w-4 h-4 text-amber-400" />
                <span>BASIC ATTACK</span>
              </button>

              <button
                onClick={() => handleAttack(squad[0].skills[0]?.name || 'Special Strike', 2.5)}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-md shadow-cyan-900/50 transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>ULTIMATE SKILL</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-center space-y-2 animate-fade-in">
              {isVictory ? (
                <div>
                  <div className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    STAGE CLEAR - VICTORY!
                  </div>
                  <div className="text-xs text-slate-300 mt-1 flex justify-center gap-3 font-mono">
                    <span className="text-amber-300">+{stage.rewards.gold} Gold</span>
                    <span className="text-cyan-300">+{stage.rewards.gems} Gems</span>
                    <span className="text-emerald-300">+{stage.rewards.eventTokens} Tokens</span>
                  </div>
                </div>
              ) : (
                <div className="text-base font-bold text-rose-400">
                  DEFEAT! Upgrade your Hero levels in Squad to beat this stage.
                </div>
              )}

              <button
                onClick={() => setInCombat(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 mt-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Return to Stage Selection</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
