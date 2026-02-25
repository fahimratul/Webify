import grapesjs from 'grapesjs';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import gjsExport from 'grapesjs-plugin-export';
import gjsForms from 'grapesjs-plugin-forms';

// Import GrapesJS core styles
//We will override some of them
import 'grapesjs/dist/css/grapes.min.css';

export const initEditor = (container) => {
    // editor/commands.js

    const formatHtml = (html) => {
        let tab = '  ';
        let result = '';
        let indent = '';
        html.split(/>\s*</).forEach(element => {
            if (element.match(/^\/\w/)) indent = indent.substring(tab.length);
            result += indent + '<' + element + '>\r\n';
            if (element.match(/^<?\w[^>]*[^\/]$/)) indent += tab;
        });
        return result.substring(1, result.length - 3);
    };

    const openImportCommand = (editor) => {
        const modal = editor.Modal;
        const container = document.createElement('div');
        container.className = 'import-container';

        const rawHtml = editor.getHtml();
        const rawCss = editor.getCss();
        const beautifiedCode = `<style>\n${rawCss}\n</style>\n\n${formatHtml(rawHtml)}`;

        const textarea = document.createElement('textarea');
        textarea.className = 'import-textarea';
        textarea.value = beautifiedCode;
        textarea.spellcheck = false;

        const btn = document.createElement('button');
        btn.innerHTML = 'Save Changes';
        btn.className = 'btn-primary-modal';

        btn.onclick = () => {
            editor.setComponents(textarea.value);
            modal.close();
        };

        container.appendChild(textarea);
        container.appendChild(btn);

        modal.setTitle('Source Code Editor');
        modal.setContent(container);
        modal.open();
    };




    const editor = grapesjs.init({
        container: container,
        height: '100%',
        width: '100%',
        // fromElement: false, //allows to modify existing HTML

        //prevent loading default panels
        panels: {
            defaults: [],
        },

        blockManager: {
            appendTo: '#blocks-container',
        },
        layerManager: {
            appendTo: '#layers-container'
        },
        styleManager: {
            appendTo: '#styles-container',
        },
        traitManager: {
            appendTo: '#traits-container',
        },
        selectorManager: {
            appendTo: '#selector-container', // This puts it in the same box as your styles
            states: [
                { name: 'hover', label: 'Hover' },
                { name: 'active', label: 'Click' },
                { name: 'nth-of-type(2n)', label: 'Even/Odd' }
            ],
        },
        modal: {
            backdrop: true,
        },

        // aetting up devices for the toggles to work
        deviceManager: {
            devices: [
                { name: 'Desktop', width: '' }, // empty means width = 100%
                { name: 'Tablet', width: '768px', widthMedia: '992px' },
                { name: 'Mobile', width: '320px', widthMedia: '480px' },
            ]
        },
        storageManager: {
            id: 'webify-builder',
            type: 'local',
            autosave: true,
            autoload: true,
            stepsBeforeSave: 1,

            options: {
                local: {
                    key: 'gjs-project-data',
                }
            },

            // storeComponents: true,
            // storeStyles: true,
            // storeHtml:true,
            // storeCss: true,
        },

        //load the preset webpage plugin
        plugins: [gjsBlocksBasic, gjsExport, gjsForms,],
        pluginsOpts: {
            [gjsBlocksBasic]: {
                flexGrid: true,
            },
        },


        // editor/config.js
        commands: {
            defaults: [
                {
                    id: 'gjs-open-import-template',
                    run: (editor) => openImportCommand(editor),
                },
            ],
        },
    });

    return editor;
}