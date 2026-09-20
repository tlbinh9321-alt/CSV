// Futuristic Web Audio Synthesizer & Sound Manager for CSV Gacha Mini-game
// Fully optimized for bright, clear, melodic audio with ZERO low-bass / deep rumbling frequencies

import { RarityLevel } from '../types';

interface NoteStep {
  note: number; // frequency in Hz (all >= 260Hz, no low-bass)
  duration: number; // in seconds
  type?: OscillatorType;
  volume?: number;
}

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterHighPass: BiquadFilterNode | null = null;

  // Intro Ambient Pad
  private ambientGain: GainNode | null = null;
  private ambientOscs: OscillatorNode[] = [];
  private isAmbientPlaying: boolean = false;

  // Dedicated Card Music System
  private currentCardMusicId: string | null = null;
  private isCardMusicActive: boolean = false;
  private cardMusicLoopTimer: ReturnType<typeof setTimeout> | null = null;
  private activeMusicNodes: { osc: OscillatorNode; gain: GainNode; stopTime: number }[] = [];

  constructor() {
    // Check saved mute preference
    const saved = localStorage.getItem('csv_sound_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        // Master High-Pass Filter: Cuts out all low bass / rumbling frequencies under 260Hz
        const hpFilter = this.ctx.createBiquadFilter();
        hpFilter.type = 'highpass';
        hpFilter.frequency.setValueAtTime(260, this.ctx.currentTime);
        hpFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);
        hpFilter.connect(this.ctx.destination);
        this.masterHighPass = hpFilter;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Master destination routing that guarantees no low-bass/sub-frequencies pass through.
   */
  private getDestination(): AudioNode {
    const ctx = this.initContext();
    if (this.masterHighPass) {
      return this.masterHighPass;
    }
    return ctx ? ctx.destination : (null as unknown as AudioNode);
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('csv_sound_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopIntroMusic();
      this.stopCardMusic();
    } else {
      this.initContext();
      if (this.currentCardMusicId) {
        this.playCardMusic(this.currentCardMusicId);
      } else {
        this.playIntroMusic();
      }
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('csv_sound_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopIntroMusic();
      this.stopCardMusic();
    }
  }

  // ==========================================
  // 1. INTRO AMBIENT PAD (Bright, Celestial, No Low-Bass)
  // ==========================================
  public playIntroMusic() {
    if (this.isMuted || this.isAmbientPlaying || this.isCardMusicActive) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      this.stopIntroMusic();

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2.5);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      // Bright, crystal-clear celestial chord: C4 (261.63Hz), E4 (329.63Hz), G4 (392.00Hz), B4 (493.88Hz), D5 (587.33Hz)
      const freqs = [261.63, 329.63, 392.0, 493.88, 587.33];
      const oscs: OscillatorNode[] = [];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Subtle shimmer LFO
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.08, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(2.0, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.detune);
        lfo.start();

        oscGain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();
        oscs.push(osc);
      });

      filter.connect(masterGain);
      masterGain.connect(this.getDestination());

      this.ambientGain = masterGain;
      this.ambientOscs = oscs;
      this.isAmbientPlaying = true;
    } catch {}
  }

  public stopIntroMusic() {
    if (!this.isAmbientPlaying) return;
    try {
      if (this.ctx && this.ambientGain) {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          this.ambientOscs.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {}
          });
          this.ambientOscs = [];
          this.isAmbientPlaying = false;
        }, 900);
      } else {
        this.isAmbientPlaying = false;
      }
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  // ==========================================
  // 2. DEDICATED MUSICAL THEMES FOR EACH CARD
  // ==========================================

  public isMusicPlaying(): boolean {
    return this.isCardMusicActive && !this.isMuted;
  }

  public getCurrentMusicCardId(): string | null {
    return this.currentCardMusicId;
  }

  /**
   * Plays a full, repeating musical theme for the specified card.
   * Completely bright, melodic, and cheerful with zero bass drone.
   */
  public playCardMusic(cardId: string) {
    this.currentCardMusicId = cardId;
    if (this.isMuted) return;

    const ctx = this.initContext();
    if (!ctx) return;

    // Stop previous music cleanly
    this.stopIntroMusic();
    this.clearCardMusicLoop();

    this.isCardMusicActive = true;
    this.scheduleCardMusicLoop(cardId);
  }

  public stopCardMusic() {
    this.isCardMusicActive = false;
    this.currentCardMusicId = null;
    this.clearCardMusicLoop();
  }

  public toggleCardMusic(cardId: string): boolean {
    if (this.isCardMusicActive && this.currentCardMusicId === cardId) {
      this.stopCardMusic();
      return false;
    } else {
      this.playCardMusic(cardId);
      return true;
    }
  }

  private clearCardMusicLoop() {
    if (this.cardMusicLoopTimer) {
      clearTimeout(this.cardMusicLoopTimer);
      this.cardMusicLoopTimer = null;
    }
    const ctx = this.ctx;
    const now = ctx ? ctx.currentTime : 0;
    this.activeMusicNodes.forEach(({ osc, gain }) => {
      try {
        if (ctx) {
          gain.gain.linearRampToValueAtTime(0.001, now + 0.3);
        }
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        }, 350);
      } catch {}
    });
    this.activeMusicNodes = [];
  }

  private scheduleCardMusicLoop(cardId: string) {
    if (!this.isCardMusicActive || this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const { melody, accompaniment, loopDuration } = this.getCardMusicScore(cardId);

    // 1. Play Melody Notes
    let currentMelodyTime = now + 0.05;
    melody.forEach((step) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = step.type || 'triangle';
      osc.frequency.setValueAtTime(step.note, currentMelodyTime);

      const vol = step.volume !== undefined ? step.volume : 0.16;
      gain.gain.setValueAtTime(0.001, currentMelodyTime);
      gain.gain.linearRampToValueAtTime(vol, currentMelodyTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, currentMelodyTime + step.duration * 0.95);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(currentMelodyTime);
      const stopTime = currentMelodyTime + step.duration;
      osc.stop(stopTime);

      this.activeMusicNodes.push({ osc, gain, stopTime });
      currentMelodyTime += step.duration;
    });

    // 2. Play Accompaniment Chords / Arpeggio Chimes
    let currentAccTime = now + 0.05;
    accompaniment.forEach((step) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = step.type || 'sine';
      osc.frequency.setValueAtTime(step.note, currentAccTime);

      const vol = step.volume !== undefined ? step.volume : 0.08;
      gain.gain.setValueAtTime(0.001, currentAccTime);
      gain.gain.linearRampToValueAtTime(vol, currentAccTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, currentAccTime + step.duration * 0.92);

      osc.connect(gain);
      gain.connect(this.getDestination());

      osc.start(currentAccTime);
      const stopTime = currentAccTime + step.duration;
      osc.stop(stopTime);

      this.activeMusicNodes.push({ osc, gain, stopTime });
      currentAccTime += step.duration;
    });

    // Clean up expired nodes periodically
    setTimeout(() => {
      const currentTime = this.ctx?.currentTime || 0;
      this.activeMusicNodes = this.activeMusicNodes.filter(
        (item) => item.stopTime > currentTime
      );
    }, (loopDuration * 1000) / 2);

    // Schedule next loop cycle smoothly
    this.cardMusicLoopTimer = setTimeout(() => {
      if (this.isCardMusicActive) {
        this.scheduleCardMusicLoop(cardId);
      }
    }, loopDuration * 1000);
  }

  /**
   * Musical compositions for each of the 8 CSV Archetypes.
   * Purely mid and high frequencies (260Hz to 1800Hz), sparkling, joyous, distinct.
   */
  private getCardMusicScore(cardId: string): {
    melody: NoteStep[];
    accompaniment: NoteStep[];
    loopDuration: number;
  } {
    // Standard Musical Note Frequencies (All >= 261Hz, completely free of deep bass)
    const N = {
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      F4: 349.23,
      Fs4: 369.99,
      G4: 392.0,
      Gs4: 415.3,
      A4: 440.0,
      As4: 466.16,
      B4: 493.88,
      C5: 523.25,
      Cs5: 554.37,
      D5: 587.33,
      Ds5: 622.25,
      E5: 659.25,
      F5: 698.46,
      Fs5: 739.99,
      G5: 783.99,
      Gs5: 830.61,
      A5: 880.0,
      B5: 987.77,
      C6: 1046.5,
      D6: 1174.66,
      Ds6: 1244.51,
      E6: 1318.51,
    };

    switch (cardId) {
      case 'tien-phong': {
        // HỆ TIÊN PHONG: Heroic, uplifting cyber march fanfare (Bright G Major)
        const d = 0.26;
        const melody: NoteStep[] = [
          { note: N.G4, duration: d, type: 'triangle', volume: 0.18 },
          { note: N.B4, duration: d, type: 'triangle', volume: 0.18 },
          { note: N.D5, duration: d * 1.5, type: 'triangle', volume: 0.22 },
          { note: N.G5, duration: d * 2, type: 'triangle', volume: 0.24 },
          { note: N.Fs5, duration: d, type: 'triangle', volume: 0.19 },
          { note: N.E5, duration: d, type: 'triangle', volume: 0.18 },
          { note: N.D5, duration: d * 1.5, type: 'triangle', volume: 0.2 },
          { note: N.C5, duration: d, type: 'triangle', volume: 0.17 },
          { note: N.B4, duration: d, type: 'triangle', volume: 0.17 },
          { note: N.D5, duration: d * 1.5, type: 'triangle', volume: 0.21 },
          { note: N.G5, duration: d * 3, type: 'triangle', volume: 0.25 },
        ];
        const accompaniment: NoteStep[] = [
          { note: N.D5, duration: d * 2, type: 'sine', volume: 0.08 },
          { note: N.G5, duration: d * 2, type: 'sine', volume: 0.08 },
          { note: N.B5, duration: d * 2, type: 'sine', volume: 0.09 },
          { note: N.A5, duration: d * 2, type: 'sine', volume: 0.08 },
          { note: N.G5, duration: d * 2, type: 'sine', volume: 0.08 },
          { note: N.B5, duration: d * 4, type: 'sine', volume: 0.1 },
        ];
        return { melody, accompaniment, loopDuration: 3.8 };
      }

      case 'ket-noi': {
        // HỆ KẾT NỐI: Sweet, joyful glockenspiel & music box melody (C Major harmony)
        const d = 0.24;
        const melody: NoteStep[] = [
          { note: N.C5, duration: d, type: 'sine', volume: 0.18 },
          { note: N.E5, duration: d, type: 'sine', volume: 0.18 },
          { note: N.G5, duration: d * 1.5, type: 'sine', volume: 0.2 },
          { note: N.A5, duration: d * 1.5, type: 'sine', volume: 0.22 },
          { note: N.G5, duration: d, type: 'sine', volume: 0.18 },
          { note: N.E5, duration: d * 1.5, type: 'sine', volume: 0.19 },
          { note: N.F5, duration: d, type: 'sine', volume: 0.17 },
          { note: N.D5, duration: d, type: 'sine', volume: 0.17 },
          { note: N.C5, duration: d * 1.5, type: 'sine', volume: 0.2 },
          { note: N.E5, duration: d, type: 'sine', volume: 0.18 },
          { note: N.G5, duration: d * 2.5, type: 'sine', volume: 0.23 },
        ];
        const accompaniment: NoteStep[] = [
          { note: N.E5, duration: d * 3, type: 'triangle', volume: 0.07 },
          { note: N.G5, duration: d * 3, type: 'triangle', volume: 0.07 },
          { note: N.F5, duration: d * 3, type: 'triangle', volume: 0.07 },
          { note: N.C6, duration: d * 4, type: 'triangle', volume: 0.09 },
        ];
        return { melody, accompaniment, loopDuration: 3.5 };
      }

      case 'kien-tao': {
        // HỆ KIẾN TẠO: Playful techno marimba & bright chiptune blocks (D Major / A Mixolydian)
        const d = 0.21;
        const melody: NoteStep[] = [
          { note: N.D4, duration: d, type: 'square', volume: 0.1 },
          { note: N.Fs4, duration: d, type: 'square', volume: 0.1 },
          { note: N.A4, duration: d, type: 'square', volume: 0.12 },
          { note: N.Cs5, duration: d * 1.5, type: 'square', volume: 0.13 },
          { note: N.B4, duration: d, type: 'square', volume: 0.11 },
          { note: N.A4, duration: d, type: 'square', volume: 0.11 },
          { note: N.Fs4, duration: d * 1.5, type: 'square', volume: 0.11 },
          { note: N.G4, duration: d, type: 'square', volume: 0.1 },
          { note: N.A4, duration: d, type: 'square', volume: 0.11 },
          { note: N.B4, duration: d * 1.5, type: 'square', volume: 0.13 },
          { note: N.D5, duration: d * 2.5, type: 'square', volume: 0.14 },
        ];
        const accompaniment: NoteStep[] = [
          { note: N.A4, duration: d * 2, type: 'triangle', volume: 0.08 },
          { note: N.D5, duration: d * 2, type: 'triangle', volume: 0.08 },
          { note: N.Fs5, duration: d * 2, type: 'triangle', volume: 0.08 },
          { note: N.E5, duration: d * 2, type: 'triangle', volume: 0.08 },
          { note: N.A5, duration: d * 3, type: 'triangle', volume: 0.09 },
        ];
        return { melody, accompaniment, loopDuration: 3.2 };
      }

      case 'kham-pha': {
        // HỆ KHÁM PHÁ: Ethereal cosmic star-harp & sparkling space bells (E Major)
        const d = 0.28;
        const melody: NoteStep[] = [
          { note: N.E5, duration: d, type: 'sine', volume: 0.16 },
          { note: N.Gs4, duration: d, type: 'sine', volume: 0.15 },
          { note: N.B4, duration: d, type: 'sine', volume: 0.16 },
          { note: N.E5, duration: d * 1.5, type: 'sine', volume: 0.19 },
          { note: N.Gs5, duration: d * 1.5, type: 'sine', volume: 0.21 },
          { note: N.B5, duration: d * 2, type: 'sine', volume: 0.23 },
          { note: N.Ds6, duration: d * 1.5, type: 'sine', volume: 0.24 },
          { note: N.E6, duration: d * 2.5, type: 'sine', volume: 0.26 },
        ];
        const accompaniment: NoteStep[] = [
          { note: N.B5, duration: d * 2, type: 'triangle', volume: 0.07 },
          { note: N.E6, duration: d * 3, type: 'triangle', volume: 0.08 },
          { note: N.Gs5, duration: d * 3, type: 'triangle', volume: 0.07 },
          { note: N.B5, duration: d * 4, type: 'triangle', volume: 0.09 },
        ];
        return { melody, accompaniment, loopDuration: 3.6 };
      }

      case 'chien-luoc': {
        // HỆ CHIẾN LƯỢC: Crisp crystal tactical bell motif (A Minor / Neo-Cyber)
        const d = 0.23;
        const melody: NoteStep[] = [
          { note: N.A4, duration: d, type: 'triangle', volume: 0.17 },
          { note: N.C5, duration: d, type: 'triangle', volume: 0.17 },
          { note: N.E5, duration: d * 1.5, type: 'triangle', volume: 0.2 },
          { note: N.G5, duration: d, type: 'triangle', volume: 0.2 },
          { note: N.F5, duration: d, type: 'triangle', volume: 0.18 },
          { note: N.E5, duration: d * 1.5, type: 'triangle', volume: 0.19 },
          { note: N.D5, duration: d, type: 'triangle', volume: 0.17 },
          { note: N.E5, duration: d, type: 'triangle', volume: 0.18 },
          { note: N.B4, duration: d * 1.5, type: 'triangle', volume: 0.18 },
          { note: N.C5, duration: d * 2.5, type: 'triangle', volume: 0.22 },
        ];
        const accompaniment: NoteStep[] = [
          { note: N.E5, duration: d * 2.5, type: 'sine', volume: 0.08 },
          { note: N.A5, duration: d * 2.5, type: 'sine', volume: 0.08 },
          { note: N.G5, duration: d * 2.5, type: 'sine', volume: 0.08 },
          { note: N.C6, duration: d * 3.5, type: 'sine', volume: 0.09 },
        ];
        return { melody, accompaniment, loopDuration: 3.4 };
      }

      case 'but-pha': {
        // HỆ BỨT PHÁ: High-speed nitro arpeggio & hyperpop triumph (F Major)
        const d = 0.17;
        const melody: NoteStep[] = [
          { note: N.F4, duration: d, type: 'sawtooth', volume: 0.11 },
          { note: N.A4, duration: d, type: 'sawtooth', volume: 0.12 },
          { note: N.C5, duration: d, type: 'sawtooth', volume: 0.13 },
          { note: N.F5, duration: d * 1.5, type: 'sawtooth', volume: 0.15 },
          { note: N.G5, duration: d, type: 'sawtooth', volume: 0.14 },
          { note: N.A5, duration: d * 2, type: 'sawtooth', volume: 0.16 },
          { note: N.F5, duration: d, type: 'sawtooth', volume: 0.13 },
          { note: N.C5, duration: d, type: 'sawtooth', volume: 0.12 },
          { note: N.D5, duration: d * 1.5, type: 'sawtooth', volume: 0.14 },
          { note: N.G5, duration: d * 1.5, type: 'sawtooth', volume: 0.15 },
          { note: N.C6, duration: d * 3, type: 'sawtooth', volume: 0.18 },
        ];
        const accompaniment: NoteStep[] = [
          { note: N.C5, duration: d * 3, type: 'triangle', volume: 0.08 },
          { note: N.F5, duration: d * 3, type: 'triangle', volume: 0.08 },
          { note: N.A5, duration: d * 3, type: 'triangle', volume: 0.09 },
          { note: N.C6, duration: d * 4, type: 'triangle', volume: 0.1 },
        ];
        return { melody, accompaniment, loopDuration: 2.8 };
      }

      case 'truyen-cam-hung': {
        // HỆ TRUYỀN CẢM HỨNG: Sparkling festival chime & joyful radiant fanfare (D Major)
        const d = 0.22;
        const melody: NoteStep[] = [
          { note: N.D5, duration: d, type: 'triangle', volume: 0.18 },
          { note: N.Fs5, duration: d, type: 'triangle', volume: 0.19 },
          { note: N.A5, duration: d * 1.5, type: 'triangle', volume: 0.21 },
          { note: N.B5, duration: d * 1.5, type: 'triangle', volume: 0.22 },
          { note: N.A5, duration: d, type: 'triangle', volume: 0.19 },
          { note: N.Fs5, duration: d * 1.5, type: 'triangle', volume: 0.19 },
          { note: N.G5, duration: d, type: 'triangle', volume: 0.18 },
          { note: N.A5, duration: d, type: 'triangle', volume: 0.19 },
          { note: N.B5, duration: d * 1.5, type: 'triangle', volume: 0.21 },
          { note: N.D6, duration: d * 2.5, type: 'triangle', volume: 0.25 },
        ];
        const accompaniment: NoteStep[] = [
          { note: N.Fs5, duration: d * 3, type: 'sine', volume: 0.08 },
          { note: N.A5, duration: d * 3, type: 'sine', volume: 0.08 },
          { note: N.D6, duration: d * 4, type: 'sine', volume: 0.09 },
        ];
        return { melody, accompaniment, loopDuration: 3.3 };
      }

      case 'tu-do': {
        // HỆ TỰ DO: Chill tropical breeze kalimba & airy daydream synth (G Major)
        const d = 0.27;
        const melody: NoteStep[] = [
          { note: N.G4, duration: d, type: 'sine', volume: 0.18 },
          { note: N.B4, duration: d, type: 'sine', volume: 0.18 },
          { note: N.D5, duration: d * 1.5, type: 'sine', volume: 0.2 },
          { note: N.E5, duration: d * 1.5, type: 'sine', volume: 0.21 },
          { note: N.D5, duration: d, type: 'sine', volume: 0.18 },
          { note: N.B4, duration: d * 1.5, type: 'sine', volume: 0.18 },
          { note: N.A4, duration: d, type: 'sine', volume: 0.16 },
          { note: N.B4, duration: d, type: 'sine', volume: 0.17 },
          { note: N.D5, duration: d * 1.5, type: 'sine', volume: 0.2 },
          { note: N.G5, duration: d * 3, type: 'sine', volume: 0.24 },
        ];
        const accompaniment: NoteStep[] = [
          { note: N.D5, duration: d * 3, type: 'triangle', volume: 0.07 },
          { note: N.G5, duration: d * 3, type: 'triangle', volume: 0.07 },
          { note: N.B5, duration: d * 4, type: 'triangle', volume: 0.08 },
        ];
        return { melody, accompaniment, loopDuration: 3.6 };
      }

      default:
        return this.getCardMusicScore('tien-phong');
    }
  }

  // ==========================================
  // 3. SOUND EFFECTS (Zero Low-Bass / Pure High-Tech)
  // ==========================================

  // SCAN SOUND (Biometric digital scanner)
  public playScanBeep() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 960 + Math.random() * 400;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, ctx.currentTime + 0.07);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.getDestination());
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }

  // SCAN COMPLETE / VIBE LOCKED
  public playScanLock() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.12, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.45);

        osc.connect(gain);
        gain.connect(this.getDestination());
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.5);
      });
    } catch {}
  }

  // ENERGY BUILD (Bright laser charge shimmer - No 50Hz sub bass)
  public playEnergyBuild() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 1.8);
      filter.Q.setValueAtTime(2.0, now);

      osc.type = 'sawtooth';
      // Starts at 350Hz (No low sub rumble)
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 1.8);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.getDestination());

      osc.start(now);
      osc.stop(now + 2.05);
    } catch {}
  }

  // CARD SUMMON (Rising synth & ethereal arpeggio)
  public playCardSummon() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [329.63, 392.0, 493.88, 587.33, 659.25, 783.99, 987.77];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.09, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.5);

        osc.connect(gain);
        gain.connect(this.getDestination());
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.55);
      });
    } catch {}
  }

  // CARD HOVER
  public playCardHover() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.getDestination());
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {}
  }

  // CARD SELECT
  public playCardSelect() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.getDestination());
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  // CARD CHARGE (Bright, high-frequency energy rise)
  public playCardCharge() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      // Shifted up from 80Hz to 320Hz - pure clean bright rise
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.9);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

      osc.connect(gain);
      gain.connect(this.getDestination());
      osc.start(now);
      osc.stop(now + 1.05);
    } catch {}
  }

  // ULTRA-FAST EXPLOSIVE WHITE FLASH (High-frequency laser snap - No low bass)
  public playPreFlipFlash() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. High-speed white noise laser burst (bandpassed in high registers)
      const bufferSize = Math.floor(ctx.sampleRate * 0.1);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(3500, now);
      noiseFilter.Q.setValueAtTime(2.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.getDestination());
      noise.start(now);

      // 2. High-register electric pulse (stops at 380Hz, never dips to low bass)
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'sawtooth';
      snapOsc.frequency.setValueAtTime(1600, now);
      snapOsc.frequency.exponentialRampToValueAtTime(380, now + 0.08);

      snapGain.gain.setValueAtTime(0.25, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      snapOsc.connect(snapGain);
      snapGain.connect(this.getDestination());
      snapOsc.start(now);
      snapOsc.stop(now + 0.1);
    } catch {}
  }

  // GACHA REVEAL (Bright crystalline fanfares - Sub-bass boom eliminated)
  public playReveal(rarity: RarityLevel) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    try {
      if (rarity === 'HUYEN_THOAI') {
        // LEGENDARY: Sparkling crystal fanfare & celestial chords (No 35Hz sub boom)
        const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0];
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);

          gain.gain.setValueAtTime(0.2, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 1.6);

          osc.connect(gain);
          gain.connect(this.getDestination());
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 1.7);
        });
      } else if (rarity === 'SU_THI') {
        // EPIC: Resonant swell + shimmering chords
        const notes = [392, 493.88, 587.33, 783.99, 987.77];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);

          gain.gain.setValueAtTime(0.18, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 1.2);

          osc.connect(gain);
          gain.connect(this.getDestination());
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 1.25);
        });
      } else {
        // HIEM / THUONG: Bright crystalline triple-chord
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);

          gain.gain.setValueAtTime(0.15, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.8);

          osc.connect(gain);
          gain.connect(this.getDestination());
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.85);
        });
      }
    } catch {}
  }
}

export const soundManager = new SoundManager();
