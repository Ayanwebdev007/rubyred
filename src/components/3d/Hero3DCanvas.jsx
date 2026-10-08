import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles, ContactShadows } from '@react-three/drei';
import { RamuneBottle3D, SodaCan3D } from './RamuneBottle3D';

export default function Hero3DCanvas({ activeRamuneColor = "#00b4d8", activeFlavor = "Original" }) {
  return (
    <div className="w-full h-[450px] md:h-[550px] relative rounded-3xl overflow-hidden glass-panel border border-rose-500/20 shadow-2xl">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-radial from-rose-600/20 via-slate-950/80 to-slate-950 pointer-events-none z-0" />

      {/* Floating Badge overlay */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-amber-500/30 flex items-center gap-2 text-xs font-semibold text-amber-400 shadow-lg">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        Interactive 3D Preview • Drag to Rotate
      </div>

      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        className="w-full h-full z-10"
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 10, 7]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-5, -5, -5]} intensity={1} color="#e11d48" />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffb703" />

        <Suspense fallback={null}>
          <group position={[0, -0.2, 0]}>
            {/* Center Ramune Bottle */}
            <RamuneBottle3D color={activeRamuneColor} flavorName={activeFlavor} />

            {/* Left Soda Can */}
            <group position={[-2.4, 0.2, -1]}>
              <SodaCan3D color="#e11d48" label="MONSTER" />
            </group>

            {/* Right Secondary Bottle */}
            <group position={[2.4, -0.2, -1]}>
              <RamuneBottle3D color="#ff85a1" flavorName="Peach" autoRotate={true} />
            </group>
          </group>

          {/* Ambient Sparkles & Particles */}
          <Sparkles count={80} scale={8} size={2.5} speed={0.4} color="#f43f5e" />
          <Sparkles count={50} scale={6} size={2} speed={0.6} color="#fbbf24" />

          {/* Shadow beneath */}
          <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2} far={4} color="#000000" />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.5}
        />
      </Canvas>

      {/* Dynamic Flavor Indicator Overlay */}
      <div className="absolute bottom-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 px-4 py-2 rounded-2xl flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: activeRamuneColor }} />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Selected Flavor</p>
          <p className="text-sm font-bold text-white">{activeFlavor} Ramune</p>
        </div>
      </div>
    </div>
  );
}
