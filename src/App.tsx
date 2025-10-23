import React, { useState, useEffect, lazy, useCallback } from "react";
import Navbar from "./components/Navbar.tsx";
import Menu from "./components/Menu.tsx";
import Scenario from "./components/Scenario.js";
import urlControler from "./controllers/url.js";
import "./styles.css";
import { time } from "console";

export default function App() {

  const [menu, setMenu]: [string, React.Dispatch<React.SetStateAction<string>>]
    = useState("none")

  const [model, setModel]: [{ [key: string]: string },
    React.Dispatch<React.SetStateAction<{ [key: string]: string }>>]
    = useState({
      "name": "Canvas",
      "category": "Sneaker",
      "dataFile": "Canvas_Sneaker.json"
    })

  const [colors, setColors]: [{ [key: string]: string },
    React.Dispatch<React.SetStateAction<{ [key: string]: string }>>]
    = useState({})

  const [extras, setExtras]: [{ [key: string]: boolean },
    React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>]
    = useState({})

  const importData = async () => {
    const response = await import(`./data/${model.dataFile}`).catch(console.error)
    let newColors: { [key: string]: string } = {}
    Object.keys(response.modifiers.materials).map((key) => {
      newColors[key] = response.modifiers.materials[key].color
    })
    let newExtras: { [key: string]: boolean } = {}
    Object.keys(response.modifiers.meshes).map((key) => {
      newExtras[key] = response.modifiers.meshes[key].visible
    })
    setColors(newColors)
    setExtras(newExtras)

  }

  useEffect(() => {
    importData()
  }, [model])

  useEffect(() => {
    //changes URL to new values, pushes to history and prevents flooding history with rapidly changing params
    const timeout = setTimeout(() => {
      if (model && colors && extras)
        urlControler.prototype.update(model, colors, extras)
    }, 500)
    if(timeout){
      return () => clearTimeout(timeout)
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
      <Scenario
        colors={colors}
        extras={extras}
      />
    </>
  );
}
