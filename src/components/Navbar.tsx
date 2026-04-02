export default function Navbar(props : {
    menu: string
    setMenu: React.Dispatch<React.SetStateAction<string>>
}) {
    const { menu, setMenu } = props
    const handleNav = (value : string) => {
        if (menu === value) setMenu("none")
        else setMenu(value)
    }
    return (
        <nav>
            <h1>Shoe Editor</h1>
            <div>
                <h2
                    onClick={() => handleNav("models")}
                    className={menu === "models" ? "selectedMenu" : ""}
                    aria-role="button"
                    aria-label="Open Shoe Model list"
                >
                    Models
                </h2>
                <h2
                    onClick={() => handleNav("parts")}
                    className={menu === "parts" ? "selectedMenu" : ""}
                    aria-role="button"
                    aria-label="Open Shoe parts list"
                >
                    Parts
                </h2>
                <h2
                    onClick={() => handleNav("share")}
                    className={menu === "share" ? "selectedMenu" : ""}
                    aria-role="button"
                    aria-label="Open Sharing Options list">
                    Share
                </h2>
            </div>
        </nav>
    )
}