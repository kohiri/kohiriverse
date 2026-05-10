import React, { useMemo } from 'react';
import MasonryGrid from './MasonryGrid';
import Scrapbook from './Scrapbook';

export default function AlbumModal({ selectedStar, onClose }) {
  if (!selectedStar) return null;

  const isScrapbook = selectedStar.name === 'Scrapbook';
  const isEmptyAlbum = ['Album 4', 'Album 13', 'Album 14'].includes(selectedStar.name);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Modal Glassmorphism Panel */}
      <div className={`relative backdrop-blur-xl bg-white/10 border border-white/20 p-4 md:p-8 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] flex flex-col items-center overflow-hidden glow-panel transition-all duration-700 ${isScrapbook ? 'max-w-[1400px] w-[95vw] mx-auto' : 'max-w-2xl w-[calc(100%-2rem)] md:w-full mx-4'}`}>
        
        {/* Soft decorative glow behind the content */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: `${selectedStar.color}40` }}></div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 md:top-3 md:right-3 p-2 bg-black/40 hover:bg-black/60 border border-white/20 rounded-full text-white transition-all z-50 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Album / Star Name */}
        {!isScrapbook && (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center z-10 mt-4 md:mt-0" style={{ textShadow: `0 0 15px ${selectedStar.color}` }}>
              {selectedStar.name}
            </h2>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-4 md:my-6 z-10"></div>
          </>
        )}
        
        {/* Content Area */}
        <div className={`w-full z-10 ${isScrapbook ? 'overflow-hidden flex items-center justify-center' : 'overflow-y-auto pr-2 pb-2 max-h-[60vh]'}`}>
          {isScrapbook ? (
            <Scrapbook />
          ) : isEmptyAlbum ? (
            <div className="flex flex-col items-center justify-center py-20 relative">
              {/* Sad Glassmorphic Animation */}
              <div className="relative w-40 h-40 mb-8">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full animate-pulse shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]"></div>
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl animate-float-slow"></div>
                
                {/* Floating "Tears" or "Glitches" */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                  <div className="absolute w-[2px] h-8 bg-gradient-to-b from-white/20 to-transparent rounded-full top-1/2 left-[30%] animate-drop opacity-40"></div>
                  <div className="absolute w-[2px] h-10 bg-gradient-to-b from-white/20 to-transparent rounded-full top-1/3 left-[70%] animate-drop delay-700 opacity-40"></div>
                  <div className="absolute w-[2px] h-6 bg-gradient-to-b from-white/20 to-transparent rounded-full top-1/4 left-[50%] animate-drop delay-300 opacity-40"></div>
                </div>

                {/* Center Symbol */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </div>
              </div>

              <p className="text-white/40 text-xs md:text-sm uppercase tracking-[0.4em] font-light text-center animate-fade-in">
                no updates here sorry
              </p>
              
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float-slow {
                  0%, 100% { transform: translate(0, 0) scale(1); }
                  50% { transform: translate(5px, -15px) scale(1.05); }
                }
                @keyframes drop {
                  0% { transform: translateY(-20px); opacity: 0; }
                  20% { opacity: 0.4; }
                  80% { opacity: 0.4; }
                  100% { transform: translateY(40px); opacity: 0; }
                }
                @keyframes fade-in {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
                .animate-drop { animation: drop 3s ease-in linear infinite; }
                .animate-fade-in { animation: fade-in 1.5s ease-out forwards; }
              `}} />
            </div>
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
