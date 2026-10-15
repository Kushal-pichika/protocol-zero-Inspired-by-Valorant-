import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerformanceMonitor, Environment as Studio, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import { scrollState } from './scrollState'
import { COLORS, SPIKE_COLORS } from '../data/config'

const sm = (x, a, b) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
// Camera keyframes [section position, x, y, z]. The 2 -> 2.05 jump is hidden by the geometric wipe.
const KEYS = [[0, 0, 0, 9], [1, 0, 0, 6.2], [2, 0, 0, 3.4], [2.05, -1.5, 2.2, -14], [3, 1.5, 1.6, -44], [3.2, 0, 0, 9], [5, 0, 0, 9], [6, 0, 0, 6.5]]
function sampleKeys(s) {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const a = KEYS[i], b = KEYS[i + 1]
    if (s <= b[0] || i === KEYS.length - 2) { const t = Math.min(1, Math.max(0, (s - a[0]) / (b[0] - a[0]))); return [1, 2, 3].map((k) => a[k] + (b[k] - a[k]) * t) }
  }
}

export function CameraRig() {
  useFrame(({ camera }, dt) => {
    const st = scrollState
    st.cur += (st.s - st.cur) * Math.min(1, dt * 4)
    st.intro = Math.min(1, st.intro + dt / 2.2)
    const [x, y, z] = sampleKeys(st.cur)
    camera.position.set(x, y, z)
    camera.lookAt(x * 0.4, y * 0.4, z - 10)
  })
  return null
}

export function SceneEffects() {
  return (<>
    <ambientLight intensity={0.35} />
    <directionalLight position={[5, 8, 6]} intensity={0.7} color={COLORS.white} />
    <pointLight position={[-6, -2, 4]} intensity={6} color={COLORS.red} distance={20} />
  </>)
}

// Hero emblem, reused as the finale emblem. Scale = build-in * visibility.
function Emblem({ reduced }) {
  const g = useRef()
  useFrame((_, dt) => {
    const s = scrollState.cur
    const vis = Math.max(1 - sm(s, 0.8, 1.0), sm(s, 4.6, 5.3))
    const e = 1 - Math.pow(1 - scrollState.intro, 3)
    g.current.visible = vis * e > 0.001
    g.current.scale.setScalar(vis * e)
    if (!reduced) { g.current.rotation.y += dt * (s > 4 ? 0.9 : 0.35); g.current.rotation.x += dt * 0.12 }
  })
  return (
    <group ref={g}>
      <mesh><icosahedronGeometry args={[1.5, 0]} /><meshBasicMaterial color={COLORS.red} wireframe /></mesh>
      <mesh><octahedronGeometry args={[0.85, 0]} /><meshStandardMaterial color={COLORS.slate} metalness={0.7} roughness={0.3} emissive={COLORS.red} emissiveIntensity={0.25} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[2.1, 0.012, 8, 96]} /><meshBasicMaterial color={COLORS.white} /></mesh>
    </group>
  )
}

export function EnergyRing({ i }) {
  const m = useRef()
  useFrame(() => {
    const t = Math.min(1, Math.max(0, scrollState.cur - 1))
    const ph = (t * 3 + i / 3) % 1
    m.current.scale.setScalar(1 + ph * 5)
    m.current.material.opacity = (1 - ph) * Math.min(1, t * 3) * 0.8
  })
  return <mesh ref={m} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}><torusGeometry args={[1, 0.015, 8, 96]} /><meshBasicMaterial color={COLORS.red} transparent toneMapped={false} /></mesh>
}

// Original hard-surface device: beveled hex chassis, glass core chamber, counter-rotating notched ring.
const hexShape = (r) => { const sh = new THREE.Shape(); for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3; const x = Math.cos(a) * r, y = Math.sin(a) * r; i ? sh.lineTo(x, y) : sh.moveTo(x, y) } sh.closePath(); return sh }
const hexPrism = (r, depth) => { const g = new THREE.ExtrudeGeometry(hexShape(r), { depth, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3 }); g.rotateX(-Math.PI / 2); g.translate(0, -depth / 2, 0); return g }

export function SpikeModel({ reduced }) {
  const g = useRef(), core = useRef(), light = useRef(), ring = useRef()
  const { geos, mats } = useMemo(() => ({
    geos: { chassis: hexPrism(0.8, 1.3), cap: hexPrism(0.5, 0.35), base: hexPrism(0.62, 0.2) },
    mats: {
      body: new THREE.MeshPhysicalMaterial({ color: SPIKE_COLORS.body, metalness: 0.9, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
      trim: new THREE.MeshPhysicalMaterial({ color: SPIKE_COLORS.trim, metalness: 0.85, roughness: 0.4 }),
      glass: new THREE.MeshPhysicalMaterial({ color: SPIKE_COLORS.glass, transparent: true, opacity: 0.3, roughness: 0.05, clearcoat: 1, emissive: SPIKE_COLORS.glass, emissiveIntensity: 0.4 }),
      glow: new THREE.MeshStandardMaterial({ color: SPIKE_COLORS.glow, emissive: SPIKE_COLORS.glow, emissiveIntensity: 2, toneMapped: false }),
    },
  }), [])
  useLayoutEffect(() => () => { Object.values(geos).forEach((x) => x.dispose()); Object.values(mats).forEach((x) => x.dispose()) }, [geos, mats])
  useFrame((_, dt) => {
    const s = scrollState.cur
    const v = sm(s, 0.85, 1.15) * (1 - sm(s, 1.9, 2.0))
    g.current.visible = v > 0.001
    if (!g.current.visible) return
    g.current.scale.setScalar(v)
    const t = Math.min(1, Math.max(0, s - 1))
    if (!reduced) { g.current.rotation.y += dt * (0.3 + t * 1.6); ring.current.rotation.y -= dt * (0.5 + t * 2.5) }
    const pulse = Math.max(0, 1 - Math.abs(t - 0.9) * 10) // controlled climax pulse near t = 0.9
    core.current.scale.setScalar(1 + t * 0.3 + pulse * 0.8)
    mats.glow.emissiveIntensity = 2 + t * 4 + pulse * 6 // > 1 so selective bloom picks it up
    light.current.intensity = 2 + t * 8 + pulse * 25
  })
  return (
    <group ref={g}>
      <mesh geometry={geos.chassis} material={mats.body} />
      <mesh geometry={geos.base} material={mats.trim} position={[0, -0.85, 0]} />
      <mesh geometry={geos.cap} material={mats.body} position={[0, 0.95, 0]} />
      {[0, 1, 2, 3, 4, 5].map((i) => { const a = (i * Math.PI) / 3 + Math.PI / 6; return (
        <mesh key={i} material={mats.glow} position={[Math.cos(a) * 0.77, 0, Math.sin(a) * 0.77]} rotation={[0, Math.PI / 2 - a, 0]}><boxGeometry args={[0.07, 0.9, 0.04]} /></mesh>
      ) })}
      <mesh material={mats.glass} position={[0, 1.5, 0]}><cylinderGeometry args={[0.4, 0.4, 0.75, 24, 1, true]} /></mesh>
      <mesh ref={core} material={mats.glow} position={[0, 1.5, 0]}><sphereGeometry args={[0.26, 24, 24]} /></mesh>
      <mesh material={mats.trim} position={[0, 1.9, 0]}><cylinderGeometry args={[0.44, 0.44, 0.06, 24]} /></mesh>
      <mesh material={mats.trim} position={[0, 1.12, 0]}><cylinderGeometry args={[0.44, 0.44, 0.06, 24]} /></mesh>
      <group ref={ring} position={[0, 0.45, 0]}>
        <mesh material={mats.trim} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.05, 0.035, 8, 64]} /></mesh>
        {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <mesh key={i} material={mats.body} position={[Math.cos(a) * 1.05, 0, Math.sin(a) * 1.05]} rotation={[0, -a, 0]}><boxGeometry args={[0.1, 0.14, 0.16]} /></mesh> })}
      </group>
      {[0, 1, 2].map((i) => { const a = (i * Math.PI * 2) / 3; return <mesh key={i} material={mats.body} position={[Math.cos(a) * 0.7, -1, Math.sin(a) * 0.7]} rotation={[0, -a, 0.35]}><boxGeometry args={[0.1, 0.7, 0.2]} /></mesh> })}
      <pointLight ref={light} color={COLORS.red} position={[0, 1.5, 0]} distance={10} />
      {[0, 1, 2].map((i) => <EnergyRing key={i} i={i} />)}
    </group>
  )
}

// Chromatic aberration kick on the activation climax only (offset mutated in place, no React state).
function Aberration() {
  const off = useMemo(() => new THREE.Vector2(0, 0), [])
  useFrame(() => { const t = Math.min(1, Math.max(0, scrollState.cur - 1)); const k = Math.max(0, 1 - Math.abs(t - 0.9) * 10) * 0.006; off.set(k, k) })
  return <ChromaticAberration offset={off} radialModulation={false} modulationOffset={0} />
}

// Fictional corridor: instanced buildings (background), floor grid (middle), light strips (foreground).
export function Environment() {
  const g = useRef(), im = useRef()
  const data = useMemo(() => {
    let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647
    return Array.from({ length: 70 }, () => ({ x: (r() < 0.5 ? -1 : 1) * (3.2 + r() * 10), z: (r() - 0.5) * 70, w: 1.5 + r() * 3, h: 2 + r() * 9, d: 1.5 + r() * 4 }))
  }, [])
  useLayoutEffect(() => {
    const o = new THREE.Object3D()
    data.forEach((b, i) => { o.position.set(b.x, b.h / 2, b.z); o.scale.set(b.w, b.h, b.d); o.updateMatrix(); im.current.setMatrixAt(i, o.matrix) })
    im.current.instanceMatrix.needsUpdate = true
  }, [data])
  useFrame(() => { g.current.visible = scrollState.cur > 1.9 && scrollState.cur < 3.1 })
  return (
    <group ref={g} position={[0, 0, -35]}>
      <instancedMesh ref={im} args={[null, null, data.length]}><boxGeometry /><meshStandardMaterial color={COLORS.slate} roughness={0.8} metalness={0.3} /></instancedMesh>
      <gridHelper args={[80, 40, COLORS.red, COLORS.slate]} />
      {[-2.8, 2.8].map((x) => <mesh key={x} position={[x, 0.05, 0]}><boxGeometry args={[0.06, 0.06, 70]} /><meshBasicMaterial color={COLORS.red} toneMapped={false} /></mesh>)}
      <pointLight color={COLORS.red} position={[0, 3, -5]} intensity={8} distance={22} />
    </group>
  )
}

export function ParticleField({ count, reduced }) {
  const g = useRef()
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) { const r = 4 + Math.random() * 14, th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1); a.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)], i * 3) }
    return a
  }, [count])
  useFrame(({ camera }, dt) => {
    g.current.position.z = camera.position.z // field follows the camera through the map
    if (!reduced) g.current.rotation.y += dt * 0.03
    g.current.scale.setScalar(1 - sm(scrollState.cur, 4.6, 5.5) * 0.85) // finale: converge to centre
  })
  return (
    <group ref={g}><points>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.045} color={COLORS.white} transparent opacity={0.65} depthWrite={false} sizeAttenuation />
    </points></group>
  )
}

export default function ExperienceCanvas({ quality, reduced }) {
  const [dpr, setDpr] = useState(quality.dpr)
  return (
    <Canvas className="webgl" dpr={dpr} camera={{ fov: 50, near: 0.1, far: 120, position: [0, 0, 9] }} gl={{ antialias: quality.aa, powerPreference: 'high-performance' }}>
      <PerformanceMonitor onDecline={() => setDpr(1)}>
        <color attach="background" args={[COLORS.obsidian]} />
        <fog attach="fog" args={[COLORS.obsidian, 12, 55]} />
        <SceneEffects /><CameraRig />
        <Emblem reduced={reduced} /><SpikeModel reduced={reduced} /><Environment />
        <ParticleField count={quality.particles} reduced={reduced} />
        {/* Procedural reflections: no HDRI download needed */}
        <Studio resolution={128}>
          <Lightformer form="rect" intensity={2.5} color={COLORS.red} position={[-5, 2, -3]} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={3} color={COLORS.white} position={[4, 4, 3]} scale={[6, 2, 1]} />
          <Lightformer form="ring" intensity={2} color={COLORS.red} position={[0, -3, 4]} scale={4} />
        </Studio>
        {quality.bloom && !reduced && (
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={1} intensity={1.1} mipmapBlur />
            <Aberration />
          </EffectComposer>
        )}
      </PerformanceMonitor>
    </Canvas>
  )
}
