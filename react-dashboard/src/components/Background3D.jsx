import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, MeshDistortMaterial, Sphere } from '@react-three/drei'

function FloatingShape() {
    const meshRef = useRef()
    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        meshRef.current.rotation.x = t * 0.2
        meshRef.current.rotation.y = t * 0.3
        meshRef.current.position.y = Math.sin(t * 0.5) * 0.5
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[2, 0, -2]}>
                <MeshDistortMaterial
                    color="#646cff"
                    attach="material"
                    distort={0.5}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    )
}

function FloatingShape2() {
    return (
        <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
            <Sphere args={[1, 32, 32]} position={[-3, 1, -4]}>
                <MeshDistortMaterial
                    color="#ff0055"
                    attach="material"
                    distort={0.4}
                    speed={1.5}
                    roughness={0.2}
                    metalness={0.5}
                />
            </Sphere>
        </Float>
    )
}

export default function Background3D() {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <color attach="background" args={['#050510']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <FloatingShape />
                <FloatingShape2 />
            </Canvas>
        </div>
    )
}
