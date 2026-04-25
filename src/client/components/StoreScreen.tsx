import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [selectedItem, setSelectedItem] = useState<typeof STORE_ITEMS[0] | null>(null);

  const handleBuy = (id: string, cost: number) => {
    if (purchased[id]) return;
    if (spendCurrency(cost)) {
      setPurchased(prev => ({ ...prev, [id]: true }));
    }
  };

  return (
    <div className="min-h-screen bg-[#D0BFFF] flex flex-col font-sans p-2 sm:p-8 relative overflow-x-hidden">
      {/* Abstract Pop Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000 3px, transparent 4px)', backgroundSize: '24px 24px' }}></div>
      <div className="absolute inset-0 pointer-events-none transform rotate-12 scale-150 mix-blend-overlay opacity-30" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 100%, 50% 75%, 25% 75%, 25% 100%, 0% 100%)', backgroundColor: '#000' }}></div>

      {/* Main Cabinet Frame */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col flex-1 max-h-[85vh] sm:max-h-[800px] mt-4 sm:mt-8 bg-[#FDF9F1] border-[4px] sm:border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] mr-2 sm:mr-auto mb-4 sm:mb-8 shrink-0">
        
        {/* Header / Store Signboard */}
        <div className="bg-black border-b-[4px] sm:border-b-[6px] border-black p-2 sm:p-5 sticky top-0 z-30 flex items-center justify-between shadow-[0px_4px_0px_0px_#FFE066] sm:shadow-[0px_6px_0px_0px_#FFE066] gap-2">
          {/* Left spacer/button container to balance flex layout */}
          <div className="flex-1 flex justify-start">
            <button 
              onClick={onBack}
              className="bg-white text-black font-black text-[10px] sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 border-[2px] sm:border-[3px] border-black hover:bg-[#FFA6A6] hover:text-black transition-colors shadow-[2px_2px_0px_0px_#89CFF0] sm:shadow-[3px_3px_0px_0px_#89CFF0] hover:shadow-[2px_2px_0px_0px_#000] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none flex items-center gap-1 transform -rotate-2 shrink-0"
            >
              <span>←</span> <span className="hidden sm:inline">EXIT</span>
            </button>
          </div>
          
          {/* Glitchy Title (Centered absolutely relative to parent, or by using flex-1 spacers) */}
          <div className="relative flex-none flex justify-center overflow-hidden sm:overflow-visible mx-2">
            <h1 className="text-lg sm:text-4xl font-black uppercase tracking-tighter text-white transform rotate-1 z-10 relative whitespace-nowrap">
              BLACK MARKET
            </h1>
            <h1 className="text-lg sm:text-4xl font-black uppercase tracking-tighter text-[#FFB3D9] absolute top-[1px] sm:top-1 left-1/2 -translate-x-[49%] transform -rotate-1 z-0 whitespace-nowrap">
              BLACK MARKET
            </h1>
          </div>

          {/* Digital Currency Display (Right spacer) */}
          <div className="flex-1 flex justify-end">
            <div className="bg-black text-[#FFE066] border-[2px] sm:border-[3px] border-[#FFE066] px-2 py-1 sm:px-5 sm:py-2 font-black text-xs sm:text-xl shadow-[2px_2px_0px_0px_#FFE066] sm:shadow-[4px_4px_0px_0px_#FFE066] transform rotate-2 shrink-0">
              <span className="text-white text-[10px] sm:text-sm mr-1 opacity-70">BAL</span>💰 {currency}
            </div>
          </div>
        </div>

        {/* Showcase Area (The Cabinet Interior) */}
        <div className="flex-1 p-4 sm:p-10 relative bg-[#FDF9F1] overflow-y-auto">
          {/* Cabinet Metal Grid & Glass Reflection */}
          <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
          <div className="absolute inset-0 pointer-events-none bg-white opacity-20" style={{ clipPath: 'polygon(15% 0, 35% 0, 20% 100%, 0% 100%)' }}></div>
          <div className="absolute inset-0 pointer-events-none bg-white opacity-10" style={{ clipPath: 'polygon(80% 0, 95% 0, 85% 100%, 70% 100%)' }}></div>

          {/* Shelves Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 sm:gap-x-8 gap-y-6 sm:gap-y-12 content-start relative z-10">
            {STORE_ITEMS.map((item, index) => {
              const isBought = purchased[item.id];
              const canAfford = currency >= item.cost;
              const isEven = index % 2 === 0;
              const isUnaffordable = !isBought && !canAfford;

              return (
                <div key={item.id} className="relative group pt-2 sm:pt-3 pr-2 sm:pr-3">
                  {/* Decorative Pop Shadow Layer behind item */}
                  <div 
                    className={`absolute inset-0 mt-2 sm:mt-3 mr-2 sm:mr-3 transform translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3 transition-colors ${isBought ? 'bg-[#CCC]' : isUnaffordable ? 'bg-[#BDBDBD]' : 'bg-[#89CFF0]'}`}
                    style={{ clipPath: isEven ? 'polygon(2% 0, 100% 2%, 98% 100%, 0 98%)' : 'polygon(0 2%, 98% 0, 100% 98%, 2% 100%)' }}
                  ></div>

                  {/* Price Tag (Moved OUTSIDE clipped motion.div) */}
                  <div className="absolute top-0 right-0 z-20 bg-[#FFE066] text-black px-2 py-0.5 sm:px-3 sm:py-1 border-[2px] sm:border-[3px] border-black font-black text-sm sm:text-xl shadow-[2px_2px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000] transform rotate-6">
                    ${item.cost}
                  </div>

                  {/* Not enough cash sticker */}
                  {isUnaffordable && (
                    <div className="absolute -bottom-2 left-0 z-20 bg-black text-white px-2 py-1 border-[2px] sm:border-[3px] border-white font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] transform -rotate-2">
                      NOT ENOUGH 💰
                    </div>
                  )}

                  {/* Physical Box/Item */}
                  <motion.div 
                    whileHover={!isBought ? { scale: 1.02, rotate: isEven ? -1 : 1, y: -2 } : {}}
                    className={`bg-white border-[3px] sm:border-[5px] border-black flex flex-col items-center p-3 sm:p-5 text-center relative z-10 h-full ${
                      isBought ? 'opacity-60 grayscale' : isUnaffordable ? 'opacity-55 grayscale' : ''
                    }`}
                    style={{ clipPath: isEven ? 'polygon(2% 0, 100% 2%, 98% 100%, 0 98%)' : 'polygon(0 2%, 98% 0, 100% 98%, 2% 100%)' }}
                    onClick={() => setSelectedItem(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedItem(item)
                    }}
                  >
                    {/* Icon Display */}
                    <div className="relative mt-1 mb-3 sm:mt-2 sm:mb-5">
                      {/* Halftone burst behind icon */}
                      <div className="absolute inset-0 opacity-30 pointer-events-none transform scale-150" style={{ backgroundImage: 'radial-gradient(#FFB3D9 2px, transparent 3px)', backgroundSize: '10px 10px' }}></div>
                      <div className="text-4xl sm:text-7xl w-16 h-16 sm:w-28 sm:h-28 flex items-center justify-center rounded-full bg-white border-[2px] sm:border-[4px] border-black shadow-[4px_4px_0px_0px_#D0BFFF] sm:shadow-[6px_6px_0px_0px_#D0BFFF] relative z-10 select-none">
                        {item.icon}
                      </div>
                    </div>
                    
                    {/* Item Name */}
                    <h3 className="font-black text-base sm:text-2xl mb-1 sm:mb-2 uppercase leading-none bg-black text-white px-2 py-1 transform -rotate-1">
                      {item.name}
                    </h3>
                    
                    {/* Item Description (Removed from card view, shown in modal) */}
                    <div className="flex-1"></div>
                    
                    {/* Buy Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className={`w-full py-2 sm:py-3 border-[2px] sm:border-[4px] border-black font-black uppercase tracking-widest text-[10px] sm:text-xl transition-all transform ${
                        isBought 
                          ? 'bg-[#E5E5E5] text-black cursor-not-allowed rotate-0'
                          : isUnaffordable
                            ? 'bg-[#E5E5E5] text-black opacity-90 -rotate-1'
                            : 'bg-black text-[#89CFF0] hover:bg-[#89CFF0] hover:text-black active:translate-y-1 rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]'
                      }`}
                    >
                      {isBought ? 'OWNED' : isUnaffordable ? 'DETAILS' : 'DETAILS'}
                    </button>

                    {/* Sold Out Stamp Overlay */}
                    {isBought && (
                      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                        <div className="bg-[#FFE066] text-black font-black text-2xl sm:text-5xl px-2 sm:px-4 py-1 sm:py-2 border-[3px] sm:border-[6px] border-black transform -rotate-12 shadow-[4px_4px_0px_0px_#000] sm:shadow-[6px_6px_0px_0px_#000]">
                          SOLD OUT
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Physical Shelf Lines (Decorative, sits under items) */}
          <div className="absolute top-[320px] left-0 w-full h-[8px] bg-black shadow-[0px_10px_20px_rgba(0,0,0,0.8)] z-0 hidden md:block"></div>
          <div className="absolute top-[660px] left-0 w-full h-[8px] bg-black shadow-[0px_10px_20px_rgba(0,0,0,0.8)] z-0 hidden md:block"></div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, rotate: -2 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.9, y: 20, rotate: 2 }}
              className="relative w-full max-w-sm mt-8"
            >
              {(() => {
                const isBought = purchased[selectedItem.id];
                const canAfford = currency >= selectedItem.cost;
                const isUnaffordable = !isBought && !canAfford;

                return (
                  <>
                    {/* Decorative Tag */}
                    <div className="absolute -top-6 -left-4 z-20 bg-black text-white px-4 py-1 border-[3px] border-white font-black text-lg sm:text-xl transform -rotate-6 shadow-[4px_4px_0px_0px_#89CFF0]">
                      CONFIRM DECODER
                    </div>

                    {/* Shadow Background Layer */}
                    <div
                      className="absolute inset-0 bg-[#FFB3D9] transform translate-x-3 translate-y-3"
                      style={{ clipPath: 'polygon(2% 0, 100% 2%, 98% 100%, 0 98%)' }}
                    />

                    {/* Main Content Card (Clipped) */}
                    <div
                      className="bg-white border-[6px] border-black p-6 sm:p-8 relative z-10 w-full"
                      style={{ clipPath: 'polygon(2% 0, 100% 2%, 98% 100%, 0 98%)' }}
                    >
                      <div className="text-center mt-4">
                        <div className="text-6xl sm:text-7xl mb-4 bg-white w-24 h-24 mx-auto flex items-center justify-center rounded-full border-[4px] border-black shadow-[6px_6px_0px_0px_#D0BFFF]">
                          {selectedItem.icon}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black uppercase mb-4 leading-tight">
                          {selectedItem.name}
                        </h2>
                        <div className="bg-[#FFE066] text-black p-4 mb-6 border-[3px] border-black transform rotate-1 shadow-[4px_4px_0px_0px_#000]">
                          <p className="text-sm sm:text-base font-bold border-l-[4px] border-black pl-3 text-left leading-snug">
                            {selectedItem.desc}
                          </p>
                        </div>

                        {isBought ? (
                          <div className="bg-[#E5E5E5] text-black border-[3px] border-black p-3 mb-5 font-black shadow-[4px_4px_0px_0px_#000] uppercase">
                            ✅ Already owned
                          </div>
                        ) : null}

                        <div className="flex gap-3 sm:gap-4">
                          <button
                            onClick={() => setSelectedItem(null)}
                            className="flex-1 py-3 border-[3px] sm:border-[4px] border-black font-black uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition-colors active:translate-y-1 transform -rotate-1 text-sm sm:text-base"
                          >
                            CANCEL
                          </button>
                          <button
                            onClick={() => {
                              if (isBought || isUnaffordable) return;
                              handleBuy(selectedItem.id, selectedItem.cost);
                              setSelectedItem(null);
                            }}
                            disabled={isBought || isUnaffordable}
                            className={`flex-[1.5] py-3 border-[3px] sm:border-[4px] border-black font-black uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all transform rotate-1 text-sm sm:text-base ${
                              isBought
                                ? 'bg-[#E5E5E5] cursor-not-allowed opacity-90'
                                : isUnaffordable
                                  ? 'bg-[#BDBDBD] cursor-not-allowed opacity-90'
                                  : 'bg-[#89CFF0] hover:bg-[#FFE066] hover:text-black active:translate-y-1 active:shadow-none'
                            }`}
                          >
                            {isBought
                              ? 'OWNED'
                              : isUnaffordable
                                ? 'NOT ENOUGH 💰'
                                : `PAY - ${selectedItem.cost}💰`}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
