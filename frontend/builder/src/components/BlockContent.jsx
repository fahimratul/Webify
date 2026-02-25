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
import { getEditor } from './Canvas';

const [activeTab, setActiveTab] = createSignal('block');

const DraggableBlock = (props) => {
    const draggable = createDraggable(props.type, { type: props.type });

    return (
        <div ref={draggable} {...draggable.dragActivators} class={props.class} style={{ "touch-action": "none" }}>
            {props.children}
        </div>
    )
}


export function BlockContent(props) {
    //we are going to add the blocks that we have registered 
    // in Canvas.jsk
    const addBlock = (blockId) => {
        //before we add a block (string passed as blockId), 
        // it has to be registered in block manager
        // which we did in Canvas.jsx
        const editor = getEditor();

        if (editor) {
            const block = editor.BlockManager.get(blockId);
            if (block) {
                editor.addComponents(block.getContent());
            }
        }
    }


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
                        <button onClick={() => addBlock('paragraph')}>
                            <img src={paragraph_icon} alt="paragraph" />
                            <span>Paragraph</span>
                        </button>

                        <button onClick={() => addBlock('heading')}>
                            <img src={heading_icon} alt="heading" />
                            <span>Heading</span>
                        </button>

                        <button onClick={() => addBlock('list')}>
                            <img src={list_icon} alt="list" />
                            <span>List </span>
                        </button>

                        <button onClick={() => addBlock('table')}>
                            <img src={table_icon} alt="table" />
                            <span>Table</span>
                        </button>
                    </div>


                    <span class={styles.label_span}>MEDIA</span>
                    <div class={styles.media_items}>
                        <button onClick={() => addBlock('image')}>
                            <img src={image_icon} alt="image" />
                            <span>Image</span>
                        </button>

                        <button onClick={() => addBlock('audio')}>
                            <img src={audio_icon} alt="audio" />
                            <span>Audio</span>
                        </button>

                        <button onClick={() => addBlock('video')}>
                            <img src={video_icon} alt="video" />
                            <span>Video</span>
                        </button>
                    </div>
                </div>
            )}

            {activeTab() === 'pattern' && (<PatternContent />)}

        </div>
    )
}