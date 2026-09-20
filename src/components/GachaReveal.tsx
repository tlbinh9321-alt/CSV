import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CSVCard } from '../types';
import { RARITY_CONFIGS } from '../data/cards';
import { CardVisual } from './CardVisual';
import { soundManager } from '../engine/soundManager';
import { ArrowRight, Sparkles, FastForward, Zap } from 'lucide-react';

interface GachaRevealProps {
  card: CSVCard;
  onRevealFinished: () => void;
}

type RevealPhase =
  | 'CHARGE' // 1. Card tremble & energy gathering
  | 'BURST' // 2. Light beam trace
  | 'FLIP' // 3. 3D Flip
  | 'FLASH' // 4. Screen flash
  | 'REVEAL'; // 5 & 6. Particle explosion & revealed card

export const GachaReveal: React.FC<GachaRevealProps> = ({
  card,
  onRevealFinished,
}) => {
  const [phase, setPhase] = useState<RevealPhase>('CHARGE');
  const [showFlash, setShowFlash] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(20);
  const hasTriggeredConfetti = useRef(false);

  const rarityConfig = RARITY_CONFIGS[card.rarity];
  const isLegendary = card.rarity === 'HUYEN_THOAI';
  const isEpic = card.rarity === 'SU_THI';

  const fireConfetti = () => {
    if (hasTriggeredConfetti.current) return;
    hasTriggeredConfetti.current = true;

    try {
      const colors = [
        card.mauSac.primary,
        card.mauSac.secondary,
        '#FFFFFF',
        rarityConfig.color,
      ];

      confetti({
        particleCount: isLegendary ? 140 : isEpic ? 90 : 50,
        spread: isLegendary ? 120 : 80,
        origin: { y: 0.6 },
        colors: colors,
        disableForReducedMotion: true,
      });

      if (isLegendary) {
        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 60,
            origin: { x: 0.1, y: 0.7 },
            colors: colors,
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 60,
            origin: { x: 0.9, y: 0.7 },
            colors: colors,
          });
        }, 300);
      }
    } catch {}
  };

  const triggerInstantReveal = () => {
    setChargeProgress(100);
    setPhase('REVEAL');
    soundManager.playReveal(card.rarity);
    soundManager.playCardMusic(card.id);
    fireConfetti();
  };

  useEffect(() => {
    // 1. CHARGE (0ms)
    soundManager.playCardCharge();

    // Fast charge progress counter (20% -> 100% in ~450ms)
    const chargeInterval = setInterval(() => {
      setChargeProgress((prev) => {
        if (prev >= 100) {
          clearInterval(chargeInterval);
          return 100;
        }
        return prev + 25;
      });
    }, 80);

    // 2. BURST (150ms)
    const burstTimer = setTimeout(() => {
      setPhase('BURST');
    }, 150);

    // 3. ULTRA-FAST WHITE FLASH (240ms - IMMEDIATELY BEFORE CARD FLIP)
    const preFlipFlashTimer = setTimeout(() => {
      setShowFlash(true);
      soundManager.playPreFlipFlash();
    }, 240);

    // 4. FLIP (320ms - executes during the blinding flash energy peak)
    const flipTimer = setTimeout(() => {
      setPhase('FLIP');
      setTimeout(() => setShowFlash(false), 90); // Quick 90ms fade-out
    }, 320);

    // 5. REVEAL & PARTICLES & CARD SIGNATURE SOUND (480ms)
    const revealTimer = setTimeout(() => {
      setChargeProgress(100);
      setPhase('REVEAL');
      soundManager.playReveal(card.rarity);
      soundManager.playCardMusic(card.id);
      fireConfetti();
    }, 480);

    return () => {
      clearInterval(chargeInterval);
      clearTimeout(burstTimer);
      clearTimeout(preFlipFlashTimer);
      clearTimeout(flipTimer);
      clearTimeout(revealTimer);
    };
  }, [card, isLegendary, isEpic, rarityConfig.color]);

  return (
    <div
      className={`relative z-20 min-h-screen flex flex-col justify-between items-center px-4 pt-16 sm:pt-20 pb-8 overflow-hidden transition-colors duration-700 ${
        phase === 'REVEAL' ? 'bg-[#020512]' : 'bg-[#040616]'
      }`}
    >
      {/* ULTRA-FAST EXPLOSIVE WHITE FLASH OVERLAY (Mô phỏng năng lượng bùng nổ trước khi lật bài) */}
      <div
        className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-100 ease-out flex items-center justify-center ${
          showFlash ? 'opacity-100 bg-white' : 'opacity-0 bg-transparent'
        }`}
      >
        {showFlash && (
          <div className="w-[800px] h-[800px] rounded-full bg-cyan-200/90 blur-3xl animate-ping" />
        )}
      </div>

      {/* Top Banner & Charging Progress Bar */}
      <div className="w-full max-w-md flex flex-col items-center z-10 pt-1 space-y-2">
        <div
          className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full border text-xs font-tech tracking-widest uppercase transition-all duration-300 ${
            phase === 'REVEAL'
              ? 'bg-[#080d26]/80 text-cyan-300 border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
              : 'bg-black/50 text-cyan-400 border-cyan-500/40'
          }`}
        >
          {phase === 'REVEAL' ? (
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          ) : (
            <Zap className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          )}
          <span>
            {phase === 'REVEAL'
              ? `GACHA SUMMON COMPLETE — ${rarityConfig.label}`
              : `KHAI MỞ NĂNG LƯỢNG VIBE (${Math.min(chargeProgress, 100)}%)`}
          </span>
        </div>

        {/* Real-time charging progress meter */}
        {phase !== 'REVEAL' && (
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 bg-[#090f26] h-2 rounded-full overflow-hidden border border-cyan-500/30 p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-500 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_#00F0FF]"
                style={{ width: `${Math.min(chargeProgress, 100)}%` }}
              />
            </div>
            <button
              onClick={triggerInstantReveal}
              className="text-[11px] font-tech text-cyan-300 hover:text-white flex items-center gap-1 px-2.5 py-0.5 rounded border border-cyan-500/40 bg-cyan-950/60 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              <span>XEM NGAY</span>
              <FastForward className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Center Card Stage with 3D Gacha Animation */}
      <div className="my-auto relative flex flex-col items-center justify-center py-2 sm:py-4">
        {/* Legendary Cinematic Shockwaves & Rays */}
        {isLegendary && phase === 'REVEAL' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-gradient-to-r from-amber-400/20 via-cyan-400/20 to-purple-500/20 blur-3xl animate-pulse" />
            <div className="w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full border border-amber-400/30 animate-ping [animation-duration:2s]" />
          </div>
        )}

        {/* The Animated Card Object */}
        <div
          className={`transition-all duration-400 ease-out transform ${
            phase === 'CHARGE'
              ? 'animate-[ping_0.12s_ease-in-out_infinite_alternate] scale-95'
              : phase === 'BURST'
              ? 'scale-105 shadow-[0_0_50px_#00F0FF]'
              : phase === 'FLIP'
              ? 'rotate-y-180 scale-100'
              : 'scale-100 animate-[fade-in_0.3s_ease-out]'
          }`}
        >
          <CardVisual
            card={card}
            isFlipped={phase === 'REVEAL'}
            size="large"
            interactive={phase === 'REVEAL'}
            highlighted={true}
            id="gacha-reveal-card"
          />
        </div>

        {/* Reveal Title & Rarity Banner */}
        {phase === 'REVEAL' && (
          <div className="mt-5 text-center animate-[scale-up_0.4s_ease-out]">
            <div
              className="text-xs sm:text-sm font-tech tracking-[0.3em] font-bold uppercase mb-1"
              style={{ color: rarityConfig.color }}
            >
              {rarityConfig.stars} {rarityConfig.label}
            </div>

            <h1
              className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold uppercase text-white tracking-wide drop-shadow-md"
              style={{
                textShadow: `0 0 25px ${card.mauSac.primary}`,
              }}
            >
              {card.ten}
            </h1>
          </div>
        )}
      </div>

      {/* Bottom CTA to view full results */}
      <div className="relative z-10 w-full max-w-sm flex justify-center pb-2">
        {phase === 'REVEAL' && (
          <button
            id="reveal-view-results-btn"
            onClick={onRevealFinished}
            className="w-full py-4 px-8 rounded-2xl font-tech font-bold text-sm sm:text-base tracking-[0.2em] uppercase text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer animate-[fade-in_0.4s_ease-out]"
          >
            <span>KHÁM PHÁ CHI TIẾT HỆ</span>
            <ArrowRight className="w-5 h-5 text-cyan-200" />
          </button>
        )}
      </div>
    </div>
  );
};
