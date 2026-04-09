import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function DistantGalaxy({ 
  position = [-50, -25, -100],
  rotation = [Math.PI * 0.2, 0, Math.PI * 0.1],
  scale = [5, 5, 5],
  count = 50000,
  size = 0.12,
  radius = 9,
  branches = 5,
  spin = 1.2,
  randomness = 0.45,
  randomnessPower = 3,
  insideColor = '#ffae00',
  outsideColor = '#1b3984'
}) {
  const pointsRef = useRef()

  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const cInside = new THREE.Color(insideColor)
    const cOutside = new THREE.Color(outsideColor)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      const r = Math.random() * radius
      const spinAngle = r * spin
      // Branches
      const branchAngle = ((i % branches) / branches) * Math.PI * 2

      // Scatter randomness multiplied by radius so it's dense in the center, sparse outside
      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r

      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ

      // Mix color based on distance from center (radius / max radius)
      const mixedColor = cInside.clone()
      mixedColor.lerp(cOutside, r / radius)

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    })

    return { geometry, material }
  }, [count, size, radius, branches, spin, randomness, randomnessPower, insideColor, outsideColor])

  useFrame((state) => {
    if (pointsRef.current) {
      // Slowly rotate the galaxy on Y-axis
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <points 
      ref={pointsRef} 
      geometry={geometry} 
      material={material} 
      position={position}
      scale={scale} 
      rotation={rotation}
    />
  )
}
