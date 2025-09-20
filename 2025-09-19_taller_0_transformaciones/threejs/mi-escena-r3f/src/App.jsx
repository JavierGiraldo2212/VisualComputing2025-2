import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

/**
 * Componente que renderiza el cubo animado.
 */
function ObjetoAnimado() {
  // useRef nos permite acceder directamente al objeto 3D (la malla)
  const meshRef = useRef();

  // useFrame es un hook de R3F que ejecuta este código en cada frame
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const elapsedTime = clock.getElapsedTime();

      // 1. Traslación: Mover el cubo en una trayectoria circular
      meshRef.current.position.x = Math.sin(elapsedTime) * 2;
      meshRef.current.position.z = Math.cos(elapsedTime) * 2;
      meshRef.current.position.y = Math.sin(elapsedTime) * 2;

      // 2. Rotación: Rotar continuamente sobre los ejes X e Y
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;

      // 3. Escalado: Escalar suavemente con una función senoidal
      const scale = 1 + Math.sin(elapsedTime) * 0.5;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="royalblue" />
    </mesh>
  );
}

/**
 * Componente principal de la aplicación.
 */
export default function App() {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
      {/* Iluminación para que el objeto sea visible */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Componente con nuestro cubo animado */}
      <ObjetoAnimado />
      
      {/* Bonus: Controles para mover la cámara con el mouse */}
      <OrbitControls />

      {/* Ayudantes visuales (opcional) */}
      <axesHelper args={[5]} />
      <gridHelper />
    </Canvas>
  );
}