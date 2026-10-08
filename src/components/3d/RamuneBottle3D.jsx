import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function RamuneBottle3D({ color = "#00b4d8", flavorName = "Original", autoRotate = true }) {
  const groupRef = useRef();
  const liquidRef = useRef();
  const marbleRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
    if (marbleRef.current) {
      marbleRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 1.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group ref={groupRef} scale={1.2}>
        {/* Glass Outer Bottle Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 2.4, 32]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            thickness={0.4}
            chromaticAberration={0.06}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.2}
            temporalDistortion={0.1}
            ior={1.4}
            color="#ffffff"
            roughness={0.1}
            metalness={0.1}
            transmission={0.92}
          />
        </mesh>

        {/* Bottle Neck & Marble Chamber Pinch */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.35, 0.55, 0.8, 32]} />
          <MeshTransmissionMaterial
            thickness={0.3}
            roughness={0.1}
            transmission={0.9}
            color="#ffffff"
          />
        </mesh>

        {/* Bottle Cap Ring */}
        <mesh position={[0, 1.85, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.15, 32]} />
          <meshStandardMaterial color="#0284c7" roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Floating Marble Stopper Inside Neck */}
        <mesh ref={marbleRef} position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            roughness={0.05}
            transmission={0.95}
            thickness={0.2}
            ior={1.5}
          />
        </mesh>

        {/* Colored Sparkling Liquid Core */}
        <mesh ref={liquidRef} position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.5, 0.58, 2.0, 32]} />
          <meshStandardMaterial
            color={color}
            roughness={0.2}
            metalness={0.1}
            transparent={true}
            opacity={0.75}
          />
        </mesh>

        {/* Effervescent Bubble Particles inside liquid */}
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.sin(i * 99) * 0.35),
              -0.8 + (i * 0.15),
              (Math.cos(i * 99) * 0.35)
            ]}
          >
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export function SodaCan3D({ color = "#e11d48", label = "MONSTER" }) {
  const canRef = useRef();

  useFrame((state, delta) => {
    if (canRef.current) {
      canRef.current.rotation.y -= delta * 0.6;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1}>
      <group ref={canRef} scale={1.1}>
        {/* Metallic Aluminum Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 2.2, 32]} />
          <meshStandardMaterial
            color={color}
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        {/* Top Rim */}
        <mesh position={[0, 1.15, 0]}>
          <cylinderGeometry args={[0.56, 0.6, 0.1, 32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Bottom Rim */}
        <mesh position={[0, -1.15, 0]}>
          <cylinderGeometry args={[0.6, 0.52, 0.1, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Glowing Logo Band */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.605, 0.605, 1.4, 32]} />
          <meshStandardMaterial
            color="#ffb703"
            emissive="#ffb703"
            emissiveIntensity={0.3}
            wireframe={true}
          />
        </mesh>
      </group>
    </Float>
  );
}
