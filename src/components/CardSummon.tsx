import React, { useState, useEffect } from 'react';
import { CSVCard } from '../types';
import { CardVisual } from './CardVisual';
import { soundManager } from '../engine/soundManager';
import { Sparkles } from 'lucide-react';

interface CardSummonProps {
  cards: CSVCard[];
  onSelectCard: (card: CSVCard) => void;
}

const AURA_COLORS = [
  'rgba(0, 240, 255, 0.8)', // Cyan
  'rgba(168, 85, 247, 0.85)', // Violet
  'rgba(255, 184, 0, 0.85)', // Gold/Amber
];

export const CardSummon: React.FC<CardSummonProps> = ({
  cards,
  onSelectCard,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(1); // default center card on mobile

  useEffect(() => {
    soundManager.playCardSummon();
  }, []);

  const handleCardClick = (card: CSVCard, index: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    soundManager.playCardSelect();

    // After snappy selection animation, immediately open reveal
    setTimeout(() => {
      onSelectCard(card);
    }, 350);
  };

  const handleHover = () => {
    if (selectedIndex === null) {
      soundManager.playCardHover();
    }
  };

  return (
    <div className="relative z-20 min-h-screen flex flex-col justify-between items-center px-4 pt-16 sm:pt-20 pb-8 overflow-hidden">
      {/* Top Section Header */}
      <div className="text-center z-10 pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-[#070b1e]/80 text-cyan-300 font-tech text-xs tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>FATE INTERSECTION</span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-white uppercase drop-shadow-md">
          {selectedIndex !== null ? (
            <span className="text-cyan-300 text-glow-cyan">BẠN ĐÃ CHỌN…</span>
          ) : (
            <>
              BA LÁ BÀI. <span className="text-cyan-400">MỘT LỰA CHỌN.</span>
            </>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide mt-2">
          {selectedIndex !== null
            ? 'Đang tập hợp năng lượng vũ trụ để khai mở hệ CSV…'
            : 'Chọn lá bài bạn cảm thấy "đúng" nhất với tần số vibe của mình.'}
        </p>
      </div>

      {/* Center 3 Cards Display Area */}
      <div className="my-auto w-full max-w-6xl flex flex-col items-center justify-center relative py-6">
        {/* Ambient Cosmic Aura Behind All Cards */}
        <div className="absolute w-[500px] sm:w-[700px] h-[300px] sm:h-[400px] rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-600/15 to-blue-500/10 blur-3xl pointer-events-none" />

        {/* Desktop & Tablet Layout (Horizontal Triad) */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-10 relative">
          {cards.map((card, idx) => {
            const isChosen = selectedIndex === idx;
            const isOther = selectedIndex !== null && !isChosen;

            return (
              <div
                key={card.id}
                className={`transition-all duration-700 ease-out transform ${
                  isChosen
                    ? 'scale-110 z-40 translate-y-[-10px]'
                    : isOther
                    ? 'opacity-15 scale-90 blur-sm pointer-events-none'
                    : 'hover:-translate-y-4'
                }`}
                style={{
                  transitionDelay: `${idx * 80}ms`,
                }}
              >
                {/* Floating Aura Beam */}
                <div
                  className="absolute -top-10 left-1/2 -translate-x-1/2 text-cyan-300 text-xs font-tech tracking-widest opacity-75 pointer-events-none"
                >
                  ✦ VIBE {idx + 1} ✦
                </div>

                <CardVisual
                  isFlipped={false}
                  size="normal"
                  glowAura={AURA_COLORS[idx % AURA_COLORS.length]}
                  interactive={selectedIndex === null}
                  onClick={() => handleCardClick(card, idx)}
                  onHover={handleHover}
                  id={`summon-card-${idx}`}
                />
              </div>
            );
          })}
        </div>

        {/* Mobile Layout (Interactive Card Carousel with Tap & Select) */}
        <div className="flex md:hidden flex-col items-center w-full max-w-sm">
          {/* Card Mobile Dots Selector */}
          {selectedIndex === null && (
            <div className="flex items-center gap-3 mb-4">
              {cards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveMobileIndex(idx);
                    soundManager.playCardHover();
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeMobileIndex === idx
                      ? 'w-7 bg-cyan-400 shadow-[0_0_10px_#00F0FF]'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  aria-label={`Chọn lá bài ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Active Mobile Card */}
          <div className="relative flex justify-center items-center py-2">
            {cards.map((card, idx) => {
              const isChosen = selectedIndex === idx;
              const isOther = selectedIndex !== null && !isChosen;
              const isMobileActive = activeMobileIndex === idx;

              if (selectedIndex === null && !isMobileActive) return null;

              return (
                <div
                  key={card.id}
                  className={`transition-all duration-500 ease-out transform ${
                    isChosen
                      ? 'scale-105 z-30'
                      : isOther
                      ? 'opacity-0 scale-75'
                      : ''
                  }`}
                >
                  <CardVisual
                    isFlipped={false}
                    size="normal"
                    glowAura={AURA_COLORS[idx % AURA_COLORS.length]}
                    interactive={selectedIndex === null}
                    onClick={() => handleCardClick(card, idx)}
                    id={`mobile-summon-card-${idx}`}
                  />

                  {selectedIndex === null && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => handleCardClick(card, idx)}
                        className="w-full py-2.5 px-6 rounded-xl font-tech text-xs tracking-widest font-bold uppercase text-black bg-cyan-300 hover:bg-cyan-200 shadow-[0_0_15px_#00F0FF] transition-all cursor-pointer"
                      >
                        CHỌN LÁ NÀY (VIBE {idx + 1})
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Technical Indicator */}
      <div className="relative z-10 text-center text-slate-400 text-xs font-tech tracking-wider">
        <span>GACHA SUMMON PROBABILITY: EQUAL RANDOM DISTRIBUTION</span>
      </div>
    </div>
  );
};
