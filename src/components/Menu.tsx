import { useState, useEffect } from "react";
export default function Menu(props:
    {
        menu: string,
        model: { [key: string]: string },
        setModel: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
        models: [{ [key: string]: string }]
        colors: { [key: string]: string }
        setColors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
        extras: { [key: string]: boolean }
        setExtras: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
    }
) {
    const { menu, model, setModel, models, colors, setColors, extras, setExtras } = props

    const [url, setUrl]:
        [string, React.Dispatch<React.SetStateAction<string>>]
        = useState(window.location.href)

    useEffect(() => {
        if (menu === "share") setUrl(window.location.href)
    }, [menu])


    console.log(Object.keys(colors).length)
    return (
        <>
            <ul className={menu === "models" ? "expandMenu" : ""}>
                {models.map((item, index) =>
                    <li
                        key={index}
                        onClick={() =>{
                            setModel({ ...item })
                        }}
                    >
                        {item.Name}
                        <input
                            type="radio"
                            name="model"
                            checked={item.Name === model.Name}
                            onChange={(e) =>{
                                setModel({...item})
                            }}
                        />
                    </li>
                )}
            </ul>
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
                {Object.keys(extras).length !== 0 ? Object.keys(extras).map((name, index, arr) =>
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
                ) : <li>No extra features available for this model</li>}
            </ul>
            <ul className={menu === "share" ? "expandMenu" : ""}>
                <li style={{ flexDirection: "column" }}>
                    <button
                        id="copyLinkButton"
                        onClick={() => navigator.clipboard.writeText(url)}
                    >Copy Link
                    </button>
                    <br />
                    <textarea
                        id="linkBox"
                        value={url}
                        readOnly={true}
                    />
                </li>
            </ul>
        </>
    );
}