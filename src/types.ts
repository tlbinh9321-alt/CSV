export type RarityLevel = 'THUONG' | 'HIEM' | 'SU_THI' | 'HUYEN_THOAI';

export interface RarityConfig {
  id: RarityLevel;
  label: string;
  stars: string;
  weight: number; // percentage (e.g. 45, 30, 20, 5)
  color: string;
  glowColor: string;
  textColor: string;
}

export interface CardStats {
  sangTao: number;
  ketNoi: number;
  khamPha: number;
  butPha: number;
  chienLuoc: number;
}

export interface CSVCard {
  id: string;
  cardNo: string;
  ten: string;
  he: string;
  rarity: RarityLevel;
  tagline: string;
  moTa: string;
  diemManh: string[];
  mauSac: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
    bgGradient: string;
    aura: string;
  };
  icon: string;
  stats: CardStats;
  symbol: string;
}

export type AppState =
  | 'INTRO'
  | 'CAMERA_SCAN'
  | 'ENERGY_AWAKENING'
  | 'CARD_SUMMON'
  | 'CARD_SELECTED'
  | 'GACHA_REVEAL'
  | 'RESULT';
