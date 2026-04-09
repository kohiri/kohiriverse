import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export default function GlowingStar({ position }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Animation loop handling rotation per-frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <sphereGeometry args={[2, 32, 32]} />
      {/* 
        Using meshStandardMaterial allows reaction to light, 
        plus emissive properties to create a glowing effect in dark scenes. 
      */}
      <meshStandardMaterial 
        color={hovered ? "#C084FC" : "#8B5CF6"} 
        emissive={hovered ? "#C084FC" : "#8B5CF6"}
        emissiveIntensity={hovered ? 2.5 : 1.5}
        toneMapped={false}
      />
    </mesh>
  )
}
