import { Routes, Route } from 'react-router-dom'
import GalaxyView from './components/GalaxyView'
import PhotoboothApp from './photobooth/PhotoboothApp'
import StudioApp from './studio/StudioApp'
import HeadspacePortal from './apps/headspace/HeadspacePortal'
import SpookyGame from './apps/spooky/SpookyGame'
import { useNavigate } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<GalaxyView />} />
      <Route path="/photobooth/*" element={<PhotoboothApp />} />
      <Route path="/studio/*" element={<StudioApp />} />
      <Route path="/headspace/*" element={<HeadspacePortal />} />
      <Route path="/spooky" element={<SpookyGameWrapper />} />
    </Routes>
  )
}

function SpookyGameWrapper() {
  const navigate = useNavigate()
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#000' }}>
      <SpookyGame onBack={() => navigate('/')} />
    </div>
  )
}

export default App
