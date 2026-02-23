import { initEditor } from "./editor/config";
import { onMount, onCleanup, createSignal } from "solid-js";
import "./AnotherApp.css";
import export_icon from './assets/icons/export_icon.svg';
import upload_icon from './assets/icons/upload_icon.svg';

const App = () => {
  let editorRef;
  let editorInstance;

  //signal to track active blocks
  const [activeTab, setActiveTab] = createSignal('blocks');
  //signal to track side bar visibility
  const [isLeftOpen, setLeftOpen] = createSignal(true);
  const [isRightOpen, setRightOpen] = createSignal(true);
  //signal to tracj active device
  const [activeDevice, setActiveDevice] = createSignal('Desktop');
  //signal for theme
  const [isDark, setIsDark] = createSignal(false);
  //signal for previes
  const [isPreview, setIsPreview] = createSignal(false);


  onMount(() => {
    if (editorRef) {
      editorInstance = initEditor(editorRef);

      const savedProject = localStorage.getItem('webify-project');
      if (savedProject) {
        try {
          const data = JSON.parse(savedProject);
          // Combine HTML and CSS, then set components
          const fullContent = `<style>${data.css}</style>${data.html}`;
          editorInstance.setComponents(fullContent);
        } catch (e) {
          console.error('Failed to load saved project:', e);
        }
      }

      // --- NEW LOGIC: Render and Move Managers ---
      const sm = editorInstance.StyleManager;
      const slm = editorInstance.SelectorManager;
      const tm = editorInstance.TraitManager;

      // 1. Target your SolidJS containers
      const stylesCont = document.getElementById('styles-container');
      const selectorCont = document.getElementById('selector-container');
      const traitsCont = document.getElementById('traits-container');

      // 2. Clear out the "Select an element" text and append GrapesJS UI
      if (stylesCont) {
        stylesCont.innerHTML = ''; // Remove the empty-state text
        stylesCont.appendChild(sm.render());
      }

      if (selectorCont) {
        selectorCont.appendChild(slm.render()); // This is your "Hover" state & classes
      }

      if (traitsCont) {
        traitsCont.appendChild(tm.render()); // Attributes/Settings
      }
      // ------------------------------------------


      //listening to device changes, so that UI can change accordingly, this is optional
      editorInstance.on('device:select', (device) => {
        // device.getName() might return 'Desktop', 'Tablet', etc.
        setActiveDevice(device.getName() || 'Desktop');
      });
    }
  });



  onCleanup(() => {
    if (editorInstance) {
      editorInstance.destroy();
    }
  });


  //helper function to swith devices
  const handleDeviceChange = (deviceMode) => {
    if (!editorInstance) return;

    setActiveDevice(deviceMode);

    // Direct API call - much more reliable than runCommand
    editorInstance.setDevice(deviceMode);
    setActiveDevice(deviceMode);

  };

  //function to toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark());
  }

  const triggerCommand = (command) => {
    if (editorInstance) editorInstance.runCommand(command);
  };


  const togglePreview = () => {
    if (!editorInstance) return;

    // 1. Get the raw data
    const html = editorInstance.getHtml();
    const css = editorInstance.getCss();

    // 2. Create the full HTML document string
    const fullCode = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Preview</title>
        <style>${css}</style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

    // 3. Open a new tab
    const previewWindow = window.open('', '_blank');

    // 4. Inject the code into the new tab
    previewWindow.document.open();
    previewWindow.document.write(fullCode);
    previewWindow.document.close();
  };


  //code editor logic
  const openCodeEditor = () => {
    if (!editorInstance) return;
    // This opens the default GrapesJS code viewer modal
    editorInstance.runCommand('export-template');

    const modal = editorInstance.Modal;

    const btnExport = document.createElement('button');
    btnExport.innerHTML = 'Download ZIP';
    btnExport.className = 'btn-primary-modal';
    btnExport.style.marginTop = '15px';
    btnExport.style.width = '100%';

    btnExport.onclick = () => {
      editorInstance.runCommand('gjs-export-zip');
    };

    const container = modal.getContentEl();
    container.appendChild(btnExport);
  };


  //code import logic, allows to edit the code
  const openCodeImportModal = () => {
    if (!editorInstance) return;
    editorInstance.runCommand('gjs-open-import-template');
  };


  // helper function for uploading code
  // this function saves data into local storage
  const saveToLocalStorage = () => {
    if (!editorInstance) return;

    const data = {
      html: editorInstance.getHtml(),
      css: editorInstance.getCss(),
      timeStamp: new Date().getTime(),
      title: "My Webify Project"
    }

    try {
      localStorage.setItem('webify-project', JSON.stringify(data));

      //opening a new window
      window.open('/marketplace/upload_to_marketplace.html', '_blank');
    }
    catch (e) {
      console.error("Save failed. The site might be too large for LocalStorage.", e);
      alert("Project too large for temporary storage.");
    }

  }

  //trying to make it look like canva
  // three column layout, left , center, right
  // update: 4 column layout with icon bar

  return (
    <div class="app-container" data-theme={isDark() ? 'dark' : 'light'}>
      {/* Exit Preview Overlay (Visible only when in preview) */}
      <Show when={isPreview()}>
        <button class="exit-preview-btn" onClick={togglePreview}>Exit Preview</button>
      </Show>


      <div class="editor-shell">

        {/* Column 0: the icon bar (The slim side) */}
        <nav class="icon-bar">
          <button onClick={() => { setActiveTab('blocks'); setLeftOpen(true); }}
            class={activeTab() === 'blocks' && isLeftOpen() ? 'active' : ''}
            title="Elements"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
            <span>Blocks</span>
          </button>


          <button onClick={() => { setActiveTab('layers'); setLeftOpen(true); }}
            class={activeTab() === 'layers' && isLeftOpen() ? 'active' : ''}
            title="Layers"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z" /></svg>
            <span>Layers</span>
          </button>

          <button onClick={() => triggerCommand('open-assets')} title="Images">
            <span class="icon">🖼</span>
            <span>Assets</span>
          </button>

          <button onClick={toggleTheme} style="margin-top: auto;">
            {isDark() ? '☀' : '☾'}
            <span>Theme</span>
          </button>
        </nav>




        {/* Column 1: Left (blocks and layers) */}
        <aside class={`sidebar-left ${isLeftOpen() ? '' : 'sidebar-collapsed'}`}>
          <div class="panel-header">
            <span>{activeTab()}</span>
            <button class="btn-toggle" onClick={() => setLeftOpen(false)}>x</button>
          </div>


          {/* We use 'display: none' via CSS instead of if-blocks 
            so GrapesJS can still find the IDs on mount */}
          <div id="blocks-container" style={{ display: activeTab() === 'blocks' ? 'block' : 'none' }}></div>
          <div id="layers-container" style={{ display: activeTab() === 'layers' ? 'block' : 'none' }}></div>
        </aside>




        {/* Column 2: Center (the stage, it will contain the canvas and topbar) */}
        <main class="editor-main">

          {/* The top bar */}
          <header class="editor-topbar">

            <div class="topbar-left">
              {!isLeftOpen() && (
                <button class="btn-toggle" style="margin-right:10px" onClick={() => setLeftOpen(true)}>Elements &rarr;</button>
              )}
            </div>

            <div class="topbar-right">
              <div class="device-toggles">
                <button onClick={() => handleDeviceChange('Desktop')}
                  class={activeDevice() === 'Desktop' ? 'active' : ''}
                >
                  Desktop
                </button>

                <button onClick={() => handleDeviceChange('Tablet')}
                  class={activeDevice() === 'Tablet' ? 'active' : ''}
                >
                  Tablet
                </button>

                <button onClick={() => handleDeviceChange('Mobile')}
                  class={activeDevice() === 'Mobile' ? 'active' : ''}
                >
                  Mobile
                </button>
              </div>


              <div class="divider-vertical"></div>

              <button class={`btn-icon ${isPreview() ? 'active' : ''}`} onClick={togglePreview} title="Preview">
                👁
              </button>

              <button class="btn-icon" onClick={openCodeEditor} title="Edit Code">
                <img src={export_icon} alt="Export" />
              </button>

              <button class="btn-icon" onClick={openCodeImportModal} title="Import Code">
                {/* Code Icon */}
                &lt;/&gt;
              </button>

              <button class="btn-icon" onClick={saveToLocalStorage} title="Upload Code">
                <img src={upload_icon} alt="Upload" />
              </button>


              {!isRightOpen() && (
                <button class="btn-ghost" onClick={() => setRightOpen(true)}>← Styles</button>
              )}
            </div>
          </header>

          {/* The canvas */}
          <div class="canvas-wrapper">
            <div ref={editorRef} > </div>
          </div>
        </main>


        {/* Column 3: Right (styles and settings) */}
        <aside class={`sidebar-right ${isRightOpen() ? '' : 'sidebar-collapsed'}`}>
          <div class="panel-header">
            <span>Styles</span>
            <button class="btn-toggle" onClick={() => setRightOpen(false)}> x </button>
          </div>

          <div id="selector-container"></div>
          <div id="styles-container"> </div>
          <div id="traits-container"></div>
        </aside>




      </div>
    </div>
  );
};

export default App;
