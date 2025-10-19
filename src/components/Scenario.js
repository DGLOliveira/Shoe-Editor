import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import Shoe from "../assets/Shoe1.glb";

export default function ShoeRender(props) {
  const { colors, extras } = props;
  function Model() {
    const gltf = useGLTF(Shoe);
    const meshes = gltf.scene.children;
    const materials = gltf.materials;
    materials.Sole.color = new THREE.Color(colors.Sole);
    materials.Laces.color = new THREE.Color(colors.Laces);
    materials.Base.color = new THREE.Color(colors.Base);
    materials.Detail1.color = new THREE.Color(colors.Detail1);
    materials.Detail2.color = new THREE.Color(colors.Detail2);
    for (let i = 0; i < meshes.length; i++) {
      if (meshes[i].name === "Circle") {
        meshes[i].visible = extras.Side;
      }
      if (meshes[i].name === "Front") {
        meshes[i].visible = extras.Front;
      }
      if (meshes[i].name === "Back") {
        meshes[i].visible = extras.Back;
      }
    }
    return <primitive position={[0, -1, 0]} object={gltf.scene} />;
  }
  return (
    <Canvas>
      <OrbitControls enableRotate={true} enablePan={false} maxDistance={6} />
      <ambientLight intensity={0.2} />
      <spotLight
        position={[-4.5, 2, -4.5]}
        castShadow
        intensity={0.4}
        angle={0.4}
      />
      <Model />
    </Canvas>
  );
}
