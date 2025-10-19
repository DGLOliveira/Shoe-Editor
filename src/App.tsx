import React, { useState } from "react";
import Navbar from "./components/Navbar.js";
import Menu from "./components/Menu.js";
import Scenario from "./components/Scenario.js";
import "./styles.css";

export default function App() {

  const [menu, setMenu] : [string, React.Dispatch<React.SetStateAction<string>>] 
  = useState("none");
  const DefaultColors : {[key: string]: string } = {
    'Base': "#525588",
    'Sole': "#FFFFFF",
    'Laces': "#FFFFFF",
    'Detail1': "#525588",
    'Detail2': "#ae1010",
  }
  const DefaultExtras : {[key: string]: boolean } = {
    'Side': true,
    'Front': true,
    'Back': true
  }
  const [colors, setColors] : [{[key: string]: string }, 
  React.Dispatch<React.SetStateAction<{[key: string]: string }>>] 
  = useState(DefaultColors);
  const [extras, setExtras] : [{[key: string]: boolean }, 
  React.Dispatch<React.SetStateAction<{[key: string]: boolean }>>] 
  = useState(DefaultExtras);

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
