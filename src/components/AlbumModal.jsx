import React, { useMemo } from 'react';
import MasonryGrid from './MasonryGrid';
import Scrapbook from './Scrapbook';

export default function AlbumModal({ selectedStar, onClose }) {
  if (!selectedStar) return null;

  const isScrapbook = selectedStar.name === 'Scrapbook';

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Modal Glassmorphism Panel */}
      <div className={`relative backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] flex flex-col items-center overflow-hidden glow-panel transition-all duration-700 ${isScrapbook ? 'max-w-[1400px] w-[95vw] mx-auto' : 'max-w-2xl w-full mx-4'}`}>
        
        {/* Soft decorative glow behind the content */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: `${selectedStar.color}40` }}></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Album / Star Name */}
        {!isScrapbook && (
          <>
            <h2 className="text-3xl font-bold text-white mb-2 text-center z-10" style={{ textShadow: `0 0 15px ${selectedStar.color}` }}>
              {selectedStar.name}
            </h2>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-6 z-10"></div>
          </>
        )}
        
        {/* Content Area */}
        <div className={`w-full z-10 ${isScrapbook ? 'overflow-hidden flex items-center justify-center' : 'overflow-y-auto pr-2 pb-2 max-h-[60vh]'}`}>
          {isScrapbook ? (
            <Scrapbook />
          ) : selectedStar.photos && selectedStar.photos.length > 0 ? (
            <MasonryGrid 
              items={selectedStar.photos.map((photoUrl, idx) => ({ 
                image: photoUrl, 
                title: `Memory ${idx + 1}` 
              }))} 
            />
          ) : (
            <p className="text-white/80 col-span-full text-center text-sm uppercase tracking-widest py-8">
              No photos found
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
