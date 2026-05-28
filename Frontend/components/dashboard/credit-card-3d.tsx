"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Text, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function CreditCard({ approved }: { approved: boolean }) {
  const cardRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      cardRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  const cardColor = approved ? "#FF6600" : "#374151";
  const chipColor = approved ? "#FFD700" : "#9CA3AF";

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={cardRef} scale={1.2}>
        {/* Card Body */}
        <RoundedBox args={[3.4, 2.1, 0.08]} radius={0.12} smoothness={4}>
          <meshStandardMaterial 
            color={cardColor} 
            metalness={0.3} 
            roughness={0.4}
          />
        </RoundedBox>
        
        {/* EMV Chip */}
        <RoundedBox 
          args={[0.45, 0.35, 0.02]} 
          radius={0.04} 
          smoothness={4}
          position={[-1.1, 0.4, 0.05]}
        >
          <meshStandardMaterial 
            color={chipColor} 
            metalness={0.8} 
            roughness={0.2}
          />
        </RoundedBox>
        
        {/* Chip Lines */}
        {[0, 0.08, -0.08].map((offset, i) => (
          <mesh key={i} position={[-1.1, 0.4 + offset, 0.07]}>
            <boxGeometry args={[0.35, 0.015, 0.01]} />
            <meshStandardMaterial color="#B8860B" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
        
        {/* Card Number Dots */}
        {[0, 1, 2, 3].map((group) => (
          <group key={group} position={[-1.2 + group * 0.8, -0.2, 0.05]}>
            {[0, 1, 2, 3].map((dot) => (
              <mesh key={dot} position={[dot * 0.12, 0, 0]}>
                <circleGeometry args={[0.04, 16]} />
                <meshStandardMaterial 
                  color="white" 
                  opacity={0.8} 
                  transparent
                />
              </mesh>
            ))}
          </group>
        ))}
        
        {/* PayFlex Text */}
        <Text
          position={[0.9, 0.7, 0.05]}
          fontSize={0.18}
          font="/fonts/Geist-Bold.ttf"
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          PAYFLEX
        </Text>
        
        {/* Status Badge */}
        <group position={[0, -0.7, 0.05]}>
          <RoundedBox args={[1.2, 0.3, 0.02]} radius={0.08} smoothness={4}>
            <meshStandardMaterial 
              color={approved ? "#22C55E" : "#EF4444"} 
              metalness={0.2} 
              roughness={0.5}
            />
          </RoundedBox>
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.12}
            font="/fonts/Geist-Bold.ttf"
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {approved ? "APPROVED" : "DECLINED"}
          </Text>
        </group>
        
        {/* Contactless Icon */}
        <group position={[1.3, 0.4, 0.05]} rotation={[0, 0, -Math.PI / 4]}>
          {[0.08, 0.14, 0.20].map((radius, i) => (
            <mesh key={i}>
              <torusGeometry args={[radius, 0.015, 8, 32, Math.PI]} />
              <meshStandardMaterial color="white" opacity={0.7} transparent />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        color="#FF6600" 
        transparent 
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

interface CreditCard3DProps {
  approved: boolean;
  className?: string;
}

export function CreditCard3D({ approved, className = "" }: CreditCard3DProps) {
  return (
    <div className={`w-full h-64 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 3, 2]} intensity={0.5} color="#FF6600" />
        <pointLight position={[0, 2, 3]} intensity={0.3} color="#FF6600" />
        
        <CreditCard approved={approved} />
        <FloatingParticles />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
