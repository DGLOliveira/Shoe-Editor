import { useState, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { PresentationControls, OrbitControls, Backdrop, Billboard, Text } from "@react-three/drei"
import { Selection, EffectComposer, Outline } from '@react-three/postprocessing'
import Model from "./Model.js"

export default function Scenario(props) {

  const { model, colors, extras, hover, setHover } = props

  const FallbackModel = () =>
    <Billboard>
      <Text follow={true} color={"black"}>Loading</Text>
    </Billboard>;

  const [modelFile, setModelFile] = useState(null)
  async function getModelFile() {
    const modelData = await import(`../data/${model.dataFile}`)
    const modelSource = await import(`../assets/${modelData.default.model_sourceFile}`)
    setModelFile(modelSource.default)
  }

  useEffect(() => {
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
      />{modelFile &&
        <Suspense fallback={<FallbackModel />}>
          <Selection>
            <EffectComposer multisampling={8} autoClear={false}>
              <Outline blur visibleEdgeColor="white" hiddenEdgeColor="white" edgeStrength={100} width={1000} />
            </EffectComposer>
            <PresentationControls
              enabled={true}
              cursor={true}
              global={true}
              config={{ mass: 1, tension: 100, friction: 26 }}
            >
              <Model
                colors={colors}
                extras={extras}
                modelFile={modelFile}
                hover={hover}
                setHover={setHover}
              />
            </PresentationControls>
          </Selection>
        </Suspense>
      }
      <Backdrop
        scale={[100, 20, 5]}
        position={[0, -3.5, -10]}
        floor={10000}
        segments={200}
        receiveShadow={true}
      >
        <meshPhysicalMaterial roughness={1} color="white" />
      </Backdrop>
      <ambientLight intensity={1} />
      <spotLight
        position={[0.5, 4, 6.5]}
        castShadow
        intensity={250}
        angle={0.8}
      />
    </Canvas>
  );
}
