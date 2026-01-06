import styles from './BlockContent.module.css';
import cross_icon from '../assets/icons/cross_icon.svg';
import paragraph_icon from '../assets/icons/paragraph_icon.svg';
import heading_icon from '../assets/icons/heading_icon.svg';
import list_icon from '../assets/icons/list_icon.svg';
import table_icon from '../assets/icons/table_icon.svg';
import image_icon from '../assets/icons/image_icon.svg';
import video_icon from '../assets/icons/video_icon.svg';
import audio_icon from '../assets/icons/audio_icon.svg';
import { PatternContent } from './PatternContent';
import { createSignal } from 'solid-js';
import { createDraggable } from "@thisbeyond/solid-dnd";

const [activeTab, setActiveTab] = createSignal('block');

const DraggableButton = (props) => {
    const draggable = createDraggable(props.id);
    return (
        <button
            ref={draggable.ref}
            {...draggable.dragActivators}
            class={props.class}
            style={{
                "touch-action": "none",
                ...(draggable.isActive ? { opacity: 0.5 } : {})
            }}
        >
            {props.children}
        </button>
    );
};

export function BlockContent(props) {
    return (
        <div class={styles.block_content_container}>
            <div class={styles.top_section}>
                <button onclick={() => setActiveTab('block')} class={activeTab() === 'block' ? styles.active_tab : ''}>

                    <span>Block</span>
                </button>
                <button onclick={() => setActiveTab('pattern')} class={activeTab() === 'pattern' ? styles.active_tab : ''}>
                    <span>Pattern</span>
                </button>
                <button class={styles.close_button} onClick={props.onClose}>
                    <img src={cross_icon} alt="close" />
                </button>
            </div>

            {activeTab() === 'block' && (
                <div>
                    <span class={styles.label_span}>TEXT</span>
                    <div class={styles.text_items}>
                        <DraggableButton id="paragraph">
                            <img src={paragraph_icon} alt="paragraph" />
                            <span>Paragraph</span>
                        </DraggableButton>

                        <DraggableButton id="heading">
                            <img src={heading_icon} alt="heading" />
                            <span>Heading</span>
                        </DraggableButton>

                        <DraggableButton id="list">
                            <img src={list_icon} alt="list" />
                            <span>List </span>
                        </DraggableButton>

                        <DraggableButton id="table">
                            <img src={table_icon} alt="table" />
                            <span>Table</span>
                        </DraggableButton>
                    </div>


                    <span class={styles.label_span}>MEDIA</span>
                    <div class={styles.media_items}>
                        <DraggableButton id="image">
                            <img src={image_icon} alt="image" />
                            <span>Image</span>
                        </DraggableButton>

                        <DraggableButton id="audio">
                            <img src={audio_icon} alt="audio" />
                            <span>Audio</span>
                        </DraggableButton>

                        <DraggableButton id="video">
                            <img src={video_icon} alt="video" />
                            <span>Video</span>
                        </DraggableButton>
                    </div>
                </div>
            )}

            {activeTab() === 'pattern' && (<PatternContent />)}

        </div>
    )
}