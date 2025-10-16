export default function Navbar(props) {
    const { menu, setMenu } = props
    const handleNav = (value) => {
        if (menu === value) setMenu("none")
        else setMenu(value)
    }
    return (
        <nav>
            <h1>Shoe Editor</h1>
            <div>
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
            </div>
        </nav>
    )
}