import { Suspense, useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import Atmosphere from './Atmosphere'

function TexturedMaterial({ url, color, hovered }) {
  const texture = useTexture(url);

  return (
    <meshStandardMaterial
      map={texture}
      emissive={color}
      emissiveIntensity={hovered ? 0.4 : 0.0}
      roughness={0.8}
      metalness={0.1}
    />
  )
}

function FallbackMaterial({ color, hovered }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={hovered ? 0.5 : 0.15}
      roughness={0.8}
    />
  )
}

export default function Star({ position, color, size, name, texture, onClick }) {
  const groupRef = useRef()
  const gravityGroupRef = useRef()
  const coreRef = useRef()

  const [hovered, setHovered] = useState(false)
  
  // Random offset for floating animation to make each star unique
  const randomOffset = useRef(Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (!groupRef.current || !gravityGroupRef.current) return

    // Subtle floating animation (like breathing)
    groupRef.current.position.y += Math.sin(state.clock.elapsedTime + randomOffset.current) * 0.002
    
    // Smooth transition for scaling
    const targetScale = hovered ? 1.3 : 1.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

    // Cursor Gravity Physics: Apply safely to local sub-group so it doesn't fight global dragging
    if (hovered) {
      gravityGroupRef.current.position.x = THREE.MathUtils.lerp(gravityGroupRef.current.position.x, state.pointer.x * 2, 0.08);
      gravityGroupRef.current.position.y = THREE.MathUtils.lerp(gravityGroupRef.current.position.y, state.pointer.y * 2, 0.08);
    } else {
      // Elastic return to local center (0,0,0)
      gravityGroupRef.current.position.x = THREE.MathUtils.lerp(gravityGroupRef.current.position.x, 0, 0.05);
      gravityGroupRef.current.position.y = THREE.MathUtils.lerp(gravityGroupRef.current.position.y, 0, 0.05);
    }


  })

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation() // Prevent triggering stars behind it
        if (onClick) onClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation() // Prevent triggering stars behind it
        setHovered(true)
        document.body.style.cursor = 'pointer' // Basic UX feedback
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <group ref={gravityGroupRef}>
        <mesh ref={coreRef}>
          <sphereGeometry args={[size * 1.2, 32, 32]} />
          {/* Conditionally render custom texture or emissive color fallback */}
          <Suspense fallback={<FallbackMaterial color={color} hovered={hovered} />}>
            {texture
              ? <TexturedMaterial url={texture} color={color} hovered={hovered} />
              : <FallbackMaterial color={color} hovered={hovered} />
            }
          </Suspense>
        </mesh>
        
        {/* Soft Atmosphere Halo */}
        <Atmosphere color={color} size={size} />

        {/* 3D Label Component */}
        <Html position={[0, size * 1.8, 0]} center style={{ pointerEvents: 'none' }}>
          <div 
            className={`px-3 py-1 rounded-full backdrop-blur-md bg-black/40 border border-white/20 whitespace-nowrap transition-all duration-300 transform ${
              hovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'
            }`}
            style={{ textShadow: `0 0 8px ${color}`, boxShadow: `0 0 15px ${color}40` }}
          >
            <span className="text-white text-xs font-bold tracking-widest uppercase">{name}</span>
          </div>
        </Html>
      </group>
    </group>
  )
}

