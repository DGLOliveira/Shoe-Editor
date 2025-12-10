export default function Navbar(props : {
    menu: string
    setMenu: React.Dispatch<React.SetStateAction<string>>
    setHover: React.Dispatch<React.SetStateAction<string | null>>
}) {
    const { menu, setMenu, setHover } = props
    const handleNav = (value : string) => {
        if (menu === value) setMenu("none")
        else setMenu(value)
    }
    return (
        <nav onClick={()=>setHover(null)}>
            <h1>Shoe Editor</h1>
            <div>
                <h2
                    onClick={() => handleNav("models")}
                    className={menu === "models" ? "selectedMenu" : ""}
                >
                    Models
                </h2>
                <h2
                    onClick={() => handleNav("colors")}
                    className={menu === "colors" ? "selectedMenu" : ""}
                >
                    Colours
                </h2>
                <h2
                    onClick={() => handleNav("extras")}
                    className={menu === "extras" ? "selectedMenu" : ""}
                >
                    Extras
                </h2>
                <h2
                    onClick={() => handleNav("share")}
                    className={menu === "share" ? "selectedMenu" : ""}>
                    Share
                </h2>
            </div>
        </nav>
    )
}