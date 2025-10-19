export default function Menu(props: 
    {
        menu: string
        colors: {[key: string]: string }
        setColors: React.Dispatch<React.SetStateAction<{[key: string]: string }>>
        extras: {[key: string]: boolean }
        setExtras: React.Dispatch<React.SetStateAction<{[key: string]: boolean }>>
    }
) {
    const { menu, colors, setColors, extras, setExtras } = props
    return (
        <>
            <ul className={menu === "colors" ? "expandMenu" : ""}>
                {Object.keys(colors).map((name, index, arr) =>
                        <li key={index}>
                            {name}
                            <input
                                type="color"
                                name={name}
                                value={colors[arr[index]]}
                                onChange={(e) =>
                                    setColors({ ...colors, [e.target.name]: e.target.value })
                                }
                            />
                        </li>
                )}
            </ul>
            <ul className={menu === "extras" ? "expandMenu" : ""}>
                {Object.keys(extras).map((name, index, arr) =>
                        <li
                            key={index}
                            onClick={() =>
                                setExtras({
                                    ...extras,
                                    [arr[index]]: !extras[arr[index]]
                                })
                            }
                        >
                            {name}
                            <div
                                className={extras[arr[index]] ? "switch switchOn" : "switch"}
                            >
                                <input
                                    name={name}
                                    type="checkbox"
                                    defaultChecked={extras[arr[index]]}
                                />
                                <span
                                    className={
                                        extras[arr[index]]
                                            ? "switchButton switchButtonOn"
                                            : "switchButton "
                                    }
                                />
                            </div>
                        </li>
                )}
            </ul>
        </>
    );
}