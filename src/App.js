import { useState } from "react";
import Shoe from "./assets/ShoeRender.js";
import "./styles.css";

export default function App() {
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
  const [colorMenu, setColorMenu] = useState(false);
  const [extrasMenu, setExtrasMenu] = useState(false);
  function handleNav(value) {
    switch (value) {
      case "colors":
        setColorMenu(!colorMenu);
        setExtrasMenu(false);
        break;
      case "extras":
        setColorMenu(false);
        setExtrasMenu(!extrasMenu);
        break;
      default:
        setColorMenu(false);
        setExtrasMenu(false);
        break;
    }
  }
  return (
    <>
      <header>
        <h1>Shoe Editor</h1>
        <nav>
          <h2
            onClick={() => handleNav("colors")}
            className={colorMenu ? "selectedMenu" : ""}
          >
            |Colors|
          </h2>
          <h2
            onClick={() => handleNav("extras")}
            className={extrasMenu ? "selectedMenu" : ""}
          >
            |Extras|
          </h2>
        </nav>
      </header>
      <ul className={colorMenu ? "expandMenu" : ""}>
        {Object.keys(controls).map((name, index, arr) =>
          typeof controls[arr[index]] === "string" ? (
            <li key={index}>
              {name}
              <input
                type="color"
                name={name}
                value={controls[arr[index]]}
                onChange={(e) =>
                  setControls({ ...controls, [e.target.name]: e.target.value })
                }
              />
            </li>
          ) : (
            <></>
          )
        )}
      </ul>
      <ul className={extrasMenu ? "expandMenu" : ""}>
        {Object.keys(controls).map((name, index, arr) =>
          typeof controls[arr[index]] === "boolean" ? (
            <li
              onClick={() =>
                setControls({
                  ...controls,
                  [arr[index]]: !controls[arr[index]]
                })
              }
            >
              {name}
              <div
                className={controls[arr[index]] ? "switch switchOn" : "switch"}
              >
                <input
                  name={name}
                  type="checkbox"
                  checked={controls[arr[index]]}
                />
                <span
                  className={
                    controls[arr[index]]
                      ? "switchButton switchButtonOn"
                      : "switchButton "
                  }
                />
              </div>
            </li>
          ) : (
            <></>
          )
        )}
      </ul>
      <Shoe value={controls} />
    </>
  );
}
