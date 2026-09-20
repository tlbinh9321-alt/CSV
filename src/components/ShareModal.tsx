import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CSVCard } from '../types';
import { RARITY_CONFIGS } from '../data/cards';
import { X, Download, Share2, Check, Sparkles, Smartphone, Square } from 'lucide-react';
import { soundManager } from '../engine/soundManager';

interface ShareModalProps {
  card: CSVCard;
  onClose: () => void;
}

type ShareFormat = 'SQUARE' | 'STORY';

export const ShareModal: React.FC<ShareModalProps> = ({ card, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [format, setFormat] = useState<ShareFormat>('SQUARE');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const rarityConfig = RARITY_CONFIGS[card.rarity];

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRendering(true);

    const isStory = format === 'STORY';
    const width = 1080;
    const height = isStory ? 1920 : 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Deep Space Futuristic Background
    const bgGradient = ctx.createRadialGradient(
      width / 2,
      isStory ? height * 0.32 : height * 0.32,
      80,
      width / 2,
      height / 2,
      width * 0.8
    );
    bgGradient.addColorStop(0, '#0c163b');
    bgGradient.addColorStop(0.5, '#070b1e');
    bgGradient.addColorStop(1, '#030510');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Cyber Matrix Grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
    ctx.lineWidth = 1.5;
    const gridStep = 54;
    for (let x = 0; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3. Ambient Glow Halo behind character
    const centerY = isStory ? 450 : 315;
    const halo = ctx.createRadialGradient(
      width / 2,
      centerY,
      30,
      width / 2,
      centerY,
      isStory ? 400 : 280
    );
    halo.addColorStop(0, `${card.mauSac.primary}66`);
    halo.addColorStop(0.5, `${card.mauSac.secondary}33`);
    halo.addColorStop(1, 'transparent');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, width, height);

    // 4. Outer Holographic Border Frame
    const pad = 36;
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

    // Corner HUD Brackets
    const bLen = 45;
    ctx.strokeStyle = card.mauSac.primary;
    ctx.lineWidth = 6;
    // Top Left
    ctx.beginPath();
    ctx.moveTo(pad - 4, pad - 4 + bLen);
    ctx.lineTo(pad - 4, pad - 4);
    ctx.lineTo(pad - 4 + bLen, pad - 4);
    ctx.stroke();
    // Top Right
    ctx.beginPath();
    ctx.moveTo(width - pad + 4 - bLen, pad - 4);
    ctx.lineTo(width - pad + 4, pad - 4);
    ctx.lineTo(width - pad + 4, pad - 4 + bLen);
    ctx.stroke();
    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(pad - 4, height - pad + 4 - bLen);
    ctx.lineTo(pad - 4, height - pad + 4);
    ctx.lineTo(pad - 4 + bLen, height - pad + 4);
    ctx.stroke();
    // Bottom Right
    ctx.beginPath();
    ctx.moveTo(width - pad + 4 - bLen, height - pad + 4);
    ctx.lineTo(width - pad + 4, height - pad + 4);
    ctx.lineTo(width - pad + 4, height - pad + 4 - bLen);
    ctx.stroke();

    // 5. CSV Event Brand Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#00F0FF';
    ctx.font = '700 22px "Be Vietnam Pro", "Chakra Petch", sans-serif';
    ctx.fillText('✦ BỐC BÀI VIBE CSV — SỰ KIỆN 2026 ✦', width / 2, pad + 45);

    // Card No & Specimen info
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '600 16px "Be Vietnam Pro", "Chakra Petch", sans-serif';
    ctx.fillText(`AUTHENTIC ARCHETYPE SPECIMEN: ${card.cardNo}`, width / 2, pad + 74);

    // 6. Character Emblem Ring
    const centerX = width / 2;
    const ringRadius = isStory ? 180 : 135;

    // Outer Aura Ring
    ctx.strokeStyle = `${card.mauSac.primary}77`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Crest Box
    const boxSize = isStory ? 230 : 175;
    ctx.fillStyle = '#0a1236';
    ctx.strokeStyle = card.mauSac.primary;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(centerX - boxSize / 2, centerY - boxSize / 2, boxSize, boxSize, 30);
    ctx.fill();
    ctx.stroke();

    // Mascot Emoji Symbol
    ctx.font = isStory ? '98px sans-serif' : '78px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(card.symbol, centerX, centerY);
    ctx.textBaseline = 'alphabetic'; // reset

    // 7. Rarity Badge
    const badgeY = centerY + (isStory ? 235 : 170);
    ctx.fillStyle = rarityConfig.color;
    ctx.font = '700 20px "Be Vietnam Pro", "Chakra Petch", sans-serif';
    ctx.fillText(`${rarityConfig.stars}  ${rarityConfig.label}`, centerX, badgeY);

    // 8. Archetype Name (High-Contrast Vietnamese Typography)
    const nameY = badgeY + (isStory ? 70 : 54);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = isStory
      ? '800 56px "Be Vietnam Pro", "Syne", sans-serif'
      : '800 44px "Be Vietnam Pro", "Syne", sans-serif';
    ctx.fillText(card.ten.toUpperCase(), centerX, nameY);

    // Archetype subtitle
    ctx.fillStyle = '#00F0FF';
    ctx.font = '700 18px "Be Vietnam Pro", "Chakra Petch", sans-serif';
    ctx.fillText(`${card.he} ARCHETYPE`, centerX, nameY + 30);

    // 9. Tagline
    const tagY = nameY + (isStory ? 80 : 60);
    ctx.fillStyle = 'rgba(230, 245, 255, 0.95)';
    ctx.font = isStory
      ? 'italic 600 24px "Be Vietnam Pro", sans-serif'
      : 'italic 600 20px "Be Vietnam Pro", sans-serif';
    ctx.fillText(`“${card.tagline}”`, centerX, tagY);

    // 10. Keywords Bar
    const kwY = tagY + (isStory ? 44 : 36);
    const kwText = card.diemManh.join('   ✦   ').toUpperCase();
    ctx.fillStyle = card.mauSac.primary;
    ctx.font = '700 17px "Be Vietnam Pro", "Chakra Petch", sans-serif';
    ctx.fillText(kwText, centerX, kwY);

    // 11. STATS SECTION (INCLUDED ON BOTH 1:1 AND 9:16!)
    if (!isStory) {
      // ===== SQUARE 1:1 FORMAT STATS =====
      // 3 High-Tech Cyber Stat Badges
      const statListSquare = [
        { label: 'SÁNG TẠO', val: card.stats.sangTao, color: '#00F0FF' },
        { label: 'KẾT NỐI', val: card.stats.ketNoi, color: '#A855F7' },
        { label: 'BỨT PHÁ', val: card.stats.butPha, color: '#FF5500' },
      ];

      const statsBoxY = kwY + 42;
      const boxW = 310;
      const boxH = 115;
      const gap = 20;
      const startX = (width - (boxW * 3 + gap * 2)) / 2;

      statListSquare.forEach((st, idx) => {
        const curX = startX + idx * (boxW + gap);

        // Container Panel
        ctx.fillStyle = 'rgba(10, 18, 54, 0.85)';
        ctx.strokeStyle = `${st.color}66`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(curX, statsBoxY, boxW, boxH, 20);
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.textAlign = 'left';
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '700 17px "Be Vietnam Pro", "Chakra Petch", sans-serif';
        ctx.fillText(st.label, curX + 20, statsBoxY + 38);

        // Value
        ctx.textAlign = 'right';
        ctx.fillStyle = st.color;
        ctx.font = '800 26px "Be Vietnam Pro", "Chakra Petch", sans-serif';
        ctx.fillText(`${st.val}%`, curX + boxW - 20, statsBoxY + 40);

        // Progress Bar Track
        const barW = boxW - 40;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect(curX + 20, statsBoxY + 62, barW, 12, 6);
        ctx.fill();

        // Progress Bar Fill
        ctx.fillStyle = st.color;
        ctx.beginPath();
        ctx.roundRect(curX + 20, statsBoxY + 62, (barW * st.val) / 100, 12, 6);
        ctx.fill();

        // Subtext
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(200, 214, 240, 0.7)';
        ctx.font = '600 13px "Be Vietnam Pro", sans-serif';
        ctx.fillText(
          st.val >= 90 ? '★ TỐI ĐA NĂNG LƯỢNG' : '✦ CHỈ SỐ VƯỢT TRỘI',
          curX + 20,
          statsBoxY + 96
        );
      });
    } else {
      // ===== STORY 9:16 FORMAT STATS =====
      const statsStartY = kwY + 65;

      // Card description block
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '500 22px "Be Vietnam Pro", sans-serif';
      const words = card.moTa.split(' ');
      let line = '';
      let lineY = statsStartY;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 780 && n > 0) {
          ctx.fillText(line, centerX, lineY);
          line = words[n] + ' ';
          lineY += 34;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, centerX, lineY);

      // Section Header
      const headerY = lineY + 55;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#00F0FF';
      ctx.font = '700 22px "Be Vietnam Pro", "Chakra Petch", sans-serif';
      ctx.fillText('✦ BẢNG CHỈ SỐ NĂNG LƯỢNG VIBE ✦', centerX, headerY);

      // Full 5 Stat bars
      const barY = headerY + 45;
      const statListStory = [
        { label: 'SÁNG TẠO', val: card.stats.sangTao, color: '#00F0FF' },
        { label: 'KẾT NỐI', val: card.stats.ketNoi, color: '#A855F7' },
        { label: 'KHÁM PHÁ', val: card.stats.khamPha, color: '#EC4899' },
        { label: 'BỨT PHÁ', val: card.stats.butPha, color: '#FF5500' },
        { label: 'CHIẾN LƯỢC', val: card.stats.chienLuoc, color: '#6366F1' },
      ];

      statListStory.forEach((st, idx) => {
        const currentY = barY + idx * 64;

        // Stat Card Row Background
        ctx.fillStyle = 'rgba(10, 18, 54, 0.7)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(140, currentY - 24, 800, 52, 14);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 20px "Be Vietnam Pro", "Chakra Petch", sans-serif';
        ctx.fillText(st.label, 170, currentY + 8);

        // Bar Track
        const barStartX = 380;
        const barWidth = 430;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.roundRect(barStartX, currentY - 7, barWidth, 16, 8);
        ctx.fill();

        // Bar Fill
        ctx.fillStyle = st.color;
        ctx.beginPath();
        ctx.roundRect(barStartX, currentY - 7, (barWidth * st.val) / 100, 16, 8);
        ctx.fill();

        // Percentage Text
        ctx.textAlign = 'right';
        ctx.fillStyle = st.color;
        ctx.font = '800 22px "Be Vietnam Pro", "Chakra Petch", sans-serif';
        ctx.fillText(`${st.val}%`, 140 + 800 - 30, currentY + 9);
      });
    }

    // 12. Footer CSV Verification Stamp
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '600 16px "Be Vietnam Pro", "Chakra Petch", sans-serif';
    ctx.fillText(
      'CSV EVENT VIBE SUMMON EXPERIENCE — SỰ KIỆN KẾT NỐI TOÀN DIỆN 2026',
      centerX,
      height - pad - 18
    );

    // Export to PNG data URL
    try {
      const dataUrl = canvas.toDataURL('image/png');
      setImageUrl(dataUrl);
    } catch {}

    setIsRendering(false);
  }, [card, format, rarityConfig]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Download high-res PNG image
  const handleDownload = () => {
    if (!imageUrl) return;
    soundManager.playCardSelect();
    const link = document.createElement('a');
    link.download = `VIBE-CSV-${card.cardNo}-${card.he}-${format.toLowerCase()}.png`;
    link.href = imageUrl;
    link.click();
  };

  // Web Share API
  const handleShare = async () => {
    soundManager.playCardSelect();
    const statsSummary = `📊 Chỉ số Vibe: Sáng Tạo ${card.stats.sangTao}% | Kết Nối ${card.stats.ketNoi}% | Khám Phá ${card.stats.khamPha}% | Bứt Phá ${card.stats.butPha}% | Chiến Lược ${card.stats.chienLuoc}%`;

    // Web Share API
    if (navigator.share && imageUrl) {
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const file = new File([blob], `VIBE-CSV-${card.he}-${format.toLowerCase()}.png`, {
          type: 'image/png',
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Bốc Bài Vibe CSV — Tôi thuộc ${card.ten}!`,
            text: `Tôi vừa triệu hồi hệ ${card.ten} (${rarityConfig.stars} ${rarityConfig.label}) tại sự kiện CSV!\n"${card.tagline}"\n${statsSummary}`,
            files: [file],
          });
          return;
        }
      } catch {}
    }

    // Fallback: Copy summary text to clipboard
    const textToCopy = `✨ Tôi vừa bốc được lá [${card.ten}] (${rarityConfig.stars} ${rarityConfig.label}) tại sự kiện CSV!\n"${card.tagline}"\n\n${statsSummary}\n\n🔥 Từ khóa: ${card.diemManh.join(', ')}\nKhám phá hệ của bạn ngay tại sự kiện!`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-[fade-in_0.3s_ease-out]">
      <div className="relative w-full max-w-lg bg-[#050818] border border-cyan-500/40 rounded-3xl p-4 sm:p-6 flex flex-col max-h-[95vh] overflow-y-auto shadow-[0_0_50px_rgba(0,240,255,0.3)]">
        {/* Top Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-display font-bold text-white uppercase">
              TẢI & CHIA SẺ VIBE CỦA BẠN
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector: Square 1:1 or Story 9:16 */}
        <div className="my-3 p-1 rounded-xl bg-slate-900/90 border border-slate-800 flex gap-1">
          <button
            onClick={() => {
              soundManager.playCardSelect();
              setFormat('SQUARE');
            }}
            className={`flex-1 py-2 px-3 rounded-lg font-tech text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              format === 'SQUARE'
                ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Square className="w-3.5 h-3.5" />
            <span>VUÔNG 1:1 (POST/ZALO)</span>
          </button>
          <button
            onClick={() => {
              soundManager.playCardSelect();
              setFormat('STORY');
            }}
            className={`flex-1 py-2 px-3 rounded-lg font-tech text-xs font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              format === 'STORY'
                ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>DỌC 9:16 (STORY/REELS)</span>
          </button>
        </div>

        {/* Stats Notice */}
        <div className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 font-tech text-[11px] mb-2 text-center">
          <span>✦ Đã tích hợp chỉ số Vibe (Sáng Tạo, Kết Nối, Bứt Phá...) vào ảnh & văn bản chia sẻ</span>
        </div>

        {/* Hidden Canvas for High-Resolution PNG Rendering */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Preview of Generated Card */}
        <div className="py-2 flex justify-center">
          {imageUrl && !isRendering ? (
            <div
              className={`relative rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-2xl transition-all ${
                format === 'STORY'
                  ? 'w-[190px] h-[338px] sm:w-[220px] sm:h-[390px]'
                  : 'w-[250px] h-[250px] sm:w-[300px] sm:h-[300px]'
              }`}
            >
              <img
                src={imageUrl}
                alt={card.ten}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 font-tech text-[10px] text-cyan-300">
                {format === 'STORY' ? '1080 × 1920' : '1080 × 1080'} PNG
              </div>
            </div>
          ) : (
            <div
              className={`rounded-2xl bg-slate-900 animate-pulse flex flex-col items-center justify-center text-xs font-tech text-cyan-400 ${
                format === 'STORY'
                  ? 'w-[190px] h-[338px] sm:w-[220px] sm:h-[390px]'
                  : 'w-[250px] h-[250px] sm:w-[300px] sm:h-[300px]'
              }`}
            >
              <Sparkles className="w-5 h-5 mb-2 animate-spin text-cyan-300" />
              <span>ĐANG KẾT XUẤT ẢNH SẮC NÉT…</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
          <button
            id="share-download-btn"
            onClick={handleDownload}
            disabled={!imageUrl}
            className="flex-1 py-3 px-4 rounded-xl font-tech font-bold text-xs sm:text-sm tracking-wider uppercase text-black bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 shadow-[0_0_15px_#00F0FF] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>TẢI ẢNH VỀ MÁY (PNG)</span>
          </button>

          <button
            id="share-native-btn"
            onClick={handleShare}
            disabled={!imageUrl}
            className="flex-1 py-3 px-4 rounded-xl font-tech font-bold text-xs sm:text-sm tracking-wider uppercase text-white bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>ĐÃ SAO CHÉP TEXT!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>CHIA SẺ LÊN MXH</span>
              </>
            )}
          </button>
        </div>

        <div className="text-center text-[11px] font-tech text-slate-400 mt-2.5">
          Ảnh chuẩn độ phân giải cao sẵn sàng đăng tải Facebook, Instagram Story, Zalo, TikTok.
        </div>
      </div>
    </div>
  );
};
