import { Routes, Route } from 'react-router-dom'
import GalaxyView from './components/GalaxyView'
import PhotoboothApp from './photobooth/PhotoboothApp'

function App() {
  return (
    <Routes>
      <Route path="/" element={<GalaxyView />} />
      <Route path="/photobooth/*" element={<PhotoboothApp />} />
    </Routes>
  )
}

export default App
