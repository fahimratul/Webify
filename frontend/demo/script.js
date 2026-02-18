/**
 * ================================
 * Global State Variables
 * ================================
 * These variables store the current builder state,
 * dropped components, canvas settings, and UI mode.
 */

// Current logged-in user type (developer / user)
let userType = null;

// Current active view: builder or preview
let currentView = 'builder';

// List of available developer components
let components = [];

// Portfolio metadata + selected components
let portfolio = {
    title: 'My Portfolio',
    selectedComponents: []
};

// Components dropped onto the canvas workspace
let droppedComponents = [];

// Currently selected component being edited/customized
let currentEditingComponent = null;

// Counter for stacking elements in free mode
let zIndexCounter = 1;

// Dragging state tracking
let isDragging = false;
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

// Layout mode: free positioning or flow stacking
let layoutMode = 'free'; // 'flow' or 'free'

// Canvas dimension settings
let canvasDimensions = {
    width: 1200,
    height: 800,
    autoHeight: false
};

/**
 * ================================
 * Settings Modal Controls
 * ================================
 */

// Open canvas settings modal and preload current values
function openSettings() {
    document.getElementById('canvasWidth').value = canvasDimensions.width;
    document.getElementById('canvasHeight').value = canvasDimensions.height;

    // Highlight the active layout mode button
    updateLayoutModeButtons();

    // Show settings modal
    document.getElementById('settingsModal').classList.remove('hidden');
}
