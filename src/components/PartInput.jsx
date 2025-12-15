//Code forked and adapted from Virtual desktop project

import { useState, useRef, useEffect } from "react"
export default function partInput(props) {
    const { hover, setHover, colors, setColors } = props
    const [isOpen, setIsOpen] = useState(false)
    const hueLumRef = useRef(null)
    const saturationRef = useRef(null);
    const [colorSelectorPos, setColorSelectorPos] = useState({ x: 0, y: 0 });
    const [saturationSliderPos, setSaturationSliderPos] = useState(0);
    const [hue, setHue] = useState(0);
    const [luminosity, setLuminosity] = useState(50);
    const [saturation, setSaturation] = useState(100);

    //Converts hex to RGB
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

    //Converts RGB to hex
    const rgbToHex = (rgb) => {
        return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
    };

    //Converts RGB to HSL
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
        let hsl = [h, s + '%', l + '%'];
        return hsl;
    }

    //Converts HSL to RGB
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

    //Updates hue, saturation and luminance when mouse hovers over a different part of the shoe
    useEffect(() => {
        if (hover) {
            let color = colors[hover];
            let hslColor = [];
            if (color[0] === "#") {
                hslColor = rgbToHsl(hexToRgb(color));
            } else if (color.slice(0, 3) === "rgb") {
                hslColor = rgbToHsl(color);
            } else if (color.slice(0, 3) === "hsl") {
                for (let i = 0; i < color.length; i++) {
                    var start;
                    var end;
                    if (color[i] === "(") {
                        start = i + 1;
                    } else if (color[i] === ")") {
                        end = i;
                        hslColor.push(color.slice(start, end));
                    } else if (color[i] === ",") {
                        hslColor.push(color.slice(start, i));
                        start = i + 1;
                    }
                }
            } else {
                //No named colors are going to be used
                //hslColor = nameToHsl(color);
            }
            setHue(Number(hslColor[0]));
            setSaturation(Number(hslColor[1].slice(0, hslColor[1].length - 1)));
            setLuminosity(Number(hslColor[2].slice(0, hslColor[2].length - 1)));
            if (isOpen) {
                const hueLumRect = hueLumRef.current.getBoundingClientRect();
                setColorSelectorPos({
                    x: hslColor[0] / 360 * hueLumRect.width,
                    y: (100 - hslColor[2].slice(0, hslColor[2].length - 1)) / 100 * hueLumRect.height
                });
                const saturationRect = saturationRef.current.getBoundingClientRect();
                setSaturationSliderPos(((100 - hslColor[1].slice(0, hslColor[1].length - 1)) / 100) * saturationRect.height);
            }

        }
    }, [hover])

    //Genetates a hue and luminance 2D color pixel map for canvas
    const drawColorMap = (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let blockwidth = ctx.canvas.width / 360;
        let blockheight = ctx.canvas.height / 100;
        for (let i = 0; i < 360; i++) {
            for (let j = 0; j < 100; j++) {
                ctx.fillStyle = `hsl(${i},${saturation}%,${100 - j}%)`;
                ctx.fillRect(i * blockwidth, j * blockheight, (i + 1) * blockwidth, (j + 1) * blockheight);
            }
        }
    };

    //Updates hue and luminance map slider positions when mouse moves, as well as their respective values
    const handleHueLumMap = (event) => {
        if (event.buttons !== 0) {
            const rect = hueLumRef.current.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                setColorSelectorPos({ x, y });
                setHue(Math.floor(360 * x / rect.width));
                setLuminosity(100 - Math.floor(100 * y / rect.height));
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
                setHue(Math.floor(360 * x / rect.width));
                setLuminosity(100 - Math.floor(100 * y / rect.height));
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
                setSaturation(100 - Math.floor(100 * y / rect.height));
                setSaturationSliderPos(y);
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
                setSaturation(100 - Math.floor(100 * y / rect.height));
                setSaturationSliderPos(y);
            }
        }
    };

    //Updates hue value and color map slider position
    const handleHueInput = (value) => {
        setHue(value);
        const rect = hueLumRef.current.getBoundingClientRect();
        setColorSelectorPos({ ...colorSelectorPos, x: value / 360 * rect.width });
    };

    //Updates luminance value and color map slider position
    const handleLumInput = (value) => {
        setLuminosity(value);
        const rect = hueLumRef.current.getBoundingClientRect();
        setColorSelectorPos({ ...colorSelectorPos, y: (100 - value) / 100 * rect.height });
    };

    //Updates saturation value, saturation slider position
    const handleSaturationInput = (value) => {
        setSaturation(value);
        const rect = saturationRef.current.getBoundingClientRect();
        setSaturationSliderPos(((100 - value) / 100) * rect.height);
    };

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

    useEffect(() => {
        if (hover !== null) setIsOpen(true)
        else setIsOpen(false)
    }, [hover])

    useEffect(() => {
        if (hueLumRef.current) {
            const ctxColorPicker = hueLumRef.current.getContext("2d", { alpha: false });
            drawColorMap(ctxColorPicker);
        }

    }, [isOpen, saturation]);

    //Updates colors object when hue, saturation, or luminosity changes
    useEffect(() => {
        //Colors are formatted back to hex string in order to keep url short
        setColors({ ...colors, [hover]: rgbToHex(hslToRgb([hue, saturation, luminosity])) })
    }, [hue, saturation, luminosity])

    return (
        <div id="partInput">
            <div id="partName">
                <button onClick={() => changePart(-1)}>◄</button>
                {hover !== null ? hover : "Select a part"}
                <button onClick={() => changePart(1)}>►</button>
            </div>
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
                            background: `hsl(${hue},${saturation}%,${luminosity}%)`
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
                                `linear-gradient(0deg, hsl(${hue},0%,${luminosity}%), hsla(${hue},100%,${luminosity}%))`
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
                            background: `hsla(${hue},${saturation}%,${luminosity}%)`
                        }}
                        onMouseDown={(e) => handleSaturationSlider(e)}
                        onMouseMove={(e) => handleSaturationSlider(e)}
                        onTouchMove={(e) => touchSaturationSlider(e)}
                        onTouchStart={(e) => touchSaturationSlider(e)}
                        onTouchEnd={(e) => touchSaturationSlider(e)}
                    />
                </saturation-slider>
            </div>
            <div id="partValues">
                <div>
                    <label htmlFor="hue">Hue</label>
                    <input type="number" id="hue" value={hue} min="0" max="360" onChange={(e) => handleHueInput(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="saturation">Saturation</label>
                    <input type="number" id="saturation" value={saturation} min="0" max="100" onChange={(e) => handleSaturationInput(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="luminosity">Luminosity</label>
                    <input type="number" id="luminosity" value={luminosity} min="0" max="100" onChange={(e) => handleLumInput(e.target.value)} />
                </div>
            </div>
        </div>
    )
} 