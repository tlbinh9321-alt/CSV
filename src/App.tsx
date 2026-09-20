/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppState, CSVCard } from './types';
import { ParticleBackground } from './components/ParticleBackground';
import { SoundToggle } from './components/SoundToggle';
import { FlowProgressBar } from './components/FlowProgressBar';
import { IntroScreen } from './components/IntroScreen';
import { CameraScanner } from './components/CameraScanner';
import { EnergyAwakening } from './components/EnergyAwakening';
import { CardSummon } from './components/CardSummon';
import { GachaReveal } from './components/GachaReveal';
import { ResultScreen } from './components/ResultScreen';
import { CollectionModal } from './components/CollectionModal';
import { ShareModal } from './components/ShareModal';
import {
  generateThreeCards,
  getDiscoveredCardIds,
  markCardDiscovered,
} from './engine/gachaEngine';

export default function App() {
  const [appState, setAppState] = useState<AppState>('INTRO');
  const [summonCards, setSummonCards] = useState<CSVCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<CSVCard | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [isCollectionOpen, setIsCollectionOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Initialize discovered cards from storage
  useEffect(() => {
    setDiscoveredIds(getDiscoveredCardIds());
  }, []);

  // STEP 1: START EXPERIENCE FROM INTRO
  const handleStartExperience = () => {
    setAppState('CAMERA_SCAN');
  };

  // STEP 2: CAMERA SCAN COMPLETE
  const handleScanComplete = (seed: number) => {
    // Generate 3 cards using seed
    const cards = generateThreeCards(seed);
    setSummonCards(cards);
    setAppState('ENERGY_AWAKENING');
  };

  // STEP 3: ENERGY AWAKENING FINISHED
  const handleAwakeningComplete = () => {
    setAppState('CARD_SUMMON');
  };

  // STEP 4: USER CHOOSES 1 CARD
  const handleSelectCard = (card: CSVCard) => {
    setSelectedCard(card);
    // Mark as discovered in collection
    const updated = markCardDiscovered(card.id);
    setDiscoveredIds(updated);
    setAppState('GACHA_REVEAL');
  };

  // STEP 5: REVEAL FINISHED -> GO TO RESULT
  const handleRevealFinished = () => {
    setAppState('RESULT');
  };

  // RESTART
  const handleRestart = () => {
    setSelectedCard(null);
    setSummonCards([]);
    setAppState('INTRO');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050816] text-[#F5F7FF] font-sans overflow-x-hidden selection:bg-cyan-500/30">
      {/* Interactive Background Particles & Cyber Grid */}
      <ParticleBackground
        intensity={
          appState === 'GACHA_REVEAL' || appState === 'ENERGY_AWAKENING'
            ? 'cosmic'
            : appState === 'CARD_SUMMON'
            ? 'high'
            : 'normal'
        }
        accentColor={selectedCard ? selectedCard.mauSac.primary : '#00F0FF'}
      />

      {/* Global Futuristic Flow Progress Bar */}
      <FlowProgressBar currentState={appState} />

      {/* Persistent Global Floating Sound Toggle */}
      <div className="fixed top-2.5 right-3 sm:right-6 z-50">
        <SoundToggle />
      </div>

      {/* MAIN STATE MACHINE ROUTER */}
      <main className="relative z-10 w-full min-h-screen">
        {appState === 'INTRO' && (
          <IntroScreen
            onStart={handleStartExperience}
            onOpenCollection={() => setIsCollectionOpen(true)}
            unlockedCount={discoveredIds.length}
          />
        )}

        {appState === 'CAMERA_SCAN' && (
          <CameraScanner
            onScanComplete={handleScanComplete}
            onCancel={() => setAppState('INTRO')}
          />
        )}

        {appState === 'ENERGY_AWAKENING' && (
          <EnergyAwakening onAwakeningComplete={handleAwakeningComplete} />
        )}

        {appState === 'CARD_SUMMON' && (
          <CardSummon
            cards={summonCards}
            onSelectCard={handleSelectCard}
          />
        )}

        {appState === 'GACHA_REVEAL' && selectedCard && (
          <GachaReveal
            card={selectedCard}
            onRevealFinished={handleRevealFinished}
          />
        )}

        {appState === 'RESULT' && selectedCard && (
          <ResultScreen
            card={selectedCard}
            unlockedCount={discoveredIds.length}
            onOpenShare={() => setIsShareOpen(true)}
            onOpenCollection={() => setIsCollectionOpen(true)}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* COLLECTION MODAL (ARCHIVE) */}
      {isCollectionOpen && (
        <CollectionModal
          discoveredIds={discoveredIds}
          onClose={() => setIsCollectionOpen(false)}
        />
      )}

      {/* SHARE MODAL (1080x1080 HIGH RES CARD) */}
      {isShareOpen && selectedCard && (
        <ShareModal
          card={selectedCard}
          onClose={() => setIsShareOpen(false)}
        />
      )}
    </div>
  );
}
