import React, { useState } from 'react';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { CardVisual } from './CardVisual';
import { soundManager } from '../engine/soundManager';

interface IntroScreenProps {
  onStart: () => void;
  onOpenCollection: () => void;
  unlockedCount: number;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStart,
  onOpenCollection,
  unlockedCount,
}) => {
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsBtnHovered(true);
    soundManager.playCardHover();
  };

  const handleMouseLeave = () => {
    setIsBtnHovered(false);
  };

  const handleStart = () => {
    soundManager.playCardSelect();
    soundManager.playIntroMusic();
    onStart();
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col justify-between items-center px-4 pt-16 sm:pt-20 pb-6 sm:pb-10 text-center">
      {/* Top Bar with Event Badge and Collection Shortcut */}
      <div className="w-full max-w-6xl flex justify-between items-center z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-[#070b1e]/60 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-tech text-xs tracking-widest text-cyan-300 font-bold">
            CSV VIBE SUMMON SYSTEM 2026
          </span>
        </div>

        <button
          id="intro-collection-btn"
          onClick={onOpenCollection}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/40 bg-[#120e2e]/70 backdrop-blur-md text-purple-300 hover:text-white hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all font-tech text-xs tracking-wider cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>BỘ SƯU TẬP ({unlockedCount}/8)</span>
        </button>
      </div>

      {/* Center Giant Floating Card with Holographic Border */}
      <div className="my-auto flex flex-col items-center justify-center relative py-6">
        {/* Ambient Halo Behind Card */}
        <div
          className={`absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            isBtnHovered
              ? 'bg-gradient-to-r from-cyan-400/40 via-purple-500/50 to-blue-500/40 scale-125'
              : 'bg-gradient-to-r from-cyan-500/20 via-purple-600/20 to-blue-600/20 scale-100'
          }`}
        />

        {/* Slow Floating Card Component */}
        <div className="animate-[bounce_6s_ease-in-out_infinite] transition-transform duration-500">
          <CardVisual
            isFlipped={false}
            size="intro"
            highlighted={isBtnHovered}
            interactive={true}
            onHover={() => soundManager.playCardHover()}
            id="intro-giant-card"
          />
        </div>

        {/* Title Typography */}
        <div className="mt-8 sm:mt-10 max-w-2xl px-2">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-tech text-cyan-400 tracking-[0.25em] uppercase mb-2">
            <Compass className="w-4 h-4 animate-spin [animation-duration:10s]" />
            EXPERIENCE GACHA CHARACTER SUMMON
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight uppercase text-white drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]">
            BỐC BÀI VIBE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">CSV</span>
          </h1>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-wide text-cyan-200 mt-2">
            BẠN THUỘC HỆ NÀO?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-medium mt-3 tracking-wide">
            Quét vibe. Chọn bài. Khám phá chính mình.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-7 sm:mt-8">
          <button
            id="start-experience-btn"
            onClick={handleStart}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-3.5 sm:py-4 rounded-xl font-tech text-base sm:text-lg font-bold tracking-[0.18em] text-white uppercase overflow-hidden border border-cyan-400/80 bg-gradient-to-r from-cyan-500/30 via-blue-600/40 to-purple-600/30 backdrop-blur-md shadow-[0_0_30px_rgba(0,240,255,0.35)] hover:shadow-[0_0_50px_rgba(0,240,255,0.8)] hover:border-cyan-300 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            {/* Shimmer line passing through button */}
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            <span className="relative z-10 flex items-center gap-3">
              <span className="text-cyan-300 group-hover:rotate-90 transition-transform duration-300">✦</span>
              KHỞI ĐỘNG TRẢI NGHIỆM
              <span className="text-cyan-300 group-hover:-rotate-90 transition-transform duration-300">✦</span>
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Privacy Assurance */}
      <div className="relative z-10 flex items-center justify-center gap-2 text-slate-400 text-xs font-tech pt-4 max-w-lg mx-auto">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Camera chỉ quét biometric vibe cục bộ trên trình duyệt. Không nhận diện danh tính và không lưu trữ hình ảnh.</span>
      </div>
    </div>
  );
};
