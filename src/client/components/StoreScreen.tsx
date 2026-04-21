import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { useState } from 'react';

const STORE_ITEMS = [
  { id: 'resume_template', name: 'Resume Template', cost: 50, icon: '📄', desc: 'Boosts starting Experience slightly.' },
  { id: 'coffee_pack', name: 'Energy Drink Pack', cost: 30, icon: '⚡', desc: 'Start with 10 extra Energy.' },
  { id: 'tutor_session', name: 'Tutor Session', cost: 80, icon: '🧑‍🏫', desc: 'Start with 10 extra GPA.' },
  { id: 'therapy_dog', name: 'Therapy Dog', cost: 100, icon: '🐕', desc: 'Start with 10 extra Mentality.' },
  { id: 'vip_agency', name: 'VIP Agency Access', cost: 200, icon: '💼', desc: 'Unlock hidden Agency choices.' },
  { id: 'skip_gre', name: 'GRE Exemption', cost: 300, icon: '📝', desc: 'Automatically pass language tests.' },
];

export const StoreScreen = ({ onBack }: { onBack: () => void }) => {
  const { currency, spendCurrency } = useGameStore();
  const [purchased, setPurchased] = useState<Record<string, boolean>>({});

  const handleBuy = (id: string, cost: number) => {
    if (purchased[id]) return;
    if (spendCurrency(cost)) {
      setPurchased(prev => ({ ...prev, [id]: true }));
    }
  };

  return (
    <div className="min-h-[100dvh] bg-brand-yellow flex flex-col font-sans p-4 sm:p-8 relative">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center bg-white border-[6px] border-black p-4 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
          <button 
            onClick={onBack}
            className="bg-black text-white font-black px-4 py-2 uppercase hover:bg-brand-pink transition-colors border-2 border-transparent"
          >
            ← BACK
          </button>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter">THE STORE</h1>
          <div className="bg-brand-green text-black border-4 border-black px-4 py-2 font-black text-xl shadow-[4px_4px_0px_0px_#000]">
            💰 {currency}
          </div>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 flex-1 content-start">
          {STORE_ITEMS.map((item) => {
            const isBought = purchased[item.id];
            const canAfford = currency >= item.cost;
            return (
              <motion.div 
                key={item.id}
                whileHover={{ scale: 1.02, rotate: 1 }}
                className={`bg-white border-[6px] border-black flex flex-col items-center p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${isBought ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="text-6xl mb-4 bg-brand-pink w-24 h-24 flex items-center justify-center rounded-full border-4 border-black shadow-inner">
                  {item.icon}
                </div>
                <h3 className="font-black text-xl mb-2 uppercase">{item.name}</h3>
                <p className="font-bold text-sm mb-6 flex-1">{item.desc}</p>
                
                <button
                  onClick={() => handleBuy(item.id, item.cost)}
                  disabled={isBought || !canAfford}
                  className={`w-full py-3 border-4 border-black font-black uppercase tracking-widest text-lg transition-transform ${
                    isBought 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : canAfford
                        ? 'bg-brand-cyan text-black hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-red-500 text-black opacity-70 cursor-not-allowed'
                  }`}
                >
                  {isBought ? 'SOLD OUT' : `BUY - ${item.cost} 💰`}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
