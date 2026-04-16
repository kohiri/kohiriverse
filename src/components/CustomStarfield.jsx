import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CustomStarfield({ count = 20000, maxDistance = 400 }) {
  const pointsRef = useRef()

  const { positions, colors, sizes, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const offsets = new Float32Array(count)

    // Defina palette: white, blue, purple, pink
    const palette = [
      new THREE.Color('#ffffff'), // White
      new THREE.Color('#aaddff'), // Blue
      new THREE.Color('#9d4edd'), // Purple
      new THREE.Color('#ff007f'), // Pink
      new THREE.Color('#4cc9f0'), // Cyan
    ]

    // Create 15 nebula attractors for clustering
    const attractors = Array.from({ length: 15 }).map(() => ({
      x: (Math.random() - 0.5) * maxDistance * 1.5,
      y: (Math.random() - 0.5) * maxDistance * 0.8, // flatter on Y
      z: (Math.random() - 0.5) * maxDistance * 1.5,
      spread: Math.random() * 150 + 80, // Much wider spread
    }))

    for (let i = 0; i < count; i++) {
      let x, y, z

      // 20% chance to be part of a loose clustered nebula, 80% uniform
      if (Math.random() < 0.2) {
        const attractor = attractors[Math.floor(Math.random() * attractors.length)]
        const rx = (Math.random() + Math.random() + Math.random() - 1.5) * attractor.spread
        const ry = (Math.random() + Math.random() + Math.random() - 1.5) * attractor.spread
        const rz = (Math.random() + Math.random() + Math.random() - 1.5) * attractor.spread

        x = attractor.x + rx
        y = attractor.y + ry
        z = attractor.z + rz
      } else {
        x = (Math.random() - 0.5) * maxDistance * 2
        y = (Math.random() - 0.5) * maxDistance * 2
        z = (Math.random() - 0.5) * maxDistance * 2
      }

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // 0.2% Highlight stars (slightly larger and brighter, not massive)
      const isHighlight = Math.random() < 0.002
      sizes[i] = isHighlight ? Math.random() * 3.0 + 3.0 : Math.random() * 2.0 + 0.2

      // Assign color with slight tint variation
      const baseColor = palette[Math.floor(Math.random() * palette.length)].clone()
      baseColor.lerp(new THREE.Color('#ffffff'), Math.random() * 0.5) // add white variance
      
      // Highlight stars are brighter
      if (isHighlight) {
        baseColor.multiplyScalar(1.5) 
      }

      colors[i * 3] = baseColor.r
      colors[i * 3 + 1] = baseColor.g
      colors[i * 3 + 2] = baseColor.b

      // Random phase offset for twinkling
      offsets[i] = Math.random() * Math.PI * 2
    }

    return { positions, colors, sizes, offsets }
  }, [count, maxDistance])

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute float offset;
        attribute vec3 color;
        
        varying vec3 vColor;
        varying float vOffset;
        
        uniform float uTime;

        void main() {
          vColor = color;
          vOffset = offset;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Subtle pulse size based on time and offset
          float pulse = sin(uTime * 1.2 + offset) * 0.2 + 0.8;
          
          gl_PointSize = size * pulse * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOffset;
        uniform float uTime;

        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          
          // Make it a circle
          if (distanceToCenter > 0.5) discard;

          // Soft volumetric gradient (hot core, fading edges)
          float strength = max(0.0, 1.0 - (distanceToCenter * 2.0));
          strength = pow(strength, 1.5); // Steepness of the glow
          
          // Twinkle effect (intensity pulses slightly over time)
          float twinkle = sin(uTime * 1.5 + vOffset) * 0.3 + 0.7;

          // Very bright core
          vec3 coreColor = mix(vColor, vec3(1.0), pow(strength, 3.0) * 0.5);

          gl_FragColor = vec4(coreColor * twinkle, strength);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
    []
  )

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
      
      // Interactive Parallax implementation
      // Rotate the whole starfield slightly based on pointer position relative to center
      const targetRotationX = state.pointer.y * 0.05
      const targetRotationY = state.pointer.x * 0.05

      pointsRef.current.rotation.x += (targetRotationX - pointsRef.current.rotation.x) * 0.05
      pointsRef.current.rotation.y += (targetRotationY - pointsRef.current.rotation.y) * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-offset" count={offsets.length} array={offsets} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial args={[shaderArgs]} />
    </points>
  )
}
