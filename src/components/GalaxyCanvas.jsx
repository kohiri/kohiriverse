import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import StarsField from './StarsField'
import ShootingStars from './ShootingStars'
import DistantGalaxy from './DistantGalaxy'
import CustomStarfield from './CustomStarfield'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Constellation from './Constellation'
import * as THREE from 'three'

// --- Constellation Data Configuration ---
const geminiStars = [
  new THREE.Vector3(-2, 1, 0),
  new THREE.Vector3(-1, 2, 0),
  new THREE.Vector3(0, 1.5, 0),
  new THREE.Vector3(1, 2.2, 0),
  new THREE.Vector3(2, 1, 0),
  new THREE.Vector3(0.5, 0, 0),
  new THREE.Vector3(-0.5, 0, 0),
];

const geminiConnections = [
  [0, 1], [1, 2], [2, 3], [3, 4], // top arc
  [2, 5], [2, 6] // body split
];

const sagittariusStars = [
  new THREE.Vector3(-1, 1, 0),
  new THREE.Vector3(0, 2, 0),
  new THREE.Vector3(1, 1.5, 0),
  new THREE.Vector3(2, 0.5, 0),
  new THREE.Vector3(1, -0.5, 0),
  new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(-1, -0.5, 0),
];

const sagittariusConnections = [
  [0, 1], [1, 2], [2, 3],
  [3, 4], [4, 5], [5, 6],
  [6, 0] // loop shape
];

function SceneController({ selectedStar, isDragging }) {
  const controlsRef = useRef()

  useEffect(() => {
    if (selectedStar && controlsRef.current) {
      // Camera Navigation (Phase 3): Lerp to focus on the selected planet
      const [x, y, z] = selectedStar.position
      
      // Shift camera to the right slightly so the left-aligned modal doesn't block the planet
      controlsRef.current.setLookAt(
        x + 6, y + 2, z + 15, // Camera position
        x, y, z,              // Target to look at
        true                  // Smooth transition
      )
    } else if (controlsRef.current) {
      // Reset view to wide galaxy view
      controlsRef.current.setLookAt(
        0, 0, 50,             // Default wide camera position
        0, 0, 0,              // Center target
        true
      )
    }
  }, [selectedStar])

  useFrame((state, delta) => {
    if (!selectedStar && !isDragging && controlsRef.current) {
      // Free-drift: gently truck sideways through space instead of orbiting origin
      controlsRef.current.truck(0.04 * delta, 0, false);
    }
  })

  return (
    <CameraControls 
      ref={controlsRef} 
      enabled={!isDragging}         // Disables zooming/panning while actively dragging an object
      maxDistance={80}              // Upper zoom-out limit — prevents flying too far from the galaxy
      minDistance={5}               // Minimum zoom-in distance
      smoothTime={0.4}
      dollyToCursor={true}          // Zoom toward cursor position, not fixed origin
      minPolarAngle={Math.PI / 6}   // Prevent camera going too far above (30°)
      maxPolarAngle={Math.PI - Math.PI / 6} // Prevent camera going too far below
    />
  )
}

export default function GalaxyCanvas({ selectedStar, setSelectedStar, galaxyData, setGalaxyData }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 50], fov: 45 }} onPointerMissed={() => setSelectedStar(null)}>
        <color attach="background" args={['#010104']} />
        <fog attach="fog" args={['#010104', 50, 800]} />
        
        {/* Environment Lighting Setup */}
        <ambientLight intensity={2.5} />
        
        {/* Suspense is required for components that use `useLoader` asynchronously */}
        <Suspense fallback={null}>
          <group>
            {/* Interactive Star Field replaces single object */}
            <StarsField 
              onStarClick={setSelectedStar} 
              galaxyData={galaxyData} 
              setGalaxyData={setGalaxyData}
              setIsDragging={setIsDragging}
            />
          </group>
        </Suspense>

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1.0} mipmapBlur intensity={1.5} />
        </EffectComposer>

        {/* Deep Space Background Environment */}
        <CustomStarfield count={25000} maxDistance={600} />

        {/* Zodiac Constellations */}
        <Constellation 
          name="Gemini"
          stars={geminiStars} 
          connections={geminiConnections} 
          textureUrl="/textures/gemini_silhouette.png" 
          position={[-200, 150, -500]} 
          rotation={[0.2, 0.4, 0]}
          scale={10} 
        />
        <Constellation 
          name="Sagittarius"
          stars={sagittariusStars} 
          connections={sagittariusConnections} 
          textureUrl="/textures/sagittarius_silhouette.png" 
          position={[250, -100, -600]} 
          rotation={[-0.1, -0.3, 0.2]}
          scale={12} 
        />

        <ShootingStars count={8} />

        {/* The first CPU-based Points spiral galaxy (Orange/Purple) */}
        <DistantGalaxy position={[-50, -25, -100]} />
        
        {/* The second CPU-based Points spiral galaxy (Green/Deep Blue) - Placed roughly 20 distance from center, opposite angle */}
        <DistantGalaxy 
          position={[30, 20, 15]} 
          rotation={[-Math.PI * 0.15, Math.PI * 0.8, -Math.PI * 0.05]}
          insideColor="#52d025" 
          outsideColor="#13099a"
          count={30000}
          branches={4}
          radius={5}
          scale={[2.5, 2.5, 2.5]}
        />
        <SceneController selectedStar={selectedStar} isDragging={isDragging} />
      </Canvas>
    </div>
  )
}
