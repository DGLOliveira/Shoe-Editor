//Code forked and adapted from Virtual desktop project

import { useState, useRef, useEffect } from "react"
export default function partInput(props) {
    const { hover, setHover, colors, setColors, copiedColor, setCopiedColor, canCopy } = props
    const hueLumRef = useRef(null)
    const saturationRef = useRef(null);
    const [colorSelectorPos, setColorSelectorPos] = useState({ x: 0, y: 0 });
    const [saturationSliderPos, setSaturationSliderPos] = useState(0);
    const [hsl, setHSL] = useState([0, 50, 100]);
    const [rgb, setRGB] = useState([0, 0, 0]);
    const [hex, setHex] = useState("#000000");
    const [hexInput, setHexInput] = useState("#000000");
    const [invalidHex, setInvalidHex] = useState(false);
    const [selectedInputs, setSelectedInputs] = useState("HSL");

    //Converts hex string to RGB array
    const hexToRgb = (hex) => {
        var result;
        if (hex.length === 4) {
            result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
        } else {
            result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        }
        return result
            ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16),
            ]
            : null;
    }

    //Converts RGB arrray to hex string
    const rgbToHex = (rgb) => {
        return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
    };

    //Converts RGB array to HSL array
    const rgbToHsl = (rgb) => {
        let r = rgb[0],
            g = rgb[1],
            b = rgb[2];
        r /= 255;
        g /= 255;
        b /= 255;
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = ((cmax + cmin) / 2);
        if (delta === 0) {
            s = 0;
            h = 0;
        } else {
            if (l <= 0.5) {
                s = delta / (cmax + cmin);
            } else {
                s = delta / (2 - cmax - cmin);
            };
            if (cmax === r) {
                h = (g - b) / delta;
            } else if (cmax === g) {
                h = ((b - r) / delta) + 2;
            } else if (cmax === b) {
                h = ((r - g) / delta) + 4;
            }
        }
        h = Math.round(h * 60);
        if (h < 0) {
            h += 360;
        }
        s = Math.abs(s * 100).toFixed(0);
        l = (l * 100).toFixed(0);
        let hsl = [Number(h), Number(s), Number(l)];
        return hsl;
    }

    //Converts HSL array to RGB array
    const hslToRgb = (hsl) => {
        let h = hsl[0],
            s = hsl[1] / 100,
            l = hsl[2] / 100,
            c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;
        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (300 <= h && h < 360) {
            r = c;
            g = 0;
            b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        let rgb = [r, g, b];
        return rgb
    }

    //Updates all color formatted values
    const updateAllColors = (target, value) => {
        let newRGB = []
        let newHSL = []
        let newHex = ""
        switch (target) {
            case "hex":
                newHex = value;
                newRGB = hexToRgb(value);
                newHSL = rgbToHsl(newRGB);
                break;
            case "hsl":
                newHSL = value;
                newRGB = hslToRgb(value);
                newHex = rgbToHex(newRGB);
                break;
            case "rgb":
                newRGB = value;
                newHSL = rgbToHsl(value);
                newHex = rgbToHex(value);
                break;
        }
        setHex(newHex);
        setHSL(newHSL);
        setRGB(newRGB);
        if (hover) setColors({ ...colors, [hover]: newHex });
    }

    //Updates color formatted values when mouse hovers over a different part of the shoe
    useEffect(() => {
        if (hover) {
            let color = colors[hover];
            let hexColor = "";
            let rgbColor = [];
            let hslColor = [];
            if (color[0] === "#") {
                hexColor = color;
                rgbColor = hexToRgb(hexColor);
                hslColor = rgbToHsl(rgbColor);
            } else if (color.slice(0, 3) === "rgb") {
                rgbColor = color.slice(4, color.length - 1).split(", ");
                hexColor = rgbToHex(rgbColor);
                hslColor = rgbToHsl(color);
            } else if (color.slice(0, 3) === "hsl") {
                hslColor = color.slice(4, color.length - 1).split(", ");
                hslColor[1] = hslColor[1].slice(0, hslColor[1].length - 1); //removes %
                hslColor[2] = hslColor[2].slice(0, hslColor[2].length - 1); //removes %
                rgbColor = hslToRgb(hslColor);
                hexColor = rgbToHex(rgbColor);
            } else {
                //No other color formats supported
                console.error("Unsuported/Invalid color format", color);
            }
            setHex(hexColor);
            setRGB([Number(rgbColor[0]), Number(rgbColor[1]), Number(rgbColor[2])]);
            setHSL([Number(hslColor[0]), Number(hslColor[1]), Number(hslColor[2])]);
            const hueLumRect = hueLumRef.current.getBoundingClientRect();
            setColorSelectorPos({
                x: hslColor[0] / 360 * hueLumRect.width,
                y: (100 - hslColor[2]) / 100 * hueLumRect.height
            });
            const saturationRect = saturationRef.current.getBoundingClientRect();
            setSaturationSliderPos(((100 - hslColor[1]) / 100) * saturationRect.height);

        }
    }, [hover])

    //Genetates a hue and luminance 2D color pixel map for canvas
    const drawColorMap = (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let blockwidth = ctx.canvas.width / 360;
        let blockheight = ctx.canvas.height / 100;
        for (let i = 0; i < 360; i++) {
            for (let j = 0; j < 100; j++) {
                ctx.fillStyle = `hsl(${i},${hsl[1]}%,${100 - j}%)`;
                ctx.fillRect(i * blockwidth, j * blockheight, (i + 1) * blockwidth, (j + 1) * blockheight);
            }
        }
    };

    //Updates hue and luminance map slider positions when mouse moves, as well as color values
    const handleHueLumMap = (event) => {
        if (event.buttons !== 0) {
            const rect = hueLumRef.current.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                setColorSelectorPos({ x, y });
                let newHSL = [Math.floor(360 * x / rect.width), hsl[1], 100 - Math.floor(100 * y / rect.height)];
                updateAllColors("hsl", newHSL);
            }
        }
    };
    //Updates hue and luminance map slider position on touch, as well as their respective values
    const touchHueLumMap = (event) => {
        if (event.touches.length === 1) {
            const rect = hueLumRef.current.getBoundingClientRect();
            let x = event.touches[0].clientX - rect.left;
            let y = event.touches[0].clientY - rect.top;
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                setColorSelectorPos({ x, y });
                let newHSL = [Math.floor(360 * x / rect.width), hsl[1], 100 - Math.floor(100 * y / rect.height)];
                updateAllColors("hsl", newHSL);
            }
        }
    };

    //Updates saturation slider position when mouse moves, as well as its value
    const handleSaturationSlider = (event) => {
        if (event.buttons !== 0) {
            const rect = saturationRef.current.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                setSaturationSliderPos(y);
                let newHSL = [hsl[0], 100 - Math.floor(100 * y / rect.height), hsl[2]];
                updateAllColors("hsl", newHSL);
            }
        }
    };
    //Updates saturation slider position on touch, as well as its value
    const touchSaturationSlider = (event) => {
        if (event.touches.length === 1) {
            const rect = saturationRef.current.getBoundingClientRect();
            let x = event.touches[0].clientX - rect.left;
            let y = event.touches[0].clientY - rect.top;
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                setSaturationSliderPos(y);
                let newHSL = [hsl[0], 100 - Math.floor(100 * y / rect.height), hsl[2]];
                updateAllColors("hsl", newHSL);
            }
        }
    };

    //Updates color values based on HSL input
    const handleHSLInput = (target, value) => {
        let newHSL = hsl;
        if (target === "h") newHSL[0] = Number(value);
        if (target === "s") newHSL[1] = Number(value);
        if (target === "l") newHSL[2] = Number(value);
        updateAllColors("hsl", newHSL);
    }

    //Updates color values based on RGB input
    const handleRGBInput = (target, value) => {
        let newRGB = rgb;
        if (target === "r") newRGB[0] = Number(value);
        if (target === "g") newRGB[1] = Number(value);
        if (target === "b") newRGB[2] = Number(value);
        updateAllColors("rgb", newRGB);
    }

    //Validates hex color and updates color values if valid
    const handleHEXInput = () => {
        let newHex = "";
        if (hexInput.match(/^#([A-Fa-f0-9]{6})$/)) {
            newHex = hexInput
            updateAllColors("hex", newHex);
        }
        else if (hexInput.match(/^#([A-Fa-f0-9]{3})$/)) {
            newHex = `#${hexInput[1] + hexInput[1] + hexInput[2] + hexInput[2] + hexInput[3] + hexInput[3]}`
            updateAllColors("hex", newHex);
        } else if (hexInput.match(/^([A-Fa-f0-9]{6})$/)) {
            newHex = `#${hexInput[0] + hexInput[0] + hexInput[1] + hexInput[1] + hexInput[2] + hexInput[2]}`
            updateAllColors("hex", newHex);
        } else if (hexInput.match(/^([A-Fa-f0-9]{3})$/)) {
            newHex = `#${hexInput[0] + hexInput[0] + hexInput[1] + hexInput[1] + hexInput[2] + hexInput[2]}`
            updateAllColors("hex", newHex);
        }
        if (newHex === "") {
            setInvalidHex(true);
        } else {
            setInvalidHex(false);
        }
    }

    //Changes which part is being edited using the arrow buttons in this component
    const changePart = (direction) => {
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

    //Updates color map, saturation map and repective slider positions
    useEffect(() => {
        if (hueLumRef.current && saturationRef.current) {
            const ctxColorPicker = hueLumRef.current.getContext("2d", { alpha: false });
            drawColorMap(ctxColorPicker);
            const rect = hueLumRef.current.getBoundingClientRect();
            setColorSelectorPos({ x: hsl[0] / 360 * rect.width, y: (100 - hsl[2]) / 100 * rect.height });
            const vert = saturationRef.current.getBoundingClientRect();
            setSaturationSliderPos(((100 - hsl[1]) / 100) * vert.height);
        }

    }, [hover, hex]);

    useEffect(() => {
        setHexInput(hex);
    }, [selectedInputs, hex])

    return (
        <>
            <div id="partName">
                <button onClick={() => changePart(-1)}>◄</button>
                {hover !== null ? hover : "Select a part"}
                <button onClick={() => changePart(1)}>►</button>
            </div>
            <div id="partInput">
                <div id="partEditor">
                    <hue-light-map>
                        <canvas
                            onMouseDown={(e) => handleHueLumMap(e)}
                            onMouseMove={(e) => handleHueLumMap(e)}
                            onTouchMove={(e) => touchHueLumMap(e)}
                            onTouchStart={(e) => touchHueLumMap(e)}
                            onTouchEnd={(e) => touchHueLumMap(e)}
                            ref={hueLumRef} width="180" height="180"
                        />
                        <slider-thumb
                            style={{
                                top: colorSelectorPos.y,
                                left: colorSelectorPos.x,
                                background: `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`
                            }}
                            onMouseDown={(e) => handleHueLumMap(e)}
                            onMouseMove={(e) => handleHueLumMap(e)}
                            onTouchMove={(e) => touchHueLumMap(e)}
                            onTouchStart={(e) => touchHueLumMap(e)}
                            onTouchEnd={(e) => touchHueLumMap(e)}
                        />
                    </hue-light-map>
                    <saturation-slider title="Saturation">
                        <div
                            ref={saturationRef}
                            style={{
                                background:
                                    `linear-gradient(0deg, hsl(${hsl[0]},0%,${hsl[2]}%), hsl(${hsl[0]},100%,${hsl[2]}%))`
                            }}
                            onMouseDown={(e) => handleSaturationSlider(e)}
                            onMouseMove={(e) => handleSaturationSlider(e)}
                            onTouchMove={(e) => touchSaturationSlider(e)}
                            onTouchStart={(e) => touchSaturationSlider(e)}
                            onTouchEnd={(e) => touchSaturationSlider(e)}
                        />
                        <slider-thumb
                            style={{
                                top: saturationSliderPos,
                                background: `hsla(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`
                            }}
                            onMouseDown={(e) => handleSaturationSlider(e)}
                            onMouseMove={(e) => handleSaturationSlider(e)}
                            onTouchMove={(e) => touchSaturationSlider(e)}
                            onTouchStart={(e) => touchSaturationSlider(e)}
                            onTouchEnd={(e) => touchSaturationSlider(e)}
                        />
                    </saturation-slider>
                </div>
                <div className="partButtons">
                    <button className={selectedInputs === "HEX" ? "active" : ""} onClick={() => setSelectedInputs("HEX")}>HEX</button>
                    <button className={selectedInputs === "HSL" ? "active" : ""} onClick={() => setSelectedInputs("HSL")}>HSL</button>
                    <button className={selectedInputs === "RGB" ? "active" : ""} onClick={() => setSelectedInputs("RGB")}>RGB</button>
                </div>
                <div id="partValues">
                    {selectedInputs === "HSL" &&
                        <>
                            <div>
                                <label htmlFor="hue">Hue</label>
                                <input type="number" id="hue" value={hsl[0]} min="0" max="360" onChange={(e) => handleHSLInput("h", e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="saturation">Saturation</label>
                                <input type="number" id="saturation" value={hsl[1]} min="0" max="100" onChange={(e) => handleHSLInput("s", e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="luminosity">Luminosity</label>
                                <input type="number" id="luminosity" value={hsl[2]} min="0" max="100" onChange={(e) => handleHSLInput("l", e.target.value)} />
                            </div>
                        </>}
                    {selectedInputs === "RGB" &&
                        <>
                            <div>
                                <label htmlFor="red">Red</label>
                                <input type="number" id="red" value={rgb[0]} min="0" max="255" onChange={(e) => handleRGBInput("r", e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="green">Green</label>
                                <input type="number" id="green" value={rgb[1]} min="0" max="255" onChange={(e) => handleRGBInput("g", e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="blue">Blue</label>
                                <input type="number" id="blue" value={rgb[2]} min="0" max="255" onChange={(e) => handleRGBInput("b", e.target.value)} />
                            </div>
                        </>
                    }{
                        selectedInputs === "HEX" &&
                        <>
                            <div style={{ justifyContent: "center" }}>
                                <input type="text" id="hex" pattern="#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?" value={hexInput} onChange={(e) => setHexInput(e.target.value)} />
                            </div>
                            <div style={{ justifyContent: "center" }}>
                                <button onClick={() => handleHEXInput()}>Confirm</button>
                            </div>
                            <div style={{ justifyContent: "center", color: "red" }}>
                                {invalidHex && "Invalid Value!"}
                            </div>
                        </>
                    }
                </div>
                <div className="partButtons">
                    <button onClick={() => setCopiedColor(hex)}>Copy</button>
                    <button enabled={canCopy} style={{ background: copiedColor !== "" ? copiedColor : "lightgray" }} onClick={() => updateAllColors("hex", copiedColor)}>Paste</button>
                </div>
            </div>
        </>
    )
} 