import styles from './Canvas.module.css';
import { createDroppable } from "@thisbeyond/solid-dnd";
import { For, Show } from "solid-js";

//selected device classes
const deviceClasses = {
    "Desktop": styles.container_desktop,
    "Tablet": styles.container_tablet,
    "Mobile": styles.container_mobile
}


export function Canvas(props) {
    const droppable = createDroppable("canvas");
    console.log(props.selectedDevice);

    return (

        <div
            ref={droppable.ref}
            class={deviceClasses[props.selectedDevice]}
            style={{ "min-height": "100%", "padding": "20px" }}
        >
            <For each={props.elements}>
                {(item) => (
                    <div style={{ "margin-bottom": "10px", "padding": "10px", "border": "1px solid #ccc", "background": "white" }}>
                        {item.content}
                    </div>
                )}
            </For>
            <Show when={!props.elements?.length}>
                <div style={{ "text-align": "center", "color": "#999", "margin-top": "20px" }}>
                    Drag elements here
                </div>
            </Show>
        </div>
    )
}