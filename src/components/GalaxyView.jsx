import { useState, useEffect, useRef } from 'react'
import GalaxyCanvas from './GalaxyCanvas'
import AlbumModal from './AlbumModal'
import SocialsMenu from './SocialsMenu'
import { starsData as initialStarsData } from '../data/starsData'
import VinylApp from './vinyl/VinylApp'
import { useNavigate } from 'react-router-dom'

function GalaxyView() {
  const [selectedStar, setSelectedStar] = useState(null)
  const [showOrbList, setShowOrbList] = useState(false)
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

  // Handle Cyber Studio navigation (Album 9 / star_8)
  useEffect(() => {
    if (selectedStar?.id === 'star_8') {
      navigate('/studio')
      setSelectedStar(null) // Reset selection
    }
  }, [selectedStar, navigate])

  // Handle Headspace navigation (Album 8 / star_7)
  useEffect(() => {
    if (selectedStar?.id === 'star_7') {
      navigate('/headspace')
      setSelectedStar(null)
    }
  }, [selectedStar, navigate])

  // Handle Spooky navigation (Album 12 / star_11)
  useEffect(() => {
    if (selectedStar?.id === 'star_11') {
      navigate('/spooky')
      setSelectedStar(null)
    }
  }, [selectedStar, navigate])

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden" style={{ fontFamily: '"Outfit", sans-serif' }}>
      <audio 
        ref={audioRef} 
        src="/02 Cornfield Chase.mp3" 
        loop 
        preload="auto"
      />

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
      <div className="absolute top-0 left-0 p-5 md:p-10 flex flex-col justify-start z-10 pointer-events-none select-none">
        <div className="flex flex-col md:flex-row items-start md:items-baseline gap-2 md:gap-4">
          <h1 className="text-white text-lg md:text-2xl font-extralight tracking-[0.3em] md:tracking-[0.5em] uppercase opacity-80 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            Koriverse
          </h1>
          <span className="w-8 md:w-12 h-[1px] bg-white/20 mb-1 md:mb-2 hidden md:block"></span>
        </div>
        <p className="text-white/40 mt-1 text-[8px] md:text-[10px] font-light tracking-[0.2em] md:tracking-[0.4em] uppercase ml-1">
          Personal Universe System // 26.04
        </p>
      </div>

      {/* Interface Controls (Top Right) */}
      <div className="absolute top-5 right-5 md:top-10 md:right-10 z-30 flex flex-col items-end gap-3 md:pr-2">
        {/* Main Navigation (Socials/About) */}
        <SocialsMenu />

        {/* Audio Toggle Button */}
        <button
          onClick={() => setIsMusicPlaying(!isMusicPlaying)}
          className="group flex items-center justify-center w-11 h-11 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-500 active:scale-90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_16px_-4px_rgba(0,0,0,0.5)]"
          aria-label={isMusicPlaying ? "Mute Music" : "Play Music"}
        >
          {isMusicPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-white transition-all duration-500">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40 group-hover:text-white transition-all duration-500">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          )}
        </button>

        {/* Orb List Toggle (Now below Sound) */}
        <div className="relative">
          <button
            onClick={() => setShowOrbList(!showOrbList)}
            className={`group flex items-center justify-center w-11 h-11 transition-all duration-500 active:scale-90 rounded-full border shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_16px_-4px_rgba(0,0,0,0.5)] ${
              showOrbList 
                ? 'bg-white/20 border-white/40 backdrop-blur-3xl' 
                : 'bg-white/[0.03] border-white/10 backdrop-blur-3xl hover:bg-white/10 hover:border-white/20'
            }`}
            aria-label="View Orb List"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-all duration-500 ${showOrbList ? 'text-white' : 'text-white/40 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Orb List Dropdown (Enhanced Glassmorphism) */}
          {showOrbList && (
            <div className="absolute top-0 right-14 w-64 max-h-[70vh] overflow-y-auto bg-white/[0.01] backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] animate-in fade-in zoom-in-95 slide-in-from-right-4 duration-500 custom-scrollbar">
              <div className="p-3 space-y-1">
                {/* Search Bar */}
                <div className="px-2 py-2 mb-2 border-b border-white/5">
                  <div className="relative group/search">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="SEARCH ORBS..."
                      autoFocus
                      className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-[10px] tracking-[0.2em] text-white placeholder:text-white/20 focus:outline-none focus:bg-white/[0.08] focus:border-white/20 transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 group-focus-within/search:opacity-40 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                  </div>
                </div>

                {initialStarsData
                  .filter(star => 
                    star.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                    !star.name.startsWith('Album ')
                  )
                  .map((star) => (
                    <button
                      key={star.id}
                      onClick={() => {
                        setSelectedStar(star)
                        setShowOrbList(false)
                        setSearchQuery('')
                      }}
                      className="w-full px-4 py-3.5 text-left text-[10px] tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/10 flex justify-between items-center transition-all duration-300 group/item rounded-2xl"
                    >
                      <span className="uppercase font-light">{star.name}</span>
                      <span className="opacity-0 group-hover/item:opacity-100 text-[8px] tracking-normal transition-all duration-500 transform translate-x-2 group-hover/item:translate-x-0 text-white/40">EXPLORE →</span>
                    </button>
                  ))}
                
                {initialStarsData.filter(star => 
                  star.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                  !star.name.startsWith('Album ')
                ).length === 0 && (
                  <div className="px-4 py-10 text-center text-[10px] tracking-[0.2em] text-white/20 uppercase">
                    No Orbs Found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedStar && selectedStar.id !== 'star_2' && selectedStar.id !== 'star_6' && selectedStar.id !== 'star_7' && selectedStar.id !== 'star_8' && selectedStar.id !== 'star_11' && (
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
