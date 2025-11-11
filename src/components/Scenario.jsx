import { useState, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { PresentationControls, OrbitControls, Backdrop, Billboard, Text } from "@react-three/drei"
import Model from "./Model.js"

export default function Scenario(props) {

  const { model, colors, extras } = props

  const FallbackModel = () => 
  <Billboard>
    <Text follow={true} color={"black"}>Loading</Text>
  </Billboard>;
  
  const [modelFile, setModelFile] = useState(null)
  async function getModelFile() {
    const modelData = await import(`../data/${model.dataFile}`)
    console.log(modelData.default)
    const modelSource = await import(`../assets/${modelData.default.model_sourceFile}`)
    console.log(modelSource.default)
    setModelFile(modelSource.default)
  }

  useEffect(() => {
    console.log(model)
    if (model.dataFile) {
      getModelFile()
    }
  }, [model])

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
      >{modelFile &&
        <Suspense fallback={<FallbackModel />}>
          <Model
            colors={colors}
            extras={extras}
            modelFile={modelFile}
          />
        </Suspense>
        }
      </PresentationControls>
      <Backdrop
        scale={[100, 20, 5]}
        position={[0, -3.5, -10]}
        floor={10000} 
        segments={200}
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
