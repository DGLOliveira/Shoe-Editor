import React, { useState, useEffect } from "react"
import Navbar from "./components/Navbar.tsx"
import Menu from "./components/Menu.tsx"
import Scenario from "./components/Scenario.jsx"
import urlControler from "./controllers/url.ts"
import ModelList from "./data/Model_List.json"
import PartInput from "./components/PartInput.jsx"
import "./styles.css";

export default function App() {

  const DEFAULT_MODEL = ModelList[0]

  const models: [{ [key: string]: string }] = Object.keys(ModelList).map((key) => ModelList[key])

  const [menu, setMenu]: [string,
    React.Dispatch<React.SetStateAction<string>>]
    = useState("none")

  const [model, setModel]: [{ [key: string]: string },
    React.Dispatch<React.SetStateAction<{ [key: string]: string }>>]
    = useState({})

  const [colors, setColors]: [{ [key: string]: string },
    React.Dispatch<React.SetStateAction<{ [key: string]: string }>>]
    = useState({})

  const [extras, setExtras]: [{ [key: string]: boolean },
    React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>]
    = useState({})

  const [hover, setHover]: [string | null,
    React.Dispatch<React.SetStateAction<string | null>>]
    = useState(null)

  //Import model data
  const importData = async (newModel: { [key: string]: string }) => {
    const response = await import(`./data/${newModel.dataFile}`).catch(
      (error) => { console.error(error); console.log(newModel) }
    )
    let newColors: { [key: string]: string } = {}
    let newExtras: { [key: string]: boolean } = {}
    if (response && response.modifiers !== undefined) {
      if (response.modifiers.materials !== undefined) {
        Object.keys(response.modifiers.materials).map((key) => {
          newColors[key] = response.modifiers.materials[key].color
        })
      }
      if (response.modifiers.meshes !== undefined) {
        Object.keys(response.modifiers.meshes).map((key) => {
          newExtras[key] = response.modifiers.meshes[key].visible
        })
      }
    }
    return { colors: newColors, extras: newExtras }
  }

  const setInitModel = async () => {
    let params = urlControler.prototype.get()
    let initModel = {}
    let badURLModel = true
    //Check if URL has Category and Model values and they exist in ModelList
    if (params.Category && params.Name) {
      ModelList.map((item) => {
        if (item.Category === params.Category && item.Name === params.Name) {
          initModel = item
          badURLModel = false
        }
      })
    }
    //If URL model values don't exist or don't exist in ModelList, use default model
    if (badURLModel) {
      initModel = DEFAULT_MODEL
    }
    //Import model data
    let defaultValues = await importData(initModel)
    //Assume all values are bad if model values are bad
    if (badURLModel) {
      console.log("Bad URL model values, using default values")
      setColors(defaultValues.colors)
      setExtras(defaultValues.extras)
    }
    //Else compare URL values to default values, validate and assign, otherwise assign default value
    else {
      let newExtras: { [key: string]: boolean } = {}
      let newColors: { [key: string]: string } = {}
      Object.keys(defaultValues.extras).map((key: string) => {
        if (params[key] !== undefined) {
          if (params[key] === "true") {
            newExtras[key] = true
          } else if (params[key] === "false") {
            newExtras[key] = false
          } else {
            newExtras[key] = defaultValues.extras[key]
          }
        }
      })
      Object.keys(defaultValues.colors).map((key: string) => {
        if (params[key] !== undefined) {
          if (/^#[0-9A-F]{6}$/i.test(params[key])) {
            newColors[key] = params[key]
          } else {
            console.log(`Invalid color value for ${key}: ${params[key]}`)
            newColors[key] = defaultValues.colors[key]
          }
        }
      })
      setExtras(newExtras)
      setColors(newColors)
    }
    setModel(initModel)
  }

  //Runs on page load, imports model data
  useEffect(() => {
    setInitModel()
  }, [])

  //Updates model data
  async function changeModel(model: { [key: string]: string }){
      const defaultValues = await importData(model)
      setColors(defaultValues.colors)
      setExtras(defaultValues.extras)
  }

  useEffect(() => {
    //Prevents reloading same model data
    if (model.dataFile && model.Name !== urlControler.prototype.get().Name) {
      changeModel(model)
    }
  }, [model])

  // Updates URL to new values, pushes to history
  // Note: Timeout prevents flooding history with rapidly changing params inputs
  useEffect(() => {
    if (model.Category && model.Name) {
      const timeout = setTimeout(() => {
        if (model && colors && extras)
          urlControler.prototype.update(model, colors, extras)
      }, 500)
      if (timeout) {
        return () => clearTimeout(timeout)
      }
    }
  }, [model, colors, extras])

  return (
    <>
      <Navbar
        menu={menu}
        setMenu={setMenu}
        setHover={setHover}
      />
      <Menu
        menu={menu}
        model={model}
        setModel={setModel}
        models={models}
        colors={colors}
        setColors={setColors}
        extras={extras}
        setExtras={setExtras}
        hover={hover}
        setHover={setHover}
      />
      {model && colors && extras && <Scenario
        model={model}
        colors={colors}
        extras={extras}
        hover={hover}
        setHover={setHover}
      />}
      <PartInput
        hover={hover}
        setHover={setHover}
        colors={colors}
        setColors={setColors}
      />
    </>
  );
}
