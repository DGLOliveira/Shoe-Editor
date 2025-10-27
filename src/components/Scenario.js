import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { PresentationControls, OrbitControls, useGLTF, Backdrop } from "@react-three/drei";
import Shoe from "../assets/Canvas_Sneaker.glb";

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
        meshes[i].visible = extras.Circle;
      }
      if (meshes[i].name === "Front") {
        meshes[i].visible = extras.Front;
      }
      if (meshes[i].name === "Back") {
        meshes[i].visible = extras.Back;
      }
    }
    gltf.scene.rotation.set(0, 2*Math.PI/3, .1);
    function setShadow(meshes) {
      meshes.forEach( (mesh) => {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if(mesh.children.length > 0) {
          setShadow(mesh.children)
        }
      })
    }
    setShadow(meshes)
    return <primitive position={[0, -1, 0]} object={gltf.scene} castShadow />;
  }
  return (
    <Canvas shadows>
      <OrbitControls
        target={[0, 0, 0]}
        enablePan={false}
        enableRotate={false}
        enableZoom={true}
        zoomSpeed={0.5}
      />
      <PresentationControls
        enabled={true}
        cursor={true}
        config={{ mass: 1, tension: 100, friction: 26 }}
      >
        <Model />
      </PresentationControls>
      <Backdrop
        scale={[100, 20, 5]}
        position={[0, -3.5, -10]}
        floor={10000} // Stretches the floor segment, 0.25 by default
        segments={200} // Mesh-resolution, 20 by default
        receiveShadow={true}
      >
        <meshPhysicalMaterial roughness={1}  color="white" />
      </Backdrop>
      <ambientLight intensity={0.2} />
      <spotLight
        position={[0.5, 4, 6.5]}
        castShadow
        intensity={0.8}
        angle={0.8}
      />
      <ambientLight intensity={0.2} />
    </Canvas>
  );
}
