import React, { useRef, useState, MouseEvent } from 'react';
import { CSVCard } from '../types';
import { RARITY_CONFIGS } from '../data/cards';
import { CardMascotArt } from './CardMascotArt';

interface CardVisualProps {
  card?: CSVCard;
  isFlipped?: boolean; // false = face down, true = face up
  size?: 'mini' | 'normal' | 'large' | 'intro';
  interactive?: boolean;
  highlighted?: boolean;
  glowAura?: string;
  onClick?: () => void;
  onHover?: () => void;
  id?: string;
}

export const CardVisual: React.FC<CardVisualProps> = ({
  card,
  isFlipped = true,
  size = 'normal',
  interactive = true,
  highlighted = false,
  glowAura,
  onClick,
  onHover,
  id,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 12;
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);
    setShinePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
    onHover?.();
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setShinePos({ x: 50, y: 50 });
  };

  // Dimensions based on size
  const sizeClasses = {
    mini: 'w-[140px] h-[220px] rounded-xl',
    normal: 'w-[250px] sm:w-[280px] h-[400px] sm:h-[450px] rounded-2xl',
    large: 'w-[300px] sm:w-[350px] md:w-[380px] h-[490px] sm:h-[570px] md:h-[620px] rounded-3xl',
    intro: 'w-[270px] sm:w-[320px] md:w-[360px] h-[440px] sm:h-[520px] md:h-[580px] rounded-3xl',
  }[size];

  const rarityConfig = card ? RARITY_CONFIGS[card.rarity] : RARITY_CONFIGS.HUYEN_THOAI;
  const primaryColor = card ? card.mauSac.primary : '#00F0FF';
  const accentGlow = glowAura || (card ? card.mauSac.glow : 'rgba(0, 240, 255, 0.7)');

  return (
    <div
      id={id}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
      className={`relative select-none transition-transform duration-200 ease-out cursor-pointer ${
        interactive ? 'hover:scale-[1.03] active:scale-[0.98]' : ''
      }`}
    >
      <div
        className={`relative ${sizeClasses} preserve-3d transition-all duration-300 shadow-2xl overflow-hidden border border-white/10`}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          boxShadow: isHovered || highlighted
            ? `0 0 35px ${accentGlow}, 0 20px 50px rgba(0,0,0,0.8)`
            : `0 0 15px ${accentGlow.replace('0.8', '0.2').replace('0.7', '0.2')}, 0 15px 35px rgba(0,0,0,0.7)`,
        }}
      >
        {/* Dynamic Holographic Foil Overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 mix-blend-color-dodge"
          style={{
            opacity: isHovered ? 0.65 : 0.3,
            background: `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, rgba(255,255,255,0.7) 0%, rgba(0,240,255,0.4) 30%, rgba(123,97,255,0.3) 60%, transparent 80%)`,
          }}
        />

        {/* Shiny Edge Border Light */}
        <div className="absolute inset-0 rounded-[inherit] border border-cyan-400/40 pointer-events-none z-20" />
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-20"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, rgba(0,240,255,0.3) 80%, rgba(255,255,255,0.2) 100%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            padding: '2px',
          }}
        />

        {/* ============================================================== */}
        {/* CARD BACK (FACE DOWN) */}
        {/* ============================================================== */}
        {!isFlipped && (
          <div className="absolute inset-0 w-full h-full bg-[#070b1e] flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden">
            {/* Background Circuit Grid & Runes */}
            <div className="absolute inset-0 opacity-20 cyber-grid pointer-events-none" />
            
            {/* Decorative Corner Brackets */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

            {/* Top Bar */}
            <div className="relative z-10 w-full flex justify-between items-center text-[10px] sm:text-xs font-tech tracking-widest text-cyan-400/70 border-b border-cyan-500/20 pb-2">
              <span className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                CSV ARCANA
              </span>
              <span className="text-white/40">GEN-2026</span>
            </div>

            {/* Center Sacred Cosmic Seal / Sigil */}
            <div className="relative my-auto flex flex-col items-center justify-center">
              {/* Outer Rotating Energy Ring */}
              <div
                className="w-36 h-36 sm:w-48 sm:h-48 rounded-full border border-cyan-400/30 border-dashed animate-[spin_20s_linear_infinite] flex items-center justify-center pointer-events-none"
                style={{
                  boxShadow: `0 0 25px ${primaryColor}40`,
                }}
              >
                {/* Inner Counter-Rotating Hexagram */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-purple-500/40 animate-[spin_15s_linear_infinite_reverse] flex items-center justify-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-cyan-300/50 flex items-center justify-center bg-[#0d1435]/80 backdrop-blur-sm shadow-inner">
                    {/* Pulsing Core */}
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center shadow-[0_0_20px_#00F0FF] animate-pulse"
                    >
                      <span className="font-tech font-bold text-black text-sm sm:text-base tracking-tighter">
                        CSV
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Runic Cross Lines */}
              <div className="absolute w-44 sm:w-56 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />
              <div className="absolute h-44 sm:h-56 w-0.5 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

              <div className="mt-4 text-center">
                <div className="text-[11px] sm:text-xs font-tech tracking-[0.25em] text-cyan-300 font-semibold text-glow-cyan uppercase">
                  NĂNG LƯỢNG ẨN
                </div>
                <div className="text-[9px] font-tech tracking-wider text-slate-400 mt-0.5">
                  CHƯA KHAI MỞ
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative z-10 w-full flex justify-between items-center text-[10px] sm:text-xs font-tech text-cyan-400/60 border-t border-cyan-500/20 pt-2">
              <span>AUTHENTIC VIBE</span>
              <span className="text-white/40">✦ ✦ ✦ ✦</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* CARD FRONT (FACE UP) */}
        {/* ============================================================== */}
        {isFlipped && card && (
          <div
            className={`absolute inset-0 w-full h-full bg-gradient-to-b ${card.mauSac.bgGradient} flex flex-col justify-between p-3.5 sm:p-5 overflow-hidden`}
          >
            {/* Ambient Background Glow behind emblem */}
            <div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-60"
              style={{ backgroundColor: card.mauSac.primary }}
            />

            {/* Top Header: Card No, CSV Brand & Rarity */}
            <div className="relative z-10 w-full flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5 font-tech text-[10px] sm:text-xs tracking-wider text-white/80">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-bold">
                  {card.cardNo}
                </span>
                <span className="text-white/40">CSV EVENT</span>
              </div>
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-tech font-bold tracking-wider"
                style={{
                  backgroundColor: `${rarityConfig.color}22`,
                  color: rarityConfig.color,
                  border: `1px solid ${rarityConfig.color}66`,
                }}
              >
                <span>{rarityConfig.stars}</span>
                <span>{rarityConfig.label}</span>
              </div>
            </div>

            {/* Center: Dynamic Vector Archetype Emblem & Playful Mascot */}
            <div className="relative z-10 my-auto flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center">
                {/* Outer spinning aura ring */}
                <div
                  className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border border-white/20 border-dashed animate-[spin_24s_linear_infinite] pointer-events-none absolute"
                  style={{
                    borderColor: `${card.mauSac.primary}66`,
                    boxShadow: `0 0 25px ${card.mauSac.glow}`,
                  }}
                />

                {/* Mascot Graphic Visual */}
                <div className="relative z-10 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                  <CardMascotArt
                    cardId={card.id}
                    size={size === 'large' ? 'lg' : size === 'intro' ? 'md' : 'sm'}
                  />
                </div>
              </div>

              {/* Archetype Title */}
              <div className="mt-4 sm:mt-5 text-center">
                <h3
                  className="text-lg sm:text-xl md:text-2xl font-display font-extrabold tracking-wider uppercase text-white drop-shadow-md"
                  style={{
                    textShadow: `0 0 15px ${card.mauSac.primary}`,
                  }}
                >
                  {card.ten}
                </h3>
                <div className="text-[10px] sm:text-xs font-tech tracking-[0.2em] text-cyan-300 font-medium uppercase mt-0.5 opacity-90">
                  {card.he} ARCHETYPE
                </div>
              </div>
            </div>

            {/* Bottom Content: Tagline & Keywords */}
            <div className="relative z-10 space-y-2 border-t border-white/10 pt-2.5">
              <p className="text-[11px] sm:text-xs text-center text-slate-200/90 italic font-medium line-clamp-2 px-1">
                &ldquo;{card.tagline}&rdquo;
              </p>

              {/* Keywords chips */}
              <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 pt-1">
                {card.diemManh.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-tech tracking-wide border"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      borderColor: `${card.mauSac.primary}44`,
                      color: '#F5F7FF',
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
