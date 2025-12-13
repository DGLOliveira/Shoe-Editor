//Code forked and adapted from Virtual desktop project

import { useState, useRef, useEffect } from "react"
export default function partInput(props) {
    const { hover, colors, setColors } = props
    const [isOpen, setIsOpen] = useState(false)
    const hueLumRef = useRef(null)
    const saturationRef = useRef(null);
    const [colorSelectorPos, setColorSelectorPos] = useState({ x: 0, y: 0 });
    const [saturationSliderPos, setSaturationSliderPos] = useState(0);
    const [hue, setHue] = useState(0);
    const [lightness, setLightness] = useState(50);
    const [saturation, setSaturation] = useState(100);

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
    }else {
        if (l <= 0.5) {
            s = delta / (cmax + cmin);
        } else {
            s = delta / (2 - cmax-cmin);
        };
        if (cmax === r) {
            h = (g - b) / delta;
        } else if (cmax === g) {
            h = ((b - r) / delta) + 2;
        } else if(cmax === b) {
            h = ((r - g) / delta) + 4;
        }
    }
    h = Math.round(h * 60);
    if (h < 0) {
        h += 360;
    }
    s = Math.abs(s * 100).toFixed(0);
    l = (l * 100 ).toFixed(0);
    let hsl = [h, s + '%', l + '%'];
    return hsl;
}

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
                setLightness(100 - Math.floor(100 * y / rect.height));
            }
        }
    };
    const touchHueLumMap = (event) => {
        if (event.touches.length === 1) {
            const rect = hueLumRef.current.getBoundingClientRect();
            let x = event.touches[0].clientX - rect.left;
            let y = event.touches[0].clientY - rect.top;
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                setColorSelectorPos({ x, y });
                setHue(Math.floor(360 * x / rect.width));
                setLightness(100 - Math.floor(100 * y / rect.height));
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

    return (
        <div id="partInput">
            <div id="partName">
                <button>◄</button>
                {hover}
                <button>►</button>
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
                            background: `hsl(${hue},${saturation}%,${lightness}%)`
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
                                `linear-gradient(0deg, hsl(${hue},0%,${lightness}%), hsla(${hue},100%,${lightness}%))`
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
                            background: `hsla(${hue},${saturation}%,${lightness}%)`
                        }}
                        onMouseDown={(e) => handleSaturationSlider(e)}
                        onMouseMove={(e) => handleSaturationSlider(e)}
                        onTouchMove={(e) => touchSaturationSlider(e)}
                        onTouchStart={(e) => touchSaturationSlider(e)}
                        onTouchEnd={(e) => touchSaturationSlider(e)}
                    />
                </saturation-slider>
            </div>
        </div>
    )
} 