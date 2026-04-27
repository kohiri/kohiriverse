import React, { useEffect, useRef } from 'react';
import '../../vinyl.css';
import VinylRecord from './VinylRecord';
import ClubKuruSection from './ClubKuruSection';
import { playlistData } from '../../data/vinylData';
import LiquidEther from './LiquidEther';

export default function VinylApp({ onBack }) {
  const containerRef = useRef(null);

  // Ensure we scroll to top when mounting this view
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.parentElement.scrollTo(0, 0);
    }
  }, []);

  return (
    <div ref={containerRef} className="vinyl-app-root bg-[#050505] text-white font-['Outfit'] min-h-screen relative overflow-x-hidden">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm tracking-widest uppercase cursor-pointer"
        style={{ fontFamily: '"Outfit", sans-serif' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Galaxy
      </button>

      <div className="app-container relative min-h-screen p-[4rem_2rem] flex flex-col items-center">
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <LiquidEther
            colors={['#5227FF', '#FF9FFC', '#B497CF']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        <div className="background-glow fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] pointer-events-none z-[-1]" style={{ background: 'radial-gradient(circle, rgba(138,43,226,0.05) 0%, rgba(0,0,0,0) 70%)' }}></div>
        
        <header className="header text-center mb-20 relative z-10">
          <h1 className="font-extralight text-[2.5rem] tracking-[0.4em] uppercase mb-2 text-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            Kohiriverse // Music
          </h1>
          <p className="text-[0.75rem] tracking-[0.2em] text-white/40">SELECT A RECORD TO PLAY ON SPOTIFY</p>
        </header>

        <main className="playlist-grid grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-y-16 gap-x-12 w-full max-w-[1200px] relative z-10">
          {playlistData.map((record) => (
            <VinylRecord
              key={record.id}
              coverUrl={record.coverUrl}
              vinylColor={record.vinylColor}
              title={record.title}
              spotifyUrl={record.spotifyUrl}
            />
          ))}
        </main>
      </div>

      <ClubKuruSection />
    </div>
  );
}
