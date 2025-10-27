import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.tsx";
import Menu from "./components/Menu.tsx";
import Scenario from "./components/Scenario.js";
import urlControler from "./controllers/url.ts";
import ModelList from "./data/Model_List.json"
import "./styles.css";

export default function App() {

  const DEFAULT_MODEL = ModelList[0]

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

  //Import model data
  const importData = async (initModel: { [key: string]: string }) => {
    const response = await import(`./data/${initModel.dataFile}`).catch(console.error)
    let newColors: { [key: string]: string } = {}
    let newExtras: { [key: string]: boolean } = {}
    if (response) {
      Object.keys(response.modifiers.materials).map((key) => {
        newColors[key] = response.modifiers.materials[key].color
      })
      Object.keys(response.modifiers.meshes).map((key) => {
        newExtras[key] = response.modifiers.meshes[key].visible
      })
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
          setModel(item)
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
    setModel(initModel)
    //Assume all values are bad if model values are bad
    if (badURLModel) {
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
            newColors[key] = defaultValues.colors[key]
          }
        }
      })
      setExtras(newExtras)
      setColors(newColors)
    }
  }

  //Runs on page load
  useEffect(() => {
    setInitModel()
  }, [])

  //Runs on model change, only one model currently available so no current need for this
  /*useEffect(() => {
    importData(model)
  }, [model])*/

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
      />
      <Menu
        menu={menu}
        colors={colors}
        setColors={setColors}
        extras={extras}
        setExtras={setExtras}
      />
      {model && colors && extras && <Scenario
        colors={colors}
        extras={extras}
      />}
    </>
  );
}
