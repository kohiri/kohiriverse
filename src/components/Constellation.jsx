import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Constellation({ stars, connections, name, textureUrl, position, rotation, scale = 1 }) {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  
  const progressRef = useRef(0)
  const symbolOpacityRef = useRef(0)
  const linesGroupRef = useRef()
  const particlesGroupRef = useRef()
  const symbolMaterialRef = useRef()

  // Load the silhouette texture
  const texture = useTexture(textureUrl)

  // Construct standard Line objects imperatively for ultimate performance
  const { lines, particles } = useMemo(() => {
    const lines = []
    const particles = []
    
    connections.forEach(([startIdx, endIdx], i) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([stars[startIdx], stars[startIdx].clone()])
      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.0
      })
      const line = new THREE.Line(geometry, material)
      lines.push({ obj: line, start: stars[startIdx], end: stars[endIdx] })
      
      const pGeometry = new THREE.SphereGeometry(0.08, 16, 16)
      const pMaterial = new THREE.MeshBasicMaterial({ color: 0xaaddff, transparent: true, opacity: 0 })
      const particle = new THREE.Mesh(pGeometry, pMaterial)
      particle.position.copy(stars[startIdx])
      particles.push(particle)
    })
    
    return { lines, particles }
  }, [stars, connections])

  useFrame((state, delta) => {
    // 1. Advance state tracking
    if (active) {
      if (progressRef.current < 1) {
        progressRef.current = Math.min(1, progressRef.current + delta * 0.4)
      } else {
        symbolOpacityRef.current = Math.min(1, symbolOpacityRef.current + delta * 0.5)
      }
    } else {
      symbolOpacityRef.current = Math.max(0, symbolOpacityRef.current - delta * 1.5)
      if (symbolOpacityRef.current <= 0) {
        progressRef.current = Math.max(0, progressRef.current - delta * 1.5)
      }
    }

    // 2. Imperatively update lines, particles, and material opacities
    const globalP = progressRef.current
    const totalLines = lines.length

    lines.forEach((lineData, i) => {
      const startP = i / totalLines
      const endP = (i + 1) / totalLines
      
      let localP = 0
      if (globalP > startP) {
        if (globalP >= endP) localP = 1
        else localP = (globalP - startP) / (1 / totalLines)
      }

      // Update line points
      const currentPos = new THREE.Vector3().lerpVectors(lineData.start, lineData.end, localP)
      lineData.obj.geometry.setFromPoints([lineData.start, currentPos])
      
      // Update line opacity
      lineData.obj.material.opacity = localP > 0 ? 0.6 + localP * 0.4 : 0
      
      // Update tracking particle
      const p = particles[i]
      p.position.copy(currentPos)
      p.material.opacity = (localP > 0 && localP < 1.0 && active) ? 1.0 - localP : 0
    })

    // 3. Update overlay image opacity
    if (symbolMaterialRef.current) {
      symbolMaterialRef.current.opacity = symbolOpacityRef.current * 0.6
    }
  })

  const center = useMemo(() => {
    const vec = new THREE.Vector3()
    stars.forEach(s => vec.add(s))
    vec.divideScalar(stars.length)
    return vec
  }, [stars])

  return (
    <group 
      position={position} 
      rotation={rotation} 
      scale={scale}
      onClick={(e) => {
        e.stopPropagation()
        setActive(!active)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      {/* 1. Constellation Star Points */}
      {stars.map((pos, i) => (
        <group key={i} position={pos}>
          {/* 3D Core Sphere */}
          <mesh>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial 
              color="#ffffff"
              emissive={hovered || active ? "#ffffff" : "#4c1d95"} // Deep purple/blue baseline glow
              emissiveIntensity={hovered || active ? 2.5 : 0.8} 
              roughness={0.4}
              metalness={0.8}
            />
          </mesh>
          {/* Subtle Outer Glow */}
          <mesh>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshBasicMaterial 
              color="#aaddff" 
              transparent 
              opacity={(hovered || active ? 0.4 : 0.05) + Math.sin(Date.now() / 800 + i) * 0.05}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {/* 2. Drawing Lines & Particles (Rendered via primitive injection) */}
      <group ref={linesGroupRef}>
        {lines.map((l, i) => <primitive key={`l-${i}`} object={l.obj} />)}
      </group>
      <group ref={particlesGroupRef}>
        {particles.map((p, i) => <primitive key={`p-${i}`} object={p} />)}
      </group>

      {/* 3. Artistic Silhouette Reveal */}
      <mesh position={[center.x, center.y, center.z - 2]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial 
          ref={symbolMaterialRef}
          map={texture} 
          transparent 
          opacity={0} 
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Elegant Glowing Name Label */}
      <Html position={[center.x, center.y - 5.5, center.z]} center style={{ pointerEvents: 'none' }}>
        <div 
          className={`transition-all duration-700 ease-in-out font-light tracking-[0.3em] uppercase text-sm ${
            hovered || active ? 'opacity-100 translate-y-0 text-white' : 'opacity-0 translate-y-4 text-white/50'
          }`}
          style={{ textShadow: '0 0 10px rgba(170, 221, 255, 0.8)' }}
        >
          {name}
        </div>
      </Html>
    </group>
  )
}
