import React, { useState } from 'react';
import { ShopOffer, PlayerProfile, Hero } from '../../types';
import { ShoppingBag, Sparkles, Gem, Zap, Shield, HelpCircle, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShopScreenProps {
  offers: ShopOffer[];
  profile: PlayerProfile;
  heroes: Hero[];
  onPurchaseOffer: (offer: ShopOffer) => void;
  onPerformGachaPull: (count: number) => { pulledHeroes: Hero[]; pityCount: number };
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  offers,
  profile,
  heroes,
  onPurchaseOffer,
  onPerformGachaPull,
}) => {
  const [showDropRatesModal, setShowDropRatesModal] = useState(false);
  const [pulledResult, setPulledResult] = useState<Hero[] | null>(null);
  const [pityCount, setPityCount] = useState(3);

  const handleGachaClick = (count: number, costGems: number) => {
    if (profile.gems < costGems && profile.gachaTickets < (count === 1 ? 1 : 10)) {
      alert('Not enough Gems or Gacha Tickets! Play battles or claim daily quests to earn more.');
      return;
    }

    const res = onPerformGachaPull(count);
    setPityCount(res.pityCount);
    setPulledResult(res.pulledHeroes);
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-16 text-slate-100 relative">
      {/* Gacha Requisition Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-cyan-500/50 rounded-2xl p-3.5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Cyber Requisition Gacha
            </div>
            <h2 className="text-base font-black text-white">Legendary Hero Drop Pool</h2>
          </div>

          <button
            onClick={() => setShowDropRatesModal(true)}
            className="flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg border border-slate-700"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Drop Rates</span>
          </button>
        </div>

        {/* Pity System Bar */}
        <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 space-y-1 text-xs">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-300 font-bold">Guaranteed Epic/Legendary Pity Counter:</span>
            <span className="font-mono text-cyan-300 font-bold">{pityCount} / 10 Pulls</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-400 h-full" style={{ width: `${(pityCount / 10) * 100}%` }} />
          </div>
        </div>

        {/* Gacha Pull Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => handleGachaClick(1, profile.gachaTickets > 0 ? 0 : 150)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs py-2.5 rounded-xl border border-slate-700 shadow flex flex-col items-center justify-center"
          >
            <span>SINGLE REQUISITION</span>
            <span className="text-[10px] text-cyan-300 font-mono mt-0.5">
              {profile.gachaTickets > 0 ? '1x Ticket' : '150 Gems'}
            </span>
          </button>

          <button
            onClick={() => handleGachaClick(10, 1350)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-lg shadow-cyan-500/30 flex flex-col items-center justify-center transition-all active:scale-95"
          >
            <span>10x TACTICAL DROP</span>
            <span className="text-[10px] text-slate-900 font-mono font-bold mt-0.5">
              1,350 Gems (Save 10%)
            </span>
          </button>
        </div>
      </div>

      {/* Featured Shop Offers & Bundles */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
          <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
          Limited Time Offers & Energy Bundles
        </h3>

        <div className="space-y-2">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3 flex items-center justify-between shadow transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-center text-2xl shadow">
                  {offer.icon}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-100">{offer.name}</span>
                    {offer.badge && (
                      <span className="text-[9px] font-black bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded shadow">
                        {offer.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{offer.containsLabel}</div>
                </div>
              </div>

              <button
                onClick={() => onPurchaseOffer(offer)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-2 rounded-xl shadow flex items-center gap-1 transition-all active:scale-95"
              >
                {offer.cost.currency === 'usd' ? `$${offer.cost.amount}` : `${offer.cost.amount} Gems`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Drop Rates Probability Inspector Modal */}
      {showDropRatesModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Gacha Summon Probability Table
              </h3>
              <button
                onClick={() => setShowDropRatesModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-500/40 flex justify-between items-center">
                <span className="text-amber-300 font-bold">5-Star Legendary Hero:</span>
                <span className="text-amber-400 font-extrabold text-sm">2.5%</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-cyan-500/40 flex justify-between items-center">
                <span className="text-cyan-300 font-bold">4-Star Epic Hero:</span>
                <span className="text-cyan-400 font-extrabold text-sm">15.0%</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 font-bold">3-Star Rare Hero:</span>
                <span className="text-slate-400 font-extrabold text-sm">82.5%</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-950 p-3 rounded-xl leading-relaxed">
              * Guaranteed Epic or Legendary hero granted every 10th consecutive summon without a 4★+ drop.
            </div>

            <button
              onClick={() => setShowDropRatesModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 rounded-xl"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {/* Pulled Gacha Result Animation Modal */}
      {pulledResult && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/50 rounded-3xl p-5 max-w-sm w-full text-center space-y-4 shadow-2xl animate-fade-in">
            <div className="text-xs font-bold uppercase text-cyan-400 tracking-widest flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" />
              Requisition Acquired!
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1">
              {pulledResult.map((h, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-cyan-500/40 p-2 rounded-2xl flex flex-col items-center shadow"
                >
                  <span className="text-3xl my-1">{h.avatar}</span>
                  <div className="font-extrabold text-xs text-white truncate max-w-[100px]">
                    {h.name}
                  </div>
                  <div className="text-[9px] text-amber-300 font-bold mt-0.5">{h.rarity}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPulledResult(null)}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-lg"
            >
              CONFIRM & COLLECT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
