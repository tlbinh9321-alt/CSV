import React, { useEffect, useState } from 'react';
import { soundManager } from '../engine/soundManager';
import { FastForward, Zap } from 'lucide-react';

interface EnergyAwakeningProps {
  onAwakeningComplete: () => void;
}

export const EnergyAwakening: React.FC<EnergyAwakeningProps> = ({
  onAwakeningComplete,
}) => {
  const [phase, setPhase] = useState<'AWAKENED' | 'CHOOSE'>('AWAKENED');
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    soundManager.playEnergyBuild();

    // Fast interval for progress bar to 100% in ~1s
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 12;
      });
    }, 100);

    const textTimer = setTimeout(() => {
      setPhase('CHOOSE');
    }, 450);

    const completeTimer = setTimeout(() => {
      onAwakeningComplete();
    }, 1100);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onAwakeningComplete]);

  return (
    <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-8 overflow-hidden bg-[#030510]">
      {/* Expanding Concentric Energy Shockwaves */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 sm:w-96 sm:h-96 rounded-full border border-cyan-400/40 animate-ping [animation-duration:1.5s]" />
        <div className="w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full border border-purple-500/30 animate-ping [animation-duration:2s] [animation-delay:0.2s]" />
        <div className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full border border-blue-500/20 animate-ping [animation-duration:2.5s] [animation-delay:0.4s]" />
      </div>

      {/* Center Pulsating Quantum Energy Core */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Core Glow */}
        <div className="relative flex items-center justify-center">
          <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 blur-2xl opacity-80 animate-pulse" />
          
          <div className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-cyan-300 border-dashed animate-[spin_4s_linear_infinite] flex items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white shadow-[0_0_40px_#00F0FF] animate-ping [animation-duration:0.8s]" />
          </div>
        </div>

        {/* Dynamic Typography Transition */}
        <div className="mt-8 text-center max-w-lg min-h-[90px] flex flex-col items-center justify-center">
          {phase === 'AWAKENED' ? (
            <div className="animate-[fade-in_0.3s_ease-out]">
              <div className="text-xs sm:text-sm font-tech text-cyan-400 tracking-[0.3em] uppercase mb-1.5 flex items-center justify-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>SYNCHRONIZATION COMPLETE</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-sky-300 tracking-tight text-glow-cyan">
                VIBE ĐÃ ĐƯỢC KÍCH HOẠT
              </h2>
            </div>
          ) : (
            <div className="animate-[scale-up_0.3s_ease-out]">
              <div className="text-xs sm:text-sm font-tech text-purple-400 tracking-[0.3em] uppercase mb-1.5">
                CHỦNG NĂNG LƯỢNG MỞ LỐI
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-pink-300 tracking-tight text-glow-purple">
                HÃY CHỌN LÁ BÀI CỦA BẠN.
              </h2>
            </div>
          )}
        </div>

        {/* Progress bar for energy awakening */}
        <div className="w-72 sm:w-80 mt-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-tech">
            <span className="text-cyan-400 uppercase tracking-widest font-semibold flex items-center gap-1">
              <span>ĐANG TRIỆU HỒI 3 LÁ BÀI</span>
            </span>
            <span className="text-cyan-300 font-bold">{Math.min(progress, 100)}%</span>
          </div>
          <div className="w-full bg-[#0a1030] h-2 rounded-full overflow-hidden border border-cyan-500/40 p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-500 rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_#00F0FF]"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Instant Skip / Fast-forward Button */}
        <button
          onClick={onAwakeningComplete}
          className="mt-6 flex items-center gap-1.5 px-4 py-2 rounded-full border border-cyan-500/40 bg-[#090f2b]/80 hover:bg-cyan-500/20 text-cyan-300 font-tech text-xs tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)] active:scale-95"
        >
          <span>CHỌN BÀI NGAY</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Radiating Light Rays */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-purple-900/10 to-transparent" />
    </div>
  );
};
