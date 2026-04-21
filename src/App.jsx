import { useState, useEffect } from 'react'
import GalaxyCanvas from './components/GalaxyCanvas'
import AlbumModal from './components/AlbumModal'
import SocialsMenu from './components/SocialsMenu'
import { starsData as initialStarsData } from './data/starsData'

function App() {
  const [selectedStar, setSelectedStar] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [galaxyData, setGalaxyData] = useState(initialStarsData)

  const filteredStars = searchQuery.trim() 
    ? galaxyData.filter(star => star.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden" style={{ fontFamily: '"Outfit", sans-serif' }}>
      {/* 3D Canvas Layer */}
      <GalaxyCanvas
        selectedStar={selectedStar}
        setSelectedStar={setSelectedStar}
        galaxyData={galaxyData}
        setGalaxyData={setGalaxyData}
        setIsDragging={() => {}} // Placeholder or real state if needed
      />

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

      {selectedStar && (
        <AlbumModal selectedStar={selectedStar} onClose={() => setSelectedStar(null)} />
      )}
    </div>
  )
}

export default App
