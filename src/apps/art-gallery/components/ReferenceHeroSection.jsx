import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function ReferenceHeroSection({ memories = [], onOpenMemory, onScrollToNext }) {
  // Helper to get media for a reference memory
  const getRefMedia = (memId, index = 0) => {
    const mem = memories.find((m) => m.id === memId);
    if (mem && mem.media && mem.media[index]) {
      return { mem, media: mem.media[index] };
    }
    return null;
  };

  const refCafe = getRefMedia('mem-ref-2', 0);
  const refDancing = getRefMedia('mem-ref-3', 0);
  const refTallCafe = getRefMedia('mem-ref-3', 1);
  const refVertical = getRefMedia('mem-ref-1', 0);
  const refAmber = getRefMedia('mem-ref-5', 0);
  const refKitchen = getRefMedia('mem-ref-4', 0);

  const hasAnyRefMedia = !!(refCafe || refDancing || refTallCafe || refVertical || refAmber || refKitchen);

  return (
    <section 
      className={`reference-hero ${!hasAnyRefMedia ? 'hero-empty-state' : ''}`} 
      id="reference-hero-section"
    >
      {/* Prominently highlighted Gallery Headline at the top */}
      <div className="hero-header-wrap">
        <div className="hero-title-highlight-glow" aria-hidden="true" />
        <div className="ref-title-container">
          <span className="ref-title-the">THE</span>
          <h1 className="ref-title-art-gallery">Art Gallery</h1>
        </div>
      </div>

      {/* --- PHOTO 1: Top-Left Cafe Night (Vertical 3/4) --- */}
      {refCafe && (
        <div 
          id="mem-ref-2"
          className="ref-media-item pos-cafe-night pinned-item pin-rot-left" 
          onClick={() => onOpenMemory('mem-ref-2', 0)}
          title="12 September 2026 — Click to expand"
        >
          <div className="glass-media-frame" style={{ aspectRatio: '3/4' }}>
            <img src={refCafe.media.url} alt="Luna Cafe late evening" />
          </div>
        </div>
      )}

      {/* Text 1: Below Top-Left Photo */}
      {refCafe && (
        <div className="handwritten-fragment frag-under-topleft">
          {refCafe.mem.text}
        </div>
      )}

      {/* Text 2: Above Dancing Couple */}
      {refDancing && (
        <div className="handwritten-fragment frag-top-center">
          {refDancing.mem.text}
        </div>
      )}

      {/* --- PHOTO 2: Upper-Center Dancing Couple (Horizontal 4/3) --- */}
      {refDancing && (
        <div 
          id="mem-ref-3"
          className="ref-media-item pos-dancing-couple pinned-item pin-rot-right"
          onClick={() => onOpenMemory('mem-ref-3', 0)}
          title="17 September 2026 — Click to expand"
        >
          <div className="glass-media-frame" style={{ aspectRatio: '4/3' }}>
            <img src={refDancing.media.url} alt="Couple slow dancing in window" />
          </div>
        </div>
      )}

      {/* --- PHOTO 3: Top-Right Cafe Multi-pane Window (Vertical 2/3) --- */}
      {refTallCafe && (
        <div 
          id="mem-ref-3b"
          className="ref-media-item pos-tall-cafe pinned-item pin-rot-slight"
          onClick={() => onOpenMemory('mem-ref-3', 1)}
          title="17 September 2026 — Click to expand"
        >
          <div className="glass-media-frame" style={{ aspectRatio: '2/3' }}>
            <img src={refTallCafe.media.url} alt="The Evening Chime window" />
          </div>
        </div>
      )}

      {/* Text 3: Above Lower-Left Window */}
      {refVertical && (
        <div className="handwritten-fragment frag-lower-left">
          {refVertical.mem.text}
        </div>
      )}

      {/* --- PHOTO 4: Lower-Left Vertical Window (Vertical 2/3) --- */}
      {refVertical && (
        <div 
          id="mem-ref-1"
          className="ref-media-item pos-vertical-window pinned-item pin-rot-slight"
          onClick={() => onOpenMemory('mem-ref-1', 0)}
          title="08 September 2026 — Click to expand"
        >
          <div className="glass-media-frame" style={{ aspectRatio: '2/3' }}>
            <img src={refVertical.media.url} alt="Vertical night window" />
          </div>
        </div>
      )}

      {/* --- PHOTO 5: Lower-Center Amber Curtains Window (Vertical 3/4) --- */}
      {refAmber && (
        <div 
          id="mem-ref-5b"
          className="ref-media-item pos-amber-curtains pinned-item pin-rot-left"
          onClick={() => onOpenMemory('mem-ref-5', 0)}
          title="25 September 2026 — Click to expand"
        >
          <div className="glass-media-frame" style={{ aspectRatio: '3/4' }}>
            <img src={refAmber.media.url} alt="Amber curtains in the night" />
          </div>
        </div>
      )}

      {/* Text 4: Above Lower-Right Kitchen Window */}
      {refKitchen && (
        <div className="handwritten-fragment frag-above-kitchen">
          {refKitchen.mem.text}
        </div>
      )}

      {/* --- PHOTO 6: Lower-Right Open Kitchen Window (Horizontal 4/3) --- */}
      {refKitchen && (
        <div 
          id="mem-ref-4"
          className="ref-media-item pos-kitchen-laughter pinned-item pin-rot-right"
          onClick={() => onOpenMemory('mem-ref-4', 0)}
          title="21 September 2026 — Click to expand"
        >
          <div className="glass-media-frame" style={{ aspectRatio: '4/3' }}>
            <img src={refKitchen.media.url} alt="Open kitchen window with friends laughing" />
          </div>
        </div>
      )}

      {/* Text 5: Below Lower-Center Amber Window */}
      {refAmber && (
        <div className="handwritten-fragment frag-bottom-center">
          {refAmber.mem.text}
        </div>
      )}

      {/* Scroll Invitation if media exists */}
      {hasAnyRefMedia && (
        <div className="scroll-invitation" onClick={onScrollToNext}>
          <span>scroll through memories</span>
          <ChevronDown size={14} />
        </div>
      )}
    </section>
  );
}
