import styles from "./StyleMenu.module.css";
import cross_icon from "../assets/icons/cross_icon.svg";
import letter_icon from "../assets/icons/letter_icon.svg";
import background_icon from "../assets/icons/background_icon.svg";
import color_icon from "../assets/icons/color_icon.svg";

export function StyleMenu(props) {
    

    return (
        <div class={styles.style_menu_container}>
            <div class={styles.top}>
                <span>Styles</span>
                <button onClick={props.closeMenu}>
                    <img src={cross_icon} alt="close" />
                </button>
            </div>

            <div class={styles.bottom}>
                <button>
                    <img src={letter_icon} alt="Typography" />
                    <span>Typography</span>
                </button>

                <button>
                    <img src={color_icon} alt="Color" />
                    <span>Color</span>
                </button>

                <button>
                    <img src={background_icon} alt="Background" />
                    <span>Background</span>
                </button>
            </div>
        </div>
    )

}