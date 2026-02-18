import { createEffect, onCleanup, onMount } from 'solid-js';
import styles from './Canvas.module.css';

// GrapesJS core editor import
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

// Basic block plugin (default blocks like text, image, etc.)
import gjsBasicBlocks from 'grapesjs-blocks-basic';

/**
 * Device class mapping
 * Used to apply different CSS container styles
 * depending on the selected device type.
 */
const deviceClasses = {
    Desktop: styles.container_desktop,
    Tablet: styles.container_tablet,
    Mobile: styles.container_mobile,
};

/**
 * Global GrapesJS editor instance
 * This allows access to the editor outside this component.
 */
let editor;

/**
 * Getter function to access the editor globally
 * Useful when other components need editor reference.
 */
export function getEditor() {
    return editor;
}

/**
 * Canvas Component
 * This component initializes GrapesJS editor inside a SolidJS app.
 */
export function Canvas(props) {
    let canvasRef;

    /**
     * onMount runs once when component loads.
     * We initialize GrapesJS editor here.
     */
    onMount(() => {
        editor = grapesjs.init({
            // DOM container where GrapesJS will mount
            container: canvasRef,

            // Load components from the container element itself
            fromElement: true,

            // Disable built-in auto-saving
            storageManager: false,

            // Show element offsets while selecting components
            showOffsets: true,

            // Prevent body highlight and focus first component
            componentFirst: true,

            // Disable default GrapesJS panels (custom UI will be provided)
            panels: { defaults: [] },

            /**
             * Device Manager Configuration
             * Allows switching between Desktop/Tablet/Mobile preview modes.
             */
            deviceManager: {
                devices: [
                    {
                        id: 'Desktop',
                        name: 'Desktop',
                        width: '', // Default full width
                    },
                    {
                        id: 'Tablet',
                        name: 'Tablet',
                        width: '768px',
                        widthMedia: '992px',
                    },
                    {
                        id: 'Mobile',
                        name: 'Mobile',
                        width: '375px',
                        widthMedia: '576px',
                    },
                ],
            },

            // Register plugins
            plugins: [gjsBasicBlocks],

            // Plugin options
            pluginsOpts: {
                [gjsBasicBlocks]: {},
            },

            /**
             * Managers are disabled from default UI
             * because custom panels will be created separately.
             */
            layerManager: { appendTo: '' },
            selectorManager: { appendTo: '' },
            styleManager: { sectors: [] },
            traitManager: { appendTo: '' },
            blockManager: { appendTo: '' },
        });

        /**
         * Custom Block Registration
         * Adding reusable content blocks into the editor.
         */

        // Paragraph block
        editor.BlockManager.add('paragraph', {
            label: 'Paragraph',
            content: '<p>Insert your text here</p>',
            catagory: 'Basic',
        });

        // Heading block
        editor.BlockManager.add('heading', {
            label: 'Heading',
            content: '<h2>Heading</h2>',
            category: 'Basic',
        });

        // List block
        editor.BlockManager.add('list', {
            label: 'List',
            content: '<ul><li>Item 1</li><li>Item 2</li></ul>',
            category: 'Basic',
        });

        // Table block
        editor.BlockManager.add('table', {
            label: 'Table',
            content: '<table><tr><td>Cell 1</td><td>Cell 2</td></tr></table>',
            category: 'Basic',
        });

        // Image block
        editor.BlockManager.add('image', {
            label: 'Image',
            content:
                '<img src="https://via.placeholder.com/350x150" alt="placeholder"/>',
            category: 'Media',
        });

        // Video block
        editor.BlockManager.add('video', {
            label: 'Video',
            content:
                '<video controls><source src="" type="video/mp4"></video>',
            category: 'Media',
        });

        // Audio block
        editor.BlockManager.add('audio', {
            label: 'Audio',
            content:
                '<audio controls><source src="" type="audio/mpeg"></audio>',
            category: 'Media',
        });
    });

    /**
     * createEffect reacts to prop changes in SolidJS.
     * Since GrapesJS is non-reactive, we manually update device mode here.
     */
    createEffect(() => {
        console.log(
            'Selected device changed to: ' + props.selectedDevice
        );

        // Update GrapesJS device preview mode when selection changes
        if (editor) {
            const device = props.selectedDevice;
            if (device) {
                editor.setDevice(device);
            }
        }
    });

    /**
     * Cleanup function
     * Destroys editor instance when component unmounts.
     */
    onCleanup(() => {
        if (editor) editor.destroy();
    });

    /**
     * Canvas container div
     * GrapesJS editor will render inside this element.
     */
    return (
        <div
            ref={canvasRef}
            class={deviceClasses[props.selectedDevice]}
        ></div>
    );
}
