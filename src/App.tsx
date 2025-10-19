import React, { useState } from "react";
import Navbar from "./components/Navbar.js";
import Menu from "./components/Menu.js";
import Scenario from "./components/Scenario.js";
import "./styles.css";

export default function App() {

  const [menu, setMenu] : [string, React.Dispatch<React.SetStateAction<string>>] 
  = useState("none");
  const DefaultControl : {[key: string]: string | boolean } = {
    'Base': "#525588",
    'Sole': "#FFFFFF",
    'Laces': "#FFFFFF",
    'Detail1': "#525588",
    'Detail2': "#ae1010",
    'Front': true,
    'Back': true,
    'Side': true
  }
  const [controls, setControls] : [{[key: string]: string | boolean }, 
  React.Dispatch<React.SetStateAction<{[key: string]: string | boolean }>>] 
  = useState(DefaultControl);

  return (
    <>
      <Navbar
        menu={menu}
        setMenu={setMenu}
      />
      <Menu
        menu={menu}
        controls={controls}
        setControls={setControls}
      />
      <Scenario
       value={controls} 
       />
    </>
  );
}
