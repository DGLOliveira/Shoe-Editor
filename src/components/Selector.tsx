import { useEffect, useState } from "react";
export default function Selector(props:
    {
        selected: string,
        setSelected: React.Dispatch<React.SetStateAction<string>>,
        colorSwatch: boolean,
        setColorSwatch: React.Dispatch<React.SetStateAction<boolean>>,
        colors: { [key: string]: string },
        extras: { [key: string]: boolean }
        setExtras: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
    }) {

    const { selected, setSelected, colorSwatch, setColorSwatch, colors, extras, setExtras } = props

    const [canSetVisibility, setCanSetVisibility]: [boolean,
        React.Dispatch<React.SetStateAction<boolean>>]
        = useState(false);

    //Changes which part is being edited using the arrow buttons in this component
    const changePart = (direction: number) => {
        if (selected === "") {
            setSelected(Object.keys(colors)[0]);
        } else {
            let partArray = Object.keys(colors);
            let index = partArray.indexOf(selected);
            if (index === partArray.length - 1 && direction === 1) index = 0;
            else if (index === 0 && direction === -1) index = partArray.length - 1
            else index += direction;
            setSelected(partArray[index]);
        }
    }

    useEffect(() => {
        if (selected === "") setColorSwatch(false);
        let newCanSetVisibility = false
        Object.keys(extras).map((key) => {
            if (selected === key) {
                newCanSetVisibility = true
            }
        })
        setCanSetVisibility(newCanSetVisibility)
    }, [selected])

    return (
        <>
            <div id="visibility"
                style={{ transform: canSetVisibility ? "translateY(25px) translateX(-50%)" : "translateX(-50%)" }}
            >
                        <div
                            className={extras[selected] === true || extras[selected] === undefined ? "switch switchOn" : "switch"}
                            onClick={() => {
                                extras[selected] !== undefined &&
                                setExtras({ ...extras, [selected]: !extras[selected] })
                            }}
                        >
                            <input
                                type="checkbox"
                                defaultChecked={extras[selected]}
                            />
                            <span
                                className={
                                    extras[selected] === true || extras[selected] === undefined
                                        ? "switchButton switchButtonOn"
                                        : "switchButton "
                                }
                            />
                        </div>
            </div>
            <div id="selector">
                <div>
                    <button
                        id="openColors"
                        className={colorSwatch ? "active" : ""}
                        disabled={selected === ""}
                        onClick={() => setColorSwatch(!colorSwatch)}>
                    </button>
                    <button onClick={() => changePart(-1)}>◄</button>
                </div>
                {selected !== "" ? selected : "Select a part"}
                <div>
                    <button onClick={() => changePart(1)}>►</button>
                    <button
                        className={selected === "" ? "active" : ""}
                        onClick={() => { setSelected(""); setColorSwatch(false) }}>
                        Ø
                    </button>
                </div>
            </div>
        </>

    )
}