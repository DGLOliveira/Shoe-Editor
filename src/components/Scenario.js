import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { PresentationControls, OrbitControls, useGLTF, Backdrop } from "@react-three/drei";
import Shoe from "../assets/Canvas_Sneaker.glb";

export default function ShoeRender(props) {
  const { colors, extras } = props

  //Iterate through all the meshes and activate shadows
  function setShadow(meshes) {
    meshes.forEach((mesh) => {
      mesh.castShadow = true
      mesh.receiveShadow = true
      if (mesh.children.length > 0) {
        setShadow(mesh.children)
      }
    })
  }

  //Iterate through all the materials and assign new colors
  function setColors(materials) {
    Object.keys(materials).forEach((key) => {
      if (colors[key]) {
        materials[key].color = new THREE.Color(colors[key])
      }
    })
  }

  //Iterate through all the meshes and set visibility
  function setVisibility(meshes) {
    meshes.forEach((mesh) => {
      if (extras[mesh.name] !== undefined) {
        mesh.visible = extras[mesh.name]
      }
      if (mesh.children.length > 0) {
        setVisibility(mesh.children)
      }
    })
  }

  //Load model and set values
  function Model() {
    const gltf = useGLTF(Shoe)
    setColors(gltf.materials)
    setVisibility(gltf.scene.children)
    setShadow(gltf.scene.children)
    gltf.scene.rotation.set(0, 2 * Math.PI / 3, .1)
    return <primitive position={[0, -1, 0]} object={gltf.scene} castShadow />
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
        <meshPhysicalMaterial roughness={1} color="white" />
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
