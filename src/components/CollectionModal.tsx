import React, { useState } from 'react';
import { CSV_CARDS, RARITY_CONFIGS } from '../data/cards';
import { CSVCard } from '../types';
import { CardVisual } from './CardVisual';
import { X, Sparkles, Lock, CheckCircle2, Volume2 } from 'lucide-react';
import { soundManager } from '../engine/soundManager';

interface CollectionModalProps {
  discoveredIds: string[];
  onClose: () => void;
  onInspectCard?: (card: CSVCard) => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  discoveredIds,
  onClose,
}) => {
  const [selectedInspectCard, setSelectedInspectCard] = useState<CSVCard | null>(null);

  const discoveredSet = new Set(discoveredIds);
  const progressPercent = Math.round((discoveredIds.length / CSV_CARDS.length) * 100);

  const handleCardClick = (card: CSVCard, isUnlocked: boolean) => {
    if (!isUnlocked) {
      soundManager.playCardHover();
      return;
    }
    soundManager.playCardMusic(card.id);
    setSelectedInspectCard(card);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-[fade-in_0.3s_ease-out]">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#050818] border border-cyan-500/40 rounded-3xl p-5 sm:p-8 flex flex-col shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex justify-between items-start pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-tech text-xs tracking-widest uppercase">
              <Sparkles className="w-4 h-4" />
              <span>CSV ARCANA ARCHIVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white uppercase mt-1">
              BỘ SƯU TẬP VIBE CSV
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="font-tech text-xs sm:text-sm text-cyan-300 font-bold tracking-wider">
                {discoveredIds.length} / {CSV_CARDS.length} VIBE ĐÃ KHÁM PHÁ
              </span>
              <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playCardHover();
              onClose();
            }}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content: Grid of 8 Cards or Detail View */}
        <div className="flex-1 overflow-y-auto py-6 pr-1">
          {selectedInspectCard ? (
            /* INSPECT UNLOCKED CARD */
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-4 animate-[fade-in_0.3s_ease-out]">
              <CardVisual
                card={selectedInspectCard}
                isFlipped={true}
                size="large"
                interactive={true}
              />

              <div className="max-w-md space-y-4 text-left">
                <div>
                  <button
                    onClick={() => setSelectedInspectCard(null)}
                    className="text-xs font-tech text-cyan-400 hover:text-cyan-300 mb-2 flex items-center gap-1 cursor-pointer"
                  >
                    ← QUAY LẠI DANH SÁCH BỘ SƯU TẬP
                  </button>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded text-xs font-tech font-bold"
                      style={{
                        backgroundColor: `${RARITY_CONFIGS[selectedInspectCard.rarity].color}22`,
                        color: RARITY_CONFIGS[selectedInspectCard.rarity].color,
                      }}
                    >
                      {RARITY_CONFIGS[selectedInspectCard.rarity].stars}{' '}
                      {RARITY_CONFIGS[selectedInspectCard.rarity].label}
                    </span>
                    <span className="text-xs font-tech text-slate-400">
                      {selectedInspectCard.cardNo}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1 uppercase">
                    {selectedInspectCard.ten}
                  </h3>
                  <p className="text-sm text-cyan-200 italic mt-1">
                    &ldquo;{selectedInspectCard.tagline}&rdquo;
                  </p>
                </div>

                <div className="bg-[#0b1028] border border-cyan-500/20 rounded-xl p-4">
                  <div className="text-xs font-tech text-cyan-400 tracking-wider uppercase mb-1">
                    MÔ TẢ HỆ
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {selectedInspectCard.moTa}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={() => soundManager.playCardMusic(selectedInspectCard.id)}
                    className="px-3.5 py-2 rounded-xl font-tech text-xs text-black font-bold bg-gradient-to-r from-cyan-300 to-sky-400 hover:from-cyan-200 hover:to-sky-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>PHÁT NHẠC HỆ NÀY</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* 8 CARDS GRID */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
              {CSV_CARDS.map((card) => {
                const isUnlocked = discoveredSet.has(card.id);
                const rarityConfig = RARITY_CONFIGS[card.rarity];

                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card, isUnlocked)}
                    className={`relative w-full max-w-[200px] h-[280px] sm:h-[300px] rounded-2xl p-3 border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
                      isUnlocked
                        ? 'border-cyan-400/60 bg-gradient-to-b from-[#0e163d] to-[#06091e] shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:scale-105 hover:border-cyan-300'
                        : 'border-slate-800 bg-[#050818]/60 opacity-60 hover:opacity-80'
                    }`}
                  >
                    {isUnlocked ? (
                      /* UNLOCKED CARD MINI VIEW */
                      <>
                        <div className="flex justify-between items-center text-[10px] font-tech">
                          <span className="text-cyan-300 font-bold">{card.cardNo}</span>
                          <span style={{ color: rarityConfig.color }}>
                            {rarityConfig.stars}
                          </span>
                        </div>

                        <div className="my-auto flex flex-col items-center justify-center text-center">
                          <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl border mb-2 shadow-inner"
                            style={{
                              borderColor: `${card.mauSac.primary}66`,
                              backgroundColor: `${card.mauSac.primary}18`,
                            }}
                          >
                            {card.symbol}
                          </div>
                          <div className="text-xs sm:text-sm font-display font-bold uppercase text-white tracking-wide">
                            {card.ten}
                          </div>
                          <div className="text-[9px] font-tech text-cyan-300 uppercase tracking-widest mt-0.5">
                            {card.he}
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-1 text-[10px] font-tech text-emerald-400 border-t border-white/10 pt-2">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ĐÃ KHÁM PHÁ</span>
                        </div>
                      </>
                    ) : (
                      /* LOCKED CARD MINI VIEW */
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-2">
                        <div className="w-14 h-14 rounded-full border border-slate-700 bg-slate-900/80 flex items-center justify-center text-slate-500 mb-3">
                          <Lock className="w-6 h-6" />
                        </div>
                        <div className="text-base font-tech font-bold text-slate-500">
                          ???
                        </div>
                        <div className="text-[10px] font-tech text-slate-600 mt-1 uppercase tracking-wider">
                          CHƯA MỞ KHÓA
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs font-tech text-slate-400">
          <span>* Chơi lại nhiều lần để triệu hồi đầy đủ 8 hệ vibe độc quyền</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-all cursor-pointer"
          >
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
