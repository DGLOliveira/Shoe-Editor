import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import Shoe from "../assets/Canvas_Sneaker.glb"
export default function Model(props) {

    const { colors, extras, modelFile } = props

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
        console.log(modelFile)
        const gltf = useGLTF(modelFile)
        console.log(gltf)
        setColors(gltf.materials)
        setVisibility(gltf.scene.children)
        setShadow(gltf.scene.children)
        gltf.scene.rotation.set(0, 2 * Math.PI / 3, .1)
        return <primitive position={[0, -1, 0]} object={gltf.scene} castShadow />
    }

    return <Model />
}