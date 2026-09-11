import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Player() {
  return (
    <group position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, 2.6, 0]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#f2c6a0" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 1.55, 0]}>
        <capsuleGeometry args={[0.38, 0.9, 8, 16]} />
        <meshStandardMaterial color="#1f4959" />
      </mesh>

      {/* Left arm */}
      <mesh
        position={[-0.55, 1.65, 0]}
        rotation={[0, 0, -0.35]}
      >
        <capsuleGeometry args={[0.12, 0.75, 8, 16]} />
        <meshStandardMaterial color="#1f4959" />
      </mesh>

      {/* Right arm */}
      <mesh
        position={[0.55, 1.65, 0]}
        rotation={[0, 0, 0.35]}
      >
        <capsuleGeometry args={[0.12, 0.75, 8, 16]} />
        <meshStandardMaterial color="#1f4959" />
      </mesh>

      {/* Left leg */}
      <mesh
        position={[-0.22, 0.45, 0]}
        rotation={[0.05, 0, -0.08]}
      >
        <capsuleGeometry args={[0.14, 1.15, 8, 16]} />
        <meshStandardMaterial color="#242424" />
      </mesh>

      {/* Right leg */}
      <mesh
        position={[0.22, 0.45, 0]}
        rotation={[-0.08, 0, 0.18]}
      >
        <capsuleGeometry args={[0.14, 1.15, 8, 16]} />
        <meshStandardMaterial color="#242424" />
      </mesh>

      {/* Left foot */}
      <mesh position={[-0.3, -0.18, 0.15]}>
        <boxGeometry args={[0.25, 0.15, 0.45]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Right foot */}
      <mesh position={[0.35, -0.18, 0.15]}>
        <boxGeometry args={[0.25, 0.15, 0.45]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export default function SportsPlayer3D() {
  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "20px",
        overflow: "hidden",
        background: "#eaf1f4",
      }}
    >
      <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }}>
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
        />

        <directionalLight
          position={[-5, 3, 2]}
          intensity={1}
        />

        <Player />

        <gridHelper
          args={[8, 8]}
          position={[0, -1.2, 0]}
        />

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={8}
        />
      </Canvas>
    </div>
  );
}