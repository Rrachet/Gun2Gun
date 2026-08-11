export type HeroRarity = '3-Star Rare' | '4-Star Epic' | '5-Star Legendary';

export type HeroElement = 'Tech' | 'Bio' | 'Psi' | 'Cyber';

export interface HeroSkill {
  name: string;
  description: string;
  cooldown: number;
  damageMultiplier: number;
  icon: string;
}

export interface Hero {
  id: string;
  name: string;
  title: string;
  rarity: HeroRarity;
  element: HeroElement;
  level: number;
  maxLevel: number;
  power: number;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  skills: HeroSkill[];
  avatar: string;
  isUnlocked: boolean;
  shardsCurrent: number;
  shardsNeeded: number;
}

export type MotivationType = 'Achiever' | 'Competitor' | 'Explorer' | 'Socializer';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'event' | 'achievement';
  objectiveType: 'battles' | 'gacha' | 'hero_upgrade' | 'stamina_spend' | 'event_stage' | 'claim_pass';
  currentProgress: number;
  targetProgress: number;
  rewards: {
    gold?: number;
    gems?: number;
    passXp?: number;
    eventTokens?: number;
    gachaTickets?: number;
  };
  motivationType: MotivationType;
  isClaimed: boolean;
  expiresIn?: string;
}

export interface Stage {
  id: string;
  stageNumber: number;
  title: string;
  staminaCost: number;
  recommendedPower: number;
  bossName: string;
  bossHp: number;
  rewards: {
    gold: number;
    gems: number;
    passXp: number;
    eventTokens: number;
    firstClearGachaTicket?: boolean;
  };
  isCleared: boolean;
}

export interface LiveOpsEvent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bannerImage: string;
  themeColor: string;
  status: 'active' | 'scheduled' | 'ended';
  startDate: string;
  endDate: string;
  xpMultiplier: number;
  goldMultiplier: number;
  featuredHeroIds: string[];
  eventMissions: Quest[];
  stages: Stage[];
}

export interface BattlePassTier {
  tier: number;
  freeReward: { type: string; amount: number; label: string };
  premiumReward: { type: string; amount: number; label: string };
  freeClaimed: boolean;
  premiumClaimed: boolean;
}

export interface BattlePass {
  seasonNumber: number;
  seasonName: string;
  theme: string;
  currentXp: number;
  xpPerLevel: number;
  currentTier: number;
  maxTier: number;
  isPremiumUnlocked: boolean;
  tiers: BattlePassTier[];
}

export interface ShopOffer {
  id: string;
  name: string;
  description: string;
  type: 'gacha_single' | 'gacha_multi' | 'bundle' | 'currency' | 'stamina';
  cost: {
    currency: 'gems' | 'gold' | 'usd';
    amount: number;
  };
  containsLabel: string;
  badge?: string;
  purchaseLimit?: number;
  purchasesCount: number;
  icon: string;
  featured?: boolean;
}

export interface PlayerProfile {
  name: string;
  level: number;
  currentXp: number;
  maxXp: number;
  vipLevel: number;
  stamina: number;
  maxStamina: number;
  gold: number;
  gems: number;
  eventTokens: number;
  gachaTickets: number;
  dailyLoginStreak: number;
  lastStaminaRegen: number;
}

export interface ActionTelemetry {
  battlesCompleted: number;
  questsClaimed: number;
  gachaPullsDone: number;
  heroUpgradesDone: number;
  eventStagesCleared: number;
  shopBrowses: number;
  chatInteractions: number;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  motivationDelta: Record<MotivationType, number>;
}

export interface EconomyConfig {
  staminaRegenMinutes: number;
  staminaPerRefill: number;
  staminaRefillCostGems: number;
  gachaRates: {
    legendary: number; // e.g., 2.5
    epic: number; // e.g., 15.0
    rare: number; // e.g., 82.5
  };
  goldPerBattle: number;
  passXpPerBattle: number;
  pityLimit: number;
}
