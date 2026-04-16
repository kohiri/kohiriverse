import { useMemo } from 'react'
import * as THREE from 'three'

export default function Atmosphere({ color, size }) {
  const uniforms = useMemo(
    () => ({
      c: { value: 0.1 },
      p: { value: 3.5 },
      glowColor: { value: new THREE.Color('#111111') }, // Darkest shade of grey
      viewVector: { value: new THREE.Vector3() }, // Will be updated by Three.js internally or we can just use cameraPosition
    }),
    []
  )



  return (
    <mesh >
      <sphereGeometry args={[size * 1.4, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 glowColor;
          uniform float p;
          varying vec3 vNormal;
          void main() {
            // View vector in camera space is vec3(0,0,1)
            float dotNV = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
            
            // Fresnel calculation (0 at center, 1 at edge)
            float fresnel = clamp(1.0 - abs(dotNV), 0.0, 1.0);
            
            // Apply power to thin out the halo
            float intensity = pow(fresnel, p);
            
            gl_FragColor = vec4(glowColor, intensity * 0.8);
          }
        `}
        side={THREE.FrontSide}
        blending={THREE.AdditiveBlending}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  )
}
