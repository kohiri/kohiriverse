import { Routes, Route } from 'react-router-dom'
import GalaxyView from './components/GalaxyView'
import PhotoboothApp from './photobooth/PhotoboothApp'
import StudioApp from './studio/StudioApp'
import HeadspacePortal from './apps/headspace/HeadspacePortal'

function App() {
  return (
    <Routes>
      <Route path="/" element={<GalaxyView />} />
      <Route path="/photobooth/*" element={<PhotoboothApp />} />
      <Route path="/studio/*" element={<StudioApp />} />
      <Route path="/headspace/*" element={<HeadspacePortal />} />
    </Routes>
  )
}

export default App
