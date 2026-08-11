import React, { useState, useEffect } from 'react';
import {
  PlayerProfile,
  Hero,
  Quest,
  LiveOpsEvent,
  BattlePass,
  ShopOffer,
  EconomyConfig,
  ActionTelemetry,
  TelemetryLog,
  Stage,
} from './types';
import {
  initialProfile,
  initialHeroes,
  initialQuests,
  initialLiveOpsEvents,
  initialBattlePass,
  initialShopOffers,
  initialEconomyConfig,
  initialTelemetry,
  initialTelemetryLogs,
} from './data/initialData';
import { MobileFrame } from './components/MobileFrame';
import { GameHeader } from './components/game/GameHeader';
import { GameNavigation, GameTab } from './components/game/GameNavigation';
import { HomeScreen } from './components/game/HomeScreen';
import { BattleScreen } from './components/game/BattleScreen';
import { EventsScreen } from './components/game/EventsScreen';
import { QuestsScreen } from './components/game/QuestsScreen';
import { BattlePassScreen } from './components/game/BattlePassScreen';
import { ShopScreen } from './components/game/ShopScreen';
import { HeroRosterScreen } from './components/game/HeroRosterScreen';
import { DesignerDashboard } from './components/designer/DesignerDashboard';
import { Smartphone, LayoutGrid, RotateCcw, Zap, Sparkles, Trophy, Award } from 'lucide-react';

export default function App() {
  // Main View Mode: 'game_only' | 'designer_only' | 'split_view'
  const [viewMode, setViewMode] = useState<'split_view' | 'game_only' | 'designer_only'>('split_view');

  // Game Navigation Tab State
  const [gameTab, setGameTab] = useState<GameTab>('home');

  // Core Application Persistent State
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem('ea_f2p_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [heroes, setHeroes] = useState<Hero[]>(() => {
    const saved = localStorage.getItem('ea_f2p_heroes');
    return saved ? JSON.parse(saved) : initialHeroes;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('ea_f2p_quests');
    return saved ? JSON.parse(saved) : initialQuests;
  });

  const [liveEvent, setLiveEvent] = useState<LiveOpsEvent>(() => {
    const saved = localStorage.getItem('ea_f2p_event');
    return saved ? JSON.parse(saved) : initialLiveOpsEvents[0];
  });

  const [battlePass, setBattlePass] = useState<BattlePass>(() => {
    const saved = localStorage.getItem('ea_f2p_pass');
    return saved ? JSON.parse(saved) : initialBattlePass;
  });

  const [shopOffers, setShopOffers] = useState<ShopOffer[]>(() => {
    const saved = localStorage.getItem('ea_f2p_offers');
    return saved ? JSON.parse(saved) : initialShopOffers;
  });

  const [economy, setEconomy] = useState<EconomyConfig>(() => {
    const saved = localStorage.getItem('ea_f2p_economy');
    return saved ? JSON.parse(saved) : initialEconomyConfig;
  });

  const [telemetry, setTelemetry] = useState<ActionTelemetry>(() => {
    const saved = localStorage.getItem('ea_f2p_telemetry');
    return saved ? JSON.parse(saved) : initialTelemetry;
  });

  const [logs, setLogs] = useState<TelemetryLog[]>(() => {
    const saved = localStorage.getItem('ea_f2p_logs');
    return saved ? JSON.parse(saved) : initialTelemetryLogs;
  });

  // Selected Stage for Battle
  const [selectedStage, setSelectedStage] = useState<Stage | undefined>(undefined);

  // Stamina Refill Modal State
  const [showStaminaModal, setShowStaminaModal] = useState(false);

  // Auto-Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('ea_f2p_profile', JSON.stringify(profile));
    localStorage.setItem('ea_f2p_heroes', JSON.stringify(heroes));
    localStorage.setItem('ea_f2p_quests', JSON.stringify(quests));
    localStorage.setItem('ea_f2p_event', JSON.stringify(liveEvent));
    localStorage.setItem('ea_f2p_pass', JSON.stringify(battlePass));
    localStorage.setItem('ea_f2p_offers', JSON.stringify(shopOffers));
    localStorage.setItem('ea_f2p_economy', JSON.stringify(economy));
    localStorage.setItem('ea_f2p_telemetry', JSON.stringify(telemetry));
    localStorage.setItem('ea_f2p_logs', JSON.stringify(logs));
  }, [profile, heroes, quests, liveEvent, battlePass, shopOffers, economy, telemetry, logs]);

  // Telemetry Logger Helper
  const logTelemetryAction = (
    action: string,
    details: string,
    deltas: { battles?: number; quests?: number; gacha?: number; hero?: number; event?: number; chat?: number }
  ) => {
    setTelemetry((prev) => ({
      battlesCompleted: prev.battlesCompleted + (deltas.battles || 0),
      questsClaimed: prev.questsClaimed + (deltas.quests || 0),
      gachaPullsDone: prev.gachaPullsDone + (deltas.gacha || 0),
      heroUpgradesDone: prev.heroUpgradesDone + (deltas.hero || 0),
      eventStagesCleared: prev.eventStagesCleared + (deltas.event || 0),
      shopBrowses: prev.shopBrowses,
      chatInteractions: prev.chatInteractions,
    }));

    const newLog: TelemetryLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action,
      details,
      motivationDelta: {
        Achiever: (deltas.quests || 0) * 10 + (deltas.hero || 0) * 15,
        Competitor: (deltas.battles || 0) * 10 + (deltas.event || 0) * 20,
        Explorer: (deltas.gacha || 0) * 15,
        Socializer: (deltas.chat || 0) * 20,
      },
    };

    setLogs((prev) => [newLog, ...prev.slice(0, 15)]);
  };

  // Handler: Complete Battle Stage
  const handleCompleteBattle = (victory: boolean, staminaUsed: number, rewards: any) => {
    setProfile((prev) => ({
      ...prev,
      stamina: Math.max(0, prev.stamina - staminaUsed),
      gold: prev.gold + (victory ? Math.round(rewards.gold * liveEvent.goldMultiplier) : 200),
      gems: prev.gems + (victory ? rewards.gems : 0),
      eventTokens: prev.eventTokens + (victory ? rewards.eventTokens : 0),
      currentXp: prev.currentXp + (victory ? Math.round(rewards.passXp * liveEvent.xpMultiplier) : 20),
    }));

    if (victory) {
      // Update Quests progress
      setQuests((prev) =>
        prev.map((q) => {
          if (q.objectiveType === 'battles' || q.objectiveType === 'event_stage') {
            return { ...q, currentProgress: Math.min(q.targetProgress, q.currentProgress + 1) };
          }
          return q;
        })
      );

      // Add Battle Pass XP
      setBattlePass((prev) => {
        const newXp = prev.currentXp + rewards.passXp;
        const newTier = Math.min(prev.maxTier, Math.floor(newXp / prev.xpPerLevel) + 1);
        return { ...prev, currentXp: newXp, currentTier: newTier };
      });

      logTelemetryAction('Tactical Stage Battle Victory', `Earned ${rewards.gold} Gold & ${rewards.passXp} Pass XP`, {
        battles: 1,
        event: selectedStage ? 1 : 0,
      });
    }
  };

  // Handler: Claim Quest Reward
  const handleClaimQuest = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.isClaimed) return;

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, isClaimed: true } : q))
    );

    setProfile((prev) => ({
      ...prev,
      gold: prev.gold + (quest.rewards.gold || 0),
      gems: prev.gems + (quest.rewards.gems || 0),
      eventTokens: prev.eventTokens + (quest.rewards.eventTokens || 0),
      gachaTickets: prev.gachaTickets + (quest.rewards.gachaTickets || 0),
    }));

    if (quest.rewards.passXp) {
      setBattlePass((prev) => {
        const newXp = prev.currentXp + (quest.rewards.passXp || 0);
        const newTier = Math.min(prev.maxTier, Math.floor(newXp / prev.xpPerLevel) + 1);
        return { ...prev, currentXp: newXp, currentTier: newTier };
      });
    }

    logTelemetryAction('Claimed Quest Objective', `Claimed quest [${quest.title}] (${quest.motivationType})`, {
      quests: 1,
    });
  };

  const handleClaimAllQuests = () => {
    const unclaimed = quests.filter((q) => q.currentProgress >= q.targetProgress && !q.isClaimed);
    unclaimed.forEach((q) => handleClaimQuest(q.id));
  };

  // Handler: Gacha Summon Pull
  const handlePerformGachaPull = (count: number) => {
    let costGems = count === 1 ? 150 : 1350;
    if (count === 1 && profile.gachaTickets > 0) {
      setProfile((prev) => ({ ...prev, gachaTickets: prev.gachaTickets - 1 }));
    } else {
      setProfile((prev) => ({ ...prev, gems: Math.max(0, prev.gems - costGems) }));
    }

    const pulled: Hero[] = [];
    for (let i = 0; i < count; i++) {
      const rand = Math.random() * 100;
      let pulledHero = heroes[3]; // default Rare
      if (rand < economy.gachaRates.legendary) {
        pulledHero = heroes[0]; // 5-Star
      } else if (rand < economy.gachaRates.legendary + economy.gachaRates.epic) {
        pulledHero = heroes[1]; // 4-Star
      }
      pulled.push(pulledHero);
    }

    // Unlock or give shards
    setHeroes((prev) =>
      prev.map((h) => {
        const isPulled = pulled.some((p) => p.id === h.id);
        if (isPulled) {
          return { ...h, isUnlocked: true, level: Math.max(h.level, 1) };
        }
        return h;
      })
    );

    logTelemetryAction('Gacha Supply Drop Summoned', `Performed ${count}x Gacha Requisition Pulls`, {
      gacha: count,
    });

    return { pulledHeroes: pulled, pityCount: (count % 10) + 1 };
  };

  // Handler: Purchase Shop Offer
  const handlePurchaseOffer = (offer: ShopOffer) => {
    if (offer.cost.currency === 'gems' && profile.gems < offer.cost.amount) {
      alert('Not enough Gems!');
      return;
    }

    if (offer.cost.currency === 'gems') {
      setProfile((prev) => ({ ...prev, gems: prev.gems - offer.cost.amount }));
    }

    if (offer.type === 'stamina') {
      setProfile((prev) => ({ ...prev, stamina: prev.stamina + 100 }));
    } else if (offer.type === 'bundle') {
      setProfile((prev) => ({
        ...prev,
        gems: prev.gems + 1000,
        gachaTickets: prev.gachaTickets + 5,
        gold: prev.gold + 50000,
      }));
    }

    logTelemetryAction('Purchased Store Offer', `Bought [${offer.name}]`, {});
  };

  // Handler: Upgrade Hero
  const handleUpgradeHero = (heroId: string) => {
    if (profile.gold < 3000) {
      alert('Not enough Gold to upgrade hero level! Complete battles or quests.');
      return;
    }

    setProfile((prev) => ({ ...prev, gold: prev.gold - 3000 }));
    setHeroes((prev) =>
      prev.map((h) => {
        if (h.id === heroId) {
          return {
            ...h,
            level: h.level + 1,
            power: h.power + 120,
            hp: h.hp + 400,
            atk: h.atk + 45,
          };
        }
        return h;
      })
    );

    logTelemetryAction('Upgraded Hero Squad Member', `Leveled up hero level (+120 Power)`, {
      hero: 1,
    });
  };

  // Handler: Stamina Refill
  const handleRefillStamina = () => {
    if (profile.gems < 50) {
      alert('Not enough Gems for Stamina Refill!');
      return;
    }
    setProfile((prev) => ({
      ...prev,
      gems: prev.gems - 50,
      stamina: prev.stamina + 100,
    }));
    setShowStaminaModal(false);
  };

  // Handler: Reset App Defaults
  const handleResetDefaults = () => {
    if (confirm('Reset all F2P mobile state and analytics to initial EA defaults?')) {
      localStorage.clear();
      setProfile(initialProfile);
      setHeroes(initialHeroes);
      setQuests(initialQuests);
      setLiveEvent(initialLiveOpsEvents[0]);
      setBattlePass(initialBattlePass);
      setShopOffers(initialShopOffers);
      setEconomy(initialEconomyConfig);
      setTelemetry(initialTelemetry);
      setLogs(initialTelemetryLogs);
    }
  };

  const unclaimedQuestsCount = quests.filter(
    (q) => q.currentProgress >= q.targetProgress && !q.isClaimed
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Application Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center font-black text-slate-950 shadow">
            EA
          </div>
          <div>
            <h1 className="text-sm font-black text-white flex items-center gap-1.5">
              <span>EA Mobile LiveOps & Content Design Workbench</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              F2P Mobile Core Loop • Event Scheduler • Bartle Telemetry • Gemini Copilot
            </p>
          </div>
        </div>

        {/* View Layout Switcher & Reset Button */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setViewMode('split_view')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'split_view'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Split View: Mobile Game + EA Studio"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Split View</span>
            </button>

            <button
              onClick={() => setViewMode('game_only')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'game_only'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Play Mobile Game Only"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile Game</span>
            </button>

            <button
              onClick={() => setViewMode('designer_only')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                viewMode === 'designer_only'
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="EA LiveOps Command Workbench"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden md:inline">EA Workbench</span>
            </button>
          </div>

          <button
            onClick={handleResetDefaults}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset Application State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden p-2 md:p-4">
        {viewMode === 'split_view' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
            {/* Left Column: Interactive Mobile F2P Game */}
            <div className="lg:col-span-5 xl:col-span-4 flex justify-center">
              <MobileFrame activeTab={gameTab}>
                <GameHeader
                  profile={profile}
                  onOpenStaminaRefill={() => setShowStaminaModal(true)}
                  onOpenShop={() => setGameTab('shop')}
                />

                <div className="flex-1 overflow-hidden relative flex flex-col">
                  {gameTab === 'home' && (
                    <HomeScreen
                      profile={profile}
                      activeEvent={liveEvent}
                      featuredHero={heroes[0]}
                      onNavigateTab={(tab) => setGameTab(tab)}
                      onClaimDailyStreak={() => {
                        setProfile((p) => ({ ...p, gems: p.gems + 100, gold: p.gold + 5000 }));
                        alert('Claimed Daily Streak Bonus: +100 Gems & +5,000 Gold!');
                      }}
                    />
                  )}

                  {gameTab === 'battle' && (
                    <BattleScreen
                      heroes={heroes}
                      profile={profile}
                      stage={selectedStage}
                      onCompleteBattle={handleCompleteBattle}
                      onOpenStaminaRefill={() => setShowStaminaModal(true)}
                    />
                  )}

                  {gameTab === 'events' && (
                    <EventsScreen
                      event={liveEvent}
                      profile={profile}
                      onPlayEventStage={(stage) => {
                        setSelectedStage(stage);
                        setGameTab('battle');
                      }}
                      onClaimEventQuest={handleClaimQuest}
                    />
                  )}

                  {gameTab === 'quests' && (
                    <QuestsScreen
                      quests={quests}
                      onClaimQuest={handleClaimQuest}
                      onClaimAllQuests={handleClaimAllQuests}
                    />
                  )}

                  {gameTab === 'pass' && (
                    <BattlePassScreen
                      pass={battlePass}
                      profile={profile}
                      onClaimTier={(tier, isPremium) => {
                        alert(`Claimed Tier ${tier} Reward!`);
                      }}
                      onUnlockPremiumPass={() => {
                        if (profile.gems < 500) {
                          alert('Not enough gems!');
                          return;
                        }
                        setProfile((p) => ({ ...p, gems: p.gems - 500 }));
                        setBattlePass((p) => ({ ...p, isPremiumUnlocked: true }));
                      }}
                    />
                  )}

                  {gameTab === 'shop' && (
                    <ShopScreen
                      offers={shopOffers}
                      profile={profile}
                      heroes={heroes}
                      onPurchaseOffer={handlePurchaseOffer}
                      onPerformGachaPull={handlePerformGachaPull}
                    />
                  )}

                  {gameTab === 'squad' && (
                    <HeroRosterScreen
                      heroes={heroes}
                      profile={profile}
                      onUpgradeHero={handleUpgradeHero}
                    />
                  )}
                </div>

                <GameNavigation
                  activeTab={gameTab}
                  onSelectTab={(t) => setGameTab(t)}
                  unclaimedQuestsCount={unclaimedQuestsCount}
                />
              </MobileFrame>
            </div>

            {/* Right Column: EA LiveOps Command Center */}
            <div className="lg:col-span-7 xl:col-span-8 overflow-y-auto max-h-[calc(100vh-100px)]">
              <DesignerDashboard
                activeEvent={liveEvent}
                economy={economy}
                telemetry={telemetry}
                logs={logs}
                onUpdateEvent={(updated) => setLiveEvent(updated)}
                onAddQuest={(q) => setQuests((prev) => [q, ...prev])}
                onUpdateEconomy={(e) => setEconomy(e)}
              />
            </div>
          </div>
        ) : viewMode === 'game_only' ? (
          <div className="flex justify-center my-auto">
            <MobileFrame activeTab={gameTab}>
              <GameHeader
                profile={profile}
                onOpenStaminaRefill={() => setShowStaminaModal(true)}
                onOpenShop={() => setGameTab('shop')}
              />

              <div className="flex-1 overflow-hidden relative flex flex-col">
                {gameTab === 'home' && (
                  <HomeScreen
                    profile={profile}
                    activeEvent={liveEvent}
                    featuredHero={heroes[0]}
                    onNavigateTab={(tab) => setGameTab(tab)}
                    onClaimDailyStreak={() => {
                      setProfile((p) => ({ ...p, gems: p.gems + 100, gold: p.gold + 5000 }));
                      alert('Claimed Daily Streak Bonus!');
                    }}
                  />
                )}

                {gameTab === 'battle' && (
                  <BattleScreen
                    heroes={heroes}
                    profile={profile}
                    stage={selectedStage}
                    onCompleteBattle={handleCompleteBattle}
                    onOpenStaminaRefill={() => setShowStaminaModal(true)}
                  />
                )}

                {gameTab === 'events' && (
                  <EventsScreen
                    event={liveEvent}
                    profile={profile}
                    onPlayEventStage={(stage) => {
                      setSelectedStage(stage);
                      setGameTab('battle');
                    }}
                    onClaimEventQuest={handleClaimQuest}
                  />
                )}

                {gameTab === 'quests' && (
                  <QuestsScreen
                    quests={quests}
                    onClaimQuest={handleClaimQuest}
                    onClaimAllQuests={handleClaimAllQuests}
                  />
                )}

                {gameTab === 'pass' && (
                  <BattlePassScreen
                    pass={battlePass}
                    profile={profile}
                    onClaimTier={() => {}}
                    onUnlockPremiumPass={() => {
                      if (profile.gems < 500) return;
                      setProfile((p) => ({ ...p, gems: p.gems - 500 }));
                      setBattlePass((p) => ({ ...p, isPremiumUnlocked: true }));
                    }}
                  />
                )}

                {gameTab === 'shop' && (
                  <ShopScreen
                    offers={shopOffers}
                    profile={profile}
                    heroes={heroes}
                    onPurchaseOffer={handlePurchaseOffer}
                    onPerformGachaPull={handlePerformGachaPull}
                  />
                )}

                {gameTab === 'squad' && (
                  <HeroRosterScreen
                    heroes={heroes}
                    profile={profile}
                    onUpgradeHero={handleUpgradeHero}
                  />
                )}
              </div>

              <GameNavigation
                activeTab={gameTab}
                onSelectTab={(t) => setGameTab(t)}
                unclaimedQuestsCount={unclaimedQuestsCount}
              />
            </MobileFrame>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <DesignerDashboard
              activeEvent={liveEvent}
              economy={economy}
              telemetry={telemetry}
              logs={logs}
              onUpdateEvent={(updated) => setLiveEvent(updated)}
              onAddQuest={(q) => setQuests((prev) => [q, ...prev])}
              onUpdateEconomy={(e) => setEconomy(e)}
            />
          </div>
        )}
      </main>

      {/* Stamina Refill Modal */}
      {showStaminaModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-xs w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <h3 className="font-extrabold text-base text-white">Refill Energy Cores</h3>
              <p className="text-xs text-slate-400 mt-1">
                Instantly restore <span className="text-amber-300 font-bold">+100 Tactical Energy</span> to continue stage battles!
              </p>
            </div>

            <button
              onClick={handleRefillStamina}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow transition-all active:scale-95"
            >
              Refill for 50 Gems
            </button>

            <button
              onClick={() => setShowStaminaModal(false)}
              className="w-full text-slate-400 text-xs hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
