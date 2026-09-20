import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, ShieldCheck, AlertCircle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundManager } from '../engine/soundManager';

interface CameraScannerProps {
  onScanComplete: (seed: number) => void;
  onCancel: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onScanComplete,
  onCancel,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isCompletedRef = useRef(false);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [progress, setProgress] = useState(30);
  const [isFaceDetected, setIsFaceDetected] = useState(false);

  // Transition to next step quickly after face lock
  const finishScan = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    setIsFaceDetected(true);
    setProgress(100);
    soundManager.playScanLock();

    // Quick 380ms delay to let user see the green/cyan "FACE DETECTED" lock before switching
    setTimeout(() => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const generatedSeed = Date.now() ^ Math.floor(Math.random() * 999999);
      onScanComplete(generatedSeed);
    }, 380);
  }, [onScanComplete]);

  // Initialize Camera
  useEffect(() => {
    let isMounted = true;

    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Thiết bị không hỗ trợ camera trực tiếp');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
        soundManager.playScanBeep();
      } catch (err: unknown) {
        if (!isMounted) return;
        setHasPermission(false);
        const error = err as Error;
        setErrorMessage(
          error.name === 'NotAllowedError'
            ? 'Quyền truy cập camera bị từ chối'
            : 'Không thể kết nối camera'
        );
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Symbolic Face Detection: Once camera stream is active or simulated, detect face in ~450ms and switch!
  useEffect(() => {
    if (hasPermission === false && !isSimulated) return;
    if (hasPermission === null && !isSimulated) return;

    // Fast progress ticker
    const progressTimer = setTimeout(() => {
      setProgress(85);
    }, 200);

    // Symbolic face recognition trigger: locks face & transitions immediately
    const detectTimer = setTimeout(() => {
      finishScan();
    }, 480);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(detectTimer);
    };
  }, [hasPermission, isSimulated, finishScan]);

  // Fallback to simulation mode if camera unavailable
  const handleSimulateFallback = () => {
    soundManager.playCardSelect();
    setIsSimulated(true);
    setHasPermission(true);
    setProgress(50);
    // Instant symbolic scan in simulation
    setTimeout(() => {
      finishScan();
    }, 450);
  };

  return (
    <div className="relative z-20 min-h-screen flex flex-col justify-between items-center px-4 pt-16 sm:pt-20 pb-6 text-white overflow-hidden">
      {/* Top Header */}
      <div className="w-full max-w-4xl flex justify-between items-center z-30">
        <button
          onClick={onCancel}
          className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-[#070b1e]/80 text-slate-300 hover:text-white hover:border-slate-500 font-tech text-xs tracking-wider transition-all cursor-pointer"
        >
          ← QUAY LẠI
        </button>

        {/* Quick Instant Skip / Advance */}
        <button
          onClick={finishScan}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/70 text-cyan-300 hover:text-white hover:bg-cyan-500/20 font-tech text-xs tracking-wider transition-all cursor-pointer active:scale-95"
        >
          <span>TIẾP TỤC NGAY</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
        </button>
      </div>

      {/* Main Scanner Section */}
      <div className="my-auto flex flex-col items-center justify-center relative py-2">
        {hasPermission === false && !isSimulated ? (
          /* PERMISSION DENIED FALLBACK */
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-[#090d24] border border-cyan-500/30 text-center shadow-2xl backdrop-blur-xl animate-[fade-in_0.4s_ease-out]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Camera className="w-8 h-8" />
            </div>

            <div className="text-xs font-tech text-cyan-400 tracking-[0.2em] uppercase mb-1">
              CHẾ ĐỘ THAY THẾ
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
              KHÔNG SAO.
            </h2>
            <h3 className="text-lg font-display text-cyan-300 mb-4">
              VIBE VẪN CÓ THỂ ĐƯỢC KÍCH HOẠT.
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              {errorMessage || 'Không thể mở camera trên thiết bị.'} Bạn có thể tiếp tục với trình quét giả lập năng lượng số để bốc bài ngay.
            </p>

            <button
              onClick={handleSimulateFallback}
              className="w-full py-3.5 px-6 rounded-xl font-tech font-bold text-sm tracking-wider uppercase text-black bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all cursor-pointer"
            >
              TIẾP TỤC KHÔNG DÙNG CAMERA
            </button>
          </div>
        ) : (
          /* ACTIVE BIOMETRIC SCANNER UI */
          <div className="relative w-[300px] h-[380px] sm:w-[380px] sm:h-[460px] rounded-3xl overflow-hidden border-2 border-cyan-400/60 shadow-[0_0_40px_rgba(0,240,255,0.3)] bg-[#030614]">
            {/* Live Video Feed or Cyber Simulation */}
            {isSimulated ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center cyber-grid bg-gradient-to-b from-[#070b1e] via-[#09153a] to-[#04081c]">
                <div className="w-32 h-32 rounded-full border border-cyan-400/40 border-dashed animate-spin flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border border-purple-400/50 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-8 h-8 text-cyan-300" />
                  </div>
                </div>
                <div className="mt-4 font-tech text-xs tracking-[0.2em] text-cyan-400">
                  AURA QUANTUM SIMULATION
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedData={() => {
                  soundManager.playScanBeep();
                }}
                className="w-full h-full object-cover scale-x-[-1]"
              />
            )}

            {/* Futuristic Scanline Effect */}
            <div className="absolute inset-0 scanlines pointer-events-none opacity-40" />

            {/* Moving Laser Scanner Line */}
            <div
              className={`absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00F0FF] pointer-events-none ${
                isFaceDetected ? 'hidden' : 'animate-[bounce_1.5s_ease-in-out_infinite]'
              }`}
            />

            {/* Corner HUD Brackets */}
            <div className={`absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 pointer-events-none transition-colors duration-200 ${isFaceDetected ? 'border-emerald-400' : 'border-cyan-400'}`} />
            <div className={`absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 pointer-events-none transition-colors duration-200 ${isFaceDetected ? 'border-emerald-400' : 'border-cyan-400'}`} />
            <div className={`absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 pointer-events-none transition-colors duration-200 ${isFaceDetected ? 'border-emerald-400' : 'border-cyan-400'}`} />
            <div className={`absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 pointer-events-none transition-colors duration-200 ${isFaceDetected ? 'border-emerald-400' : 'border-cyan-400'}`} />

            {/* Circular Radar HUD Reticle Centered */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {/* Outer Radar */}
              <div className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-dashed transition-all duration-300 ${isFaceDetected ? 'border-emerald-400 scale-95' : 'border-cyan-400/40 animate-[spin_8s_linear_infinite]'}`} />
              
              {/* Inner Face Target Box */}
              <div className={`absolute w-36 h-36 sm:w-44 sm:h-44 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                isFaceDetected
                  ? 'border-emerald-400 bg-emerald-400/15 shadow-[0_0_30px_#10B981]'
                  : 'border-cyan-300/50'
              }`}>
                {/* Horizontal & Vertical Crosshair */}
                <div className={`absolute w-44 sm:w-52 h-[1px] ${isFaceDetected ? 'bg-emerald-400/40' : 'bg-cyan-400/20'}`} />
                <div className={`absolute h-44 sm:h-52 w-[1px] ${isFaceDetected ? 'bg-emerald-400/40' : 'bg-cyan-400/20'}`} />
                
                {/* Face Lock Indicator */}
                {isFaceDetected && (
                  <div className="animate-scale-up text-center bg-black/70 px-3 py-1.5 rounded-lg border border-emerald-400/80 shadow-lg">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1 animate-pulse" />
                    <div className="text-[10px] font-tech font-bold text-emerald-300 tracking-wider">
                      FACE ACQUIRED
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Technical Floating Telemetry Labels */}
            <div className="absolute top-6 left-6 font-tech text-[10px] text-cyan-400/80 tracking-widest pointer-events-none space-y-0.5">
              <div>TARGET: BIOMETRIC_AURA</div>
              <div className={isFaceDetected ? 'text-emerald-400 font-bold' : ''}>
                {isFaceDetected ? 'STATUS: LOCKED 100%' : 'STATUS: SCANNING…'}
              </div>
            </div>

            <div className="absolute top-6 right-6 font-tech text-[10px] text-cyan-400/80 tracking-widest text-right pointer-events-none space-y-0.5">
              <div>CSV: VIBE_SYS_26</div>
              <div>RATE: 120 FPS</div>
            </div>

            {/* Bottom Scanner Status and Progress Bar */}
            <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-[#020512] via-[#020512]/90 to-transparent flex flex-col items-center">
              {isFaceDetected ? (
                <div className="text-center animate-pulse">
                  <div className="text-base sm:text-lg font-display font-extrabold tracking-widest text-emerald-300 drop-shadow-[0_0_15px_#10B981]">
                    ✦ ĐÃ NHẬN DIỆN KHUÔN MẶT ✦
                  </div>
                  <div className="text-[11px] font-tech text-cyan-300 tracking-wider mt-1">
                    ĐANG CHUYỂN TIẾP SANG KHÔNG GIAN BÀI…
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="text-xs sm:text-sm font-tech font-bold tracking-widest text-cyan-300 uppercase text-center mb-2">
                    ĐANG QUÉT VIBE KHUÔN MẶT…
                  </div>

                  {/* Progress Bar Container */}
                  <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden border border-cyan-500/30">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-purple-500 transition-all duration-200 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="w-full flex justify-between text-[10px] font-tech text-slate-400 mt-1.5">
                    <span>BIOMETRIC RECOGNITION</span>
                    <span className="text-cyan-300 font-semibold">{progress}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Exploding Energy Ring when locked */}
            {isFaceDetected && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 rounded-full border-4 border-emerald-400 animate-ping opacity-90" />
                <div className="w-44 h-44 rounded-full border-2 border-cyan-400 animate-ping [animation-duration:0.8s] opacity-75" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Privacy Statement */}
      <div className="relative z-30 flex items-center justify-center gap-2 text-slate-400 text-xs font-tech max-w-md mx-auto text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Camera chỉ được sử dụng để kích hoạt trải nghiệm. Hình ảnh của bạn không được lưu trữ.</span>
      </div>
    </div>
  );
};
