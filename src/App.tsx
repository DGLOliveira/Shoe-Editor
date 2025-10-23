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
    //Check if URL has Category and Model values and they exist in ModelList
    if (params.Category && params.Model) {
      let found = false
      ModelList.map((item) => {
        if (item.Category === params.Category && item.Name === params.Model) {
          setModel(item)
          initModel = item
          found = true
        }
      })
      //If URL values don't exist in ModelList, use default
      if (!found) {
        initModel = DEFAULT_MODEL
      }
    }
    //If URL values don't exist, use default
    else {
      initModel = DEFAULT_MODEL
    }
    let defaultValues = await importData(initModel)
    /*
      Create code for validating and assigning url param values
    */
    setModel(initModel)
    setColors(defaultValues.colors)
    setExtras(defaultValues.extras)
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
