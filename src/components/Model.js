import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { Select } from "@react-three/postprocessing"
export default function Model(props) {

    const { colors, extras, modelFile, selected, setSelected } = props

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

    //Iterate through all the materials and assign new Three colors
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

    const markselected = (name) => {
        if (colors[name] !== undefined) {
            setSelected(name)
        } else {
            setSelected("")
        }
    }

    //Load model and set values
    function Model() {
        const { materials, scene, nodes } = useGLTF(modelFile)
        setColors(materials)
        setVisibility(scene.children)
        setShadow(scene.children)
        scene.rotation.set(0, 2 * Math.PI / 3, .1)
        function generateObjects(obj) {
            if (obj.isObject3D && obj.name !== "Scene") {
                if (obj.isMesh) {
                    return <Select enabled={selected === obj.material.name} key={obj.name}>
                        <mesh {...obj} />
                    </Select>
                } else if (obj.isGroup) {
                    return <group {...obj} key={obj.name}>
                        {obj.children.map(objChild => generateObjects(objChild))}
                    </group>
                }
            } else {
                return null
            }
        }
        return (
            <group onClick={(e) => { e.stopPropagation(); markselected(e.object.material.name) }} >
                {scene.children.map(node =>
                    generateObjects(node)
                )}
            </group>
        )
    }

    return <Model />
}