import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 transformed = position;

    float waveA = sin((position.y * 4.5) + (uTime * 1.15)) * 0.08;
    float waveB = sin((position.x * 3.2) - (uTime * 0.9)) * 0.06;
    float waveC = sin((position.z * 5.1) + (uTime * 1.5)) * 0.045;

    transformed += normal * (waveA + waveB + waveC);

    vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
    vWorldPosition = worldPosition.xyz;
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uAccent;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

    float fresnel = pow(1.0 - max(dot(viewDirection, normal), 0.0), 2.7);
    float pulse = 0.5 + 0.5 * sin((uTime * 0.85) + (vWorldPosition.y * 3.2));
    float grain = hash(vWorldPosition * 6.5 + uTime * 0.2) * 0.05;

    vec3 darkBase = vec3(0.02, 0.02, 0.02);
    vec3 baseTone = mix(darkBase, uBase, 0.72 + pulse * 0.28);
    vec3 reflected = mix(baseTone, uAccent, fresnel * 0.9);

    gl_FragColor = vec4(reflected + grain, 1.0);
  }
`

function AbstractSculpture() {
  const groupRef = useRef(null)
  const coreRef = useRef(null)
  const ringRef = useRef(null)
  const liquidRef = useRef(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBase: { value: new THREE.Color('#ff4d00') },
      uAccent: { value: new THREE.Color('#ffffff') },
    }),
    [],
  )

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime

    if (liquidRef.current) {
      liquidRef.current.uniforms.uTime.value = elapsed
    }

    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(elapsed * 1.15) * 0.12
      groupRef.current.rotation.y += delta * 0.14
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.34
      coreRef.current.rotation.x = Math.sin(elapsed * 0.4) * 0.25
    }

    if (ringRef.current) {
      ringRef.current.rotation.x -= delta * 0.16
      ringRef.current.rotation.z += delta * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1.08, 4]} />
        <shaderMaterial
          ref={liquidRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>

      <mesh ref={ringRef} scale={1.34}>
        <torusKnotGeometry args={[1.15, 0.14, 160, 24]} />
        <meshPhysicalMaterial
          color="#ff7b3d"
          transparent
          opacity={0.18}
          roughness={0.08}
          metalness={1}
          clearcoat={1}
          clearcoatRoughness={0.05}
          emissive="#ff4d00"
          emissiveIntensity={0.22}
        />
      </mesh>
    </group>
  )
}

export default function SculptureScene() {
  return (
    <div className="hero-scene">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 4.7], fov: 38 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 4.2, 10]} />

        <ambientLight intensity={0.22} />
        <directionalLight position={[3.5, 3, 2]} intensity={1.2} color="#ff4d00" />
        <pointLight position={[-2, -1.4, 1.8]} intensity={0.7} color="#ffffff" />
        <pointLight position={[0, 0, -2]} intensity={0.45} color="#ff8351" />

        <AbstractSculpture />
      </Canvas>
    </div>
  )
}
