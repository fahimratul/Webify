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

// List of available components (developer components)
let components = [];

// Portfolio metadata + selected components
let portfolio = {
    title: 'My Portfolio',
    selectedComponents: []
};

// Components that have been dropped onto the canvas
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
    // Load current width/height values into input fields
    document.getElementById('canvasWidth').value = canvasDimensions.width;
    document.getElementById('canvasHeight').value = canvasDimensions.height;

    // Highlight the active layout mode button
    updateLayoutModeButtons();

    // Show settings modal
    document.getElementById('settingsModal').classList.remove('hidden');
}

// Open publish modal popup
function publishfile() {
    document.getElementById('publishModal').classList.remove('hidden');
}

// Close publish modal popup
function closePublishModal() {
    document.getElementById('publishModal').classList.add('hidden');
}

// Close settings modal popup
function closeSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
}

/**
 * Apply new width/height settings to the canvas
 */
function applyCanvasSettings() {
    const width = parseInt(document.getElementById('canvasWidth').value);
    const height = parseInt(document.getElementById('canvasHeight').value);

    // Save updated dimensions
    canvasDimensions.width = width;
    canvasDimensions.height = height;

    // Apply dimensions directly to canvas element
    const canvas = document.getElementById('canvas');
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    closeSettings();
}

/**
 * ================================
 * Layout Mode Switching
 * ================================
 * Flow mode: components stack vertically
 * Free mode: components can be positioned anywhere
 */

// Set layout mode and update canvas styling
function setLayoutMode(mode) {
    layoutMode = mode;
    updateLayoutModeButtons();

    const canvas = document.getElementById('canvas');

    if (mode === 'flow') {
        // Flow mode uses flex column layout
        canvas.style.display = 'flex';
        canvas.style.flexDirection = 'column';
        canvas.style.gap = '1rem';
    } else {
        // Free mode uses absolute positioning
        canvas.style.display = 'block';
        canvas.style.position = 'relative';
    }
}

// Update active button styles for layout mode selection
function updateLayoutModeButtons() {
    const flowBtn = document.getElementById('flowModeBtn');
    const freeBtn = document.getElementById('freeModeBtn');

    if (layoutMode === 'flow') {
        flowBtn.classList.add('active');
        freeBtn.classList.remove('active');
    } else {
        flowBtn.classList.remove('active');
        freeBtn.classList.add('active');
    }
}

/**
 * ================================
 * Device Selector Controls
 * ================================
 * Allows resizing canvas to match common screen devices.
 */

// Open device selector modal
function openDeviceSelector() {
    document.getElementById('deviceSelectorModal').classList.remove('hidden');

    // Reinitialize lucide icons inside modal
    setTimeout(() => lucide.createIcons(), 10);
}

// Close device selector modal
function closeDeviceSelector() {
    document.getElementById('deviceSelectorModal').classList.add('hidden');
}

/**
 * Set canvas dimensions based on selected device preset
 */
function setCanvasDevice(device) {
    const canvas = document.getElementById('canvas');

    // Predefined device dimension presets
    const deviceDimensions = {
        desktop: { width: 1920, height: 1080 },
        laptop: { width: 1366, height: 768 },
        tablet: { width: 768, height: 1024 },
        mobile: { width: 375, height: 667 }
    };

    // Apply selected device dimensions
    const dimensions = deviceDimensions[device];
    canvasDimensions.width = dimensions.width;
    canvasDimensions.height = dimensions.height;

    canvas.style.width = dimensions.width + 'px';
    canvas.style.height = dimensions.height + 'px';

    // Update active state on UI buttons
    document.querySelectorAll('.device-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelector(`[data-device="${device}"]`).classList.add('active');

    closeDeviceSelector();
}

/**
 * ================================
 * Basic Component Library
 * ================================
 * These are default editable building blocks
 * available for all users.
 */

const basicComponents = [
    {
        id: 'basic-1',
        name: 'Text Paragraph',
        category: 'basic',
        description: 'Simple text paragraph',
        html: '<p>Click edit to change this text</p>',
        css: 'p { line-height: 1.6; }',
        editable: true
    },
    ...
];

/**
 * ================================
 * App Initialization
 * ================================
 * Runs when DOM is fully loaded.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Load lucide icons
    lucide.createIcons();

    // Load sample developer components
    components = [...sampleComponents];

    // Setup slider UI value displays
    const fontSizeSlider = document.getElementById('customFontSize');
    const borderRadiusSlider = document.getElementById('customBorderRadius');
    const opacitySlider = document.getElementById('customOpacity');

    // Live update font size display
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', (e) => {
            document.getElementById('fontSizeValue').textContent =
                e.target.value + 'px';
        });
    }

    // Live update border radius display
    if (borderRadiusSlider) {
        borderRadiusSlider.addEventListener('input', (e) => {
            document.getElementById('borderRadiusValue').textContent =
                e.target.value + 'px';
        });
    }

    // Live update opacity display
    if (opacitySlider) {
        opacitySlider.addEventListener('input', (e) => {
            document.getElementById('opacityValue').textContent =
                e.target.value + '%';
        });
    }

    // Default view: Builder
    switchView('builder');
});
