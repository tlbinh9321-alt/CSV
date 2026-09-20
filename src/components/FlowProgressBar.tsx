import React from 'react';
import { AppState } from '../types';
import { Check, Sparkles, Scan, Zap, Layers, Gift, Award } from 'lucide-react';

interface FlowProgressBarProps {
  currentState: AppState;
}

interface StepInfo {
  key: AppState | 'CARD_SELECTED';
  stepNumber: number;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  percent: number;
}

const STEPS: StepInfo[] = [
  {
    key: 'INTRO',
    stepNumber: 1,
    label: 'KHỞI ĐỘNG',
    shortLabel: 'BẮT ĐẦU',
    icon: <Sparkles className="w-3 h-3" />,
    percent: 15,
  },
  {
    key: 'CAMERA_SCAN',
    stepNumber: 2,
    label: 'QUÉT VIBE',
    shortLabel: 'QUÉT',
    icon: <Scan className="w-3 h-3" />,
    percent: 35,
  },
  {
    key: 'ENERGY_AWAKENING',
    stepNumber: 3,
    label: 'KÍCH HOẠT',
    shortLabel: 'KÍCH HOẠT',
    icon: <Zap className="w-3 h-3" />,
    percent: 55,
  },
  {
    key: 'CARD_SUMMON',
    stepNumber: 4,
    label: 'CHỌN BÀI',
    shortLabel: 'CHỌN BÀI',
    icon: <Layers className="w-3 h-3" />,
    percent: 75,
  },
  {
    key: 'GACHA_REVEAL',
    stepNumber: 5,
    label: 'MỞ THẺ',
    shortLabel: 'MỞ THẺ',
    icon: <Gift className="w-3 h-3" />,
    percent: 90,
  },
  {
    key: 'RESULT',
    stepNumber: 6,
    label: 'KẾT QUẢ',
    shortLabel: 'KẾT QUẢ',
    icon: <Award className="w-3 h-3" />,
    percent: 100,
  },
];

export const FlowProgressBar: React.FC<FlowProgressBarProps> = ({ currentState }) => {
  const currentStepIndex = STEPS.findIndex((s) => s.key === currentState);
  const activeStep = STEPS[currentStepIndex] || STEPS[0];
  const progressPercent = activeStep.percent;

  return (
    <div className="w-full fixed top-0 left-0 right-0 z-40 bg-[#040716]/85 backdrop-blur-md border-b border-cyan-500/20 px-3 py-2 sm:px-6 sm:py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex flex-col gap-1.5">
        {/* Top Mini Info Line */}
        <div className="flex items-center justify-between text-[11px] font-tech tracking-wider">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-cyan-300 font-bold uppercase tracking-widest hidden sm:inline">
              TIẾN ĐỘ TRẢI NGHIỆM CSV:
            </span>
            <span className="text-slate-200 uppercase font-semibold">
              BƯỚC {activeStep.stepNumber}/6 — {activeStep.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span className="text-[10px] text-slate-400 hidden sm:inline uppercase">NĂNG LƯỢNG TIẾN TRÌNH:</span>
            <span className="bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Laser Progress Track */}
        <div className="w-full h-1.5 sm:h-2 bg-[#090e24] rounded-full overflow-hidden p-[1px] border border-cyan-500/30 relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 transition-all duration-500 ease-out shadow-[0_0_12px_#00F0FF]"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Laser Head Glow */}
          <div
            className="absolute top-0 bottom-0 w-3 bg-white blur-[2px] rounded-full -translate-x-1/2 transition-all duration-500 pointer-events-none"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Step Nodes Row (Desktop / Tablet) */}
        <div className="hidden sm:flex justify-between items-center pt-1 px-1">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.key}
                className="flex items-center gap-1.5 transition-all duration-300"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-tech font-bold border transition-all ${
                    isCompleted
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : isCurrent
                      ? 'bg-cyan-400 border-white text-black shadow-[0_0_10px_#00F0FF] scale-110'
                      : 'bg-slate-900 border-slate-700 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : step.stepNumber}
                </div>
                <span
                  className={`text-[10px] font-tech tracking-wider uppercase transition-colors ${
                    isCurrent
                      ? 'text-cyan-300 font-bold'
                      : isCompleted
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
