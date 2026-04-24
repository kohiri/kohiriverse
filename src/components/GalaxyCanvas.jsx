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
    if (!controlsRef.current) return

    if (selectedStar) {
      // Normal galaxy planet focus
      const [x, y, z] = selectedStar.position
      controlsRef.current.setLookAt(x + 6, y + 2, z + 15, x, y, z, true)
    } else {
      // Reset to wide galaxy view
      controlsRef.current.setLookAt(0, 0, 50, 0, 0, 0, true)
    }
  }, [selectedStar])

  useFrame((state, delta) => {
    if (!selectedStar && !isDragging && controlsRef.current) {
      // Free-drift: gently truck sideways through space
      controlsRef.current.truck(0.04 * delta, 0, false)
    }
  })

  return (
    <CameraControls
      ref={controlsRef}
      enabled={!isDragging}
      maxDistance={80}
      minDistance={5}
      smoothTime={0.4}
      dollyToCursor={true}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI - Math.PI / 6}
    />
  )
}

export default function GalaxyCanvas({
  selectedStar,
  setSelectedStar,
  galaxyData,
  setGalaxyData
}) {
  const [isDragging, setIsDragging] = useState(false)
  const showGalaxy = true

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 50], fov: 45 }}
        onPointerMissed={() => setSelectedStar(null)}
      >
        {/* ── Background colour — swapped by inner scene via color attach ── */}
        <color attach="background" args={['#010104']} />
        {showGalaxy && <fog attach="fog" args={['#010104', 50, 800]} />}

        {/* ══════════════ GALAXY SCENE ══════════════ */}
        {showGalaxy && (
          <>
            <ambientLight intensity={2.5} />

            <Suspense fallback={null}>
              <group>
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

            {/* Deep Space Background */}
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



            {/* Distant Galaxies */}
            <DistantGalaxy position={[-50, -25, -100]} />
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
          </>
        )}


        <SceneController
          selectedStar={selectedStar}
          isDragging={isDragging}
        />
      </Canvas>
    </div>
  )
}
