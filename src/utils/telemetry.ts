import { ActionTelemetry, MotivationType } from '../types';

export function calculateBartleScores(telemetry: ActionTelemetry) {
  // Achiever: Focuses on quests, levelling up heroes, completing battle pass
  const achiever =
    telemetry.questsClaimed * 12 +
    telemetry.heroUpgradesDone * 15 +
    telemetry.battlesCompleted * 5;

  // Competitor: Focuses on event stages, leaderboards, battle victories
  const competitor =
    telemetry.eventStagesCleared * 20 +
    telemetry.battlesCompleted * 10 +
    telemetry.gachaPullsDone * 8;

  // Explorer: Focuses on shop browsing, opening gacha drops, discovering events
  const explorer =
    telemetry.shopBrowses * 8 +
    telemetry.gachaPullsDone * 15 +
    telemetry.eventStagesCleared * 10;

  // Socializer: Focuses on guild chat interactions, social challenges
  const socializer = telemetry.chatInteractions * 25 + telemetry.questsClaimed * 4;

  const total = Math.max(1, achiever + competitor + explorer + socializer);

  return {
    Achiever: Math.round((achiever / total) * 100),
    Competitor: Math.round((competitor / total) * 100),
    Explorer: Math.round((explorer / total) * 100),
    Socializer: Math.round((socializer / total) * 100),
  };
}

export function calculateSDTScores(telemetry: ActionTelemetry) {
  // Autonomy: Ability to choose shop offers, gacha summons, team line-ups
  const autonomy = Math.min(
    100,
    30 + telemetry.shopBrowses * 5 + telemetry.gachaPullsDone * 10
  );

  // Competence: Mastery over stages, hero upgrades, quest completion
  const competence = Math.min(
    100,
    25 + telemetry.heroUpgradesDone * 12 + telemetry.battlesCompleted * 6
  );

  // Relatedness: Guild interactions, event community participation
  const relatedness = Math.min(
    100,
    20 + telemetry.chatInteractions * 15 + telemetry.eventStagesCleared * 8
  );

  return { Autonomy: autonomy, Competence: competence, Relatedness: relatedness };
}

export function getDominantArchetype(scores: Record<MotivationType, number>): MotivationType {
  let highest: MotivationType = 'Achiever';
  let maxScore = -1;

  (Object.keys(scores) as MotivationType[]).forEach((type) => {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      highest = type;
    }
  });

  return highest;
}

export function getPersonalizedInsights(dominantType: MotivationType) {
  switch (dominantType) {
    case 'Achiever':
      return {
        title: 'Achiever Trait Dominant (Mastery & Progression)',
        recommendation:
          'This player responds best to clear milestone meters, battle pass level-up notifications, and hero upgrade power spikes. Recommend displaying "Claim All" badges prominently and offering Level-Up Bundles.',
        suggestedOffer: 'Starter Commander Level-Up Pack (+1,000 Gems, +50k Gold)',
      };
    case 'Competitor':
      return {
        title: 'Competitor Trait Dominant (Leaderboards & Dominance)',
        recommendation:
          'This player is driven by relative power, rank standings, and high-difficulty event stages. Recommend displaying leaderboard rank deltas, PvP/Ranked teasers, and Legendary hero gacha banners.',
        suggestedOffer: '5-Star Cyber Titan Requisition Gacha Ticket Pack',
      };
    case 'Explorer':
      return {
        title: 'Explorer Trait Dominant (Discovery & Variety)',
        recommendation:
          'This player loves inspecting hero skill synergies, browsing shop deals, and revealing new event chapters. Recommend highlighting lore, secret event stages, and daily refreshed store offers.',
        suggestedOffer: 'Cyber Supply Drop 10x Pack + Special Lore Shards',
      };
    case 'Socializer':
      return {
        title: 'Socializer Trait Dominant (Community & Cooperation)',
        recommendation:
          'This player values team synergy, guild assistance, and social chat. Recommend offering Guild Energy Gifting, co-op boss raids, and social achievement rewards.',
        suggestedOffer: 'Guild Raid Pass & Team Buff Energy Bundle',
      };
  }
}
