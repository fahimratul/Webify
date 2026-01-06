import { createSignal, onMount } from "solid-js";
import { BlockContent } from "./components/BlockContent";
import { Topbar } from "./components/Topbar";
import { DeviceSelector } from "./components/DeviceSelector";
import { Canvas } from "./components/Canvas";
import styles from "./App.module.css";
import { DragDropProvider, DragDropSensors, DragOverlay } from "@thisbeyond/solid-dnd";

const App = () => {
  //signal for sidebar block content
  const [showBlockContent, setShowBlockContent] = createSignal(false);
  //signal for device selector
  const [showSelectedDevice, setShowSelectedDevice] = createSignal(false);
  const [selectedDevice, setSelectedDevice] = createSignal("Desktop");

  // Canvas elements state
  const [elements, setElements] = createSignal([]);
  const [activeDragId, setActiveDragId] = createSignal(null);

  //removing the loading gif
  onMount(() => {
    const loadingGif = document.getElementById('loading_gif');
    if (loadingGif) {
      loadingGif.remove();
    }
  })

  const onDragStart = ({ draggable }) => {
    setActiveDragId(draggable.id);
  }

  const onDragEnd = ({ draggable, droppable }) => {
    setActiveDragId(null);
    if (droppable && droppable.id === "canvas") {
      // Add a new element based on the dragged item type
      const newElement = {
        id: Date.now(), // Simple ID generation
        type: draggable.id,
        content: `New ${draggable.id} block`
      };
      setElements([...elements(), newElement]);
    }
  };

  return (
    <DragDropProvider onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <DragDropSensors />
      <div class={styles.appContainer}>
        <div class={styles.topbarWrapper}>
          <Topbar onOpenSidebar={() => setShowBlockContent(true)} onOpenDeviceSelector={() => !showSelectedDevice() ? setShowSelectedDevice(true) : setShowSelectedDevice(false)}
            selectedDevice={selectedDevice()} />
        </div>

        <div class={styles.mainContent}>
          {showBlockContent() && (
            <aside class={styles.sidebar}>
              <BlockContent onClose={() => setShowBlockContent(false)} />
            </aside>
          )}

          {showSelectedDevice() && (
            <div>
              <DeviceSelector select_a_Device={(device) => setSelectedDevice(device)} selectedDevice={selectedDevice()} />
            </div>
          )}

          <main class={styles.canvasArea}>
            <Canvas selectedDevice={selectedDevice()} elements={elements()} />
          </main>
        </div>
      </div>
      <DragOverlay>
        {activeDragId() && (
          <div style={{
            padding: "10px 20px",
            background: "white",
            border: "1px solid #ccc",
            "border-radius": "4px",
            "box-shadow": "0 5px 15px rgba(0,0,0,0.1)",
            "pointer-events": "none" // Pass events through
          }}>
            {activeDragId()}
          </div>
        )}
      </DragOverlay>
    </DragDropProvider>
  );
};

export default App;
