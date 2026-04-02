import { MdContentCopy, MdContentPaste } from "react-icons/md";
import { FaLink, FaTelegramPlane } from "react-icons/fa";
import { IoLogoFacebook } from "react-icons/io";
import { IoLogoReddit, IoLogoLinkedin, IoLogoWhatsapp } from "react-icons/io5";
import { BsTwitterX } from "react-icons/bs";

export default function Menu(props:
    {
        menu: string,
        model: { [key: string]: string },
        setModel: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
        models: [{ [key: string]: string }]
        colors: { [key: string]: string }
        setColors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
        visibility: { [key: string]: boolean }
        setVisibility: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
        selected: string
        setSelected: React.Dispatch<React.SetStateAction<string>>
        copiedColor: string
        setCopiedColor: React.Dispatch<React.SetStateAction<string>>
        canCopy: boolean
    }
) {
    const { menu, model, setModel, models, colors, setColors, visibility, setVisibility, selected, setSelected, copiedColor, setCopiedColor, canCopy } = props

    return (
        <>
            <ul className={menu === "models" ? "expandMenu" : "collapsedMenu"}>
                <li className="spacer" arial-label="hidden"></li>
                {models.map((item, index) =>
                    <li
                        key={index}
                        onClick={() => {
                            setModel({ ...item })
                        }}
                        aria-role="button"
                    >
                        <label for={item.Name}>{item.Name}</label>
                        <input
                            id={item.Name}
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
            <ul className={menu === "parts" ? "expandMenu" : "collapsedMenu"}>
                <li className="spacer" arial-label="hidden"></li>
                {Object.keys(colors).map((name, index, arr) =>
                    <li 
                        key={index}
                        onClick={() => selected !== name && setSelected(name)}
                        style={{ background: selected === name ? "lightskyblue" : "white" }}
                        aria-role="button"
                        aria-label="Select part"
                    >
                        {name}
                        <div>
                            {visibility[name] !== undefined &&
                                <div
                                    className={!visibility[name] ? "switch" : "switch switchOn"}
                                    onClick={() => {
                                        setVisibility({ ...visibility, [name]: !visibility[name] })
                                    }}
                                >
                                    <input
                                        name={name}
                                        type="checkbox"
                                        defaultChecked={visibility[name]}
                                        aria-label="Switch visibility"
                                    />
                                    <span
                                        className={
                                            !visibility[name]
                                                ? "switchButton"
                                                : "switchButton switchButtonOn"
                                        }
                                    />
                                </div>
                            }
                            <button
                                arial-label="Copy color"
                                title="Copy color"
                                style={{
                                    background: colors[name],
                                    cursor: "copy"
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setCopiedColor(colors[name])
                                }}
                            >
                                <span aria-hidden="true"><MdContentCopy /></span>
                            </button>
                            <button
                                title="Paste color"
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
                                <span aria-hidden="true"><MdContentPaste /></span>
                            </button>
                        </div>
                    </li>
                )}
            </ul>
            <ul className={menu === "share" ? "expandMenu" : "collapsedMenu"}>
                <li className="spacer" aria-hidden="true"></li>
                <li>
                    <a
                        id="share-link"
                        href={window.location.href}
                        onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(window.location.href) }}
                    >
                        <span aria-hidden="true"><FaLink /></span>
                        Copy Link
                    </a>
                </li>
                <li>
                    <a
                        id="share-facebook"
                        target="blank"
                        href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                    >
                        <span aria-hidden="true"><IoLogoFacebook /></span>
                        Facebook
                    </a>
                </li>
                <li>
                    <a
                        id="share-twitter"
                        target="blank"
                        href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
                    >
                        <span aria-hidden="true"><BsTwitterX /></span>
                        Twitter
                    </a>
                </li>
                <li>
                    <a
                        id="share-reddit"
                        target="blank"
                        href={`https://www.reddit.com/submit?url=${window.location.href}`}
                    >
                        <span aria-hidden="true"><IoLogoReddit /></span>
                        Reddit
                    </a>
                </li>
                <li>
                    <a
                        id="share-linkedin"
                        target="blank"
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                    >
                        <span aria-hidden="true"><IoLogoLinkedin /></span>
                        LinkedIn
                    </a>
                </li>
                <li>
                    <a
                        id="share-whatsapp"
                        target="blank"
                        href={`https://api.whatsapp.com/send?text=${window.location.href}`}
                    >
                        <span aria-hidden="true"><IoLogoWhatsapp /></span>
                        Whatsapp
                    </a>
                </li>
                <li>
                    <a
                        id="share-telegram"
                        target="blank"
                        href={`https://t.me/share/url?url=${window.location.href}`}
                    >
                        <span aria-hidden="true"><FaTelegramPlane /></span>
                        Telegram
                    </a>
                </li>
            </ul>
        </>
    );
}