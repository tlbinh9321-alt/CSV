import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../engine/soundManager';

interface SoundToggleProps {
  id?: string;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ id = 'sound-toggle-btn' }) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  useEffect(() => {
    setIsMuted(soundManager.getMuted());
  }, []);

  const handleToggle = () => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      soundManager.playCardSelect();
    }
  };

  return (
    <button
      id={id}
      onClick={handleToggle}
      className="relative z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-cyan-500/30 bg-[#070b1e]/80 backdrop-blur-md text-cyan-300 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300 text-xs font-tech tracking-wider cursor-pointer"
      title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
      aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4 text-slate-400" />
      ) : (
        <div className="relative flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
          {/* Animated Mini Equalizer Bars */}
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 bg-cyan-400 h-full animate-[pulse_0.6s_ease-in-out_infinite]" />
            <span className="w-0.5 bg-cyan-400 h-2/3 animate-[pulse_0.8s_ease-in-out_infinite_0.2s]" />
            <span className="w-0.5 bg-cyan-400 h-4/5 animate-[pulse_0.7s_ease-in-out_infinite_0.4s]" />
          </div>
        </div>
      )}
      <span className="hidden sm:inline font-semibold">
        {isMuted ? 'ÂM THANH: TẮT' : 'ÂM THANH: BẬT'}
      </span>
    </button>
  );
};
