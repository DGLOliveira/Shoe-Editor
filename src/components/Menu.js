export default function Menu(props) {
    const { menu, controls, setControls } = props
    return (
        <>
            <ul className={menu === "colors" ? "expandMenu" : ""}>
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
                    ) : null
                )}
            </ul>
            <ul className={menu === "extras" ? "expandMenu" : ""}>
                {Object.keys(controls).map((name, index, arr) =>
                    typeof controls[arr[index]] === "boolean" ? (
                        <li
                            key={index}
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
                                    defaultChecked={controls[arr[index]]}
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
                    ) : null
                )}
            </ul>
        </>
    );
}