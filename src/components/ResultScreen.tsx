import React, { useState, useEffect } from 'react';
import { CSVCard } from '../types';
import { RARITY_CONFIGS } from '../data/cards';
import { CardVisual } from './CardVisual';
import { Share2, Sparkles, RotateCcw, BarChart3, ChevronRight, Download, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../engine/soundManager';

interface ResultScreenProps {
  card: CSVCard;
  unlockedCount: number;
  onOpenShare: () => void;
  onOpenCollection: () => void;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  card,
  unlockedCount,
  onOpenShare,
  onOpenCollection,
  onRestart,
}) => {
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'STATS'>('DETAILS');
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(!soundManager.getMuted());
  const rarityConfig = RARITY_CONFIGS[card.rarity];

  useEffect(() => {
    // Start card's exclusive musical theme
    soundManager.playCardMusic(card.id);
    setIsPlayingMusic(!soundManager.getMuted());
  }, [card.id]);

  const toggleMusic = () => {
    const active = soundManager.toggleCardMusic(card.id);
    setIsPlayingMusic(active);
  };

  const statItems = [
    { label: 'SÁNG TẠO', value: card.stats.sangTao, color: '#00F0FF' },
    { label: 'KẾT NỐI', value: card.stats.ketNoi, color: '#7B61FF' },
    { label: 'KHÁM PHÁ', value: card.stats.khamPha, color: '#FF007A' },
    { label: 'BỨT PHÁ', value: card.stats.butPha, color: '#FF5500' },
    { label: 'CHIẾN LƯỢC', value: card.stats.chienLuoc, color: '#6366F1' },
  ];

  return (
    <div className="relative z-20 min-h-screen flex flex-col justify-between items-center px-4 pt-16 sm:pt-20 pb-6 sm:pb-8 overflow-x-hidden">
      {/* Dynamic Background Ambient Gradient */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 blur-3xl -z-10 transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${card.mauSac.primary}33 0%, ${card.mauSac.secondary}22 45%, transparent 75%)`,
        }}
      />

      {/* Top Header */}
      <div className="w-full max-w-5xl flex flex-wrap justify-between items-center gap-3 z-10 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-tech text-xs sm:text-sm tracking-widest text-cyan-300 font-bold uppercase">
            KẾT QUẢ TRIỆU HỒI CSV VIBE
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Card Music Toggle */}
          <button
            id="result-music-toggle-btn"
            onClick={toggleMusic}
            title={isPlayingMusic ? 'Tắt nhạc nền hệ' : 'Bật nhạc nền hệ'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-tech tracking-wider transition-all cursor-pointer ${
              isPlayingMusic
                ? 'border-cyan-400/60 bg-cyan-950/60 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isPlayingMusic ? (
              <>
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-cyan-400 animate-pulse" />
                  <span className="w-0.5 h-3 bg-cyan-300 animate-bounce" />
                  <span className="w-0.5 h-1.5 bg-cyan-400 animate-pulse" />
                </div>
                <span>NHẠC: HỆ {card.ten.toUpperCase()}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>BẬT NHẠC HỆ</span>
              </>
            )}
          </button>

          <button
            id="result-collection-btn"
            onClick={() => {
              soundManager.playCardSelect();
              onOpenCollection();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/40 bg-[#120e2e]/80 text-purple-300 hover:text-white font-tech text-xs tracking-wider transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>BỘ SƯU TẬP ({unlockedCount}/8)</span>
          </button>
        </div>
      </div>

      {/* Main Content: Split Card Preview + Details / Stats */}
      <div className="my-auto w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
        {/* Left Column: Interactive 3D Card Visual */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative">
            {/* Ambient Radial Halo */}
            <div
              className="absolute -inset-4 rounded-full blur-2xl opacity-60 pointer-events-none"
              style={{ backgroundColor: card.mauSac.primary }}
            />
            <CardVisual
              card={card}
              isFlipped={true}
              size="large"
              interactive={true}
              id="result-card-display"
            />
          </div>
          <div className="mt-3 text-center text-xs font-tech text-slate-400 tracking-wider">
            Di chuột hoặc chạm để nghiêng góc 3D
          </div>
        </div>

        {/* Right Column: Archetype Profile & Stats */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          {/* Header & Title */}
          <div className="space-y-2 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span
                className="px-2.5 py-1 rounded-full text-xs font-tech font-bold tracking-widest border"
                style={{
                  backgroundColor: `${rarityConfig.color}15`,
                  borderColor: `${rarityConfig.color}55`,
                  color: rarityConfig.color,
                }}
              >
                {rarityConfig.stars} {rarityConfig.label}
              </span>
              <span className="text-xs font-tech text-cyan-400 tracking-wider">
                MÃ SỐ: {card.cardNo}
              </span>
            </div>

            <div className="text-xs font-tech text-cyan-400/80 tracking-[0.25em] uppercase">
              BẠN THUỘC HỆ…
            </div>

            <h1
              className="text-3xl sm:text-5xl font-display font-extrabold uppercase text-white tracking-wide"
              style={{
                textShadow: `0 0 20px ${card.mauSac.primary}`,
              }}
            >
              {card.ten}
            </h1>

            <p className="text-base sm:text-lg text-cyan-200/90 italic font-medium pt-1">
              &ldquo;{card.tagline}&rdquo;
            </p>
          </div>

          {/* Tab Selector: Hồ sơ vibe vs Chỉ số game */}
          <div className="flex items-center gap-3 border-b border-white/10 pb-2">
            <button
              onClick={() => {
                setActiveTab('DETAILS');
                soundManager.playCardHover();
              }}
              className={`pb-2 font-tech text-xs sm:text-sm tracking-wider uppercase transition-all border-b-2 cursor-pointer ${
                activeTab === 'DETAILS'
                  ? 'text-cyan-300 border-cyan-400 font-bold'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              ✦ HỒ SƠ VIBE CỦA BẠN
            </button>
            <button
              onClick={() => {
                setActiveTab('STATS');
                soundManager.playCardHover();
              }}
              className={`pb-2 font-tech text-xs sm:text-sm tracking-wider uppercase transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'STATS'
                  ? 'text-cyan-300 border-cyan-400 font-bold'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>YOUR CSV STATS</span>
            </button>
          </div>

          {/* TAB 1: DETAILS & DESCRIPTION */}
          {activeTab === 'DETAILS' && (
            <div className="space-y-4 animate-[fade-in_0.4s_ease-out]">
              <div>
                <div className="text-xs font-tech text-slate-400 tracking-wider uppercase mb-2">
                  TỪ KHÓA ĐẶC TRƯNG
                </div>
                <div className="flex flex-wrap gap-2">
                  {card.diemManh.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-tech font-semibold tracking-wider border"
                      style={{
                        backgroundColor: `${card.mauSac.primary}18`,
                        borderColor: `${card.mauSac.primary}44`,
                        color: '#F5F7FF',
                      }}
                    >
                      ✦ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#070b1e]/70 border border-cyan-500/20 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
                <div className="text-xs font-tech text-cyan-400 tracking-wider uppercase mb-2">
                  MÔ TẢ NĂNG LƯỢNG
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {card.moTa}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: YOUR CSV STATS */}
          {activeTab === 'STATS' && (
            <div className="space-y-3.5 animate-[fade-in_0.4s_ease-out]">
              <div className="text-xs font-tech text-slate-400 tracking-wider uppercase">
                CHỈ SỐ TẦN SỐ VIBE (GAME VISUALIZATION)
              </div>

              <div className="space-y-2.5 bg-[#070b1e]/70 border border-cyan-500/20 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
                {statItems.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-tech">
                      <span className="text-slate-300 font-semibold">{stat.label}</span>
                      <span className="text-cyan-300 font-bold">{stat.value}%</span>
                    </div>
                    <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${stat.value}%`,
                          backgroundColor: stat.color,
                          boxShadow: `0 0 10px ${stat.color}`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div className="text-[10px] font-tech text-slate-400 pt-2 border-t border-slate-800">
                  * Các chỉ số này mang tính chất trải nghiệm game gacha, đại diện cho vibe tỏa sáng của bạn trong sự kiện CSV 2026.
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              id="result-download-btn"
              onClick={() => {
                soundManager.playCardSelect();
                onOpenShare();
              }}
              className="flex-1 py-3.5 px-5 rounded-xl font-tech font-bold text-xs sm:text-sm tracking-wider uppercase text-black bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>TẢI ẢNH THẺ (PNG)</span>
            </button>

            <button
              id="result-share-btn"
              onClick={() => {
                soundManager.playCardSelect();
                onOpenShare();
              }}
              className="py-3.5 px-5 rounded-xl font-tech font-bold text-xs sm:text-sm tracking-wider uppercase text-white bg-purple-600 hover:bg-purple-500 border border-purple-400/40 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>CHIA SẺ</span>
            </button>

            <button
              id="result-restart-btn"
              onClick={() => {
                soundManager.stopCardMusic();
                soundManager.playCardSelect();
                onRestart();
              }}
              className="py-3.5 px-5 rounded-xl font-tech font-bold text-xs sm:text-sm tracking-wider uppercase text-slate-200 border border-slate-700 bg-[#070b1e]/80 hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>BỐC LẠI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
