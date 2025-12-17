import { useEffect } from "react";
export default function Selector(props:
    {
        hover: string | null,
        setHover: React.Dispatch<React.SetStateAction<string | null>>,
        colorSwatch: boolean,
        setColorSwatch: React.Dispatch<React.SetStateAction<boolean>>,
        colors: { [key: string]: string }
    }) {

    const { hover, setHover, colorSwatch, setColorSwatch, colors } = props
    //Changes which part is being edited using the arrow buttons in this component
    const changePart = (direction: number) => {
        if (hover === null) {
            setHover(Object.keys(colors)[0]);
        } else {
            let partArray = Object.keys(colors);
            let index = partArray.indexOf(hover);
            if (index === partArray.length - 1 && direction === 1) index = 0;
            else if (index === 0 && direction === -1) index = partArray.length - 1
            else index += direction;
            setHover(partArray[index]);
        }
    }
    
    useEffect(()=>{
        if(hover === null) setColorSwatch(false)
    },[hover])

    return (
        <div id="selector">
            <div>
                <button
                    id="openColors"
                    className={colorSwatch ? "active" : ""}
                    disabled={hover === null}
                    onClick={() => setColorSwatch(!colorSwatch)}>
                </button>
                <button onClick={() => changePart(-1)}>◄</button>
            </div>
            {hover !== null ? hover : "Select a part"}
            <div>
                <button onClick={() => changePart(1)}>►</button>
                <button
                    className={hover === null ? "active" : ""}
                    onClick={() => {setHover(null); setColorSwatch(false)}}>
                    Ø
                </button>
            </div>
        </div>

    )
}