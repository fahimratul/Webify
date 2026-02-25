import { createSignal, onMount } from "solid-js";
import { BlockContent } from "./components/BlockContent";
import { Topbar } from "./components/Topbar";
import { DeviceSelector } from "./components/DeviceSelector";
import { Canvas } from "./components/Canvas";
import styles from "./App.module.css";
import {
  DragDropProvider,
  DragDropSensors,
} from "@thisbeyond/solid-dnd";


const App = () => {
  //signal for sidebar block content
  const [showBlockContent, setShowBlockContent] = createSignal(false);
  //signal for device selector
  const [showSelectedDevice, setShowSelectedDevice] = createSignal(false);
  const [selectedDevice, setSelectedDevice] = createSignal("Desktop");

  // =========================================================================
  // STEP 1: DEFINE YOUR STATE HERE
  const [elements, setElements] = createSignal([]);
  // This 'elements' array is the Single Source of Truth for your builder.
  // =========================================================================

  onMount(() => {
    const loadingGif = document.getElementById('loading_gif');
    if (loadingGif) loadingGif.remove();
  })

  // =========================================================================
  // STEP 2: DEFINE 'onDragEnd'
  // const onDragEnd = ({ draggable, droppable }) => {
  //    ... logic to check droppable.id and add new item to 'elements' ...
  // }

  const onDragEnd = ({ draggable, droppable }) => {
    if (!droppable) return;

    if (droppable.id === "canvas-root") {
      const existingElementIndex = elements().findIndex((el) => el.id === draggable.id);

      if (existingElementIndex !== -1) {
        // CASE 1: Reordering an EXISTING element
        // Currently we just move it to the end of the list because we are dropping on the generic "canvas" container
        const movedItem = elements()[existingElementIndex];
        const newElements = [...elements()];
        newElements.splice(existingElementIndex, 1); // Remove from old spot
        newElements.push(movedItem); // Add to end
        setElements(newElements);
      } else {
        // CASE 2: Creating a NEW element from Sidebar
        // Guard against missing data
        const type = draggable.data && draggable.data.type;

        if (type) {
          const newBlock = {
            id: crypto.randomUUID(),
            type: type,
            props: {}
          };
          setElements((prev) => [...prev, newBlock]);
        }
      }
    }
  }
  // =========================================================================

  return (
    // STEP 3: WRAP IN DragDropProvider
    <DragDropProvider onDragEnd={onDragEnd}>

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

    </DragDropProvider>

  );
};

export default App;
