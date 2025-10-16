import { useState } from "react";
import Navbar from "./components/Navbar.js";
import Menu from "./components/Menu.js";
import Scenario from "./components/Scenario.js";
import "./styles.css";

export default function App() {

  const [menu, setMenu] = useState("none");
  const [controls, setControls] = useState({
    Base: "#525588",
    Sole: "#FFFFFF",
    Laces: "#FFFFFF",
    Detail1: "#525588",
    Detail2: "#ae1010",
    Front: true,
    Back: true,
    Side: true
  });

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
