import styles from './ExportMenu.module.css'
import cross_icon from '../assets/icons/cross_icon.svg'
import export_icon from '../assets/icons/export_icon.svg'
import publish_icon from '../assets/icons/external_link_icon.svg'

export function ExportMenu(props) {
    return (
        <div class={styles.container}>
            <div class={styles.top}>
                <span>Tools</span>
                <button onClick={props.closeMenu}>
                    <img src={cross_icon} alt="Close" />
                </button>
            </div>

            <div class={styles.bottom}>
                <button>
                    <img src={export_icon} alt="Export" />
                    <span>Export</span>
                </button>

                <button>
                    <img src={publish_icon} alt="Publish" />
                    <span>Publish</span>
                </button>

            </div>
        </div>
    )
}