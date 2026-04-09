import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'

const neonColors = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#fcd34d', // warm glow yellow
  '#fb923c', // orange/amber
  '#ef4444', // red
  '#10b981', // emerald
]

function ShootingStarInstance({ color }) {
  const meshRef = useRef()
  
  // Calculate a streak velocity (straight line motion)
  const velocity = useMemo(() => new THREE.Vector3(
    (Math.random() - 0.5) * 40, 
    -(Math.random() * 20 + 30), // Mostly downward      
    (Math.random() - 0.5) * 40      
  ).normalize().multiplyScalar(150), []) // High speed

  // Start at a random location high up in the galaxy
  const initialPos = useMemo(() => new THREE.Vector3(
    (Math.random() - 0.5) * 150,
    Math.random() * 50 + 80, 
    (Math.random() - 0.5) * 150
  ), [])

  useFrame((state, delta) => {
    if (meshRef.current) {
        // Move quickly across the sky in a pure straight motion
        meshRef.current.position.addScaledVector(velocity, delta)
    }
  })

  // To organically simulate bloom without requiring the heavy postprocessing dependency
  const intenseColor = useMemo(() => new THREE.Color(color).multiplyScalar(2.5), [color]);

  return (
    <Trail 
      width={2} 
      length={8} 
      color={intenseColor} 
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef} position={initialPos}>
        <sphereGeometry args={[0.25]} />
        <meshBasicMaterial 
          color={intenseColor} 
          toneMapped={false} 
        />
      </mesh>
    </Trail>
  )
}

export default function ShootingStars() {
  // Use a state array to manage instances for the strict "every 3 seconds" requirement
  const [stars, setStars] = useState([{ id: Date.now(), color: neonColors[0] }]);

  useEffect(() => {
    // Explicit 3 second frequency timer
    const interval = setInterval(() => {
      setStars((prev) => {
        // Randomly grab a vibrant neon color
        const color = neonColors[Math.floor(Math.random() * neonColors.length)];
        
        // Append a new star ID cleanly, and keep only the last 3 visible
        const next = [...prev, { id: Date.now(), color }];
        if (next.length > 3) next.shift(); // Unmount old stars so they don't drift forever
        return next;
      });
    }, 3000); 
    
    return () => clearInterval(interval);
  }, []);

  return (
    <group>
      {stars.map((star) => (
        <ShootingStarInstance key={star.id} color={star.color} />
      ))}
    </group>
  )
}
