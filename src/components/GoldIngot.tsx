import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

interface GoldIngotProps {
  purity: 24 | 22 | 18;
  weight: 8 | 100 | 500 | 1000;
}

function IngotModel({ purity, weight }: { purity: number; weight: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [spinVelocity, setSpinVelocity] = useState(0);
  const [scaleTarget, setScaleTarget] = useState(1);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  // Rotate slowly and handle interactive spins
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5 + spinVelocity * delta;
      
      if (spinVelocity > 0) {
        setSpinVelocity(Math.max(0, spinVelocity - delta * 15));
      }

      meshRef.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), 0.15);
    }
  });

  const handleClick = () => {
    setSpinVelocity(15);
    setScaleTarget(1.2);
    setTimeout(() => setScaleTarget(1), 150);
  };

  // Calculate dimensions based on weight
  const getScale = () => {
    switch (weight) {
      case 8: return [1.5, 0.2, 0.8];
      case 100: return [2.2, 0.4, 1.2];
      case 500: return [3.0, 0.6, 1.6];
      case 1000: return [3.8, 0.8, 2.0];
      default: return [2.2, 0.4, 1.2];
    }
  };

  const scale = getScale() as [number, number, number];

  // Adjust color based on purity (24k is more yellow-orange, 18k is more yellowish)
  const getGoldColor = () => {
    switch (purity) {
      case 24: return '#ffaa00'; // Deep rich gold
      case 22: return '#ffcc00'; // Standard gold
      case 18: return '#ffdd44'; // Lighter gold
      default: return '#ffcc00';
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh 
        ref={meshRef} 
        castShadow 
        receiveShadow
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={scale} />
        <meshStandardMaterial
          color={getGoldColor()}
          metalness={1}
          roughness={0.15}
          envMapIntensity={1.5}
        />
      </mesh>
    </Float>
  );
}

export default function GoldIngot({ purity, weight }: GoldIngotProps) {
  return (
    <div className="w-full h-[250px]">
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <IngotModel purity={purity} weight={weight} />
        
        <Environment preset="city" />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        
        <OrbitControls enableZoom={true} enablePan={true} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 4} />
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
