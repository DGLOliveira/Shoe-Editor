import { useState, useEffect } from "react";
import { MdContentCopy } from "react-icons/md";
import { MdContentPaste } from "react-icons/md";
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
        selected: string
        setSelected: React.Dispatch<React.SetStateAction<string>>
        copiedColor: string
        setCopiedColor: React.Dispatch<React.SetStateAction<string>>
        canCopy: boolean
    }
) {
    const { menu, model, setModel, models, colors, setColors, extras, setExtras, selected, setSelected, copiedColor, setCopiedColor, canCopy } = props

    const [url, setUrl]:
        [string, React.Dispatch<React.SetStateAction<string>>]
        = useState(window.location.href)

    useEffect(() => {
        if (menu === "share") setUrl(window.location.href)
    }, [menu])

    return (
        <>
            <ul className={menu === "models" ? "expandMenu" : ""}>
                <li className="spacer"></li>
                {models.map((item, index) =>
                    <li
                        key={index}
                        onClick={() => {
                            setModel({ ...item })
                        }}
                    >
                        {item.Name}
                        <input
                            type="radio"
                            name="model"
                            checked={item.Name === model.Name}
                            onChange={(e) => {
                                setModel({ ...item })
                            }}
                        />
                    </li>
                )}
            </ul>
            <ul className={menu === "colors" ? "expandMenu" : ""}>
                <li className="spacer"></li>
                {Object.keys(colors).map((name, index, arr) =>
                    <li key={index}
                        onMouseOver={() => selected !== name && setSelected(name)}
                        style={{background: selected === name ? "lightskyblue" : "white"}}
                        >
                        {name}
                        <div>
                            <button
                                arial-label="Copy color"
                                style={{
                                    background: colors[arr[index]],
                                    cursor: "copy"
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setCopiedColor(colors[arr[index]])
                                }}
                            >
                                <MdContentCopy />
                            </button>
                            <button
                                arial-label="Paste color"
                                style={{
                                     backgroundColor: canCopy ? copiedColor : "transparent",
                                     cursor: canCopy ? "pointer" : "not-allowed"
                                     }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setColors({
                                        ...colors,
                                        [name]: copiedColor
                                    })
                                }}
                            >
                                <MdContentPaste />
                            </button>
                        </div>
                    </li>
                )}
            </ul>
            <ul className={menu === "extras" ? "expandMenu" : ""}>
                <li className="spacer"></li>
                {Object.keys(extras).length !== 0 ? Object.keys(extras).map((name, index, arr) =>
                    <li
                        key={index}
                        onClick={() =>
                            setExtras({
                                ...extras,
                                [arr[index]]: !extras[arr[index]]
                            })
                        }
                        onMouseOver={() => selected !== name && setSelected(name)}
                        style={{background: selected === name ? "lightskyblue" : "white"}}
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
                <li className="spacer"></li>
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