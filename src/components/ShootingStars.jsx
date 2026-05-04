import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'

const STAR_COLOR   = '#ffffff'
const SPAWN_RADIUS = 280
const TRAVEL_DIST  = 620
const SPEED_MIN    = 120
const SPEED_MAX    = 220

// How many seconds the star sits hidden between shots.
// Single star is used, so this IS the gap between each shooting star.
const REST_SECONDS = 5

/** Pick a random point on a sphere surface */
function randomOnSphere(radius) {
  const theta = Math.random() * Math.PI * 2
  const phi   = Math.acos(2 * Math.random() - 1)
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi)
  )
}

/** Return fresh spawn state for one shot */
function freshState() {
  const origin = randomOnSphere(SPAWN_RADIUS)
  const jitter = new THREE.Vector3(
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 40
  )
  const velocity = new THREE.Vector3()
    .sub(origin)          // aim toward center
    .add(jitter)
    .normalize()
    .multiplyScalar(SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN))

  return { origin, velocity }
}

// Phase flags
const PHASE_REST    = 'rest'
const PHASE_TRAVEL  = 'travel'

/**
 * A single shooting star that:
 *  1. Fires once immediately
 *  2. After finishing its streak, hides for REST_SECONDS
 *  3. Then fires again from a new random direction — forever
 *
 * Because there is only ONE instance, there is never more than
 * one shooting star visible at the same time.
 */
function ShootingStarInstance() {
  const meshRef   = useRef()
  const stateRef  = useRef(freshState())
  const phaseRef  = useRef(PHASE_TRAVEL)   // start firing immediately
  const timerRef  = useRef(0)              // counts REST_SECONDS during idle

  const intenseColor = useMemo(
    () => new THREE.Color(STAR_COLOR).multiplyScalar(2.5),
    []
  )

  useFrame((_, delta) => {
    if (!meshRef.current) return

    if (phaseRef.current === PHASE_REST) {
      // Park off-screen so Trail doesn't draw anything
      meshRef.current.position.set(10000, 10000, 10000)
      timerRef.current += delta
      if (timerRef.current >= REST_SECONDS) {
        // Ready to fire again — pick a fresh trajectory
        stateRef.current = freshState()
        meshRef.current.position.copy(stateRef.current.origin)
        timerRef.current = 0
        phaseRef.current = PHASE_TRAVEL
      }
      return
    }

    // PHASE_TRAVEL — move along the streak line
    meshRef.current.position.addScaledVector(stateRef.current.velocity, delta)

    const dist = meshRef.current.position.distanceTo(stateRef.current.origin)
    if (dist > TRAVEL_DIST) {
      // Shot complete — enter rest period
      phaseRef.current = PHASE_REST
      timerRef.current = 0
    }
  })

  const { origin } = stateRef.current

  return (
    <Trail
      width={1.8}
      length={0.4}
      color={intenseColor}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef} position={[origin.x, origin.y, origin.z]}>
        <sphereGeometry args={[0.28, 6, 6]} />
        <meshBasicMaterial color={intenseColor} toneMapped={false} />
      </mesh>
    </Trail>
  )
}

/** Single instance — guarantees never more than one star on screen */
export default function ShootingStars() {
  return (
    <group>
      <ShootingStarInstance />
    </group>
  )
}
