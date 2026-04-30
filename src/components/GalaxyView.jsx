import { useState, useEffect, useRef } from 'react'
import GalaxyCanvas from './GalaxyCanvas'
import AlbumModal from './AlbumModal'
import SocialsMenu from './SocialsMenu'
import { starsData as initialStarsData } from '../data/starsData'
import VinylApp from './vinyl/VinylApp'
import { useNavigate } from 'react-router-dom'

function GalaxyView() {
  const [selectedStar, setSelectedStar] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [galaxyData, setGalaxyData] = useState(initialStarsData)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const audioRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isMusicPlaying && !selectedStar) {
      audioRef.current?.play().catch(e => console.error("Audio playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isMusicPlaying, selectedStar])

  // Handle Photobooth navigation (Album 7 / star_6)
  useEffect(() => {
    if (selectedStar?.id === 'star_6') {
      navigate('/photobooth/home')
      setSelectedStar(null) // Reset selection so returning works
    }
  }, [selectedStar, navigate])

  const filteredStars = searchQuery.trim() 
    ? galaxyData.filter(star => star.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden" style={{ fontFamily: '"Outfit", sans-serif' }}>
      <audio 
        ref={audioRef} 
        src="/02 Cornfield Chase.mp3" 
        loop 
        preload="auto"
      />

      {/* CSS Shooting Stars */}
      {selectedStar?.id !== 'star_2' && (
        <section className="css-shooting-stars">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </section>
      )}

      {/* 3D Canvas Layer */}
      {selectedStar?.id !== 'star_2' && (
        <GalaxyCanvas
          selectedStar={selectedStar}
          setSelectedStar={setSelectedStar}
          galaxyData={galaxyData}
          setGalaxyData={setGalaxyData}
          setIsDragging={() => {}} // Placeholder or real state if needed
        />
      )}

      {/* Header Label (Top Left) */}
      <div className="absolute top-0 left-0 p-10 flex flex-col justify-start z-10 pointer-events-none select-none">
        <div className="flex items-baseline gap-4">
          <h1 className="text-white text-2xl font-extralight tracking-[0.5em] uppercase opacity-80 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            Kohiriverse
          </h1>
          <span className="w-12 h-[1px] bg-white/20 mb-2"></span>
        </div>
        <p className="text-white/40 mt-1 text-[10px] font-light tracking-[0.4em] uppercase ml-1">
          Personal Universe System // 26.04
        </p>
      </div>

      {/* Subtle Search Bar (Top Right) */}
      <div className="absolute top-10 right-10 z-20 flex flex-col items-end gap-2 pr-2">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/40 group-focus-within:text-white transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="FIND A PLANET..."
              className="bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full pl-10 pr-4 py-2 text-[10px] tracking-[0.2em] text-white/40 placeholder-white/40 focus:text-white focus:placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-white/30 w-40 transition-all duration-500 focus:w-60 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.1)]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <SocialsMenu />
        </div>

        {/* Audio Toggle Button */}
        <button
          onClick={() => setIsMusicPlaying(!isMusicPlaying)}
          className="group flex items-center justify-center w-10 h-10 bg-white/5 backdrop-blur-2xl border border-white/20 rounded-full hover:bg-white/10 hover:border-white/30 transition-all duration-300 active:scale-95 shadow-[inset_0_1px_0.5px_rgba(255,255,255,0.1)] mr-[2px]"
          aria-label={isMusicPlaying ? "Mute Music" : "Play Music"}
        >
          {isMusicPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 group-hover:text-white transition-colors duration-300">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 group-hover:text-white transition-colors duration-300">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>

        {/* Search Results Dropdown */}
        {filteredStars.length > 0 && (
          <div className="w-64 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            {filteredStars.slice(0, 5).map((star) => (
              <button
                key={star.id}
                onClick={() => {
                  setSelectedStar(star)
                  setSearchQuery('')
                }}
                className="w-full px-5 py-3 text-left text-[10px] tracking-[0.2em] text-white/60 hover:text-white hover:bg-white/10 flex justify-between items-center transition-all group/item"
              >
                <span className="uppercase">{star.name}</span>
                <span className="opacity-0 group-hover/item:opacity-100 text-[8px] tracking-normal transition-opacity">GO →</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedStar && selectedStar.id !== 'star_2' && selectedStar.id !== 'star_6' && (
        <AlbumModal selectedStar={selectedStar} onClose={() => setSelectedStar(null)} />
      )}

      {selectedStar?.id === 'star_2' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black">
          <VinylApp onBack={() => setSelectedStar(null)} />
        </div>
      )}
    </div>
  )
}

export default GalaxyView
