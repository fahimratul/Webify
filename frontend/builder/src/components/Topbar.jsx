import logo from '../assets/images/logo.png';
import plus_icon from '../assets/icons/extend_icon.svg';
import undo_icon from '../assets/icons/undo_icon.svg'
import redo_icon from '../assets/icons/redo_icon.svg'
import doc_overvier_icon from '../assets/icons/doc_overview_icon.svg'
import desktop_icon from '../assets/icons/desktop_icon.svg'
import style_icon from '../assets/icons/style_icon.svg'
import menu_icon from '../assets/icons/menu_icon.svg'
import tablet_icon from '../assets/icons/tablet_icon.svg'
import mobile_icon from '../assets/icons/mobile_icon.svg'
import styles from './Topbar.module.css'
import { createSignal, Show } from 'solid-js';
import { StyleMenu } from "./StyleMenu";
import { ExportMenu } from "./ExportMenu";
import { getEditor } from './Canvas';

export function Topbar(props) {
    //signal for popups
    const [showPopup, setShowPopup] = createSignal(false);
    const [popupMsg, setPopupMsg] = createSignal("");

    //this functino only set value of popup parameter
    const triggerPopup = (msg) => {
        setPopupMsg(msg);
        setShowPopup(true);

        setTimeout(() => {
            setShowPopup(false);
            setPopupMsg("");
        }, 3000);
    }

    //signal for style menu
    const [showStyleMenu, setShowStyleMenu] = createSignal(false);

    //signal for export menu
    const [showExportMenu, setShowExportMenu] = createSignal(false);

    const deviceIcons = {
        Desktop: desktop_icon,
        Tablet: tablet_icon,
        Mobile: mobile_icon
    };

    //wiring up the tobar button using grapejs api
    // with their respective functinos
    const handleUndo = () => {
        const editor = getEditor();
        if (editor) { editor.runCommand('core:undo') };
    };

    const handleRedo = () => {
        const editor = getEditor();
        if (editor) { editor.runCommand('core:redo') };
    };

    const handleSave = () => {
        const editor = getEditor();
        if (editor) {
            const html = editor.getHtml();
            const css = editor.getCss();

            localStorage.setItem('savedHtml', html);
            localStorage.setItem('savedCss', css);
            triggerPopup("Progress Saved!");
        };
    };



    return (
        <>
            <div class={styles.topbar_container}>
                <div class={styles.topbar_left}>
                    <button class={styles.logo_button}>
                        <img class={styles.logo} src={logo} alt="Site logo" />
                    </button>
                    <button onClick={props.onOpenSidebar}>
                        <img src={plus_icon} alt="plus_icon"
                            style={{
                                "background-color": "#0693E3",
                                "border-radius": "5%",
                                "height": "24px",
                                "width": "24px",
                            }} />
                    </button>
                    <button onClick={handleUndo}>
                        <img src={undo_icon} alt="undo_icon" />
                    </button>
                    <button onClick={handleRedo}>
                        <img src={redo_icon} alt="redo_icon" />
                    </button>
                    <button>
                        <img src={doc_overvier_icon} alt="doc_overvier_icon" />
                    </button>
                </div>

                <div class={styles.topbar_middle}>
                    <span>My Awsome Website</span>
                </div>


                <div class={styles.topbar_right}>
                    <button onClick={props.onOpenDeviceSelector}>
                        <img src={deviceIcons[props.selectedDevice]} alt="device_icon" />

                    </button>

                    <button onClick={() => {
                        setShowStyleMenu(true);
                    }}>
                        <img src={style_icon} alt="style_icon" />
                    </button>

                    <button style={{
                        "height": "24px",
                        "width": "43px",
                        "background-color": "#0693E3",
                        "border-radius": "5%",
                        "color": "white",
                        "font-size": "14px",
                        "text-align": "center",
                    }}
                        onClick={handleSave}>
                        <span>Save</span>
                    </button>

                    <button onClick={() => { setShowExportMenu(true) }}>
                        <img src={menu_icon} alt="menu_icon" />
                    </button>
                </div>
            </div>

            <Show when={showPopup()}>
                <div class={styles.popup}>
                    <span>{popupMsg()}</span>
                    <div class={styles.savebtn_progress_bar}></div>
                </div>
            </Show>

            <Show when={showStyleMenu()}>
                <StyleMenu closeMenu={() => setShowStyleMenu(false)} />
            </Show>

            <Show when={showExportMenu()}>
                <ExportMenu closeMenu={() => setShowExportMenu(false)} />
            </Show>
        </>
    )
}