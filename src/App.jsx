import { useState } from 'react'
import GalaxyCanvas from './components/GalaxyCanvas'
import AlbumModal from './components/AlbumModal'
import { starsData as initialStarsData } from './data/starsData'

function App() {
  const [selectedStar, setSelectedStar] = useState(null)
  
  // Phase 5: Persisted Global Drag State
  const [galaxyData, setGalaxyData] = useState(initialStarsData)

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* 3D Canvas Layer */}
      <GalaxyCanvas 
        selectedStar={selectedStar} 
        setSelectedStar={setSelectedStar} 
        galaxyData={galaxyData} 
        setGalaxyData={setGalaxyData} 
      />
      
      {/* UI Layer */}
      <div className="absolute top-0 left-0 w-full p-8 flex flex-col justify-start z-10 pointer-events-none">
        <h1 className="text-white text-5xl font-extrabold tracking-widest uppercase opacity-90 drop-shadow-lg">
          Kohiriverse
        </h1>
        <p className="text-zinc-400 mt-2 text-lg drop-shadow-md">
          Your Personal Universe
        </p>
      </div>

      {/* Modal Layer */}
      <AlbumModal selectedStar={selectedStar} onClose={() => setSelectedStar(null)} />
    </div>
  )
}

export default App
