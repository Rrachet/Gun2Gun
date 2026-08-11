import React, { useState } from 'react';
import { Quest, MotivationType } from '../../types';
import { ScrollText, Plus, Check } from 'lucide-react';

interface QuestDesignerProps {
  onAddQuest: (quest: Quest) => void;
}

export const QuestDesigner: React.FC<QuestDesignerProps> = ({ onAddQuest }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'daily' | 'weekly' | 'event'>('daily');
  const [objectiveType, setObjectiveType] = useState<Quest['objectiveType']>('battles');
  const [targetProgress, setTargetProgress] = useState(3);
  const [motivationType, setMotivationType] = useState<MotivationType>('Achiever');
  const [rewardGold, setRewardGold] = useState(2500);
  const [rewardGems, setRewardGems] = useState(25);
  const [rewardPassXp, setRewardPassXp] = useState(100);
  const [isCreated, setIsCreated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newQuest: Quest = {
      id: `custom-q-${Date.now()}`,
      title,
      description: description || `Complete ${targetProgress} ${objectiveType} objectives.`,
      category,
      objectiveType,
      currentProgress: 0,
      targetProgress: Number(targetProgress),
      rewards: {
        gold: Number(rewardGold),
        gems: Number(rewardGems),
        passXp: Number(rewardPassXp),
      },
      motivationType,
      isClaimed: false,
    };

    onAddQuest(newQuest);
    setIsCreated(true);
    setTitle('');
    setDescription('');
    setTimeout(() => setIsCreated(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <ScrollText className="w-5 h-5 text-amber-400" />
        <div>
          <h3 className="font-extrabold text-base text-white">Mission & Challenge Designer Studio</h3>
          <p className="text-xs text-slate-400">
            Design targeted player quests tuned to specific Bartle player archetypes ([Achiever], [Competitor], [Explorer], [Socializer]).
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Mission Title</label>
            <input
              type="text"
              placeholder="e.g. Cyber Grid Vanguard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Description Narrative</label>
            <input
              type="text"
              placeholder="e.g. Win 3 battles with Cyber squad members."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white"
            >
              <option value="daily">Daily Mission</option>
              <option value="weekly">Weekly Objective</option>
              <option value="event">Event Challenge</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Objective Type</label>
            <select
              value={objectiveType}
              onChange={(e) => setObjectiveType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white"
            >
              <option value="battles">Stage Battles</option>
              <option value="gacha">Gacha Summons</option>
              <option value="hero_upgrade">Hero Upgrades</option>
              <option value="event_stage">Event Stages</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Target Player Archetype</label>
            <select
              value={motivationType}
              onChange={(e) => setMotivationType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white font-bold text-amber-300"
            >
              <option value="Achiever">Achiever (Mastery)</option>
              <option value="Competitor">Competitor (Dominance)</option>
              <option value="Explorer">Explorer (Discovery)</option>
              <option value="Socializer">Socializer (Community)</option>
            </select>
          </div>
        </div>

        {/* Target Count & Reward Matrix */}
        <div className="grid grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
          <div>
            <label className="block font-bold text-slate-400 mb-1">Target Count</label>
            <input
              type="number"
              min="1"
              value={targetProgress}
              onChange={(e) => setTargetProgress(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white font-mono"
            />
          </div>
          <div>
            <label className="block font-bold text-amber-400 mb-1">Gold Reward</label>
            <input
              type="number"
              value={rewardGold}
              onChange={(e) => setRewardGold(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-amber-300 font-mono"
            />
          </div>
          <div>
            <label className="block font-bold text-cyan-400 mb-1">Gems Reward</label>
            <input
              type="number"
              value={rewardGems}
              onChange={(e) => setRewardGems(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-cyan-300 font-mono"
            />
          </div>
          <div>
            <label className="block font-bold text-emerald-400 mb-1">Pass XP Reward</label>
            <input
              type="number"
              value={rewardPassXp}
              onChange={(e) => setRewardPassXp(parseInt(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-emerald-300 font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow flex items-center gap-2 transition-all"
        >
          {isCreated ? <Check className="w-4 h-4 text-slate-950" /> : <Plus className="w-4 h-4 text-slate-950" />}
          <span>{isCreated ? 'MISSION DEPLOYED TO GAME!' : 'DEPLOY MISSION TO GAME BOARD'}</span>
        </button>
      </form>
    </div>
  );
};
