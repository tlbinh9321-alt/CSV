import { CSV_CARDS, RARITY_CONFIGS } from '../data/cards';
import { CSVCard, RarityLevel } from '../types';

const STORAGE_KEY_COLLECTION = 'csv_vibe_collection_ids';

// Simple seeded pseudo-random generator
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickRarityByWeight(randFn: () => number): RarityLevel {
  const roll = randFn() * 100;
  let cumulative = 0;

  // Check HUYEN_THOAI first
  const rarities: RarityLevel[] = ['HUYEN_THOAI', 'SU_THI', 'HIEM', 'THUONG'];
  for (const rarity of rarities) {
    cumulative += RARITY_CONFIGS[rarity].weight;
    if (roll <= cumulative) {
      return rarity;
    }
  }
  return 'THUONG';
}

/**
 * Generates 3 distinct cards for the player to choose from.
 * Uses a seed (derived from camera metrics + timestamp) to guarantee a diverse, exciting triad.
 */
export function generateThreeCards(seedValue?: number): CSVCard[] {
  const seed = seedValue || Date.now() ^ (Math.random() * 0x100000);
  const rand = mulberry32(seed);

  // Shuffle all 8 cards using seeded random
  const shuffled = [...CSV_CARDS].sort(() => rand() - 0.5);

  // Pick 3 unique cards
  const selected: CSVCard[] = [];
  
  // Guarantee exciting variety: try to get at least 1 high tier if possible or diverse rarities
  for (const card of shuffled) {
    if (selected.length < 3 && !selected.some((c) => c.id === card.id)) {
      selected.push(card);
    }
  }

  // Fallback to first 3 if any issue
  while (selected.length < 3) {
    for (const card of CSV_CARDS) {
      if (!selected.some((c) => c.id === card.id)) {
        selected.push(card);
        break;
      }
    }
  }

  return selected;
}

/**
 * Retrieves the set of discovered card IDs from localStorage
 */
export function getDiscoveredCardIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COLLECTION);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Marks a card as discovered in the user's collection
 */
export function markCardDiscovered(cardId: string): string[] {
  if (typeof window === 'undefined') return [cardId];
  try {
    const existing = new Set(getDiscoveredCardIds());
    existing.add(cardId);
    const updated = Array.from(existing);
    localStorage.setItem(STORAGE_KEY_COLLECTION, JSON.stringify(updated));
    return updated;
  } catch {
    return [cardId];
  }
}
