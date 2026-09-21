import React, { useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, Plus, Volume2, VolumeX } from 'lucide-react';
import ReferenceHeroSection from './ReferenceHeroSection';
import MemoryItem from './MemoryItem';
import GlassCalendar from './GlassCalendar';
import SubtleTimeline from './SubtleTimeline';
import MemoryLightbox from './MemoryLightbox';
import AddMemoryModal from './AddMemoryModal';
import ShootingStarCursor from './ShootingStarCursor';
import { useMemories } from '../hooks/useMemories';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HumanExperienceGallery({ onBack }) {
  const { memories, addMemory, deleteMedia, deleteMemory, resetMemories, highlightedId, highlightMemory } = useMemories();
  useScrollReveal();

  const [activeLightbox, setActiveLightbox] = useState(null); // { memory, initialIndex }
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [ambientAudioPlaying, setAmbientAudioPlaying] = useState(false);

  // Handle opening a memory in lightbox
  const handleOpenMemory = (memoryId, mediaIndex = 0) => {
    // Search in memories
    const found = memories.find((m) => m.id === memoryId);
    if (found) {
      setActiveLightbox({ memory: found, initialIndex: mediaIndex });
    }
  };

  // Scroll to a specific memory and highlight it
  const handleScrollToMemory = (memoryId) => {
    highlightMemory(memoryId);
    const targetElement = document.getElementById(memoryId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Scroll smoothly past reference hero
  const handleScrollToNext = () => {
    const extendedSection = document.getElementById('extended-memories-section');
    if (extendedSection) {
      extendedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter memories for the extended vertical scroll (those not exclusively represented in hero or added dynamically)
  const extendedMemories = memories.filter((m) => !m.isReferenceKey || m.id.startsWith('mem-custom'));

  return (
    <div className="gallery-container">
      {/* Interactive Shooting Star Cursor Canvas in #FF1493 */}
      <ShootingStarCursor />

      {/* Far Left and Far Right Screen Edge Tiger Artworks */}
      <img src="/tigerleft.png" alt="Tiger Left" className="screen-tiger-img tiger-far-left" />
      <img src="/tigerright.png" alt="Tiger Right" className="screen-tiger-img tiger-far-right" />

      {/* Floating Top Navigation */}
      <header className="floating-header">
        <div className="header-left">
          <button 
            className="back-btn" 
            onClick={() => {
              if (onBack) {
                onBack();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            title="Return / Scroll to top"
            aria-label="Back"
          >
            <ArrowLeft size={16} strokeWidth={2.2} />
          </button>
        </div>

        <div className="header-right">
          <button 
            className={`glass-icon-btn ${showCalendar ? 'active' : ''}`}
            onClick={() => setShowCalendar(true)}
            title="Open Calendar Navigation"
            aria-label="Open Calendar Navigation"
          >
            <CalendarIcon size={16} />
          </button>
        </div>
      </header>

      {/* Side Chronological Timeline */}
      <SubtleTimeline 
        memories={memories} 
        onSelectMemory={handleScrollToMemory}
        activeMemoryId={highlightedId}
      />

      {/* 1. Reference Composition (Exact recreation of the attached reference image) */}
      <ReferenceHeroSection 
        memories={memories}
        onOpenMemory={handleOpenMemory}
        onScrollToNext={handleScrollToNext}
      />

      {/* 2. Extended Organic Scrolling Memories */}
      <section 
        className="extended-memories-section" 
        id="extended-memories-section"
      >
        {extendedMemories.map((mem, index) => (
          <MemoryItem 
            key={mem.id}
            memory={mem}
            index={index}
            isHighlighted={highlightedId === mem.id}
            onOpenMemory={handleOpenMemory}
            onDeleteMemory={deleteMemory}
          />
        ))}
      </section>

      {/* Calendar Overlay */}
      {showCalendar && (
        <GlassCalendar 
          memories={memories}
          onSelectDate={handleScrollToMemory}
          onResetMemories={resetMemories}
          onClose={() => setShowCalendar(false)}
        />
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <AddMemoryModal 
          onAddMemory={(newMem) => {
            const newId = addMemory(newMem);
            setTimeout(() => {
              handleScrollToMemory(newId);
            }, 300);
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Immersive Lightbox */}
      {activeLightbox && (
        <MemoryLightbox 
          memory={activeLightbox.memory}
          initialMediaIndex={activeLightbox.initialIndex}
          onClose={() => setActiveLightbox(null)}
          onDeleteMedia={(memId, mediaIdx) => {
            deleteMedia(memId, mediaIdx);
            const current = memories.find((m) => m.id === memId);
            if (!current || (current.media || []).length <= 1) {
              setActiveLightbox(null);
            } else {
              setActiveLightbox((prev) => ({
                ...prev,
                memory: {
                  ...current,
                  media: current.media.filter((_, i) => i !== mediaIdx)
                }
              }));
            }
          }}
        />
      )}
    </div>
  );
}
